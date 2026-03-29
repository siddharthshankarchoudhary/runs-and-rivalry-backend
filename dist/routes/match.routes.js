"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/match.routes.ts
const express_1 = __importDefault(require("express"));
const match_controller_1 = require("../controllers/match.controller");
const router = express_1.default.Router();
router.get("/", match_controller_1.getDailyMatches);
router.get("/:matchId", match_controller_1.getMatch);
exports.default = router;
