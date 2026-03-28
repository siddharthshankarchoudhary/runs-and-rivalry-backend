// src/controllers/leaderboard.controller.ts
import { Request, Response } from "express";
import * as leaderboardService from "../services/leaderboard.service";

export const getLeaderboard = async (
    req: Request<{ roomId: string }>,
    res: Response
) => {
    try {
        const { roomId } = req.params;

        const result = await leaderboardService.getLeaderboard(roomId);

        res.json(result);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};