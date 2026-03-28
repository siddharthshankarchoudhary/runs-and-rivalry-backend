// src/routes/prediction.routes.ts
import express from "express";
import { createPrediction } from "../controllers/prediction.controller";

const router = express.Router();

router.post("/", createPrediction);

export default router;
