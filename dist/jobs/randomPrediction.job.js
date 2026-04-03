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
exports.assignRandomPredictionsJob = void 0;
const client_1 = require("../prisma/client");
const assignRandomPredictionsJob = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("🎲 Starting random prediction assignment job...");
        // Get all rooms with assignRandomPrediction enabled
        const rooms = yield client_1.prisma.room.findMany({
            where: { assignRandomPrediction: true },
        });
        if (rooms.length === 0) {
            console.log("No rooms with random prediction assignment enabled");
            return;
        }
        // Get all matches that are about to go LIVE (within the next 15 minutes)
        const now = new Date();
        const futureTime = new Date(now.getTime() + 15 * 60000); // 15 minutes from now
        const upcomingMatches = yield client_1.prisma.match.findMany({
            where: {
                status: "SCHEDULED",
                matchDate: {
                    gte: now,
                    lte: futureTime,
                },
            },
        });
        if (upcomingMatches.length === 0) {
            console.log("No upcoming matches found");
            return;
        }
        let totalAssigned = 0;
        // For each room, assign random predictions for upcoming matches
        for (const room of rooms) {
            for (const match of upcomingMatches) {
                const teams = [match.teamA, match.teamB];
                // Get room members
                const members = yield client_1.prisma.roomMember.findMany({
                    where: { roomId: room.id },
                });
                // Get users who already have predictions for this match
                const existingPredictions = yield client_1.prisma.prediction.findMany({
                    where: { roomId: room.id, matchId: match.id },
                    select: { userId: true },
                });
                const existingUserIds = new Set(existingPredictions.map((p) => p.userId));
                // Find users without predictions
                const usersWithoutPredictions = members.filter((m) => !existingUserIds.has(m.userId));
                // Assign random predictions
                for (const member of usersWithoutPredictions) {
                    const randomTeam = teams[Math.floor(Math.random() * teams.length)];
                    yield client_1.prisma.prediction.create({
                        data: {
                            userId: member.userId,
                            roomId: room.id,
                            matchId: match.id,
                            selectedTeam: randomTeam,
                        },
                    });
                    totalAssigned++;
                }
            }
        }
        console.log(`✅ Random prediction assignment job completed. Assigned ${totalAssigned} predictions`);
    }
    catch (error) {
        console.error("❌ Random prediction assignment job failed:", error);
    }
});
exports.assignRandomPredictionsJob = assignRandomPredictionsJob;
