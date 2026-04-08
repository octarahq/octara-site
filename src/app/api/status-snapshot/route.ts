import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "server", "status-snapshot.json");
    const data = await fs.promises.readFile(filePath, "utf8");
    const json = JSON.parse(data);
    return NextResponse.json(json);
  } catch (err) {
    if (
      err &&
      typeof err === "object" &&
      "code" in err &&
      err.code === "ENOENT"
    ) {
      const g = globalThis as unknown as {
        __octara_status_projects_snapshot?: unknown;
      };
      if (g && g.__octara_status_projects_snapshot) {
        return NextResponse.json(g.__octara_status_projects_snapshot);
      }
      return NextResponse.json({ projects: [] });
    }

    const g = globalThis as unknown as {
      __octara_status_projects_snapshot?: unknown;
    };
    if (g && g.__octara_status_projects_snapshot) {
      return NextResponse.json(g.__octara_status_projects_snapshot);
    }
    return NextResponse.json(
      { error: "failed to read snapshot" },
      { status: 500 },
    );
  }
}
