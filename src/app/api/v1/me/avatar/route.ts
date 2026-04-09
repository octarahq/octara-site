import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAccessToken } from "@/lib/oauth-resources";

import { cookies } from "next/headers";
import { verifyMasterSessionToken } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    let userId: string | null = null;

    const auth = await verifyAccessToken(request);
    if (!("error" in auth)) {
      userId = auth.user.id;
    } else {
      const cookieStore = await cookies();
      const token = cookieStore.get("master_session_token");
      if (token) {
        const payload = await verifyMasterSessionToken(token.value);
        if (payload) {
          userId = payload.userId;
        }
      }
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { avatarData: true, email: true },
    });

    if (!dbUser) {
      return new Response("Not Found", { status: 404 });
    }

    if (dbUser.avatarData) {
      const [header, base64] = dbUser.avatarData.includes(",")
        ? dbUser.avatarData.split(",")
        : ["data:image/png;base64", dbUser.avatarData];

      const mime = header.split(";")[0].split(":")[1];
      const buffer = Buffer.from(base64, "base64");

      return new Response(buffer, {
        headers: { "Content-Type": mime },
      });
    }

    const initial = (dbUser.email || "U").slice(0, 1).toUpperCase();

    const svg = `
    <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#6366f1;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#2563eb;stop-opacity:1" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="50" fill="url(#grad)" />
      <text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" fill="white" font-family="sans-serif" font-weight="900" font-size="40">
        ${initial}
      </text>
    </svg>
    `.trim();

    return new Response(svg, {
      headers: { "Content-Type": "image/svg+xml" },
    });
  } catch (error) {
    console.error("Avatar API Error:", error);
    return new Response("Error", { status: 500 });
  }
}
