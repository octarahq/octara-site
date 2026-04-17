import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAccessToken } from "@/lib/oauth-resources";
import { cookies } from "next/headers";
import { verifyMasterSessionToken } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    let userId: string | null = null;

    const auth = await verifyAccessToken(request);
    if (!("error" in auth)) {
      userId = auth.user.id;
    } else {
      const cookieStore = await cookies();
      const token = cookieStore.get("master_session_token");
      if (token) {
        const payload = await verifyMasterSessionToken(token.value);
        if (payload) userId = payload.userId;
      }
    }

    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const nearby = await prisma.nearbyPerson.findMany({
      where: { ownerId: userId },
      include: { person: { select: { id: true, name: true, email: true, createdAt: true } } },
      orderBy: { createdAt: "desc" },
    });

    const result = nearby.map((n) => ({
      id: n.person.id,
      name: n.person.name,
      email: n.person.email,
      addedAt: n.createdAt.toISOString(),
    }));

    return NextResponse.json({ ok: true, nearby: result });
  } catch (err) {
    console.error("Nearby API error:", err);
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("master_session_token");
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = await verifyMasterSessionToken(token.value);
    if (!payload || !payload.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { targetUserId } = body;
    if (!targetUserId) return NextResponse.json({ error: "targetUserId required" }, { status: 400 });

    const target = await prisma.user.findUnique({ where: { id: targetUserId } });
    if (!target) return NextResponse.json({ error: "target not found" }, { status: 404 });

    if (target.id === payload.userId) return NextResponse.json({ error: "cannot add yourself" }, { status: 400 });
    if (await prisma.nearbyPerson.findUnique({ where: { ownerId_personId: { ownerId: payload.userId, personId: targetUserId } } })) return NextResponse.json({ error: "already added" }, { status: 400 });

    const existing = await prisma.nearbyPerson.upsert({
      where: { ownerId_personId: { ownerId: payload.userId, personId: targetUserId } },
      update: {},
      create: { ownerId: payload.userId, personId: targetUserId },
    });

    return NextResponse.json({ ok: true, nearby: { id: target.id, name: target.name, email: target.email, addedAt: existing.createdAt.toISOString() } });
  } catch (err) {
    console.error("Nearby POST error:", err);
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("master_session_token");
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = await verifyMasterSessionToken(token.value);
    if (!payload || !payload.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const url = new URL(request.url);
    const targetUserId = url.searchParams.get("targetUserId");
    let id = targetUserId;
    if (!id) {
      try {
        const body = await request.json();
        id = body?.targetUserId;
      } catch (_) {
        
      }
    }

    if (!id) return NextResponse.json({ error: "targetUserId required" }, { status: 400 });

    await prisma.nearbyPerson.deleteMany({ where: { ownerId: payload.userId, personId: id } });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Nearby DELETE error:", err);
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }
}
