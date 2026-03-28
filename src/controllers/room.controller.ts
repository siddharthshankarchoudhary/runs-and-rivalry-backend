// src/controllers/room.controller.ts
import { Request, Response } from "express";
import * as roomService from "../services/room.service";
import { error } from "node:console";

export const createRoom = async (req: Request, res: Response) => {
    try {
        const userId = req.auth.userId;
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ error: "Room name required" });
        }

        if (userId) {
            const room = await roomService.createRoom(userId, name);
            res.json(room);
        } else {
            throw error("User Id not found");
        }

    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const joinRoom = async (req: Request, res: Response) => {
    try {
        const userId = req.auth.userId;
        const { inviteCode } = req.body; 
        const { name } = req.body;

        if (!inviteCode) {
            return res.status(400).json({ error: "Invite code required" });
        }

        if (userId) {
            const room = await roomService.createRoom(userId, name);
            res.json(room);
        } else {
            throw error("User Id not found");
        }
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};