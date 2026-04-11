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
      {
        error: "invalid_request",
        error_description: "Invalid or missing parameters",
      },
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
      return NextResponse.json(
        {
          error: "unauthorized_client",
          error_description: "Invalid client_id",
        },
        { status: 400 },
      );
    }

    const isPlayground =
      redirect_uri === "/playground/callback" ||
      redirect_uri.endsWith("/playground/callback");
    const isUriValid =
      isPlayground || client.redirect_uris.some((u) => u.uri === redirect_uri);
    if (!isUriValid) {
      return NextResponse.json(
        { error: "invalid_request", error_description: "Invalid redirect_uri" },
        { status: 400 },
      );
    }

    if (response_type !== "code") {
      return NextResponse.json(
        { error: "unsupported_response_type" },
        { status: 400 },
      );
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("master_session_token");

    if (!token) {
      const { pathname, search } = new URL(request.url);
      const loginUrl = new URL("/login", "https://octara.xyz");
      loginUrl.searchParams.set("return_to", pathname + search);
      return NextResponse.redirect(loginUrl);
    }

    const payload = await verifyMasterSessionToken(token.value);
    if (!payload) {
      const { pathname, search } = new URL(request.url);
      const loginUrl = new URL("/login", "https://octara.xyz");
      loginUrl.searchParams.set("return_to", pathname + search);
      return NextResponse.redirect(loginUrl);
    }

    const consentUrl = new URL("/oauth/consent", "https://octara.xyz");
    consentUrl.searchParams.set("client_id", client_id);
    consentUrl.searchParams.set("scope", scope);
    consentUrl.searchParams.set("state", state);
    consentUrl.searchParams.set("redirect_uri", redirect_uri);
    return NextResponse.redirect(consentUrl);
  } catch (error) {
    console.error("Authorize Error:", error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
