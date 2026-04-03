"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRoomSettings = exports.deleteRoom = exports.getRoomDetails = exports.getUserRooms = exports.joinRoom = exports.createRoom = void 0;
const roomService = __importStar(require("../services/room.service"));
const createRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.auth.userId;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ error: "Room name required" });
        }
        const room = yield roomService.createRoom(userId, name);
        res.json(room);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.createRoom = createRoom;
const joinRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.auth.userId;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const { inviteCode } = req.body;
        if (!inviteCode) {
            return res.status(400).json({ error: "Invite code required" });
        }
        const result = yield roomService.joinRoom(userId, inviteCode);
        res.json(result);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
exports.joinRoom = joinRoom;
const getUserRooms = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.auth.userId;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const rooms = yield roomService.getUserRooms(userId);
        res.json(rooms);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.getUserRooms = getUserRooms;
const getRoomDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.auth.userId;
        const { roomId } = req.params;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        if (!roomId) {
            return res.status(400).json({ error: "Room ID required" });
        }
        const room = yield roomService.getRoomDetails(roomId, userId);
        res.json(room);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
exports.getRoomDetails = getRoomDetails;
const deleteRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.auth.userId;
        const { roomId } = req.params;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        if (!roomId) {
            return res.status(400).json({ error: "Room ID required" });
        }
        const result = yield roomService.deleteRoom(roomId, userId);
        res.json(result);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
exports.deleteRoom = deleteRoom;
const updateRoomSettings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.auth.userId;
        const { roomId } = req.params;
        const settings = req.body;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        if (!roomId) {
            return res.status(400).json({ error: "Room ID required" });
        }
        const updatedRoom = yield roomService.updateRoomSettings(roomId, userId, settings);
        res.json(updatedRoom);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
exports.updateRoomSettings = updateRoomSettings;
