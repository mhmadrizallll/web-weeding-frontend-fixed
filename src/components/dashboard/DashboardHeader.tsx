"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import {
  LayoutDashboard,
  Mail,
  PlusCircle,
  Users,
  LogOut,
  Sparkles,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

import "./css/dashboard-header.css";

export default function DashboardHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const menus = useMemo(
    () => [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        label: "Invitations",
        href: "/dashboard/invitations",
        icon: Mail,
      },
      {
        label: "Buat Undangan",
        href: "/dashboard/create",
        icon: PlusCircle,
      },
      {
        label: "RSVP Dashboard",
        href: "/dashboard/rsvps",
        icon: Users,
      },
    ],
    []
  );

  const pageTitleMap: Record<string, string> = {
    "/dashboard": "Dashboard Overview",
    "/dashboard/invitations": "Kelola Semua Invitation",
    "/dashboard/create": "Buat Invitation Baru",
    "/dashboard/rsvps": "Dashboard RSVP",
  };

  const currentPageTitle = pageTitleMap[pathname] || "Dashboard Undangan";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const handleCloseMenu = () => setMenuOpen(false);

  return (
    <>
      <header className="dashboard-header">
        <div className="dashboard-header__glow glow-1"></div>
        <div className="dashboard-header__glow glow-2"></div>

        <div className="dashboard-header__container">
          {/* TOP */}
          <div className="dashboard-header__top">
            <div className="dashboard-header__left">
              <div className="dashboard-header__brand">
                <div className="dashboard-header__brand-icon">
                  <Sparkles size={18} />
                </div>

                <div className="dashboard-header__brand-text">
                  <p className="dashboard-header__eyebrow">Admin Panel</p>
                  <h1 className="dashboard-header__title">Dashboard Undangan</h1>
                </div>

                {/* HAMBURGER */}
                <button
                  type="button"
                  className="dashboard-header__menu-toggle"
                  onClick={() => setMenuOpen((prev) => !prev)}
                  aria-label="Toggle menu"
                  aria-expanded={menuOpen}
                >
                  {menuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              </div>

              <div className="dashboard-header__breadcrumb">
                <span>Admin</span>
                <ChevronRight size={14} />
                <span className="active">{currentPageTitle}</span>
              </div>
            </div>

            <div className="dashboard-header__actions desktop-actions">
              <Link
                href="/dashboard/create"
                className="header-btn header-btn--primary"
              >
                <PlusCircle size={18} />
                <span>Buat Undangan</span>
              </Link>

              <button
                onClick={handleLogout}
                className="header-btn header-btn--danger"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* NAV DESKTOP */}
          <nav className="dashboard-nav desktop-nav">
            {menus.map((menu) => {
              const isActive =
                pathname === menu.href ||
                (menu.href !== "/dashboard" && pathname.startsWith(menu.href));

              const Icon = menu.icon;

              return (
                <Link
                  key={menu.href}
                  href={menu.href}
                  className={`dashboard-nav__item ${isActive ? "active" : ""}`}
                >
                  <Icon size={18} />
                  <span>{menu.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* MOBILE DROPDOWN */}
          <div className={`dashboard-mobile-menu ${menuOpen ? "open" : ""}`}>
            <nav className="dashboard-mobile-nav">
              {menus.map((menu) => {
                const isActive =
                  pathname === menu.href ||
                  (menu.href !== "/dashboard" && pathname.startsWith(menu.href));

                const Icon = menu.icon;

                return (
                  <Link
                    key={menu.href}
                    href={menu.href}
                    onClick={handleCloseMenu}
                    className={`dashboard-mobile-nav__item ${
                      isActive ? "active" : ""
                    }`}
                  >
                    <div className="dashboard-mobile-nav__left">
                      <Icon size={18} />
                      <span>{menu.label}</span>
                    </div>
                    <ChevronRight size={16} />
                  </Link>
                );
              })}
            </nav>

            <div className="dashboard-mobile-actions">
              <Link
                href="/dashboard/create"
                className="header-btn header-btn--primary"
                onClick={handleCloseMenu}
              >
                <PlusCircle size={18} />
                <span>Buat Undangan</span>
              </Link>

              <button
                onClick={handleLogout}
                className="header-btn header-btn--danger"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer supaya konten bawah gak ketiban sticky header */}
      <div className="dashboard-header-spacer" />
    </>
  );
}