import { redirect } from "next/navigation";
import { auth } from "@/core/auth/auth";
import { AppShell } from "@/core/ui";
import { LogoutButton } from "@/modules/auth";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <AppShell user={session.user} headerActions={<LogoutButton />}>
      {children}
    </AppShell>
  );
}
