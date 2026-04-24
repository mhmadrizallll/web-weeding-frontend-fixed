import AuthGuard from "@/components/auth/AuthGuard";
import CreateInvitationForm from "@/components/dashboard/CreateInvitationForm";

export default function CreateInvitationPage() {
  return (
    <AuthGuard>
      <main className="min-h-screen bg-[#faf7f2] py-10">
        <CreateInvitationForm />
      </main>
    </AuthGuard>
  );
}