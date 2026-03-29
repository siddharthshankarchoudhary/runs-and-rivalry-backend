// src/controllers/match.controller.ts
import { Request, Response } from "express";
import * as matchService from "../services/match.service";

export const getDailyMatches = async (req: Request, res: Response) => {
    try {
        const matches = await matchService.getDailyMatches();
        res.json(matches);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const syncMatches = async (req: Request, res: Response) => {
    try {
        // Only admins/background jobs should have access
        const result = await matchService.syncDailyMatches();
        res.json(result);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const getMatch = async (req: Request, res: Response) => {
    try {
        const { matchId } = req.params;

        if (!matchId) {
            return res.status(400).json({ error: "Match ID required" });
        }

        const match = await matchService.getMatch(matchId as string);

        if (!match) {
            return res.status(404).json({ error: "Match not found" });
        }

        res.json(match);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};
