// src/routes/room.routes.ts
import express from "express";
import { createRoom, joinRoom } from "../controllers/room.controller";

const router = express.Router();

router.post("/", createRoom);
router.post("/join", joinRoom);

export default router;