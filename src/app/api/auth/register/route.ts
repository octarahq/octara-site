import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, createMasterSessionToken } from "@/lib/auth";
import { registerSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.format() },
        { status: 400 },
      );
    }

    const { email, password } = result.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 },
      );
    }

    const password_hash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        password_hash,
      },
    });

    const token = await createMasterSessionToken(user.id, user.email);

    const response = NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email },
    });

    response.cookies.set("master_session_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365 * 100,
    });

    return response;
  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
