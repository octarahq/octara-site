import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("[DEBUG API] ATTEMPTING FETCH");
    const users = await prisma.user.findMany({ take: 1 });
    return NextResponse.json({ success: true, count: users.length });
  } catch (e: any) {
    console.error("[DEBUG API] CRASH:", e);
    return NextResponse.json(
      {
        error: e.message,
        stack: e.stack,
        hint: "Check terminal for more logs",
      },
      { status: 500 },
    );
  }
}
