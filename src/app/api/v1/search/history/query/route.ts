import { NextResponse } from "next/server";
import {
  firstPartyOnlyResponse,
  insufficientScopesResponse,
  verifyAccessToken,
} from "@/lib/oauth-resources";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
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
    const { query } = body;

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid query" },
        { status: 400 },
      );
    }

    const settings = await prisma.searchSettings.findUnique({
      where: { userId: user.id },
    });

    let queries = settings?.historyQueries || [];

    queries = queries.filter((q) => q !== query);

    queries.unshift(query);

    if (queries.length > 10) {
      queries = queries.slice(0, 10);
    }

    await prisma.searchSettings.upsert({
      where: { userId: user.id },
      update: { historyQueries: queries },
      create: {
        userId: user.id,
        historyQueries: queries,
      },
    });

    return NextResponse.json({
      success: true,
      query,
      history: queries,
    });
  } catch (error) {
    console.error("POST /api/v1/search/history/query Error:", error);
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

    const { searchParams } = new URL(request.url);
    let query = searchParams.get("query");

    if (!query) {
      try {
        const body = await request.json();
        query = body.query;
      } catch (e) {}
    }

    if (!query) {
      return NextResponse.json(
        { error: "Missing query to delete" },
        { status: 400 },
      );
    }

    const settings = await prisma.searchSettings.findUnique({
      where: { userId: user.id },
    });

    if (settings) {
      const queries = settings.historyQueries.filter((q) => q !== query);
      await prisma.searchSettings.update({
        where: { userId: user.id },
        data: { historyQueries: queries },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Query deleted from history",
    });
  } catch (error) {
    console.error("DELETE /api/v1/search/history/query Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
