"use client";

import { useState } from "react";
import { Heart, Menu, X, Sparkles } from "lucide-react";

// import "@/styles/invitation.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const menus = [
    { label: "Home", href: "#home" },
    { label: "Fitur", href: "#features" },
    { label: "Harga", href: "#pricing" },
    { label: "Order", href: "#order" },
  ];

  return (
    <nav className="hk-navbar">
      <div className="hk-navbar-inner">
        <a href="#home" className="hk-brand">
          <div className="hk-brand-logo">
            <Heart size={20} fill="currentColor" />
          </div>
          <div>
            <p className="hk-brand-text">HariKita</p>
            <p className="text-xs text-slate-400 -mt-0.5">Digital Invitation</p>
          </div>
        </a>

        <div className="hk-nav-links">
          {menus.map((menu) => (
            <a key={menu.href} href={menu.href}>
              {menu.label}
            </a>
          ))}
        </div>

        <div className="hk-navbar-cta">
          <a href="#pricing" className="hk-btn hk-btn-primary">
            <Sparkles size={18} />
            Lihat Paket
          </a>
        </div>

        <button className="hk-mobile-btn" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <div className={`hk-mobile-menu ${open ? "show" : ""}`}>
        <div className="hk-mobile-menu-inner">
          {menus.map((menu) => (
            <a key={menu.href} href={menu.href} onClick={() => setOpen(false)}>
              {menu.label}
            </a>
          ))}

          <a
            href="#pricing"
            onClick={() => setOpen(false)}
            className="hk-btn hk-btn-primary mt-4 w-full"
          >
            <Sparkles size={18} />
            Lihat Paket
          </a>
        </div>
      </div>
    </nav>
  );
}