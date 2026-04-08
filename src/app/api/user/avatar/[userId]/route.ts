import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  const { userId } = await params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { avatarData: true, email: true },
    });

    if (!user) {
      return new Response("Not Found", { status: 404 });
    }

    if (user.avatarData) {

      const [header, base64] = user.avatarData.includes(",")
        ? user.avatarData.split(",")
        : ["data:image/png;base64", user.avatarData];

      const mime = header.split(";")[0].split(":")[1];
      const buffer = Buffer.from(base64, "base64");

      return new Response(buffer, {
        headers: { "Content-Type": mime },
      });
    }

    const initial = user.email.slice(0, 1).toUpperCase();

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
