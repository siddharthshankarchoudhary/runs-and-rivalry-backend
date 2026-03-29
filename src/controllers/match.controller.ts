// src/controllers/match.controller.ts
import { Request, Response } from "express";
import * as matchService from "../services/match.service";

/**
 * Serialize match data ensuring all dates are ISO strings with 'Z' suffix for UTC
 */
const serializeMatches = (matches: any[]): any[] => {
    return matches.map(match => ({
        ...match,
        matchDate: match.matchDate instanceof Date
            ? match.matchDate.toISOString()
            : typeof match.matchDate === 'string'
                ? match.matchDate.includes('Z') ? match.matchDate : match.matchDate + 'Z'
                : match.matchDate,
    }));
};

/**
 * Serialize single match data ensuring all dates are ISO strings with 'Z' suffix for UTC
 */
const serializeMatch = (match: any): any => {
    return {
        ...match,
        matchDate: match.matchDate instanceof Date
            ? match.matchDate.toISOString()
            : typeof match.matchDate === 'string'
                ? match.matchDate.includes('Z') ? match.matchDate : match.matchDate + 'Z'
                : match.matchDate,
    };
};

export const getDailyMatches = async (req: Request, res: Response) => {
    try {
        const matches = await matchService.getDailyMatches();
        res.json(serializeMatches(matches));
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

        res.json(serializeMatch(match));
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};
