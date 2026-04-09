import { prisma } from "./src/lib/prisma";

async function check() {
  console.log("AccessToken property:", typeof (prisma as any).accessToken);
  console.log("RefreshToken property:", typeof (prisma as any).refreshToken);
  process.exit(0);
}

check().catch((err) => {
  console.error(err);
  process.exit(1);
});
