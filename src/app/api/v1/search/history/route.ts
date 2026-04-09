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

    const { user, scopes, isFirstParty } = auth;
    if (!isFirstParty) return firstPartyOnlyResponse();

    if (!scopes.includes("read:search_history")) {
      return insufficientScopesResponse(["read:search_history"]);
    }

    const settings = await prisma.searchSettings.findUnique({
      where: { userId: user.id },
    });

    const history = settings?.historyQueries || [];

    return NextResponse.json({
      success: true,
      history,
    });
  } catch (error) {
    console.error("GET /api/v1/search/history Error:", error);
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

    if (!scopes.includes("write:search_history")) {
      return insufficientScopesResponse(["write:search_history"]);
    }

    await prisma.searchSettings.upsert({
      where: { userId: user.id },
      update: { historyQueries: [] },
      create: {
        userId: user.id,
        historyQueries: [],
      },
    });

    return NextResponse.json({
      success: true,
      message: "Search history cleared",
    });
  } catch (error) {
    console.error("DELETE /api/v1/search/history Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
