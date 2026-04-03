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
exports.getMatch = exports.syncMatches = exports.getDailyMatches = void 0;
const matchService = __importStar(require("../services/match.service"));
/**
 * Serialize match data ensuring all dates are ISO strings with 'Z' suffix for UTC
 */
const serializeMatches = (matches) => {
    return matches.map(match => (Object.assign(Object.assign({}, match), { matchDate: match.matchDate instanceof Date
            ? match.matchDate.toISOString()
            : typeof match.matchDate === 'string'
                ? match.matchDate.includes('Z') ? match.matchDate : match.matchDate + 'Z'
                : match.matchDate })));
};
/**
 * Serialize single match data ensuring all dates are ISO strings with 'Z' suffix for UTC
 */
const serializeMatch = (match) => {
    return Object.assign(Object.assign({}, match), { matchDate: match.matchDate instanceof Date
            ? match.matchDate.toISOString()
            : typeof match.matchDate === 'string'
                ? match.matchDate.includes('Z') ? match.matchDate : match.matchDate + 'Z'
                : match.matchDate });
};
const getDailyMatches = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const matches = yield matchService.getDailyMatches();
        res.json(serializeMatches(matches));
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.getDailyMatches = getDailyMatches;
const syncMatches = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Only admins/background jobs should have access
        const result = yield matchService.syncDailyMatches();
        res.json(result);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.syncMatches = syncMatches;
const getMatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { matchId } = req.params;
        if (!matchId) {
            return res.status(400).json({ error: "Match ID required" });
        }
        const match = yield matchService.getMatch(matchId);
        if (!match) {
            return res.status(404).json({ error: "Match not found" });
        }
        res.json(serializeMatch(match));
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.getMatch = getMatch;
