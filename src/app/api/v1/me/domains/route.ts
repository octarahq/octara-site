import { NextResponse } from "next/server";
import {
  firstPartyOnlyResponse,
  insufficientScopesResponse,
  verifyAccessToken,
} from "@/lib/oauth-resources";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const auth = await verifyAccessToken(request);

    if ("error" in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { user, scopes } = auth;
    if (!scopes.includes("read:search_domains")) {
      return insufficientScopesResponse(["read:search_domains"]);
    }

    const domains = await prisma.verifiedDomain.findMany({
      where: { userId: user.id },
    });

    return NextResponse.json({
      success: true,
      domains: domains.map((d) => ({
        id: d.id,
        domain: d.domain,
        status: d.status,
        createdAt: d.createdAt,
      })),
    });
  } catch (error) {
    console.error("GET /api/v1/search/domains Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const auth = await verifyAccessToken(request);

    if ("error" in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { user, scopes, isFirstParty } = auth;
    if (!isFirstParty) return firstPartyOnlyResponse();

    if (!scopes.includes("write:search_domains")) {
      return insufficientScopesResponse(["write:search_domains"]);
    }

    const body = await request.json();
    const { domain } = body;

    if (!domain || typeof domain !== "string") {
      return NextResponse.json({ error: "Invalid domain" }, { status: 400 });
    }

    const verificationToken =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    const verificationTxt = `octara-verification=${verificationToken}`;

    const newDomain = await prisma.verifiedDomain.create({
      data: {
        userId: user.id,
        domain,
        status: "PENDING",
        verificationTxt,
      },
    });

    return NextResponse.json({
      success: true,
      domain: newDomain,
    });
  } catch (error) {
    console.error("POST /api/v1/search/domains Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const auth = await verifyAccessToken(request);

    if ("error" in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { user, scopes, isFirstParty } = auth;
    if (!isFirstParty) return firstPartyOnlyResponse();

    if (!scopes.includes("write:search_domains")) {
      return insufficientScopesResponse(["write:search_domains"]);
    }

    const { searchParams } = new URL(request.url);
    const domainId = searchParams.get("id");

    if (!domainId) {
      return NextResponse.json({ error: "Missing domain id" }, { status: 400 });
    }

    await prisma.verifiedDomain.deleteMany({
      where: {
        id: domainId,
        userId: user.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Domain removed",
    });
  } catch (error) {
    console.error("DELETE /api/v1/search/domains Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
