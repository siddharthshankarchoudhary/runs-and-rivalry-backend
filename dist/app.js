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
// Middleware to ensure Date objects are serialized with 'Z' suffix (UTC timezone)
app.use((req, res, next) => {
    const originalJson = res.json.bind(res);
    res.json = function (data) {
        const stringified = JSON.stringify(data, (key, value) => {
            if (value instanceof Date) {
                // Ensure dates are serialized as ISO strings with 'Z' suffix for UTC
                return value.toISOString();
            }
            return value;
        });
        const parsed = JSON.parse(stringified);
        return originalJson(parsed);
    };
    next();
});
app.get("/", (req, res) => {
    res.send("🏏 Runs & Rivalry API running");
});
app.use("/api/matches", match_routes_1.default); // Match routes handle their own auth
app.use("/api/rooms", auth_middleware_1.requireAuth, room_routes_1.default);
app.use("/api/predictions", auth_middleware_1.requireAuth, prediction_routes_1.default);
app.use("/api/leaderboard", auth_middleware_1.requireAuth, leaderboard_routes_1.default);
exports.default = app;
