"use strict";
/**
 * Database Reset Script
 *
 * Deletes all data from the database while preserving the schema.
 * Useful for testing and development purposes.
 *
 * Usage:
 *   npx ts-node scripts/reset-db.ts
 */
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
const client_1 = require("../src/prisma/client");
function resetDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("🗑️  Starting database reset...\n");
            // Delete data in reverse order of dependencies (foreign key constraints)
            console.log("Deleting PointsLedger records...");
            const pointsDeleted = yield client_1.prisma.pointsLedger.deleteMany();
            console.log(`✅ Deleted ${pointsDeleted.count} points ledger records\n`);
            console.log("Deleting Prediction records...");
            const predictionsDeleted = yield client_1.prisma.prediction.deleteMany();
            console.log(`✅ Deleted ${predictionsDeleted.count} prediction records\n`);
            console.log("Deleting RoomMember records...");
            const roomMembersDeleted = yield client_1.prisma.roomMember.deleteMany();
            console.log(`✅ Deleted ${roomMembersDeleted.count} room member records\n`);
            console.log("Deleting Match records...");
            const matchesDeleted = yield client_1.prisma.match.deleteMany();
            console.log(`✅ Deleted ${matchesDeleted.count} match records\n`);
            console.log("Deleting Room records...");
            const roomsDeleted = yield client_1.prisma.room.deleteMany();
            console.log(`✅ Deleted ${roomsDeleted.count} room records\n`);
            console.log("Deleting User records...");
            const usersDeleted = yield client_1.prisma.user.deleteMany();
            console.log(`✅ Deleted ${usersDeleted.count} user records\n`);
            console.log("=" + "=".repeat(48));
            console.log("✅ Database reset successfully!\n");
            console.log("Summary:");
            console.log(`  • Users: ${usersDeleted.count}`);
            console.log(`  • Rooms: ${roomsDeleted.count}`);
            console.log(`  • Room Members: ${roomMembersDeleted.count}`);
            console.log(`  • Matches: ${matchesDeleted.count}`);
            console.log(`  • Predictions: ${predictionsDeleted.count}`);
            console.log(`  • Points Ledger: ${pointsDeleted.count}`);
            console.log("=" + "=".repeat(48) + "\n");
            console.log("Ready to test! 🚀\n");
        }
        catch (error) {
            console.error("❌ Error resetting database:", error);
            process.exit(1);
        }
        finally {
            yield client_1.prisma.$disconnect();
        }
    });
}
resetDatabase();
