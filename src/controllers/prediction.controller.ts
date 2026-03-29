// src/controllers/prediction.controller.ts
import { Request, Response } from "express";
import * as predictionService from "../services/prediction.service";

export const createPrediction = async (req: Request, res: Response) => {
    try {
        const userId = req.auth.userId;

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const { roomId, matchId, selectedTeam } = req.body;

        if (!roomId || !matchId || !selectedTeam) {
            return res.status(400).json({
                error: "roomId, matchId and selectedTeam are required",
            });
        }

        const result = await predictionService.createPrediction(
            userId,
            roomId,
            matchId,
            selectedTeam
        );

        res.json(result);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
};

export const getPredictionsForRoom = async (req: Request, res: Response) => {
    try {
        const userId = req.auth.userId;
        const { roomId } = req.params;

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        if (!roomId) {
            return res.status(400).json({ error: "Room ID required" });
        }

        const predictions = await predictionService.getPredictionsForRoom(
            roomId,
            userId
        );

        res.json(predictions);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
};

export const deletePrediction = async (req: Request, res: Response) => {
    try {
        const userId = req.auth.userId;
        const { predictionId } = req.params;

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        if (!predictionId) {
            return res.status(400).json({ error: "Prediction ID required" });
        }

        const result = await predictionService.deletePrediction(
            predictionId,
            userId
        );

        res.json(result);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
};
