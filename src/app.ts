import express from "express";
import cors from "cors";
import roomRoutes from "./routes/room.routes";
import predictionRoutes from "./routes/prediction.routes";
import leaderboardRoutes from "./routes/leaderboard.routes";
import { requireAuth } from "./middleware/auth.middleware";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("🏏 Runs & Rivalry API running");
});

app.use("/api/rooms", requireAuth as any, roomRoutes);
app.use("/api/predictions", requireAuth as any, predictionRoutes);
app.use("/api/leaderboard", requireAuth as any, leaderboardRoutes);

export default app;

