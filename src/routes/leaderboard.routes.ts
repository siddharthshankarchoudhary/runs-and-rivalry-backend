// src/routes/leaderboard.routes.ts
import express from "express";
import { getLeaderboard } from "../controllers/leaderboard.controller";

const router = express.Router();

router.get("/:roomId", getLeaderboard);

export default router;