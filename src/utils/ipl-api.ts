// src/utils/ipL-api.ts

export interface IPLMatch {
    id: string;
    externalMatchId: string;
    teamA: string;
    teamB: string;
    matchDate: Date;
    status: "SCHEDULED" | "LIVE" | "COMPLETED" | "ABANDONED";
    winnerTeam?: string;
}

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
export const fetchIPLMatches = async (date?: Date): Promise<IPLMatch[]> => {
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
        const mockMatches: IPLMatch[] = [];

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
    } catch (error) {
        console.error("Failed to fetch IPL matches:", error);
        return [];
    }
};

/**
 * Get match result from external API
 * Used when match is completed to determine winner
 */
export const fetchMatchResult = async (
    externalMatchId: string
): Promise<{ winnerTeam?: string; status: string } | null> => {
    try {
        // TODO: Fetch actual match result from IPL API
        // This should be called after match completion
        console.log(`Fetching result for match: ${externalMatchId}`);
        return null;
    } catch (error) {
        console.error("Failed to fetch match result:", error);
        return null;
    }
};

/**
 * Get all fixtures for ongoing IPL season
 */
export const fetchIPLFixtures = async (): Promise<IPLMatch[]> => {
    try {
        // TODO: Fetch full season fixtures
        return [];
    } catch (error) {
        console.error("Failed to fetch IPL fixtures:", error);
        return [];
    }
};
