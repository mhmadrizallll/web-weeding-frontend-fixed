"use client";

import { Check, Crown } from "lucide-react";

const pricingPlans = [
  {
    name: "Basic",
    price: "99K",
    features: [
      "1 template pilihan",
      "Countdown acara",
      "Google Maps lokasi",
      "Galeri foto",
      "Musik backsound",
      "1x revisi",
    ],
    featured: false,
  },
  {
    name: "Premium",
    price: "149K",
    features: [
      "Semua fitur Basic",
      "RSVP & ucapan tamu",
      "Nama tamu personal",
      "3x revisi",
      "Link undangan lebih rapi",
      "Tampilan lebih interaktif",
    ],
    featured: true,
  },
  {
    name: "Exclusive",
    price: "249K",
    features: [
      "Semua fitur Premium",
      "Custom section tambahan",
      "Layout lebih eksklusif",
      "Prioritas pengerjaan",
      "Kesan lebih premium",
      "Cocok untuk konsep spesial",
    ],
    featured: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="hk-section hk-pricing">
      <div className="hk-glow top-[60px] right-[-80px] h-[300px] w-[300px] bg-fuchsia-500/15" />
      <div className="hk-glow bottom-[60px] left-[-100px] h-[280px] w-[280px] bg-yellow-400/15" />

      <div className="hk-container hk-grid">
        <div className="text-center max-w-3xl mx-auto">
          <div className="hk-badge">Paket Harga</div>
          <h2 className="hk-section-title mt-6">
            Pilih paket yang paling pas
            <span className="block">untuk momenmu</span>
          </h2>
          <p className="hk-section-desc">
            Mulai dari yang simple sampai yang lebih eksklusif. Tinggal pilih
            sesuai kebutuhan dan budget acara kamu.
          </p>
        </div>

        <div className="hk-pricing-grid">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`hk-card hk-pricing-card ${plan.featured ? "featured" : ""}`}
            >
              {plan.featured && (
                <div className="hk-pricing-badge">
                  <Crown size={14} className="inline mr-1" />
                  Paling Dipilih
                </div>
              )}

              <h3>{plan.name}</h3>

              <div className="hk-price">
                <strong>{plan.price}</strong>
                <span>/ sekali jadi</span>
              </div>

              <ul className="hk-pricing-list">
                {plan.features.map((feature, idx) => (
                  <li key={idx}>
                    <Check size={18} className="text-yellow-300 mt-1 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#order"
                className={`hk-btn mt-8 w-full ${
                  plan.featured ? "hk-btn-primary" : "hk-btn-secondary"
                }`}
              >
                Pilih Paket
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}