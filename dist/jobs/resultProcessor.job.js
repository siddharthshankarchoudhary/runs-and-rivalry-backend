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
exports.processResults = void 0;
// src/jobs/resultProcessor.job.ts
const client_1 = require("../prisma/client");
const POINTS = 10;
const processResults = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("🏏 Running result processor...");
    // 1. Get unprocessed completed/abandoned matches
    const matches = yield client_1.prisma.match.findMany({
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
            yield client_1.prisma.match.update({
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
        yield client_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            // lock-like behavior (double-check)
            const freshMatch = yield tx.match.findUnique({
                where: { id: match.id },
            });
            if (!freshMatch || freshMatch.isProcessed)
                return;
            // 5. Get predictions
            const predictions = yield tx.prediction.findMany({
                where: { matchId: match.id },
            });
            for (const p of predictions) {
                const isWin = p.selectedTeam === match.winnerTeam;
                yield tx.pointsLedger.create({
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
            yield tx.match.update({
                where: { id: match.id },
                data: { isProcessed: true },
            });
        }));
    }
});
exports.processResults = processResults;
