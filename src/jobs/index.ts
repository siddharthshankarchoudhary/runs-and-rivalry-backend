import { processResults } from "./resultProcessor.job";
import { assignRandomPredictionsJob } from "./randomPrediction.job";
import { syncDailyMatches } from "../services/match.service";

let isRunning = false;
let isRandomPredictionJobRunning = false;

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

// Run random prediction assignment every 5 minutes
setInterval(async () => {
    if (isRandomPredictionJobRunning) {
        console.log("Skipping random prediction job, previous still in progress");
        return;
    }

    isRandomPredictionJobRunning = true;

    try {
        await assignRandomPredictionsJob();
    } finally {
        isRandomPredictionJobRunning = false;
    }
}, 5 * 60 * 1000);