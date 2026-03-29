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
exports.getRoomDetails = exports.getUserRooms = exports.joinRoom = exports.createRoom = void 0;
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
const getUserRooms = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const rooms = yield client_1.prisma.roomMember.findMany({
        where: { userId },
        include: {
            room: {
                include: {
                    members: {
                        include: {
                            user: true,
                        },
                    },
                },
            },
        },
    });
    return rooms.map((m) => ({
        id: m.room.id,
        name: m.room.name,
        adminId: m.room.adminId,
        inviteCode: m.room.inviteCode,
        createdAt: m.room.createdAt,
        membersCount: m.room.members.length,
        members: m.room.members.map((member) => ({
            userId: member.userId,
            userName: member.user.id, // TODO: Get name from Clerk
            joinedAt: member.joinedAt,
        })),
    }));
});
exports.getUserRooms = getUserRooms;
const getRoomDetails = (roomId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    // Verify user is part of room
    const membership = yield client_1.prisma.roomMember.findUnique({
        where: {
            userId_roomId: { userId, roomId },
        },
    });
    if (!membership) {
        throw new Error("User not part of this room");
    }
    const room = yield client_1.prisma.room.findUnique({
        where: { id: roomId },
        include: {
            members: {
                include: {
                    user: true,
                },
            },
        },
    });
    if (!room) {
        throw new Error("Room not found");
    }
    return {
        id: room.id,
        name: room.name,
        adminId: room.adminId,
        inviteCode: room.inviteCode,
        createdAt: room.createdAt,
        members: room.members.map((m) => ({
            userId: m.userId,
            userName: m.user.id, // TODO: Get name from Clerk
            joinedAt: m.joinedAt,
        })),
    };
});
exports.getRoomDetails = getRoomDetails;
