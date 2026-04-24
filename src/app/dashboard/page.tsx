import AuthGuard from "@/components/auth/AuthGuard";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import InvitationList from "@/components/dashboard/InvitationList";

export default function DashboardPage() {
  return (
    <AuthGuard>
      <main className="min-h-screen bg-[#faf7f2]">
        <DashboardHeader />
        <InvitationList />
      </main>
    </AuthGuard>
  );
}