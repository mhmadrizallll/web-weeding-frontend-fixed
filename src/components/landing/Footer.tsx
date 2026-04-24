"use client";

import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="hk-footer">
      <div className="hk-container text-center">
        <div className="hk-footer-brand">
          <div className="hk-brand-logo">
            <Heart size={18} fill="currentColor" />
          </div>
          <h3 className="text-xl font-bold text-white">HariKita</h3>
        </div>

        <p className="mt-4">Simple dalam tampilan, berkesan dalam momen.</p>
        <p className="mt-3 text-sm">© 2026 HariKita. All rights reserved.</p>
      </div>
    </footer>
  );
}