export const getBaseInvitationUrl = (slug: string) => {
  return `${window.location.origin}/invite/${slug}`;
};

export const getPersonalInvitationUrl = (slug: string, guestName?: string) => {
  const baseUrl = getBaseInvitationUrl(slug);

  if (!guestName?.trim()) return baseUrl;

  return `${baseUrl}?to=${encodeURIComponent(guestName.trim())}`;
};

export const getWhatsappShareUrl = (
  slug: string,
  guestName?: string,
  groomName?: string,
  brideName?: string,
) => {
  const invitationUrl = getPersonalInvitationUrl(slug, guestName);

  // fallback biar aman
  const pasangan = [groomName, brideName].filter(Boolean).join(" & ");

  const message = `Kepada Yth.
Bapak/Ibu/Saudara/i *${guestName || ""}*

Dengan hormat,

Kami bermaksud menyampaikan undangan kepada Bapak/Ibu/Saudara/i untuk berkenan hadir dalam acara kami.

Informasi lengkap mengenai waktu, tempat, dan susunan acara dapat diakses melalui tautan berikut:
${invitationUrl}

Merupakan kehormatan dan kebahagiaan tersendiri bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir serta memberikan doa dan restu.

Undangan ini kami sampaikan secara digital sebagai pengganti undangan fisik. Atas perhatian dan kehadirannya, kami mengucapkan terima kasih yang sebesar-besarnya.

Hormat kami,
${pasangan}
`;

  return `https://wa.me/?text=${encodeURIComponent(message)}`;
};
