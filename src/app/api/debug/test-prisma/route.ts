import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("[DEBUG API] ATTEMPTING FETCH");
    const users = await prisma.user.findMany({ take: 1 });
    return NextResponse.json({ success: true, count: users.length });
  } catch (e) {
    console.error("[DEBUG API] CRASH:", e);
    const err = e as Error;
    return NextResponse.json(
      {
        error: err.message || "Unknown error",
        stack: err.stack,
        hint: "Check terminal for more logs",
      },
      { status: 500 },
    );
  }
}
