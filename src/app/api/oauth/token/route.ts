import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, generateRandomString } from "@/lib/auth";
import { tokenSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = tokenSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.format() },
        { status: 400 },
      );
    }

    const { client_id, client_secret, code, redirect_uri, grant_type } =
      result.data;

    const client = await prisma.client.findUnique({
      where: { client_id },
    });

    if (!client) {
      return NextResponse.json({ error: "Invalid client" }, { status: 401 });
    }

    const isSecretValid = await verifyPassword(
      client_secret,
      client.client_secret,
    );
    if (!isSecretValid) {
      return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
    }

    const authCode = await prisma.authCode.findUnique({
      where: { code },
      include: { user: true, scopes: true },
    });

    if (
      !authCode ||
      authCode.clientId !== client.id ||
      authCode.used ||
      authCode.expires_at < new Date()
    ) {
      return NextResponse.json(
        { error: "Invalid or expired code" },
        { status: 400 },
      );
    }

    const isPlayground = (uri: string) =>
      uri === "/playground/callback" || uri.endsWith("/playground/callback");

    if (
      authCode.redirectUri !== redirect_uri &&
      !(isPlayground(authCode.redirectUri) && isPlayground(redirect_uri))
    ) {
      return NextResponse.json(
        { error: "Redirect URI mismatch" },
        { status: 400 },
      );
    }

    await prisma.authCode.update({
      where: { id: authCode.id },
      data: { used: true },
    });
    const accessTokenValue = generateRandomString(64);
    const expires_at = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const accessToken = await prisma.accessToken.create({
      data: {
        token: accessTokenValue,
        clientId: client.id,
        userId: authCode.userId,
        expires_at,
        scopes: {
          create: authCode.scopes.map((s: { scope: string }) => ({
            scope: s.scope,
          })),
        },
      },
    });

    return NextResponse.json({
      access_token: accessTokenValue,
      token_type: "Bearer",
      expires_in: 86400,
      user: {
        id: authCode.user.id,
        email: authCode.user.email,
      },
    });
  } catch (error) {
    console.error("Token Exchange Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
