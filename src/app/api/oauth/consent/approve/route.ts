import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyMasterSessionToken, generateRandomString } from "@/lib/auth";
import { cookies } from "next/headers";
import { DEFAULT_SCOPE } from "@/lib/constants/scopes";
import { consentSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = consentSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.format() },
        { status: 400 },
      );
    }

    const { client_id, scope, state, redirect_uri } = result.data;

    const cookieStore = await cookies();
    const token = cookieStore.get("master_session_token");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyMasterSessionToken(token.value);
    if (!payload) {
      return NextResponse.json({ error: "Session expired" }, { status: 401 });
    }

    const client = await prisma.client.findUnique({
      where: { client_id },
      include: { redirect_uris: true },
    });

    if (!client) {
      return NextResponse.json({ error: "Invalid client" }, { status: 400 });
    }

    const isPlayground =
      redirect_uri === "/playground/callback" ||
      redirect_uri.endsWith("/playground/callback");
    const isUriValid =
      isPlayground || client.redirect_uris.some((u) => u.uri === redirect_uri);
    if (!isUriValid) {
      return NextResponse.json(
        { error: "Invalid redirect_uri" },
        { status: 400 },
      );
    }

    const approvedScopes = scope || DEFAULT_SCOPE;
    await prisma.userConsent.upsert({
      where: {
        userId_clientId: { userId: payload.userId, clientId: client.id },
      },
      update: { scopes: approvedScopes },
      create: {
        userId: payload.userId,
        clientId: client.id,
        scopes: approvedScopes,
      },
    });

    const code = generateRandomString(32);
    const expires_at = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.authCode.create({
      data: {
        code,
        clientId: client.id,
        userId: payload.userId,
        redirectUri: redirect_uri,
        expires_at,
        scopes: {
          create: approvedScopes
            .split(" ")
            .map((s: string) => ({ scope: s.trim() })),
        },
      },
    });

    const targetUrl = redirect_uri.startsWith("/")
      ? new URL(redirect_uri, "https://octara.xyz")
      : new URL(redirect_uri);
    targetUrl.searchParams.set("code", code);
    if (state) targetUrl.searchParams.set("state", state);

    return NextResponse.json({
      success: true,
      redirect_url: targetUrl.toString(),
    });
  } catch (error) {
    console.error("Consent Approval Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
