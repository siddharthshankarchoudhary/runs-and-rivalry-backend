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

export const getPredictionsForRoom = async (roomId: string, userId: string) => {
    // Verify user is part of room
    const membership = await prisma.roomMember.findUnique({
        where: {
            userId_roomId: { userId, roomId },
        },
    });

    if (!membership) {
        throw new Error("User not part of this room");
    }

    const predictions = await prisma.prediction.findMany({
        where: { roomId },
        include: {
            match: true,
            user: true,
        },
    });

    return predictions.map((p) => ({
        id: p.id,
        userId: p.userId,
        userName: p.user.id, // TODO: Get name from Clerk
        matchId: p.matchId,
        match: {
            id: p.match.id,
            teamA: p.match.teamA,
            teamB: p.match.teamB,
            status: p.match.status,
            matchDate: p.match.matchDate,
            winnerTeam: p.match.winnerTeam,
        },
        selectedTeam: p.selectedTeam,
        createdAt: p.createdAt,
    }));
};

export const deletePrediction = async (predictionId: string, userId: string) => {
    const prediction = await prisma.prediction.findUnique({
        where: { id: predictionId },
    });

    if (!prediction) {
        throw new Error("Prediction not found");
    }

    if (prediction.userId !== userId) {
        throw new Error("Unauthorized");
    }

    const match = await prisma.match.findUnique({
        where: { id: prediction.matchId },
    });

    if (!match || match.status !== "SCHEDULED") {
        throw new Error("Cannot delete prediction for ongoing or completed matches");
    }

    await prisma.prediction.delete({
        where: { id: predictionId },
    });

    return { message: "Prediction deleted successfully" };
};
