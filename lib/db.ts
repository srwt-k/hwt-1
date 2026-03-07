import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@/prisma/generated/prisma/client";
import { env } from "prisma/config";

const adapter = new PrismaMariaDb(env("DATABASE_URL"));
const prisma = new PrismaClient({ adapter, log: env("NODE_ENV") == "production" ? ["query", "error"]: [] });
export { prisma };