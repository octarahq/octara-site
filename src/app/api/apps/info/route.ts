import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const infoSchema = z.object({
  client_id: z.string().min(1).max(100),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const result = infoSchema.safeParse(
    Object.fromEntries(searchParams.entries()),
  );

  if (!result.success) {
    return NextResponse.json(
      { error: "Invalid client_id", details: result.error.format() },
      { status: 400 },
    );
  }

  const { client_id } = result.data;

  try {
    const client = await prisma.client.findUnique({
      where: { client_id: client_id as string },
      include: {
        redirect_uris: true,
      },
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      app: {
        ...client,
        avatarURL: `/api/apps/logo/${client.id}`,
      },
    });
  } catch (error) {
    console.error("App Info Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
