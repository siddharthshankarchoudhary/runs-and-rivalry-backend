import { processResults } from "./resultProcessor.job";
import { syncDailyMatches } from "../services/match.service";

let isRunning = false;

// Sync matches on startup
(async () => {
    try {
        await syncDailyMatches();
        console.log("✅ Initial match sync completed");
    } catch (error) {
        console.error("❌ Initial match sync failed:", error);
    }
})();

// Process results every hour
processResults();

setInterval(async () => {
    if (isRunning) {
        console.log("Skipping run, previous still in progress");
        return;
    }

    isRunning = true;

    try {
        await processResults();
    } finally {
        isRunning = false;
    }
}, 60 * 60 * 1000);