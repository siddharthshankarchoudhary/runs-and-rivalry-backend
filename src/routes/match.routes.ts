// src/routes/match.routes.ts
import express from "express";
import { getDailyMatches, getMatch } from "../controllers/match.controller";

const router = express.Router();

router.get("/", getDailyMatches);
router.get("/:matchId", getMatch);

export default router;
