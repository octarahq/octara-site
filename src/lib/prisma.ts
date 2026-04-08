import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.error("[Prisma] DATABASE_URL is not set!");
  } else {
    const masked = connectionString.replace(/:([^:@]+)@/, ":****@");
    console.log("[Prisma] Connecting to:", masked);
  }

  // OrionHost and some providers don't always support SSL on custom ports
  const pool = new pg.Pool({
    connectionString,
    ssl: false, // Disable SSL by default as seen in logs
  });
  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log: ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
