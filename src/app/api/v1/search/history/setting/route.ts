import { NextResponse } from "next/server";
import {
  firstPartyOnlyResponse,
  insufficientScopesResponse,
  verifyAccessToken,
} from "@/lib/oauth-resources";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request) {
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

    const body = await request.json();
    const { enabled } = body;

    if (typeof enabled !== "boolean") {
      return NextResponse.json(
        { error: "Invalid value for enabled" },
        { status: 400 },
      );
    }

    const settings = await prisma.searchSettings.upsert({
      where: { userId: user.id },
      update: { historyEnabled: enabled },
      create: {
        userId: user.id,
        historyEnabled: enabled,
      },
    });

    return NextResponse.json({
      success: true,
      settings: {
        enabled: settings.historyEnabled,
        queries: settings.historyQueries,
      },
    });
  } catch (error) {
    console.error("PATCH /api/v1/search/history/setting Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
