// src/services/prediction.service.ts
import { prisma } from "../prisma/client";

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

    // 2. Get room settings
    const room = await prisma.room.findUnique({
        where: { id: roomId },
    });

    if (!room) {
        throw new Error("Room not found");
    }

    // 3. Get match
    const match = await prisma.match.findUnique({
        where: { id: matchId },
    });

    if (!match) {
        throw new Error("Match not found");
    }

    // 4. Validate match state
    if (match.status !== "SCHEDULED") {
        throw new Error("Predictions are closed for this match");
    }

    // 5. Check prediction cutoff time
    const now = new Date();
    const cutoffTime = new Date(match.matchDate.getTime() - room.predictionCutoffMinutes * 60000);

    if (now > cutoffTime) {
        throw new Error(`Predictions closed ${room.predictionCutoffMinutes} minutes before match starts`);
    }

    // 6. Check if user already has a prediction
    const existing = await prisma.prediction.findUnique({
        where: {
            userId_roomId_matchId: { userId, roomId, matchId },
        },
    });

    if (existing) {
        // Check if prediction change is allowed
        if (!room.allowPredictionChange) {
            throw new Error("Prediction changes are not allowed in this room");
        }

        // Delete old prediction and create new one
        await prisma.prediction.delete({
            where: { id: existing.id },
        });
    }

    // 7. Validate selected team
    if (
        selectedTeam !== match.teamA &&
        selectedTeam !== match.teamB
    ) {
        throw new Error("Invalid team selected");
    }

    // 8. Create prediction
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

export const assignRandomPredictions = async (roomId: string, matchId: string) => {
    // Get room settings
    const room = await prisma.room.findUnique({
        where: { id: roomId },
    });

    if (!room || !room.assignRandomPrediction) {
        return { message: "Random prediction assignment disabled" };
    }

    // Get match
    const match = await prisma.match.findUnique({
        where: { id: matchId },
    });

    if (!match) {
        throw new Error("Match not found");
    }

    // Get all room members
    const members = await prisma.roomMember.findMany({
        where: { roomId },
    });

    // Get users who already have predictions for this match
    const existingPredictions = await prisma.prediction.findMany({
        where: { roomId, matchId },
        select: { userId: true },
    });

    const existingUserIds = new Set(existingPredictions.map((p) => p.userId));

    // Find users without predictions
    const usersWithoutPredictions = members.filter(
        (m) => !existingUserIds.has(m.userId)
    );

    if (usersWithoutPredictions.length === 0) {
        return { message: "All users already have predictions" };
    }

    // Randomly assign predictions
    const teams = [match.teamA, match.teamB];
    const createdPredictions = [];

    for (const member of usersWithoutPredictions) {
        const randomTeam = teams[Math.floor(Math.random() * teams.length)];

        const prediction = await prisma.prediction.create({
            data: {
                userId: member.userId,
                roomId,
                matchId,
                selectedTeam: randomTeam,
            },
        });

        createdPredictions.push(prediction);
    }

    return {
        message: `Random predictions assigned to ${createdPredictions.length} users`,
        predictions: createdPredictions,
    };
};
