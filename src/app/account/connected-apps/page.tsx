import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyMasterSessionToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ConnectedAppsClientView from "./ConnectedAppsClientView";

export default async function ConnectedAppsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("master_session_token");

  if (!token) {
    redirect("/login?return_to=/account/connected-apps");
  }

  const payload = await verifyMasterSessionToken(token.value);
  if (!payload || !payload.userId) {
    redirect("/login?return_to=/account/connected-apps");
  }

  const [user, consents] = await Promise.all([
    prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, name: true, email: true },
    }),
    prisma.userConsent.findMany({
      where: { userId: payload.userId },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            client_id: true,
            is_first_party: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  if (!user) {
    redirect("/login?return_to=/account/connected-apps");
  }

  const serializedUser = {
    ...user,
    name: user.name ?? null,
  };

  interface UserConsentWithClient {
    id: string;
    userId: string;
    clientId: string;
    scopes: string;
    createdAt: Date;
    updatedAt: Date;
    client: {
      id: string;
      name: string;
      client_id: string;
      is_first_party: boolean;
    };
  }

  const serializedConsents = consents.map((c: UserConsentWithClient) => ({
    ...c,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  }));

  return (
    <ConnectedAppsClientView
      initialUser={serializedUser}
      initialConsents={serializedConsents}
    />
  );
}
