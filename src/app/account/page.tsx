import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyMasterSessionToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AccountClientView from "./AccountClientView";

export default async function AccountPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("master_session_token");

  if (!token) {
    redirect("/login?return_to=/account");
  }

  const payload = await verifyMasterSessionToken(token.value);
  if (!payload || !payload.userId) {
    redirect("/login?return_to=/account");
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
      passwordUpdatedAt: true,
    },
  });

  if (!user) {
    redirect("/login?return_to=/account");
  }

  const serializedUser = {
    ...user,
    createdAt: user.createdAt.toISOString(),
    passwordUpdatedAt: user.passwordUpdatedAt.toISOString(),
  };

  return <AccountClientView initialUser={serializedUser} />;
}
