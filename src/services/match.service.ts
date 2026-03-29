// src/services/match.service.ts
import { prisma } from "../prisma/client";
import { fetchIPLMatches, fetchMatchResult } from "../utils/ipl-api";
import { MatchStatus } from "../types/match.types";

export const getDailyMatches = async (date?: Date) => {
    const targetDate = date || new Date();
    targetDate.setHours(0, 0, 0, 0);

    const nextDate = new Date(targetDate);
    nextDate.setDate(nextDate.getDate() + 1);

    const matches = await prisma.match.findMany({
        where: {
            matchDate: {
                gte: targetDate,
                lt: nextDate,
            },
        },
        orderBy: {
            matchDate: "asc",
        },
    });

    return matches;
};

export const syncDailyMatches = async () => {
    try {
        // Fetch matches from IPL API
        const iplMatches = await fetchIPLMatches();

        for (const iplMatch of iplMatches) {
            // Check if match already exists
            const existing = await prisma.match.findUnique({
                where: { externalMatchId: iplMatch.externalMatchId },
            });

            if (existing) {
                // Update existing match
                await prisma.match.update({
                    where: { id: existing.id },
                    data: {
                        status: iplMatch.status as MatchStatus,
                        winnerTeam: iplMatch.winnerTeam,
                    },
                });
            } else {
                // Create new match
                await prisma.match.create({
                    data: {
                        externalMatchId: iplMatch.externalMatchId,
                        teamA: iplMatch.teamA,
                        teamB: iplMatch.teamB,
                        matchDate: iplMatch.matchDate,
                        status: iplMatch.status as MatchStatus,
                        winnerTeam: iplMatch.winnerTeam,
                    },
                });
            }
        }

        console.log(`Synced ${iplMatches.length} matches`);
        return { success: true, synced: iplMatches.length };
    } catch (error) {
        console.error("Failed to sync matches:", error);
        throw error;
    }
};

export const updateMatchStatus = async (
    matchId: string,
    status: MatchStatus
) => {
    const match = await prisma.match.update({
        where: { id: matchId },
        data: { status },
    });

    return match;
};

export const completeMatch = async (
    externalMatchId: string
): Promise<{ success: boolean; matchId?: string }> => {
    try {
        // Fetch match result from IPL API
        const result = await fetchMatchResult(externalMatchId);

        if (!result) {
            return { success: false };
        }

        const match = await prisma.match.findUnique({
            where: { externalMatchId },
        });

        if (!match) {
            return { success: false };
        }

        // Update match with result
        await prisma.match.update({
            where: { id: match.id },
            data: {
                status: "COMPLETED",
                winnerTeam: result.winnerTeam,
                isProcessed: false, // Will be processed by result processor job
            },
        });

        return { success: true, matchId: match.id };
    } catch (error) {
        console.error("Failed to complete match:", error);
        return { success: false };
    }
};

export const getMatch = async (matchId: string) => {
    return prisma.match.findUnique({
        where: { id: matchId },
    });
};
