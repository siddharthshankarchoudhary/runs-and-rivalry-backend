// src/routes/room.routes.ts
import express from "express";
import {
    createRoom,
    joinRoom,
    getUserRooms,
    getRoomDetails,
    deleteRoom,
    updateRoomSettings,
} from "../controllers/room.controller";

const router = express.Router();

router.post("/", createRoom);
router.post("/join", joinRoom);
router.get("/", getUserRooms);
router.get("/:roomId", getRoomDetails);
router.delete("/:roomId", deleteRoom);
router.put("/:roomId/settings", updateRoomSettings);

export default router;