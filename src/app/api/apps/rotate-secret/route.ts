import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyMasterSessionToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { generateClientSecret, hashPassword } from "@/lib/auth";
import { idSchema } from "@/lib/validations";

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
    const result = idSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.format() },
        { status: 400 },
      );
    }

    const { id } = result.data;

    const existingApp = await prisma.client.findUnique({
      where: { id, ownerId: payload.userId },
    });

    if (!existingApp) {
      return NextResponse.json({ error: "App not found" }, { status: 404 });
    }

    const newSecret = generateClientSecret();
    const hashedSecret = await hashPassword(newSecret);

    await prisma.client.update({
      where: { id },
      data: { client_secret: hashedSecret },
    });

    return NextResponse.json({
      success: true,
      client_secret: newSecret,
    });
  } catch (error) {
    console.error("Secret Rotation Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
