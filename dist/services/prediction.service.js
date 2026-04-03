"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignRandomPredictions = exports.deletePrediction = exports.getPredictionsForRoom = exports.createPrediction = void 0;
// src/services/prediction.service.ts
const client_1 = require("../prisma/client");
const createPrediction = (userId, roomId, matchId, selectedTeam) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Check user is part of room
    const membership = yield client_1.prisma.roomMember.findUnique({
        where: {
            userId_roomId: { userId, roomId },
        },
    });
    if (!membership) {
        throw new Error("User not part of this room");
    }
    // 2. Get room settings
    const room = yield client_1.prisma.room.findUnique({
        where: { id: roomId },
    });
    if (!room) {
        throw new Error("Room not found");
    }
    // 3. Get match
    const match = yield client_1.prisma.match.findUnique({
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
    const existing = yield client_1.prisma.prediction.findUnique({
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
        yield client_1.prisma.prediction.delete({
            where: { id: existing.id },
        });
    }
    // 7. Validate selected team
    if (selectedTeam !== match.teamA &&
        selectedTeam !== match.teamB) {
        throw new Error("Invalid team selected");
    }
    // 8. Create prediction
    const prediction = yield client_1.prisma.prediction.create({
        data: {
            userId,
            roomId,
            matchId,
            selectedTeam,
        },
    });
    return prediction;
});
exports.createPrediction = createPrediction;
const getPredictionsForRoom = (roomId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    // Verify user is part of room
    const membership = yield client_1.prisma.roomMember.findUnique({
        where: {
            userId_roomId: { userId, roomId },
        },
    });
    if (!membership) {
        throw new Error("User not part of this room");
    }
    const predictions = yield client_1.prisma.prediction.findMany({
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
});
exports.getPredictionsForRoom = getPredictionsForRoom;
const deletePrediction = (predictionId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const prediction = yield client_1.prisma.prediction.findUnique({
        where: { id: predictionId },
    });
    if (!prediction) {
        throw new Error("Prediction not found");
    }
    if (prediction.userId !== userId) {
        throw new Error("Unauthorized");
    }
    const match = yield client_1.prisma.match.findUnique({
        where: { id: prediction.matchId },
    });
    if (!match || match.status !== "SCHEDULED") {
        throw new Error("Cannot delete prediction for ongoing or completed matches");
    }
    yield client_1.prisma.prediction.delete({
        where: { id: predictionId },
    });
    return { message: "Prediction deleted successfully" };
});
exports.deletePrediction = deletePrediction;
const assignRandomPredictions = (roomId, matchId) => __awaiter(void 0, void 0, void 0, function* () {
    // Get room settings
    const room = yield client_1.prisma.room.findUnique({
        where: { id: roomId },
    });
    if (!room || !room.assignRandomPrediction) {
        return { message: "Random prediction assignment disabled" };
    }
    // Get match
    const match = yield client_1.prisma.match.findUnique({
        where: { id: matchId },
    });
    if (!match) {
        throw new Error("Match not found");
    }
    // Get all room members
    const members = yield client_1.prisma.roomMember.findMany({
        where: { roomId },
    });
    // Get users who already have predictions for this match
    const existingPredictions = yield client_1.prisma.prediction.findMany({
        where: { roomId, matchId },
        select: { userId: true },
    });
    const existingUserIds = new Set(existingPredictions.map((p) => p.userId));
    // Find users without predictions
    const usersWithoutPredictions = members.filter((m) => !existingUserIds.has(m.userId));
    if (usersWithoutPredictions.length === 0) {
        return { message: "All users already have predictions" };
    }
    // Randomly assign predictions
    const teams = [match.teamA, match.teamB];
    const createdPredictions = [];
    for (const member of usersWithoutPredictions) {
        const randomTeam = teams[Math.floor(Math.random() * teams.length)];
        const prediction = yield client_1.prisma.prediction.create({
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
});
exports.assignRandomPredictions = assignRandomPredictions;
