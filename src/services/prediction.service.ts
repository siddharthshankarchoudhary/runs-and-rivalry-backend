// src/services/prediction.service.ts
import { prisma } from "../prisma/client";

export const createPrediction = async (
    userId: string,
    roomId: string,
    matchId: string,
    selectedTeam: string
) => {
    // 1. Check user is part of room
    const membership = await prisma.roomMember.findUnique({
        where: {
            userId_roomId: { userId, roomId },
        },
    });

    if (!membership) {
        throw new Error("User not part of this room");
    }

    // 2. Get match
    const match = await prisma.match.findUnique({
        where: { id: matchId },
    });

    if (!match) {
        throw new Error("Match not found");
    }

    // 3. Validate match state
    if (match.status !== "SCHEDULED") {
        throw new Error("Predictions are closed for this match");
    }

    // 4. Prevent duplicate prediction
    const existing = await prisma.prediction.findUnique({
        where: {
            userId_roomId_matchId: { userId, roomId, matchId },
        },
    });

    if (existing) {
        throw new Error("Prediction already exists");
    }

    // 5. Validate selected team
    if (
        selectedTeam !== match.teamA &&
        selectedTeam !== match.teamB
    ) {
        throw new Error("Invalid team selected");
    }

    // 6. Create prediction
    const prediction = await prisma.prediction.create({
        data: {
            userId,
            roomId,
            matchId,
            selectedTeam,
        },
    });

    return prediction;
};
