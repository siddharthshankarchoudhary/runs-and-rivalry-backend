"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
// src/middleware/auth.middleware.ts
const clerk_sdk_node_1 = require("@clerk/clerk-sdk-node");
exports.requireAuth = (0, clerk_sdk_node_1.ClerkExpressRequireAuth)();
