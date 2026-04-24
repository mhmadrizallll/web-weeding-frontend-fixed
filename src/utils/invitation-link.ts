export const getBaseInvitationUrl = (slug: string) => {
  return `${window.location.origin}/invite/${slug}`;
};

export const getPersonalInvitationUrl = (slug: string, guestName?: string) => {
  const baseUrl = getBaseInvitationUrl(slug);

  if (!guestName?.trim()) return baseUrl;

  return `${baseUrl}?to=${encodeURIComponent(guestName.trim())}`;
};

export const getWhatsappShareUrl = (slug: string, guestName?: string) => {
  const invitationUrl = getPersonalInvitationUrl(slug, guestName);

  const message = `Assalamu’alaikum,\n\nDengan penuh kebahagiaan kami mengundang Anda untuk hadir di acara kami.\n\nBerikut link undangannya:\n${invitationUrl}\n\nTerima kasih 🙏`;

  return `https://wa.me/?text=${encodeURIComponent(message)}`;
};