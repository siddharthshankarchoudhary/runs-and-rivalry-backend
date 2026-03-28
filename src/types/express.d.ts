// src/types/express.d.ts

import { AuthObject } from "@clerk/clerk-sdk-node";

declare global {
    namespace Express {
        interface Request {
            auth: AuthObject;
        }
    }
}
