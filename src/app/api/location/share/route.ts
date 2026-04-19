import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAccessToken, insufficientScopesResponse } from "@/lib/oauth-resources";

export async function GET(request: Request) { // permet de savoir si on partage et qui nous fait un partage
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

  const shares = await prisma.locationShare.findMany({
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
        },
      },
      target: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

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
