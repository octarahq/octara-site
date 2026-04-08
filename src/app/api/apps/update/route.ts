import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { verifyMasterSessionToken } from "@/lib/auth";
import { cookies } from "next/headers";
import sharp from "sharp";
import { appUpdateSchema } from "@/lib/validations";

export async function PUT(request: Request) {
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
    const result = appUpdateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.format() },
        { status: 400 },
      );
    }

    const { id, name, description, redirect_uris, logoData } = result.data;

    const existingApp = await prisma.client.findUnique({
      where: { id, ownerId: payload.userId },
    });

    if (!existingApp) {
      return NextResponse.json(
        { error: "App not found or already deleted" },
        { status: 404 },
      );
    }

    const updateData: Prisma.ClientUpdateInput = {};
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;

    if (logoData !== undefined && logoData !== null) {
      if (logoData.startsWith("data:image/")) {
        const [header, base64] = logoData.split(",");
        const buffer = Buffer.from(base64, "base64");

        const compressedBuffer = await sharp(buffer)
          .resize(512, 512, { fit: "inside", withoutEnlargement: true })
          .webp({ quality: 80 })
          .toBuffer();

        const compressedBase64 = `data:image/webp;base64,${compressedBuffer.toString("base64")}`;
        updateData.logoData = compressedBase64;
      } else {
        updateData.logoData = logoData;
      }
    } else if (logoData === null) {
      updateData.logoData = null;
    }

    if (redirect_uris && Array.isArray(redirect_uris)) {
      for (const uri of redirect_uris) {
        try {
          const parsed = new URL(uri);
          if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
            throw new Error();
          }
        } catch {
          return NextResponse.json(
            { error: `URL de redirection invalide: ${uri}` },
            { status: 400 },
          );
        }
      }

      await prisma.clientRedirectUri.deleteMany({
        where: { clientId: existingApp.id },
      });

      updateData.redirect_uris = {
        create: redirect_uris.map((uri: string) => ({ uri })),
      };
    }

    const app = await prisma.client.update({
      where: { id },
      data: updateData,
      include: {
        redirect_uris: {
          select: { uri: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      app: {
        id: app.id,
        client_id: app.client_id,
        name: app.name,
        description: app.description,
        is_first_party: app.is_first_party,
        redirect_uris: app.redirect_uris.map((r: { uri: string }) => r.uri),
      },
    });
  } catch (error) {
    console.error("App Update Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
