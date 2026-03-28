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
                    userId,
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
            userId,
            roomId: room.id,
        },
    });

    return { message: "Joined successfully", roomId: room.id };
};