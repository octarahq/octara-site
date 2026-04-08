import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyMasterSessionToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DeveloperPortalClientView from "./DeveloperPortalClientView";

export default async function DeveloperPortalPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("master_session_token");

  if (!token) {
    redirect("/login?return_to=/account/apps");
  }

  const payload = await verifyMasterSessionToken(token.value);
  if (!payload || !payload.userId) {
    redirect("/login?return_to=/account/apps");
  }

  const apps = await prisma.client.findMany({
    where: { ownerId: payload.userId },
    include: {
      redirect_uris: { select: { uri: true } },
      _count: {
        select: { consents: true },
      },
    },
  });

  const serializedApps = apps.map((app) => ({
    id: app.id,
    client_id: app.client_id,
    name: app.name,
    is_first_party: app.is_first_party,
    redirect_uris: app.redirect_uris.map((r) => r.uri),
    createdAt: app.createdAt.toISOString(),
    userCount: app._count.consents,
  }));

  return <DeveloperPortalClientView initialApps={serializedApps} />;
}
