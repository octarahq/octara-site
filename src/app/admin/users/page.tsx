"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card,  CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, ShieldAlert, User } from "lucide-react";

interface UserModel {
  ID: string;
  Username: string;
  Email: string;
  Role: string;
  IsVerified: boolean;
  CreatedAt: string;
  AvatarData: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<UserModel[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/v1/admin/users");
      const data = await res.json();
      if (data.users && Array.isArray(data.users)) {
        setUsers(data.users);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    const originalUsers = [...users];
    setUsers(users.map(u => u.ID === userId ? { ...u, Role: newRole } : u));

    try {
      const res = await fetch(`/api/v1/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (!res.ok) throw new Error();
      toast.success("User role updated successfully!");
    } catch {
      toast.error("Failed to update user role.");
      setUsers(originalUsers);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">Manage all users and their permissions across the platform.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <p className="text-muted-foreground">Loading users...</p>
        </div>
      ) : users.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center">
          <CardHeader>
            <CardTitle>No users found</CardTitle>
            <CardDescription>No users are registered on the platform.</CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-4">
          {users.map((user) => (
            <Card key={user.ID} className="hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 py-4">
                <div className="flex items-center gap-4">
                  {user.AvatarData ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={user.AvatarData}
                        alt={user.Username}
                        className="size-10 rounded-full object-cover border border-zinc-200 dark:border-zinc-800"
                      />
                    </>
                  ) : (
                    <div className="size-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 border border-zinc-200 dark:border-zinc-800">
                      <User className="size-5" />
                    </div>
                  )}
                  <div className="space-y-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {user.Username}
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold border ${
                        user.IsVerified
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30"
                          : "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-850 dark:text-zinc-400 dark:border-zinc-800"
                      }`}>
                        {user.IsVerified ? "Verified" : "Unverified"}
                      </span>
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {user.Email}
                    </CardDescription>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-md border ${
                    user.Role === "ADMIN" 
                    ? "bg-amber-50 border-amber-200 text-amber-600 dark:bg-amber-950/20 dark:border-amber-900/50 dark:text-amber-500" 
                    : "bg-zinc-50 border-zinc-200 text-zinc-500 dark:bg-zinc-900/50 dark:border-zinc-800"
                  }`}>
                    {user.Role === "ADMIN" ? <ShieldAlert className="size-4" /> : <Shield className="size-4" />}
                  </div>
                  <Select
                    value={user.Role || "USER"}
                    onValueChange={(val) => handleRoleChange(user.ID || "", val || "")}
                  >
                    <SelectTrigger className="w-32 h-9 text-xs font-medium">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USER" className="text-xs">User</SelectItem>
                      <SelectItem value="ADMIN" className="text-xs">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
