// src/routes/match.routes.ts
import express from "express";
import { getDailyMatches, getMatch, syncMatches } from "../controllers/match.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = express.Router();

// Public endpoints - no auth required
router.get("/", getDailyMatches);
router.get("/:matchId", getMatch);

// Protected endpoints - auth required
router.post("/sync", requireAuth as any, syncMatches);

export default router;
