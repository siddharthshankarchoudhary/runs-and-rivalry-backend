/**
 * Database Reset Script
 * 
 * Deletes all data from the database while preserving the schema.
 * Useful for testing and development purposes.
 * 
 * Usage:
 *   npx ts-node scripts/reset-db.ts
 */

import { prisma } from "../src/prisma/client";

async function resetDatabase() {
    try {
        console.log("🗑️  Starting database reset...\n");

        // Delete data in reverse order of dependencies (foreign key constraints)
        console.log("Deleting PointsLedger records...");
        const pointsDeleted = await prisma.pointsLedger.deleteMany();
        console.log(`✅ Deleted ${pointsDeleted.count} points ledger records\n`);

        console.log("Deleting Prediction records...");
        const predictionsDeleted = await prisma.prediction.deleteMany();
        console.log(`✅ Deleted ${predictionsDeleted.count} prediction records\n`);

        console.log("Deleting RoomMember records...");
        const roomMembersDeleted = await prisma.roomMember.deleteMany();
        console.log(`✅ Deleted ${roomMembersDeleted.count} room member records\n`);

        console.log("Deleting Match records...");
        const matchesDeleted = await prisma.match.deleteMany();
        console.log(`✅ Deleted ${matchesDeleted.count} match records\n`);

        console.log("Deleting Room records...");
        const roomsDeleted = await prisma.room.deleteMany();
        console.log(`✅ Deleted ${roomsDeleted.count} room records\n`);

        console.log("Deleting User records...");
        const usersDeleted = await prisma.user.deleteMany();
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
    } catch (error) {
        console.error("❌ Error resetting database:", error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

resetDatabase();
