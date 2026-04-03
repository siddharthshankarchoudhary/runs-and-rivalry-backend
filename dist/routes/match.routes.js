"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/match.routes.ts
const express_1 = __importDefault(require("express"));
const match_controller_1 = require("../controllers/match.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
// Public endpoints - no auth required
router.get("/", match_controller_1.getDailyMatches);
router.get("/:matchId", match_controller_1.getMatch);
// Protected endpoints - auth required
router.post("/sync", auth_middleware_1.requireAuth, match_controller_1.syncMatches);
exports.default = router;
