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
exports.getLeaderboard = void 0;
// src/services/leaderboard.service.ts
const client_1 = require("../prisma/client");
const getLeaderboard = (roomId) => __awaiter(void 0, void 0, void 0, function* () {
    const members = yield client_1.prisma.roomMember.findMany({
        where: { roomId },
        include: { user: true },
    });
    const points = yield client_1.prisma.pointsLedger.groupBy({
        by: ["userId"],
        where: { roomId },
        _sum: { points: true },
    });
    const pointsMap = new Map(points.map((p) => [p.userId, p._sum.points || 0]));
    const leaderboard = members
        .map((m) => ({
        userId: m.userId,
        userName: m.user.id, // TODO: Get name from Clerk
        points: pointsMap.get(m.userId) || 0,
        joinedAt: m.joinedAt,
    }))
        .sort((a, b) => b.points - a.points)
        .map((entry, index) => (Object.assign(Object.assign({}, entry), { rank: index + 1 })));
    return leaderboard;
});
exports.getLeaderboard = getLeaderboard;
