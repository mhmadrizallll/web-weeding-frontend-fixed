"use client";

import { InvitationTemplateProps } from "./types";

export default function MinimalTemplate({
  invitation,
  guestName,
  isOpened,
  isMuted,
  toggleMute,
  audioRef,
  timeLeft,
  handleOpenInvitation,
}: InvitationTemplateProps) {
  if (!isOpened) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center px-6 py-16 text-center">
        <div className="max-w-2xl">
          <p className="text-sm tracking-[0.4em] uppercase text-gray-500">Undangan</p>
          <h1 className="mt-6 text-5xl md:text-6xl font-bold text-gray-900">
            {invitation.groom_name} & {invitation.bride_name}
          </h1>
          <p className="mt-8 text-lg text-gray-600">Kepada Yth.</p>
          <h2 className="mt-3 text-3xl font-semibold text-gray-900">{guestName}</h2>
          <button
            onClick={handleOpenInvitation}
            className="mt-10 rounded-full bg-gray-900 text-white px-8 py-4 font-semibold"
          >
            Buka Undangan
          </button>

          {invitation.music_url && (
            <audio ref={audioRef} loop preload="auto">
              <source src={invitation.music_url} type="audio/mpeg" />
            </audio>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="bg-white text-gray-900 min-h-screen">
      {invitation.music_url && (
        <button
          onClick={toggleMute}
          className="fixed bottom-6 right-6 z-50 rounded-full bg-gray-900 text-white px-5 py-3 shadow-lg"
        >
          {isMuted ? "🔇" : "🎵"}
        </button>
      )}

      <section className="px-6 py-24 text-center border-b">
        <p className="uppercase tracking-[0.4em] text-sm text-gray-500">
          {invitation.cover_title || "The Wedding Of"}
        </p>
        <h1 className="mt-6 text-5xl md:text-7xl font-bold">
          {invitation.groom_name} & {invitation.bride_name}
        </h1>
        <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
          {invitation.cover_subtitle}
        </p>
      </section>

      <section className="px-6 py-20">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-5 text-center">
          {[
            { label: "Hari", value: timeLeft.days },
            { label: "Jam", value: timeLeft.hours },
            { label: "Menit", value: timeLeft.minutes },
            { label: "Detik", value: timeLeft.seconds },
          ].map((item) => (
            <div key={item.label} className="border rounded-3xl p-8">
              <h3 className="text-4xl font-bold">{item.value}</h3>
              <p className="mt-2 text-gray-500">{item.label}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}