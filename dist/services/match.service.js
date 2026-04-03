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
exports.getMatch = exports.completeMatch = exports.updateMatchStatus = exports.syncDailyMatches = exports.getDailyMatches = void 0;
// src/services/match.service.ts
const client_1 = require("../prisma/client");
const ipl_api_1 = require("../utils/ipl-api");
const getDailyMatches = (date) => __awaiter(void 0, void 0, void 0, function* () {
    // Use UTC dates for consistent timezone handling
    const targetDate = date ? new Date(date) : new Date();
    // Create start of day in UTC
    const startOfDay = new Date(Date.UTC(targetDate.getUTCFullYear(), targetDate.getUTCMonth(), targetDate.getUTCDate(), 0, 0, 0, 0));
    // Create start of next day in UTC
    const endOfDay = new Date(startOfDay);
    endOfDay.setUTCDate(endOfDay.getUTCDate() + 1);
    const matches = yield client_1.prisma.match.findMany({
        where: {
            matchDate: {
                gte: startOfDay,
                lt: endOfDay,
            },
        },
        orderBy: {
            matchDate: "asc",
        },
    });
    return matches;
});
exports.getDailyMatches = getDailyMatches;
const syncDailyMatches = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch matches from IPL API
        const iplMatches = yield (0, ipl_api_1.fetchIPLMatches)();
        for (const iplMatch of iplMatches) {
            // Check if match already exists
            const existing = yield client_1.prisma.match.findUnique({
                where: { externalMatchId: iplMatch.externalMatchId },
            });
            if (existing) {
                // Update existing match
                yield client_1.prisma.match.update({
                    where: { id: existing.id },
                    data: {
                        status: iplMatch.status,
                        winnerTeam: iplMatch.winnerTeam,
                    },
                });
            }
            else {
                // Create new match
                yield client_1.prisma.match.create({
                    data: {
                        externalMatchId: iplMatch.externalMatchId,
                        teamA: iplMatch.teamA,
                        teamB: iplMatch.teamB,
                        matchDate: iplMatch.matchDate,
                        status: iplMatch.status,
                        winnerTeam: iplMatch.winnerTeam,
                    },
                });
            }
        }
        console.log(`Synced ${iplMatches.length} matches`);
        return { success: true, synced: iplMatches.length };
    }
    catch (error) {
        console.error("Failed to sync matches:", error);
        throw error;
    }
});
exports.syncDailyMatches = syncDailyMatches;
const updateMatchStatus = (matchId, status) => __awaiter(void 0, void 0, void 0, function* () {
    const match = yield client_1.prisma.match.update({
        where: { id: matchId },
        data: { status },
    });
    return match;
});
exports.updateMatchStatus = updateMatchStatus;
const completeMatch = (externalMatchId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch match result from IPL API
        const result = yield (0, ipl_api_1.fetchMatchResult)(externalMatchId);
        if (!result) {
            return { success: false };
        }
        const match = yield client_1.prisma.match.findUnique({
            where: { externalMatchId },
        });
        if (!match) {
            return { success: false };
        }
        // Update match with result
        yield client_1.prisma.match.update({
            where: { id: match.id },
            data: {
                status: "COMPLETED",
                winnerTeam: result.winnerTeam,
                isProcessed: false, // Will be processed by result processor job
            },
        });
        return { success: true, matchId: match.id };
    }
    catch (error) {
        console.error("Failed to complete match:", error);
        return { success: false };
    }
});
exports.completeMatch = completeMatch;
const getMatch = (matchId) => __awaiter(void 0, void 0, void 0, function* () {
    return client_1.prisma.match.findUnique({
        where: { id: matchId },
    });
});
exports.getMatch = getMatch;
