import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  verifyMasterSessionToken,
  generateRandomString,
  generateClientSecret,
  hashPassword,
} from "@/lib/auth";
import { cookies } from "next/headers";
import { appCreateSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("master_session_token");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyMasterSessionToken(token.value);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const result = appCreateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.format() },
        { status: 400 },
      );
    }

    const { name, redirect_uris } = result.data;

    const client_id = `app_oct_${generateRandomString(16)}`;
    const raw_client_secret = generateClientSecret();
    const hashed_client_secret = await hashPassword(raw_client_secret);
    const app = await prisma.client.create({
      data: {
        client_id,
        client_secret: hashed_client_secret,
        name,
        is_first_party: false,
        ownerId: payload.userId,
        redirect_uris: {
          create: redirect_uris.map((uri: string) => ({ uri })),
        },
      },
    });

    return NextResponse.json({
      success: true,
      app: {
        id: app.id,
        client_id: app.client_id,
        client_secret: raw_client_secret,
        name: app.name,
        is_first_party: app.is_first_party,
        redirect_uris: redirect_uris,
      },
    });
  } catch (error) {
    console.error("App Creation Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
