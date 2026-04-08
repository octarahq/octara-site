import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const app = await prisma.client.findUnique({
      where: { id },
      select: { logoData: true, name: true },
    });

    if (!app) {
      return new Response("Not Found", { status: 404 });
    }

    if (app.logoData) {
      const [header, base64] = app.logoData.includes(",")
        ? app.logoData.split(",")
        : ["data:image/png;base64", app.logoData];

      const mime = header.split(";")[0].split(":")[1];
      const buffer = Buffer.from(base64, "base64");

      return new Response(buffer, {
        headers: { "Content-Type": mime },
      });
    }

    const initial = app.name.slice(0, 1).toUpperCase();

    const svg = `
    <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#a3a6ff;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#6366f1;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="100" height="100" rx="24" fill="url(#grad)" />
      <text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" fill="white" font-family="sans-serif" font-weight="900" font-size="40">
        ${initial}
      </text>
    </svg>
    `.trim();

    return new Response(svg, {
      headers: { "Content-Type": "image/svg+xml" },
    });
  } catch (error) {
    console.error("App Logo API Error:", error);
    return new Response("Error", { status: 500 });
  }
}
