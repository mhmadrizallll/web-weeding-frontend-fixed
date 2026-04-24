import AuthGuard from "@/components/auth/AuthGuard";
import RsvpDashboardPage from "@/components/dashboard/RsvpDashboardPage";

export default function Page() {
  return (
    <AuthGuard>
      <RsvpDashboardPage />
    </AuthGuard>
  )
}