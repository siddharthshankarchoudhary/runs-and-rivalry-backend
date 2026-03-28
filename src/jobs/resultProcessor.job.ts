// src/jobs/resultProcessor.job.ts
import { prisma } from "../prisma/client";

const POINTS = 10;

export const processResults = async () => {
    console.log("🏏 Running result processor...");

    // 1. Get unprocessed completed/abandoned matches
    const matches = await prisma.match.findMany({
        where: {
            isProcessed: false,
            status: {
                in: ["COMPLETED", "ABANDONED"],
            },
        },
    });

    for (const match of matches) {
        console.log(`Processing match ${match.id}`);

        // 2. Skip abandoned matches
        if (match.status === "ABANDONED") {
            await prisma.match.update({
                where: { id: match.id },
                data: { isProcessed: true },
            });
            continue;
        }

        // 3. Safety check
        if (!match.winnerTeam) {
            console.warn("Winner missing, skipping");
            continue;
        }

        // 4. Process in transaction
        await prisma.$transaction(async (tx) => {
            // lock-like behavior (double-check)
            const freshMatch = await tx.match.findUnique({
                where: { id: match.id },
            });

            if (!freshMatch || freshMatch.isProcessed) return;

            // 5. Get predictions
            const predictions = await tx.prediction.findMany({
                where: { matchId: match.id },
            });

            for (const p of predictions) {
                const isWin = p.selectedTeam === match.winnerTeam;

                await tx.pointsLedger.create({
                    data: {
                        userId: p.userId,
                        roomId: p.roomId,
                        matchId: p.matchId,
                        points: isWin ? POINTS : -POINTS,
                        reason: isWin ? "WIN" : "LOSS",
                    },
                });
            }

            // 6. Mark match processed
            await tx.match.update({
                where: { id: match.id },
                data: { isProcessed: true },
            });
        });
    }
};
