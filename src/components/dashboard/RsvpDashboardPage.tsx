"use client";

import { useEffect, useMemo, useState } from "react";
import { invitationService } from "@/services/invitation.service";
import { rsvpService } from "@/services/rsvp.service";
import { Invitation } from "@/types/invitation";
import { Rsvp } from "@/types/rsvp";
import {
  CalendarHeart,
  CheckCircle2,
  CircleX,
  Clock3,
  Filter,
  MessageCircleHeart,
  Search,
  Users,
  Sparkles,
} from "lucide-react";

import "./css/rsvp-dashboard.css";

type RsvpWithInvitation = Rsvp & {
  invitation_title?: string;
};

export default function RsvpDashboardPage() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [selectedInvitationId, setSelectedInvitationId] = useState<number | "all">("all");
  const [selectedStatus, setSelectedStatus] = useState<
    "all" | "hadir" | "tidak_hadir" | "masih_ragu"
  >("all");
  const [searchGuest, setSearchGuest] = useState("");
  const [allRsvps, setAllRsvps] = useState<RsvpWithInvitation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getInvitationLabel = (invitation: Invitation) => {
    const groom = invitation.groom_name?.trim();
    const bride = invitation.bride_name?.trim();

    if (groom || bride) {
      return `${groom || "Mempelai"} & ${bride || "Mempelai"}`;
    }

    return invitation.title || `Undangan #${invitation.id}`;
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const invitationData = await invitationService.getAll();
      setInvitations(invitationData);

      const rsvpResults = await Promise.all(
        invitationData.map(async (invitation: Invitation) => {
          try {
            const rsvps = await rsvpService.getByInvitationId(invitation.id);

            return rsvps.map((rsvp) => ({
              ...rsvp,
              invitation_title: getInvitationLabel(invitation),
            }));
          } catch (error) {
            console.error(`Failed to fetch RSVP for invitation ${invitation.id}`, error);
            return [];
          }
        })
      );

      const mergedRsvps = rsvpResults.flat();
      setAllRsvps(mergedRsvps);
    } catch (error) {
      console.error("Failed to fetch RSVP dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRsvps = useMemo(() => {
    return allRsvps.filter((rsvp) => {
      const matchInvitation =
        selectedInvitationId === "all" || rsvp.invitation_id === selectedInvitationId;

      const matchStatus =
        selectedStatus === "all" || rsvp.attendance_status === selectedStatus;

      const matchSearch =
        rsvp.guest_name?.toLowerCase().includes(searchGuest.toLowerCase()) || false;

      return matchInvitation && matchStatus && matchSearch;
    });
  }, [allRsvps, selectedInvitationId, selectedStatus, searchGuest]);

  const stats = useMemo(() => {
    return {
      total: filteredRsvps.length,
      hadir: filteredRsvps.filter((r) => r.attendance_status === "hadir").length,
      tidak_hadir: filteredRsvps.filter((r) => r.attendance_status === "tidak_hadir").length,
      masih_ragu: filteredRsvps.filter((r) => r.attendance_status === "masih_ragu").length,
    };
  }, [filteredRsvps]);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "hadir":
        return "Hadir";
      case "tidak_hadir":
        return "Tidak Hadir";
      case "masih_ragu":
        return "Masih Ragu";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <main className="rsvp-dashboard-page">
        <div className="rsvp-orb orb-1"></div>
        <div className="rsvp-orb orb-2"></div>
        <div className="rsvp-orb orb-3"></div>

        <div className="rsvp-dashboard-container">
          <div className="rsvp-loading-card">
            <div className="rsvp-spinner"></div>
            <div>
              <p className="rsvp-loading-label">Loading RSVP Dashboard</p>
              <h1>Menyiapkan data tamu & ucapan...</h1>
              <p className="rsvp-loading-sub">
                Sistem sedang memuat statistik kehadiran undangan kamu.
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="rsvp-dashboard-page">
      <div className="rsvp-orb orb-1"></div>
      <div className="rsvp-orb orb-2"></div>
      <div className="rsvp-orb orb-3"></div>
      <div className="rsvp-grid-pattern"></div>

      <div className="rsvp-dashboard-container">
        {/* HERO */}
        <section className="rsvp-hero-card">
          <div className="rsvp-hero-badge">
            <Sparkles size={15} />
            <span>Attendance Analytics</span>
          </div>

          <div className="rsvp-hero-content">
            <div>
              <h1 className="rsvp-hero-title">
                Statistik Kehadiran
                <span>& Ucapan Tamu</span>
              </h1>
              <p className="rsvp-hero-desc">
                Pantau semua RSVP, filter berdasarkan undangan dan status,
                lalu lihat pesan tamu dalam dashboard yang lebih modern dan rapi.
              </p>
            </div>

            <div className="rsvp-hero-mini-card">
              <div className="mini-icon">
                <MessageCircleHeart size={22} />
              </div>
              <div>
                <p>Total Ucapan Masuk</p>
                <h3>{allRsvps.filter((r) => r.message?.trim()).length}</h3>
              </div>
            </div>
          </div>
        </section>

        {/* FILTERS */}
        <section className="rsvp-filter-card">
          <div className="rsvp-filter-header">
            <div className="filter-title-wrap">
              <div className="filter-icon-box">
                <Filter size={18} />
              </div>
              <div>
                <h3>Filter Data RSVP</h3>
                <p>Sesuaikan tampilan data tamu berdasarkan kebutuhan kamu.</p>
              </div>
            </div>
          </div>

          <div className="rsvp-filter-grid">
            {/* Filter Undangan */}
            <div className="rsvp-form-group">
              <label>Filter Undangan</label>
              <div className="rsvp-input-wrap">
                <CalendarHeart size={18} className="rsvp-input-icon" />
                <select
                  value={selectedInvitationId}
                  onChange={(e) =>
                    setSelectedInvitationId(
                      e.target.value === "all" ? "all" : Number(e.target.value)
                    )
                  }
                >
                  <option value="all">Semua Undangan</option>
                  {invitations.map((invitation) => (
                    <option key={invitation.id} value={invitation.id}>
                      {getInvitationLabel(invitation)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Filter Status */}
            <div className="rsvp-form-group">
              <label>Filter Status</label>
              <div className="rsvp-input-wrap">
                <CheckCircle2 size={18} className="rsvp-input-icon" />
                <select
                  value={selectedStatus}
                  onChange={(e) =>
                    setSelectedStatus(
                      e.target.value as "all" | "hadir" | "tidak_hadir" | "masih_ragu"
                    )
                  }
                >
                  <option value="all">Semua Status</option>
                  <option value="hadir">Hadir</option>
                  <option value="tidak_hadir">Tidak Hadir</option>
                  <option value="masih_ragu">Masih Ragu</option>
                </select>
              </div>
            </div>

            {/* Search Nama */}
            <div className="rsvp-form-group">
              <label>Cari Nama Tamu</label>
              <div className="rsvp-input-wrap">
                <Search size={18} className="rsvp-input-icon" />
                <input
                  type="text"
                  value={searchGuest}
                  onChange={(e) => setSearchGuest(e.target.value)}
                  placeholder="Contoh: Budi, Siti, Andi..."
                />
              </div>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="rsvp-stats-grid">
          <div className="rsvp-stat-card total">
            <div className="rsvp-stat-top">
              <div>
                <p>Total RSVP</p>
                <h2>{stats.total}</h2>
              </div>
              <div className="rsvp-stat-icon">
                <Users size={24} />
              </div>
            </div>
            <span>Total tamu yang sudah mengisi form</span>
          </div>

          <div className="rsvp-stat-card hadir">
            <div className="rsvp-stat-top">
              <div>
                <p>Hadir</p>
                <h2>{stats.hadir}</h2>
              </div>
              <div className="rsvp-stat-icon">
                <CheckCircle2 size={24} />
              </div>
            </div>
            <span>Jumlah tamu yang akan hadir</span>
          </div>

          <div className="rsvp-stat-card tidak-hadir">
            <div className="rsvp-stat-top">
              <div>
                <p>Tidak Hadir</p>
                <h2>{stats.tidak_hadir}</h2>
              </div>
              <div className="rsvp-stat-icon">
                <CircleX size={24} />
              </div>
            </div>
            <span>Jumlah tamu yang tidak hadir</span>
          </div>

          <div className="rsvp-stat-card ragu">
            <div className="rsvp-stat-top">
              <div>
                <p>Masih Ragu</p>
                <h2>{stats.masih_ragu}</h2>
              </div>
              <div className="rsvp-stat-icon">
                <Clock3 size={24} />
              </div>
            </div>
            <span>Jumlah tamu yang belum pasti hadir</span>
          </div>
        </section>

        {/* TABLE */}
        <section className="rsvp-table-card">
          <div className="rsvp-table-header">
            <div>
              <h2>Daftar RSVP & Ucapan</h2>
              <p>
                Semua data konfirmasi kehadiran dan ucapan dari tamu undangan.
              </p>
            </div>

            <div className="rsvp-total-chip">
              Total ditampilkan: <strong>{filteredRsvps.length}</strong>
            </div>
          </div>

          <div className="rsvp-table-wrap">
            <table className="rsvp-table">
              <thead>
                <tr>
                  <th>Nama Tamu</th>
                  <th>Undangan</th>
                  <th>Status</th>
                  <th>Ucapan</th>
                  <th>Waktu</th>
                </tr>
              </thead>
              <tbody>
                {filteredRsvps.length > 0 ? (
                  filteredRsvps.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="guest-name-cell">
                          <div className="guest-avatar">
                            {item.guest_name?.charAt(0).toUpperCase() || "G"}
                          </div>
                          <div>
                            <p className="guest-name">{item.guest_name || "-"}</p>
                            <span className="guest-subtext">Guest RSVP</span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="invitation-chip">
                          {item.invitation_title || "-"}
                        </span>
                      </td>

                      <td>
                        <span className={`status-badge ${item.attendance_status}`}>
                          {getStatusLabel(item.attendance_status)}
                        </span>
                      </td>

                      <td>
                        <p className="message-cell">
                          {item.message?.trim() ? item.message : "-"}
                        </p>
                      </td>

                      <td>
                        <span className="time-cell">
                          {item.created_at
                            ? new Date(item.created_at).toLocaleString("id-ID")
                            : "-"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5}>
                      <div className="rsvp-empty-state">
                        <div className="rsvp-empty-icon">📭</div>
                        <h3>Belum ada data RSVP</h3>
                        <p>
                          Tidak ada data yang cocok dengan filter saat ini.
                          Coba ubah pencarian, status, atau undangan.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}