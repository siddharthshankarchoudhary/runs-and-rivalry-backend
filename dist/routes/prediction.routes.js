"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/prediction.routes.ts
const express_1 = __importDefault(require("express"));
const prediction_controller_1 = require("../controllers/prediction.controller");
const router = express_1.default.Router();
router.post("/", prediction_controller_1.createPrediction);
router.get("/:roomId", prediction_controller_1.getPredictionsForRoom);
router.delete("/:predictionId", prediction_controller_1.deletePrediction);
exports.default = router;
