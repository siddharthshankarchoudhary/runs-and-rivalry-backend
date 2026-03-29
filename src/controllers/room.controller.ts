// src/controllers/room.controller.ts
import { Request, Response } from "express";
import * as roomService from "../services/room.service";

export const createRoom = async (req: Request, res: Response) => {
    try {
        const userId = req.auth.userId;

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ error: "Room name required" });
        }
        const room = await roomService.createRoom(userId, name);
        res.json(room);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const joinRoom = async (req: Request, res: Response) => {
    try {
        const userId = req.auth.userId;

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const { inviteCode } = req.body;

        if (!inviteCode) {
            return res.status(400).json({ error: "Invite code required" });
        }

        const result = await roomService.joinRoom(userId, inviteCode);
        res.json(result);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
};

export const getUserRooms = async (req: Request, res: Response) => {
    try {
        const userId = req.auth.userId;

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const rooms = await roomService.getUserRooms(userId);
        res.json(rooms);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const getRoomDetails = async (req: Request, res: Response) => {
    try {
        const userId = req.auth.userId;
        const { roomId } = req.params;

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        if (!roomId) {
            return res.status(400).json({ error: "Room ID required" });
        }

        const room = await roomService.getRoomDetails(roomId, userId);
        res.json(room);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
};