import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    await prisma.match.create({
        data: {
            externalMatchId: "match_1",
            teamA: "RCB",
            teamB: "SRH",
            matchDate: new Date(),
            status: "SCHEDULED",
        },
    });
}

main();