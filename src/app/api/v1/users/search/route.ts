import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const q = url.searchParams.get("q") || url.searchParams.get("query") || "";
    if (!q || q.trim().length === 0) return NextResponse.json({ ok: true, users: [] });

    const users = await prisma.user.findMany({
      where: {
        OR: [
          { email: { contains: q, mode: "insensitive" } },
          { name: { contains: q, mode: "insensitive" } },
        ],
      },
      select: { id: true, name: true, email: true },
      take: 10,
    });

    return NextResponse.json({ ok: true, users });
  } catch (err) {
    console.error("User search error:", err);
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }
}
