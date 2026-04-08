import { NextResponse } from "next/server";
import { verifyMasterSessionToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("master_session_token");

    console.log("[STATUS API] Cookie token present:", !!token);

    if (!token) {
      return NextResponse.json(
        { authenticated: false, message: "No session found" },
        { status: 200 },
      );
    }

    const payload = await verifyMasterSessionToken(token.value);
    console.log("[STATUS API] Token verification payload:", !!payload);

    if (!payload) {
      return NextResponse.json(
        { authenticated: false, message: "Invalid or expired session" },
        { status: 200 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { name: true, createdAt: true, passwordUpdatedAt: true },
    });

    console.log("[STATUS API] User found in DB:", !!user);

    return NextResponse.json({
      authenticated: true,
      user: {
        id: payload.userId,
        email: payload.email,
        name: user?.name,
        createdAt: user?.createdAt,
        passwordUpdatedAt: user?.passwordUpdatedAt,
      },
    });
  } catch (error) {
    console.error("Auth Status Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
