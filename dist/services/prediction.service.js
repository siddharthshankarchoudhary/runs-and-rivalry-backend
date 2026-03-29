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
exports.deletePrediction = exports.getPredictionsForRoom = exports.createPrediction = void 0;
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
    // 2. Get match
    const match = yield client_1.prisma.match.findUnique({
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
    const existing = yield client_1.prisma.prediction.findUnique({
        where: {
            userId_roomId_matchId: { userId, roomId, matchId },
        },
    });
    if (existing) {
        throw new Error("Prediction already exists");
    }
    // 5. Validate selected team
    if (selectedTeam !== match.teamA &&
        selectedTeam !== match.teamB) {
        throw new Error("Invalid team selected");
    }
    // 6. Create prediction
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
