import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete("master_session_token");

  return NextResponse.json({ success: true, message: "Logged out from Hub" });
}
