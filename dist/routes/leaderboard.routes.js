"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/leaderboard.routes.ts
const express_1 = __importDefault(require("express"));
const leaderboard_controller_1 = require("../controllers/leaderboard.controller");
const router = express_1.default.Router();
router.get("/:roomId", leaderboard_controller_1.getLeaderboard);
exports.default = router;
