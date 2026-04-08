import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyMasterSessionToken, generateRandomString } from "@/lib/auth";
import { cookies } from "next/headers";
import { DEFAULT_SCOPE } from "@/lib/constants/scopes";
import { authorizeSchema } from "@/lib/validations";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const params = Object.fromEntries(searchParams.entries());
  const result = authorizeSchema.safeParse({
    ...params,
    scope: params.scope || DEFAULT_SCOPE,
    state: params.state || "",
  });

  if (!result.success) {
    return NextResponse.json(
      { error: "Invalid request parameters", details: result.error.format() },
      { status: 400 },
    );
  }

  const {
    client_id,
    redirect_uri,
    response_type,
    scope = DEFAULT_SCOPE,
    state = "",
  } = result.data;

  try {
    const client = await prisma.client.findUnique({
      where: { client_id },
      include: { redirect_uris: true },
    });

    if (!client) {
      return NextResponse.json({ error: "Invalid client_id" }, { status: 400 });
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

    const cookieStore = await cookies();
    const token = cookieStore.get("master_session_token");

    if (!token) {
      const loginUrl = new URL("/login", "https://octara.xyz");
      loginUrl.searchParams.set("return_to", request.url);
      return NextResponse.redirect(loginUrl);
    }

    const payload = await verifyMasterSessionToken(token.value);
    if (!payload) {
      const loginUrl = new URL("/login", "https://octara.xyz");
      loginUrl.searchParams.set("return_to", request.url);
      return NextResponse.redirect(loginUrl);
    }
    if (client.is_first_party) {
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
            create: scope.split(" ").map((s) => ({ scope: s.trim() })),
          },
        },
      });

      const targetUrl = redirect_uri.startsWith("/")
        ? new URL(redirect_uri, "https://octara.xyz")
        : new URL(redirect_uri);
      targetUrl.searchParams.set("code", code);
      if (state) targetUrl.searchParams.set("state", state);

      return NextResponse.redirect(targetUrl);
    } else {
      const consentUrl = new URL("/oauth/consent", "https://octara.xyz");
      consentUrl.searchParams.set("client_id", client_id);
      consentUrl.searchParams.set("scope", scope);
      consentUrl.searchParams.set("state", state);
      consentUrl.searchParams.set("redirect_uri", redirect_uri);
      return NextResponse.redirect(consentUrl);
    }
  } catch (error) {
    console.error("Authorize Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
