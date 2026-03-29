// src/routes/prediction.routes.ts
import express from "express";
import {
    createPrediction,
    getPredictionsForRoom,
    deletePrediction,
} from "../controllers/prediction.controller";

const router = express.Router();

router.post("/", createPrediction);
router.get("/:roomId", getPredictionsForRoom);
router.delete("/:predictionId", deletePrediction);

export default router;
