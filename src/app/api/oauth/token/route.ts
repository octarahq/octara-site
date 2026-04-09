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
        {
          error: "invalid_request",
          error_description: "Invalid input parameters",
        },
        { status: 400 },
      );
    }

    const data = result.data;
    const { client_id, client_secret, grant_type } = data;

    const client = await prisma.client.findUnique({
      where: { client_id },
    });

    if (!client) {
      return NextResponse.json({ error: "invalid_client" }, { status: 401 });
    }

    const isSecretValid = await verifyPassword(
      client_secret,
      client.client_secret,
    );
    if (!isSecretValid) {
      return NextResponse.json({ error: "invalid_client" }, { status: 401 });
    }

    if (grant_type === "authorization_code") {
      const { code, redirect_uri } = data;

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
          {
            error: "invalid_grant",
            error_description: "Invalid or expired authorization code",
          },
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
          {
            error: "invalid_grant",
            error_description: "Redirect URI mismatch",
          },
          { status: 400 },
        );
      }

      await prisma.authCode.update({
        where: { id: authCode.id },
        data: { used: true },
      });

      const accessTokenValue = generateRandomString(64);
      const refreshTokenValue = generateRandomString(64);
      const accessExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h
      const refreshExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

      await prisma.$transaction([
        prisma.accessToken.create({
          data: {
            token: accessTokenValue,
            clientId: client.id,
            userId: authCode.userId,
            expires_at: accessExpiresAt,
            scopes: {
              create: authCode.scopes.map((s) => ({
                scope: s.scope,
              })),
            },
          },
        }),
        prisma.refreshToken.create({
          data: {
            token: refreshTokenValue,
            clientId: client.id,
            userId: authCode.userId,
            expires_at: refreshExpiresAt,
            scopes: {
              create: authCode.scopes.map((s) => ({
                scope: s.scope,
              })),
            },
          },
        }),
      ]);

      return NextResponse.json({
        access_token: accessTokenValue,
        refresh_token: refreshTokenValue,
        token_type: "Bearer",
        expires_in: 86400,
        user: {
          id: authCode.user.id,
          email: authCode.user.email,
        },
      });
    } else if (grant_type === "refresh_token") {
      const { refresh_token } = data;

      const refreshToken = await prisma.refreshToken.findUnique({
        where: { token: refresh_token },
        include: { user: true, scopes: true },
      });

      if (
        !refreshToken ||
        refreshToken.clientId !== client.id ||
        refreshToken.expires_at < new Date()
      ) {
        return NextResponse.json(
          {
            error: "invalid_grant",
            error_description: "Invalid or expired refresh token",
          },
          { status: 401 },
        );
      }

      const newAccessTokenValue = generateRandomString(64);
      const newRefreshTokenValue = generateRandomString(64);
      const accessExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const refreshExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      const scopesData = refreshToken.scopes.map((s) => ({
        scope: s.scope,
      }));

      await prisma.$transaction([
        prisma.refreshToken.delete({ where: { id: refreshToken.id } }),
        prisma.accessToken.create({
          data: {
            token: newAccessTokenValue,
            clientId: client.id,
            userId: refreshToken.userId,
            expires_at: accessExpiresAt,
            scopes: {
              create: scopesData,
            },
          },
        }),
        prisma.refreshToken.create({
          data: {
            token: newRefreshTokenValue,
            clientId: client.id,
            userId: refreshToken.userId,
            expires_at: refreshExpiresAt,
            scopes: {
              create: scopesData,
            },
          },
        }),
      ]);

      return NextResponse.json({
        access_token: newAccessTokenValue,
        refresh_token: newRefreshTokenValue,
        token_type: "Bearer",
        expires_in: 86400,
        user: {
          id: refreshToken.user.id,
          email: refreshToken.user.email,
        },
      });
    }

    return NextResponse.json(
      { error: "unsupported_grant_type" },
      { status: 400 },
    );
  } catch (error) {
    console.error("Token Exchange/Refresh Error:", error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
