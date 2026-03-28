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
exports.joinRoom = exports.createRoom = void 0;
// src/services/room.service.ts
const client_1 = require("../prisma/client");
const crypto_1 = require("crypto");
const generateInviteCode = () => {
    return (0, crypto_1.randomBytes)(4).toString("hex"); // 8-char code
};
const createRoom = (userId, name) => __awaiter(void 0, void 0, void 0, function* () {
    const inviteCode = generateInviteCode();
    const room = yield client_1.prisma.room.create({
        data: {
            name,
            adminId: userId,
            inviteCode,
            members: {
                create: {
                    userId,
                },
            },
        },
    });
    return room;
});
exports.createRoom = createRoom;
const joinRoom = (userId, inviteCode) => __awaiter(void 0, void 0, void 0, function* () {
    const room = yield client_1.prisma.room.findUnique({
        where: { inviteCode },
    });
    if (!room) {
        throw new Error("Room not found");
    }
    // prevent duplicate join
    const existing = yield client_1.prisma.roomMember.findUnique({
        where: {
            userId_roomId: {
                userId,
                roomId: room.id,
            },
        },
    });
    if (existing) {
        return { message: "Already joined", roomId: room.id };
    }
    yield client_1.prisma.roomMember.create({
        data: {
            userId,
            roomId: room.id,
        },
    });
    return { message: "Joined successfully", roomId: room.id };
});
exports.joinRoom = joinRoom;
