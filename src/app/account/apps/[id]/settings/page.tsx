import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ConfigAppClientView from "./ConfigAppClientView";
import { cookies } from "next/headers";
import { verifyMasterSessionToken } from "@/lib/auth";

export default async function AppSettingsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("master_session_token")?.value;

  if (!token) {
    redirect("/login");
  }

  const payload = await verifyMasterSessionToken(token);
  if (!payload) {
    redirect("/login");
  }

  const app = await prisma.client.findUnique({
    where: { id, ownerId: payload.userId },
    include: {
      redirect_uris: true,
    },
  });

  if (!app) {
    redirect("/account/apps");
  }

  return <ConfigAppClientView app={app} />;
}
