// src/services/leaderboard.service.ts
import { prisma } from "../prisma/client";

export const getLeaderboard = async (roomId: string) => {
    const members = await prisma.roomMember.findMany({
        where: { roomId },
        select: { userId: true },
    });

    const points = await prisma.pointsLedger.groupBy({
        by: ["userId"],
        where: { roomId },
        _sum: { points: true },
    });

    const pointsMap = new Map(
        points.map((p) => [p.userId, p._sum.points || 0])
    );

    const leaderboard = members.map((m) => ({
        userId: m.userId,
        points: pointsMap.get(m.userId) || 0,
    }));
}