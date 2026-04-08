import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyMasterSessionToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { revokeSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = revokeSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.format() },
        { status: 400 },
      );
    }

    const { clientId } = result.data;

    const cookieStore = await cookies();
    const token = cookieStore.get("master_session_token");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyMasterSessionToken(token.value);
    if (!payload) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    await prisma.userConsent.deleteMany({
      where: {
        userId: payload.userId,
        clientId: clientId,
      },
    });

    await prisma.accessToken.deleteMany({
      where: {
        userId: payload.userId,
        clientId: clientId,
      },
    });

    await prisma.authCode.deleteMany({
      where: {
        userId: payload.userId,
        clientId: clientId,
      },
    });

    return NextResponse.json({ success: true, message: "Accès révoqué" });
  } catch (error) {
    console.error("Revoke Apps Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
