// src/controllers/room.controller.ts
import { Request, Response } from "express";
import * as roomService from "../services/room.service";
import { error } from "node:console";

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
        const { name } = req.body;

        if (!inviteCode) {
            return res.status(400).json({ error: "Invite code required" });
        }

        const room = await roomService.createRoom(userId, name);
        res.json(room);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};