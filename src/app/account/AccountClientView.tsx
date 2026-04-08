"use client";

import AccountSidebar from "./_components/AccountSidebar";
import AccountForms from "./_components/AccountForms";

interface InitialUser {
  id: string;
  email: string;
  name?: string | null;
  createdAt?: string;
  passwordUpdatedAt?: string;
}

export default function AccountClientView({
  initialUser,
}: {
  initialUser: InitialUser;
}) {
  return (
    <div className="min-h-screen bg-background-dark text-on-surface selection:bg-primary/30 font-body">
      <AccountSidebar />
      <AccountForms initialUser={initialUser} />
    </div>
  );
}
