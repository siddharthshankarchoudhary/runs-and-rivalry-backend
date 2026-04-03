"use strict";
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
const resultProcessor_job_1 = require("./resultProcessor.job");
const randomPrediction_job_1 = require("./randomPrediction.job");
const match_service_1 = require("../services/match.service");
let isRunning = false;
let isRandomPredictionJobRunning = false;
// Sync matches on startup
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, match_service_1.syncDailyMatches)();
        console.log("✅ Initial match sync completed");
    }
    catch (error) {
        console.error("❌ Initial match sync failed:", error);
    }
}))();
// Process results every hour
(0, resultProcessor_job_1.processResults)();
setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
    if (isRunning) {
        console.log("Skipping run, previous still in progress");
        return;
    }
    isRunning = true;
    try {
        yield (0, resultProcessor_job_1.processResults)();
    }
    finally {
        isRunning = false;
    }
}), 60 * 60 * 1000);
// Run random prediction assignment every 5 minutes
setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
    if (isRandomPredictionJobRunning) {
        console.log("Skipping random prediction job, previous still in progress");
        return;
    }
    isRandomPredictionJobRunning = true;
    try {
        yield (0, randomPrediction_job_1.assignRandomPredictionsJob)();
    }
    finally {
        isRandomPredictionJobRunning = false;
    }
}), 5 * 60 * 1000);
