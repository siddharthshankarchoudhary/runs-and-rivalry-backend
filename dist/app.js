"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const room_routes_1 = __importDefault(require("./routes/room.routes"));
const prediction_routes_1 = __importDefault(require("./routes/prediction.routes"));
const leaderboard_routes_1 = __importDefault(require("./routes/leaderboard.routes"));
const match_routes_1 = __importDefault(require("./routes/match.routes"));
const auth_middleware_1 = require("./middleware/auth.middleware");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send("🏏 Runs & Rivalry API running");
});
app.use("/api/rooms", auth_middleware_1.requireAuth, room_routes_1.default);
app.use("/api/predictions", auth_middleware_1.requireAuth, prediction_routes_1.default);
app.use("/api/leaderboard", auth_middleware_1.requireAuth, leaderboard_routes_1.default);
app.use("/api/matches", auth_middleware_1.requireAuth, match_routes_1.default);
exports.default = app;
