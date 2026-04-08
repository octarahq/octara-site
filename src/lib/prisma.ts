import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const dbUrl = "file:./dev.db"; 
  let sqlitePath = dbUrl.slice(5);

  if (!path.isAbsolute(sqlitePath)) {
    sqlitePath = path.resolve(process.cwd(), sqlitePath);
  }

  console.log("[Prisma Hub] Connecting with Adapter to:", sqlitePath);

  const adapter = new PrismaBetterSqlite3({
    url: `file:${sqlitePath}`,
  });

  return new PrismaClient({
    adapter,
    log: ["error"],
  });
}

export const prisma = createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
