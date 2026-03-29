"use strict";
// src/utils/ipL-api.ts
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
exports.fetchIPLFixtures = exports.fetchMatchResult = exports.fetchIPLMatches = void 0;
const IPL_TEAMS = [
    "Chennai Super Kings",
    "Delhi Capitals",
    "Gujarat Titans",
    "Kolkata Knight Riders",
    "Lucknow Super Giants",
    "Mumbai Indians",
    "Rajasthan Royals",
    "Royal Challengers Bangalore",
    "Sunrisers Hyderabad",
];
/**
 * Fetch IPL matches from external API
 * Currently using mock data - replace with real API (e.g., cricketapi.com, ESPN API)
 */
const fetchIPLMatches = (date) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // TODO: Replace with actual IPL API when available
        // Example options:
        // 1. Cricketapi.com (free tier available)
        // 2. ESPN Cricket API
        // 3. CricketData API
        // 4. Your own IPL data source
        const matchDate = date || new Date();
        matchDate.setHours(0, 0, 0, 0);
        // Mock implementation
        const mockMatches = [];
        // Generate 2 random matches for testing
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        for (let i = 1; i <= 2; i++) {
            const teamA = IPL_TEAMS[Math.floor(Math.random() * IPL_TEAMS.length)];
            let teamB = IPL_TEAMS[Math.floor(Math.random() * IPL_TEAMS.length)];
            while (teamB === teamA) {
                teamB = IPL_TEAMS[Math.floor(Math.random() * IPL_TEAMS.length)];
            }
            mockMatches.push({
                id: `match_${i}`,
                externalMatchId: `ext_match_${i}`,
                teamA,
                teamB,
                matchDate: new Date(today.getTime() + i * 4 * 60 * 60 * 1000),
                status: "SCHEDULED",
            });
        }
        return mockMatches;
    }
    catch (error) {
        console.error("Failed to fetch IPL matches:", error);
        return [];
    }
});
exports.fetchIPLMatches = fetchIPLMatches;
/**
 * Get match result from external API
 * Used when match is completed to determine winner
 */
const fetchMatchResult = (externalMatchId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // TODO: Fetch actual match result from IPL API
        // This should be called after match completion
        console.log(`Fetching result for match: ${externalMatchId}`);
        return null;
    }
    catch (error) {
        console.error("Failed to fetch match result:", error);
        return null;
    }
});
exports.fetchMatchResult = fetchMatchResult;
/**
 * Get all fixtures for ongoing IPL season
 */
const fetchIPLFixtures = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // TODO: Fetch full season fixtures
        return [];
    }
    catch (error) {
        console.error("Failed to fetch IPL fixtures:", error);
        return [];
    }
});
exports.fetchIPLFixtures = fetchIPLFixtures;
