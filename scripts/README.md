# Database Reset Script

This directory contains utility scripts for managing the database.

## `reset-db.ts`

A script that deletes all data from the database while preserving the schema.

### Usage

```bash
npm run reset-db
```

### What it does

- Deletes all records from all tables in the correct order (respecting foreign key constraints)
- Clears: Users → Rooms → Room Members → Matches → Predictions → Points Ledger
- Shows a summary of deleted records
- Does NOT drop tables or alter schema

### When to use

- Before running end-to-end tests
- To start fresh with testing new features
- To clear test data after development

### Important

⚠️ **This will delete ALL data in the database.** Make sure you have backups if needed.

### Tables affected

- `User` - Clerk user IDs
- `Room` - Betting room definitions
- `RoomMember` - User room memberships
- `Match` - IPL match data
- `Prediction` - User match predictions
- `PointsLedger` - Points calculations

### Example output

```
🗑️  Starting database reset...

Deleting PointsLedger records...
✅ Deleted 0 points ledger records

Deleting Prediction records...
✅ Deleted 5 prediction records

Deleting RoomMember records...
✅ Deleted 3 room member records

Deleting Match records...
✅ Deleted 8 match records

Deleting Room records...
✅ Deleted 2 room records

Deleting User records...
✅ Deleted 3 user records

================================================
✅ Database reset successfully!

Summary:
  • Users: 3
  • Rooms: 2
  • Room Members: 3
  • Matches: 8
  • Predictions: 5
  • Points Ledger: 0
================================================

Ready to test! 🚀
```
