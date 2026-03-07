import { redirect } from "next/navigation";
import { auth, isAdmin, type AppSession } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth() as AppSession;
  if (!isAdmin(session)) {
    redirect("/api/auth/signin");
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-6 ml-48">{children}</main>
    </div>
  );
}
