import { processResults } from "./resultProcessor.job";

let isRunning = false;

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