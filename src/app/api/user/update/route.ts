import { NextResponse } from "next/server";
import {
  verifyMasterSessionToken,
  hashPassword,
  verifyPassword,
} from "@/lib/auth";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import sharp from "sharp";
import { userUpdateSchema } from "@/lib/validations";
import type { Prisma } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("master_session_token");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyMasterSessionToken(token.value);
    if (!payload) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const body = await request.json();
    const result = userUpdateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.format() },
        { status: 400 },
      );
    }

    const { name, email, password, currentPassword, avatarData } = result.data;

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 },
      );
    }

    const updateData: Prisma.UserUpdateInput = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;

    if (avatarData !== undefined && avatarData !== null) {
      try {
        const base64Data = avatarData.split(",")[1];
        const buffer = Buffer.from(base64Data, "base64");

        const compressedBuffer = await sharp(buffer)
          .resize(256, 256, { fit: "cover" })
          .webp({ quality: 70 })
          .toBuffer();

        updateData.avatarData = `data:image/webp;base64,${compressedBuffer.toString("base64")}`;
      } catch (err) {
        console.error("Compression Error:", err);
      }
    } else if (avatarData === null) {
      updateData.avatarData = null;
    }

    if (password) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: "Ancien mot de passe requis" },
          { status: 400 },
        );
      }
      const isPasswordValid = await verifyPassword(
        currentPassword,
        user.password_hash,
      );
      if (!isPasswordValid) {
        return NextResponse.json(
          { error: "Ancien mot de passe incorrect" },
          { status: 400 },
        );
      }
      updateData.password_hash = await hashPassword(password);
      updateData.passwordUpdatedAt = new Date();
    }

    const updatedUser = await prisma.user.update({
      where: { id: payload.userId },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
      },
    });
  } catch (error) {
    console.error("Update User Error:", error);
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Cet email est déjà utilisé" },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
