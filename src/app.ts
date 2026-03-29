import express from "express";
import cors from "cors";
import roomRoutes from "./routes/room.routes";
import predictionRoutes from "./routes/prediction.routes";
import leaderboardRoutes from "./routes/leaderboard.routes";
import matchRoutes from "./routes/match.routes";
import { requireAuth } from "./middleware/auth.middleware";

const app = express();

app.use(cors());
app.use(express.json());

// Middleware to ensure Date objects are serialized with 'Z' suffix (UTC timezone)
app.use((req, res, next) => {
    const originalJson = res.json.bind(res);
    res.json = function (data: any) {
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

app.use("/api/matches", matchRoutes); // Match routes handle their own auth
app.use("/api/rooms", requireAuth as any, roomRoutes);
app.use("/api/predictions", requireAuth as any, predictionRoutes);
app.use("/api/leaderboard", requireAuth as any, leaderboardRoutes);

export default app;

