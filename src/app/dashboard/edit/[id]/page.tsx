import EditInvitationForm from "@/components/dashboard/EditInvitationForm";

export default async function EditInvitationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <EditInvitationForm id={id} />;
}
