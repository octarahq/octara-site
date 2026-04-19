import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAccessToken, insufficientScopesResponse } from "@/lib/oauth-resources";
import buildAvatarUrl from "@/utils/users/buildAvatarUrl";

export async function GET(request: Request) {
  const auth = await verifyAccessToken(request);
  if ((auth as any).error) {
    return NextResponse.json({ error: auth.error }, { status: (auth as any).status || 401 });
  }

  const searchParams = new URL(request.url).searchParams;
  const userId = searchParams.get("userId");
  const { user } = auth as any;
  const scopes = (auth as any).scopes as string[];

  if (!scopes.includes("share:location")) {
    return insufficientScopesResponse(["share:location"]);
  }

  const sharesRaw = await prisma.locationShare.findMany({
    where: {
      OR: [
        { sharerId: userId || user.id },
        { targetId: userId || user.id },
      ],
    },
    include: {
      sharer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      target: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  const shares = sharesRaw.map((s) => ({
    id: s.id,
    whoShare: {
      id: s.sharer.id,
      name: s.sharer.name,
      email: s.sharer.email,
      avatar_url: buildAvatarUrl({ id: s.sharer.id }),
    },
    toWho: {
      id: s.target.id,
      name: s.target.name,
      email: s.target.email,
      avatar_url: buildAvatarUrl({ id: s.target.id }),
    },
    expiresAt: s.expiresAt,
  }));

  return NextResponse.json({ ok: true, shares });
}

export async function POST(request: Request) {
  const auth = await verifyAccessToken(request);
  if ((auth as any).error) {
    return NextResponse.json({ error: auth.error }, { status: (auth as any).status || 401 });
  }

  const { user } = auth as any;
  const scopes = (auth as any).scopes as string[];

  if (!scopes.includes("share:location")) {
    return insufficientScopesResponse(["share:location"]);
  }

  const body = await request.json();
  const { targetUserId, durationHours = 1 } = body;

  if (!targetUserId) {
    return NextResponse.json({ error: "targetUserId is required" }, { status: 400 });
  }

  const hours = Math.min(Number(durationHours) || 1, 24);
  const expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000);

  const share = await prisma.locationShare.create({
    data: {
      sharerId: user.id,
      targetId: targetUserId,
      expiresAt,
    },
  });

  await prisma.nearbyPerson.upsert({
    where: {
      ownerId_personId: {
        ownerId: user.id,
        personId: targetUserId,
      },
    },
    update: {},
    create: {
      ownerId: user.id,
      personId: targetUserId,
    },
  });

  return NextResponse.json({ ok: true, share });
}

export async function DELETE(request: Request) {
  const auth = await verifyAccessToken(request);
  if ((auth as any).error) {
    return NextResponse.json({ error: auth.error }, { status: (auth as any).status || 401 });
  }

  const { user } = auth as any;
  const scopes = (auth as any).scopes as string[];

  if (!scopes.includes("share:location")) {
    return insufficientScopesResponse(["share:location"]);
  }

  const searchParams = new URL(request.url).searchParams;
  const targetUserId = searchParams.get("targetUserId");

  if (!targetUserId) {
    return NextResponse.json({ error: "targetUserId is required" }, { status: 400 });
  }

  try {
    await prisma.locationShare.deleteMany({
      where: {
        sharerId: user.id,
        targetId: targetUserId,
      },
    });

    return NextResponse.json({ ok: true, message: "Partage arrêté avec succès" });
  } catch (error) {
    console.error("Erreur lors de l'arrêt du partage:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}