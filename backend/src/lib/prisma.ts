// import { Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
//import { log } from "console";

export const prisma = new PrismaClient({
    log: ['query'],
})
