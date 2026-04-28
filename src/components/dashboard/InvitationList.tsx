"use client";

import { useEffect, useMemo, useState } from "react";
import { invitationService } from "@/services/invitation.service";
import { Invitation } from "@/types/invitation";
import Link from "next/link";
import {
  getBaseInvitationUrl,
  getPersonalInvitationUrl,
  getWhatsappShareUrl,
} from "@/utils/invitation-link";

import {
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  Copy,
  Check,
  Link2,
  Send,
  Users,
  FileText,
  Sparkles,
  Globe,
  BadgeCheck,
  Clock3,
  Filter,
  UserRound,
} from "lucide-react";

import "./css/invitation.css";

type FilterType = "all" | "published" | "draft";

export default function InvitationList() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [deleteLoadingId, setDeleteLoadingId] = useState<number | null>(null);
  const [guestNames, setGuestNames] = useState<Record<number, string>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [currentUser, setCurrentUser] = useState<{
    id: number;
    name: string;
    email: string;
    role: string;
  } | null>(null);

  const isAdmin =
    currentUser?.role === "admin" || currentUser?.role === "superadmin";

  const fetchInvitations = async () => {
    try {
      const data = await invitationService.getAll();
      setInvitations(data);
    } catch (error) {
      console.error("Failed to fetch invitations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvitations();

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const filteredInvitations = useMemo(() => {
    return invitations.filter((item) => {
      const fullName =
        `${item.groom_name || ""} ${item.bride_name || ""}`.toLowerCase();
      const slug = (item.slug || "").toLowerCase();
      const title = (item.title || "").toLowerCase();
      const keyword = search.toLowerCase();

      const matchSearch =
        fullName.includes(keyword) ||
        slug.includes(keyword) ||
        title.includes(keyword);

      const matchFilter =
        filter === "all"
          ? true
          : filter === "published"
            ? !!item.is_published
            : !item.is_published;

      return matchSearch && matchFilter;
    });
  }, [invitations, search, filter]);

  const stats = useMemo(() => {
    const total = invitations.length;
    const published = invitations.filter((item) => item.is_published).length;
    const draft = invitations.filter((item) => !item.is_published).length;

    return { total, published, draft };
  }, [invitations]);

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      "Yakin ingin menghapus invitation ini?",
    );
    if (!confirmDelete) return;

    try {
      setDeleteLoadingId(id);
      await invitationService.delete(id);
      await fetchInvitations();
    } catch (error) {
      console.error("Failed to delete invitation:", error);
      alert("Gagal menghapus invitation");
    } finally {
      setDeleteLoadingId(null);
    }
  };

  const handleGuestNameChange = (invitationId: number, value: string) => {
    setGuestNames((prev) => ({
      ...prev,
      [invitationId]: value,
    }));
  };

  const showCopiedState = (key: string) => {
    setCopiedId(key);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyLink = async (
    slug: string,
    guestName?: string,
    key?: string,
  ) => {
    try {
      const link = getPersonalInvitationUrl(slug, guestName);
      await navigator.clipboard.writeText(link);
      showCopiedState(key || slug);
    } catch (error) {
      console.error(error);
      alert("Gagal menyalin link");
    }
  };

  const handleCopyBaseLink = async (slug: string, key?: string) => {
    try {
      const link = getBaseInvitationUrl(slug);
      await navigator.clipboard.writeText(link);
      showCopiedState(key || slug);
    } catch (error) {
      console.error(error);
      alert("Gagal menyalin link");
    }
  };

  const handleOpenWhatsapp = (
    slug: string,
    guestName?: string,
    groomName?: string,
    brideName?: string,
  ) => {
    const waUrl = getWhatsappShareUrl(slug, guestName, groomName, brideName);

    window.open(waUrl, "_blank");
  };

  if (loading) {
    return (
      <section className="invitation-page">
        <div className="invitation-bg-orb orb-1"></div>
        <div className="invitation-bg-orb orb-2"></div>
        <div className="invitation-bg-orb orb-3"></div>

        <div className="invitation-container">
          <div className="loading-card">
            <div className="loading-spinner"></div>
            <div>
              <h3>Memuat Dashboard Invitation...</h3>
              <p>Menyiapkan tampilan premium untuk undangan kamu.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="invitation-page">
      <div className="invitation-bg-grid"></div>
      <div className="invitation-bg-orb orb-1"></div>
      <div className="invitation-bg-orb orb-2"></div>
      <div className="invitation-bg-orb orb-3"></div>
      <div className="invitation-bg-orb orb-4"></div>

      <div className="invitation-container">
        {/* HERO */}
        <div className="hero-card">
          <div className="hero-left">
            <div className="hero-badge">
              <Sparkles size={14} />
              <span>Invitation Dashboard</span>
            </div>

            <h1 className="hero-title">
              Kelola Undangan
              <span className="hero-gradient-text">
                {" "}
                Modern, Elegan & Menjual
              </span>
            </h1>

            <p className="hero-description">
              Dashboard undangan digital yang terasa lebih premium, lebih hidup,
              dan siap dipakai untuk produk yang benar-benar layak jual.
            </p>

            {currentUser && (
              <div className="hero-user">
                <div className="hero-user-icon">
                  <UserRound size={18} />
                </div>
                <div>
                  <p className="hero-user-label">Login sebagai</p>
                  <h4>{currentUser.name}</h4>
                </div>
                <span className="hero-role">{currentUser.role}</span>
              </div>
            )}
          </div>

          {isAdmin && (
            <div className="hero-right">
              <Link href="/dashboard/create" className="btn btn-primary btn-lg">
                <Plus size={18} />
                <span>Buat Undangan Baru</span>
              </Link>
            </div>
          )}
        </div>

        {/* STATS */}
        <div className="stats-grid">
          <div className="stat-card">
            <div>
              <p className="stat-label">Total Invitation</p>
              <h3 className="stat-value">{stats.total}</h3>
              <p className="stat-sub">Semua undangan yang tersedia</p>
            </div>
            <div className="stat-icon pink">
              <FileText size={22} />
            </div>
          </div>

          <div className="stat-card">
            <div>
              <p className="stat-label">Published</p>
              <h3 className="stat-value">{stats.published}</h3>
              <p className="stat-sub">Sudah siap dibagikan ke tamu</p>
            </div>
            <div className="stat-icon green">
              <BadgeCheck size={22} />
            </div>
          </div>

          <div className="stat-card">
            <div>
              <p className="stat-label">Draft</p>
              <h3 className="stat-value">{stats.draft}</h3>
              <p className="stat-sub">Masih dalam proses penyempurnaan</p>
            </div>
            <div className="stat-icon amber">
              <Clock3 size={22} />
            </div>
          </div>
        </div>

        {/* FILTER PANEL */}
        <div className="filter-panel">
          <div className="search-block">
            <label className="section-label">Search Invitation</label>
            <div className="search-input-wrap">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Cari nama mempelai, judul, atau slug..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          <div className="filter-block">
            <label className="section-label">Filter Status</label>
            <div className="filter-buttons">
              <button
                onClick={() => setFilter("all")}
                className={`filter-btn ${filter === "all" ? "active" : ""}`}
              >
                <Filter size={16} />
                Semua
              </button>

              <button
                onClick={() => setFilter("published")}
                className={`filter-btn ${
                  filter === "published" ? "active" : ""
                }`}
              >
                <BadgeCheck size={16} />
                Published
              </button>

              <button
                onClick={() => setFilter("draft")}
                className={`filter-btn ${filter === "draft" ? "active" : ""}`}
              >
                <Clock3 size={16} />
                Draft
              </button>
            </div>
          </div>
        </div>

        {/* EMPTY */}
        {filteredInvitations.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <Users size={34} />
            </div>
            <h3>Belum ada invitation yang cocok</h3>
            <p>
              Coba ubah pencarian atau filter status. Kalau kamu admin, kamu
              bisa langsung buat undangan baru dari sini.
            </p>

            {isAdmin && (
              <Link href="/dashboard/create" className="btn btn-primary">
                <Plus size={18} />
                <span>Buat Undangan Baru</span>
              </Link>
            )}
          </div>
        ) : (
          <div className="invitation-list">
            {filteredInvitations.map((item) => {
              const guestName = guestNames[item.id] || "";
              const baseUrl =
                typeof window !== "undefined"
                  ? getBaseInvitationUrl(item.slug)
                  : "";
              const personalUrl =
                typeof window !== "undefined"
                  ? getPersonalInvitationUrl(item.slug, guestName)
                  : "";

              return (
                <div key={item.id} className="invitation-card">
                  <div className="card-glow"></div>

                  <div className="invitation-card-grid">
                    {/* LEFT */}
                    <div className="invitation-main">
                      <div className="invitation-header">
                        <div>
                          <div className="status-row">
                            <span
                              className={`status-badge ${
                                item.is_published ? "published" : "draft"
                              }`}
                            >
                              {item.is_published ? "Published" : "Draft"}
                            </span>
                          </div>

                          <h3 className="invitation-couple">
                            {item.groom_name || "Mempelai Pria"}
                            <span>&</span>
                            {item.bride_name || "Mempelai Wanita"}
                          </h3>

                          <p className="invitation-title">
                            {item.title || "Undangan Digital"}
                          </p>
                        </div>
                      </div>

                      <div className="slug-box">
                        <Globe size={16} />
                        <span>/invite/{item.slug}</span>
                      </div>

                      <div className="card-actions">
                        <Link
                          href={`/invite/${item.slug}`}
                          target="_blank"
                          className="btn-card btn-soft"
                        >
                          <Eye size={18} />
                          <span>Preview</span>
                        </Link>

                        {isAdmin && (
                          <>
                            <Link
                              href={`/dashboard/edit/${item.id}`}
                              className="btn-card btn-dark"
                            >
                              <Pencil size={18} />
                              <span>Edit</span>
                            </Link>

                            <button
                              onClick={() => handleDelete(item.id)}
                              disabled={deleteLoadingId === item.id}
                              className="btn-card btn-danger"
                            >
                              <Trash2 size={18} />
                              <span>
                                {deleteLoadingId === item.id
                                  ? "Menghapus..."
                                  : "Hapus"}
                              </span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* RIGHT */}
                    <div className="share-panel">
                      <div className="share-header">
                        <div>
                          <h4>Share Invitation</h4>
                          <p>Bagikan link umum atau personal untuk tamu</p>
                        </div>
                        <div className="share-icon-box">
                          <Link2 size={20} />
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Link Umum</label>
                        <div className="input-action">
                          <input type="text" readOnly value={baseUrl} />
                          <button
                            onClick={() =>
                              handleCopyBaseLink(item.slug, `base-${item.id}`)
                            }
                            className="mini-btn"
                          >
                            {copiedId === `base-${item.id}` ? (
                              <Check size={18} />
                            ) : (
                              <Copy size={18} />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Nama Tamu (Opsional)</label>
                        <input
                          type="text"
                          placeholder="Contoh: Pak Budi & Keluarga"
                          value={guestName}
                          onChange={(e) =>
                            handleGuestNameChange(item.id, e.target.value)
                          }
                        />
                      </div>

                      <div className="form-group">
                        <label>Link Personal</label>
                        <div className="input-action">
                          <input type="text" readOnly value={personalUrl} />
                          <button
                            onClick={() =>
                              handleCopyLink(
                                item.slug,
                                guestName,
                                `personal-${item.id}`,
                              )
                            }
                            className="mini-btn gradient"
                          >
                            {copiedId === `personal-${item.id}` ? (
                              <Check size={18} />
                            ) : (
                              <Copy size={18} />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="share-actions">
                        <button
                          onClick={() =>
                            handleOpenWhatsapp(
                              item.slug,
                              guestName,
                              item.groom_name,
                              item.bride_name,
                            )
                          }
                          className="btn btn-whatsapp"
                        >
                          <Send size={18} />
                          <span>WhatsApp</span>
                        </button>

                        <a
                          href={personalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-card btn-soft"
                        >
                          <Eye size={18} />
                          <span>Preview Personal</span>
                        </a>
                      </div>

                      {guestName && (
                        <div className="guest-preview">
                          <p>
                            Undangan akan ditampilkan untuk{" "}
                            <strong>{guestName}</strong>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
