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
let isRunning = false;
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
