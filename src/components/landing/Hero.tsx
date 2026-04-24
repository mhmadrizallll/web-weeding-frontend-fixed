"use client";

import { ArrowRight, Heart, Music4, Smartphone, TimerReset, MapPin } from "lucide-react";

export default function Hero() {
  return (
    <section id="home" className="hk-section hk-hero">
      <div className="hk-glow top-[-120px] left-[-80px] h-[280px] w-[280px] bg-yellow-400/20" />
      <div className="hk-glow top-[120px] right-[-100px] h-[320px] w-[320px] bg-fuchsia-500/20" />
      <div className="hk-glow bottom-[-80px] left-1/2 h-[280px] w-[280px] -translate-x-1/2 bg-cyan-400/20" />

      <div className="hk-container hk-grid">
        <div className="hk-hero-grid">
          <div>
            <div className="hk-badge">
              <Heart size={14} />
              Undangan Digital Modern
            </div>

            <h1 className="hk-title mt-6">
              Simple dalam tampilan,
              <br />
              <span>berkesan dalam momen.</span>
            </h1>

            <p className="hk-subtitle mt-6 max-w-2xl">
              Buat undangan digital yang elegan, modern, dan nyaman dibagikan
              ke tamu hanya dengan satu link. Cocok untuk pernikahan, tunangan,
              ulang tahun, hingga acara spesial lainnya.
            </p>

            <div className="hk-hero-actions">
              <a href="#pricing" className="hk-btn hk-btn-primary">
                Mulai Sekarang
                <ArrowRight size={18} />
              </a>

              <a href="#features" className="hk-btn hk-btn-secondary">
                Lihat Fitur
              </a>
            </div>

            <div className="hk-hero-points">
              <div className="hk-chip">
                <Smartphone size={17} />
                Mobile Friendly
              </div>
              <div className="hk-chip">
                <Music4 size={17} />
                Musik
              </div>
              <div className="hk-chip">
                <TimerReset size={17} />
                Countdown
              </div>
              <div className="hk-chip">
                <MapPin size={17} />
                Maps & RSVP
              </div>
            </div>
          </div>

          <div>
            <div className="hk-preview-card">
              <p className="text-sm text-slate-300">Mulai dari</p>

              <div className="hk-price-badge">
                <strong>Rp99K</strong>
                <span className="text-slate-400 text-base">/ undangan</span>
              </div>

              <p className="mt-3 text-slate-300 leading-8">
                Desain premium, interaktif, dan siap dibagikan ke semua tamu.
              </p>

              <div className="hk-phone">
                <div className="hk-phone-screen">
                  <div className="hk-phone-ring">
                    <div className="hk-phone-ring-inner">
                      <Heart size={30} fill="currentColor" />
                    </div>
                  </div>

                  <div className="hk-phone-couple">
                    <p className="uppercase tracking-[0.3em] text-[11px] text-[#b08d4f] font-bold">
                      The Wedding Of
                    </p>
                    <h4 className="mt-3">Andi & Sari</h4>
                    <p>Sabtu, 27 Juli 2026</p>
                  </div>

                  <div className="hk-mini-cards">
                    <div className="hk-mini-card">
                      <div>
                        <span>Countdown</span>
                        <strong>12 Hari Lagi</strong>
                      </div>
                      <TimerReset size={18} />
                    </div>

                    <div className="hk-mini-card">
                      <div>
                        <span>RSVP</span>
                        <strong>128 Tamu Merespon</strong>
                      </div>
                      <Heart size={18} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}