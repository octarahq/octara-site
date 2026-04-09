import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function verifyAccessToken(request: Request) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { error: "Missing or invalid authorization header", status: 401 };
  }

  const token = authHeader.split(" ")[1];

  const accessToken = await prisma.accessToken.findUnique({
    where: { token },
    include: {
      user: true,
      scopes: true,
      client: true,
    },
  });

  if (!accessToken || accessToken.expires_at < new Date()) {
    return { error: "Invalid or expired access token", status: 401 };
  }

  return {
    accessToken,
    user: accessToken.user,
    scopes: accessToken.scopes.map((s) => s.scope),
    isFirstParty: accessToken.client.is_first_party,
  };
}

export function insufficientScopesResponse(scopes: string[]) {
  return NextResponse.json(
    { error: `Insufficient scope (${scopes.join(" or ")} required)` },
    { status: 403 },
  );
}

export function firstPartyOnlyResponse() {
  return NextResponse.json(
    {
      error: "This operation is restricted to Octara first-party applications",
    },
    { status: 403 },
  );
}
