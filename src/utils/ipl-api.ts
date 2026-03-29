// src/utils/ipl-api.ts

export interface IPLMatch {
    id: string;
    externalMatchId: string;
    teamA: string;
    teamB: string;
    matchDate: Date;
    status: "SCHEDULED" | "LIVE" | "COMPLETED" | "ABANDONED";
    winnerTeam?: string;
}

interface CricketDataSeries {
    id: string;
    name: string;
    startDate?: string;
    startdate?: string; // API sometimes uses lowercase
    endDate?: string;
    enddate?: string; // API sometimes uses lowercase
    matches?: number;
}

interface CricketDataMatch {
    id: string;
    name: string;
    status: string;
    matchType: string;
    date: string;
    dateTimeGMT: string;
    teams: string[];
    matchStarted?: boolean;
    matchEnded?: boolean;
}

interface SeriesInfoResponse {
    info: CricketDataSeries;
    matchList: CricketDataMatch[];
}

const API_KEY = process.env.CRICKET_DATA_API_KEY;
const API_BASE_URL = "https://api.cricapi.com/v1";
// Current active IPL series ID (update this when a new season starts)
const CURRENT_IPL_SERIES_ID = process.env.IPL_SERIES_ID || "8bfedb5a-500c-4f02-a5c3-17a3d731fe9c";

if (!API_KEY) {
    console.warn(
        "⚠️  CRICKET_DATA_API_KEY not set in .env - IPL matches will be fetched using mock data"
    );
}

/**
 * Get current IPL series ID
 * Uses the configured series ID from environment, which should be the current active series
 */
const getIPLSeriesId = async (): Promise<string | null> => {
    // Directly use the configured series ID from environment
    // The environment variable should be updated when a new season begins
    console.log(`Using configured IPL series ID: ${CURRENT_IPL_SERIES_ID}`);
    return CURRENT_IPL_SERIES_ID;
};

/**
 * Map CricketData match status to our local status
 */
const mapStatus = (
    cricketDataStatus: string
): "SCHEDULED" | "LIVE" | "COMPLETED" | "ABANDONED" => {
    const lowerStatus = cricketDataStatus.toLowerCase();
    if (lowerStatus.includes("upcoming") || lowerStatus.includes("scheduled")) {
        return "SCHEDULED";
    }
    if (lowerStatus.includes("live")) {
        return "LIVE";
    }
    if (lowerStatus.includes("completed") || lowerStatus.includes("won by")) {
        return "COMPLETED";
    }
    if (lowerStatus.includes("abandoned")) {
        return "ABANDONED";
    }
    return "SCHEDULED";
};

/**
 * Fetch IPL matches from CricketData API
 */
export const fetchIPLMatches = async (date?: Date): Promise<IPLMatch[]> => {
    try {
        if (!API_KEY) {
            console.log(
                "API key not available, falling back to mock data..."
            );
            return generateMockMatches(date);
        }

        // Get current IPL series ID
        const seriesId = await getIPLSeriesId();
        if (!seriesId) {
            console.log("Could not find IPL series, using mock data...");
            return generateMockMatches(date);
        }

        // Fetch series info which includes all matches
        const response = await fetch(
            `${API_BASE_URL}/series_info?apikey=${API_KEY}&id=${seriesId}`
        );
        const data = await response.json();

        if (data.status !== "success" || !data.data?.matchList || data.data.matchList.length === 0) {
            console.log("No matches found in series, using mock data...");
            return generateMockMatches(date);
        }

        // Parse and filter matches
        const matches: IPLMatch[] = [];
        for (const match of data.data.matchList) {
            // Use the teams array directly from API (more reliable than parsing)
            if (!match.teams || match.teams.length < 2) continue;

            const matchDate = new Date(match.dateTimeGMT);
            matches.push({
                id: match.id,
                externalMatchId: match.id,
                teamA: match.teams[0],
                teamB: match.teams[1],
                matchDate,
                status: mapStatus(match.status),
                winnerTeam: undefined,
            });
        }

        console.log(`✅ Fetched ${matches.length} IPL matches from CricketData API`);
        return matches;
    } catch (error) {
        console.error("Failed to fetch IPL matches from API:", error);
        // Fallback to mock data
        return generateMockMatches(date);
    }
};

/**
 * Generate mock IPL matches for development/testing
 */
const generateMockMatches = (date?: Date): IPLMatch[] => {
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

    // Use UTC for consistent timezone handling
    const now = new Date();
    const today = new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        0,
        0,
        0,
        0
    ));

    const mockMatches: IPLMatch[] = [];

    for (let i = 1; i <= 2; i++) {
        const teamA = IPL_TEAMS[Math.floor(Math.random() * IPL_TEAMS.length)];
        let teamB = IPL_TEAMS[Math.floor(Math.random() * IPL_TEAMS.length)];
        while (teamB === teamA) {
            teamB = IPL_TEAMS[Math.floor(Math.random() * IPL_TEAMS.length)];
        }

        // Create match times in UTC (4 hours apart starting from 14:30 UTC)
        const matchTime = new Date(today);
        matchTime.setUTCHours(14 + i * 2, 30, 0, 0);

        mockMatches.push({
            id: `mock_match_${i}`,
            externalMatchId: `mock_ext_match_${i}`,
            teamA,
            teamB,
            matchDate: matchTime,
            status: "SCHEDULED",
        });
    }

    console.log("📋 Using mock IPL matches for development/testing");
    return mockMatches;
};

/**
 * Get match result from external API
 * Used when match is completed to determine winner
 */
export const fetchMatchResult = async (
    externalMatchId: string
): Promise<{ winnerTeam?: string; status: string } | null> => {
    try {
        if (!API_KEY) return null;

        const response = await fetch(
            `${API_BASE_URL}/match_info?apikey=${API_KEY}&id=${externalMatchId}`
        );
        const data = await response.json();

        if (data.status === "success" && data.data) {
            const match = data.data;
            const status = mapStatus(match.status);

            // Extract winner team from status if available
            let winnerTeam: string | undefined = undefined;
            if (status === "COMPLETED" && match.status) {
                const winnerMatch = match.status.match(/^(.+?)\s+won/);
                if (winnerMatch) {
                    winnerTeam = winnerMatch[1];
                }
            }

            return { winnerTeam, status: match.status };
        }
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
        return await fetchIPLMatches();
    } catch (error) {
        console.error("Failed to fetch IPL fixtures:", error);
        return [];
    }
};
