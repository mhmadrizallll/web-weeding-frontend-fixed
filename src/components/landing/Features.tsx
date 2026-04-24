"use client";

import {
  Sparkles,
  Send,
  LayoutTemplate,
  Zap,
  Music4,
  MapPinned,
  TimerReset,
  MessageCircleHeart,
} from "lucide-react";

const features = [
  {
    title: "Tampilan Premium",
    desc: "Desain clean, modern, elegan, dan jauh dari kesan template murahan.",
    icon: Sparkles,
  },
  {
    title: "Mudah Dibagikan",
    desc: "Cukup kirim satu link ke keluarga, teman, pasangan, dan seluruh tamu undangan.",
    icon: Send,
  },
  {
    title: "Section Lengkap",
    desc: "Cover, galeri, love story, maps, countdown, RSVP, dan ucapan dalam satu halaman.",
    icon: LayoutTemplate,
  },
  {
    title: "Proses Cepat",
    desc: "Pilih template, kirim data, revisi seperlunya, lalu langsung siap dibagikan.",
    icon: Zap,
  },
  {
    title: "Musik Otomatis",
    desc: "Undangan terasa lebih hidup dengan backsound yang bikin suasana lebih emosional.",
    icon: Music4,
  },
  {
    title: "Maps Lokasi",
    desc: "Tamu tinggal klik dan langsung diarahkan ke lokasi acara tanpa ribet.",
    icon: MapPinned,
  },
  {
    title: "Countdown Acara",
    desc: "Bangun antusiasme tamu dengan hitung mundur menuju hari spesialmu.",
    icon: TimerReset,
  },
  {
    title: "RSVP & Ucapan",
    desc: "Pantau konfirmasi kehadiran dan kumpulkan ucapan tamu dalam satu dashboard.",
    icon: MessageCircleHeart,
  },
];

export default function Features() {
  return (
    <section id="features" className="hk-section hk-features">
      <div className="hk-glow top-[80px] left-[-100px] h-[280px] w-[280px] bg-cyan-400/15" />
      <div className="hk-glow bottom-[40px] right-[-80px] h-[280px] w-[280px] bg-yellow-400/15" />

      <div className="hk-container hk-grid">
        <div className="text-center max-w-3xl mx-auto">
          <div className="hk-badge">Kenapa HariKita?</div>
          <h2 className="hk-section-title mt-6">
            Dibuat untuk tampil rapi, modern, dan lebih
            <span className="block">“niat” di mata tamu</span>
          </h2>
          <p className="hk-section-desc">
            Bukan cuma sekadar link undangan. Ini dibuat supaya momenmu terasa
            lebih spesial, lebih estetik, dan lebih nyaman saat dibuka.
          </p>
        </div>

        <div className="hk-features-grid">
          {features.map((item, index) => {
            const Icon = item.icon;

            return (
              <div key={index} className="hk-card hk-feature-card">
                <div className="hk-icon-box">
                  <Icon size={26} />
                </div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}