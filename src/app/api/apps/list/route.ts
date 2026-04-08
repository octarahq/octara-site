import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyMasterSessionToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET() {
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

    const apps = await prisma.client.findMany({
      where: { ownerId: payload.userId },
      include: {
        redirect_uris: {
          select: { uri: true },
        },
      },
    });

    interface AppListItem {
      id: string;
      client_id: string;
      name: string;
      is_first_party: boolean;
      createdAt: Date;
      redirect_uris: { uri: string }[];
    }

    return NextResponse.json({
      success: true,
      apps: apps.map((app: AppListItem) => ({
        id: app.id,
        client_id: app.client_id,
        name: app.name,
        is_first_party: app.is_first_party,
        redirect_uris: app.redirect_uris.map((r: { uri: string }) => r.uri),
        created_at: app.createdAt,
      })),
    });
  } catch (error) {
    console.error("App List Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
