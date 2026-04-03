// src/services/room.service.ts
import { prisma } from "../prisma/client";
import { randomBytes } from "crypto";

const generateInviteCode = () => {
    return randomBytes(4).toString("hex"); // 8-char code
};

export const createRoom = async (userId: string, name: string) => {
    const inviteCode = generateInviteCode();

    const room = await prisma.room.create({
        data: {
            name,
            adminId: userId,
            inviteCode,
            members: {
                create: {
                    user: {
                        connectOrCreate: {
                            where: { id: userId },
                            create: { id: userId },
                        },
                    },
                },
            },
        },
    });

    return room;
};

export const joinRoom = async (userId: string, inviteCode: string) => {
    const room = await prisma.room.findUnique({
        where: { inviteCode },
    });

    if (!room) {
        throw new Error("Room not found");
    }

    // prevent duplicate join
    const existing = await prisma.roomMember.findUnique({
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

    await prisma.roomMember.create({
        data: {
            user: {
                connectOrCreate: {
                    where: { id: userId },
                    create: { id: userId },
                },
            },
            room: {
                connect: { id: room.id },
            },
        },
    });

    return { message: "Joined successfully", roomId: room.id };
};

export const getUserRooms = async (userId: string) => {
    const rooms = await prisma.roomMember.findMany({
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
};

export const getRoomDetails = async (roomId: string, userId: string) => {
    // Verify user is part of room
    const membership = await prisma.roomMember.findUnique({
        where: {
            userId_roomId: { userId, roomId },
        },
    });

    if (!membership) {
        throw new Error("User not part of this room");
    }

    const room = await prisma.room.findUnique({
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
        allowPredictionChange: room.allowPredictionChange,
        predictionCutoffMinutes: room.predictionCutoffMinutes,
        assignRandomPrediction: room.assignRandomPrediction,
        members: room.members.map((m) => ({
            userId: m.userId,
            userName: m.user.id, // TODO: Get name from Clerk
            joinedAt: m.joinedAt,
        })),
    };
};

export const deleteRoom = async (roomId: string, userId: string) => {
    // Verify user is admin of room
    const room = await prisma.room.findUnique({
        where: { id: roomId },
    });

    if (!room) {
        throw new Error("Room not found");
    }

    if (room.adminId !== userId) {
        throw new Error("Only admin can delete room");
    }

    // Delete all related records in cascade
    // Delete predictions first
    await prisma.prediction.deleteMany({
        where: { roomId },
    });

    // Delete points ledger
    await prisma.pointsLedger.deleteMany({
        where: { roomId },
    });

    // Delete room members
    await prisma.roomMember.deleteMany({
        where: { roomId },
    });

    // Delete room
    await prisma.room.delete({
        where: { id: roomId },
    });

    return { message: "Room deleted successfully" };
};

export const updateRoomSettings = async (
    roomId: string,
    userId: string,
    settings: {
        allowPredictionChange?: boolean;
        predictionCutoffMinutes?: number;
        assignRandomPrediction?: boolean;
    }
) => {
    // Verify user is admin of room
    const room = await prisma.room.findUnique({
        where: { id: roomId },
    });

    if (!room) {
        throw new Error("Room not found");
    }

    if (room.adminId !== userId) {
        throw new Error("Only admin can update room settings");
    }

    const updatedRoom = await prisma.room.update({
        where: { id: roomId },
        data: settings,
    });

    return updatedRoom;
};