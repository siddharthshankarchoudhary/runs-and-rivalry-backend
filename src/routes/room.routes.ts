// src/routes/room.routes.ts
import express from "express";
import {
    createRoom,
    joinRoom,
    getUserRooms,
    getRoomDetails,
} from "../controllers/room.controller";

const router = express.Router();

router.post("/", createRoom);
router.post("/join", joinRoom);
router.get("/", getUserRooms);
router.get("/:roomId", getRoomDetails);

export default router;