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

    if (!scopes.includes("read:search_settings")) {
      return insufficientScopesResponse(["read:search_settings"]);
    }

    const settings = await prisma.searchSettings.findUnique({
      where: { userId: user.id },
    });

    return NextResponse.json({
      success: true,
      settings: {
        safeSearch: settings?.safeSearch ?? "moderate",
        language: settings?.language ?? "auto",
        resultsPerPage: settings?.resultsPerPage ?? 10,
        historyEnabled: settings?.historyEnabled ?? true,
        openInNewTab: settings?.openInNewTab ?? false,
        searchSuggestions: settings?.searchSuggestions ?? true,
      },
    });
  } catch (error) {
    console.error("GET /api/v1/search/settings Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const auth = await verifyAccessToken(request);

    if ("error" in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { user, scopes, isFirstParty } = auth;
    if (!isFirstParty) return firstPartyOnlyResponse();

    if (!scopes.includes("write:search_settings")) {
      return insufficientScopesResponse(["write:search_settings"]);
    }

    const body = await request.json();
    const {
      safeSearch,
      language,
      resultsPerPage,
      historyEnabled,
      openInNewTab,
      searchSuggestions,
    } = body;

    const data: any = {};
    if (typeof safeSearch === "string") data.safeSearch = safeSearch;
    if (typeof language === "string") data.language = language;
    if (typeof resultsPerPage === "number")
      data.resultsPerPage = resultsPerPage;
    if (typeof historyEnabled === "boolean")
      data.historyEnabled = historyEnabled;
    if (typeof openInNewTab === "boolean") data.openInNewTab = openInNewTab;
    if (typeof searchSuggestions === "boolean")
      data.searchSuggestions = searchSuggestions;

    const settings = await prisma.searchSettings.upsert({
      where: { userId: user.id },
      update: data,
      create: {
        userId: user.id,
        ...data,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("PATCH /api/v1/search/settings Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
