"use client";

import { ArrowRight, Sparkles } from "lucide-react";

export default function CTA() {
  return (
    <section id="order" className="hk-section hk-cta">
      <div className="hk-container hk-grid">
        <div className="hk-card hk-cta-box">
          <div className="hk-badge justify-center">
            <Sparkles size={14} />
            Mulai Sekarang
          </div>

          <h2 className="hk-section-title mt-6">
            Siap buat momenmu terasa
            <span className="block">lebih mewah & berkesan?</span>
          </h2>

          <p className="hk-section-desc max-w-2xl mx-auto">
            Buat undangan digital yang modern, estetik, dan siap dibagikan hari
            ini. Cocok untuk kamu yang pengen tampil lebih proper, gak kaku,
            dan gak keliatan “asal jadi”.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a href="#pricing" className="hk-btn hk-btn-primary">
              Lihat Paket Sekarang
              <ArrowRight size={18} />
            </a>

            <a href="#features" className="hk-btn hk-btn-secondary">
              Pelajari Fitur
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}