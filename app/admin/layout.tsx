import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const adminSession = cookieStore.get("filmkeren_admin")?.value;

  if (adminSession !== "abimanyu-panji") {
    redirect("/login");
  }

  return <AppShell>{children}</AppShell>;
}
