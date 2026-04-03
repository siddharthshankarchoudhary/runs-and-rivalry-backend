"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/room.routes.ts
const express_1 = __importDefault(require("express"));
const room_controller_1 = require("../controllers/room.controller");
const router = express_1.default.Router();
router.post("/", room_controller_1.createRoom);
router.post("/join", room_controller_1.joinRoom);
router.get("/", room_controller_1.getUserRooms);
router.get("/:roomId", room_controller_1.getRoomDetails);
router.delete("/:roomId", room_controller_1.deleteRoom);
router.put("/:roomId/settings", room_controller_1.updateRoomSettings);
exports.default = router;
