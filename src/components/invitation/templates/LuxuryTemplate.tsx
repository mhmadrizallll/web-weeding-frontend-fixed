"use client";

import { InvitationTemplateProps } from "./types";
import { motion } from "framer-motion";
import {
  Music2,
  VolumeX,
  MapPin,
  CalendarDays,
  Heart,
  Send,
  Sparkles,
  ChevronDown,
} from "lucide-react";

import "../css/luxury.css";

export default function LuxuryTemplate({
  invitation,
  guestName,
  isOpened,
  isMuted,
  toggleMute,
  audioRef,
  timeLeft,
  galleryImages,
  rsvps,
  rsvpForm,
  rsvpLoading,
  rsvpSuccess,
  rsvpError,
  handleOpenInvitation,
  handleRsvpChange,
  handleSubmitRsvp,
}: InvitationTemplateProps) {
  const attendanceLabel = (status: string) => {
    if (status === "hadir") return "Hadir";
    if (status === "tidak_hadir") return "Tidak Hadir";
    return "Masih Ragu";
  };

  const attendanceClass = (status: string) => {
    if (status === "hadir") return "attend hadir";
    if (status === "tidak_hadir") return "attend tidak-hadir";
    return "attend ragu";
  };

  const formattedDate = invitation.event_date
    ? new Date(invitation.event_date).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Asia/Jakarta",
      })
    : "Tanggal belum tersedia";

  const formattedTime = invitation.event_date
    ? new Date(invitation.event_date).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Asia/Jakarta",
      })
    : invitation.event_time || "Jam belum tersedia";

  const fadeUp = {
    hidden: { opacity: 0, y: 70 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const staggerWrap = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  if (!isOpened) {
    return (
      <main
        className="luxury-opening"
        style={{
          backgroundImage: invitation.cover_image
            ? `url(${invitation.cover_image})`
            : "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        }}
      >
        <div className="opening-overlay"></div>
        <div className="opening-noise"></div>
        <div className="opening-glow glow-1"></div>
        <div className="opening-glow glow-2"></div>

        <div className="opening-content">
          <div className="opening-badge">
            <Sparkles size={14} />
            <span>Luxury Wedding Invitation</span>
          </div>

          <p className="opening-subtitle">The Wedding Of</p>

          <h1 className="opening-title">
            {invitation.groom_name || "Mempelai Pria"}
            <span>&</span>
            {invitation.bride_name || "Mempelai Wanita"}
          </h1>

          <div className="opening-divider"></div>

          <p className="opening-to">Kepada Yth.</p>
          <h2 className="opening-guest">{guestName}</h2>

          <p className="opening-description">
            Dengan penuh rasa syukur dan kebahagiaan, kami mengundang Anda untuk
            hadir dan menjadi bagian dari hari istimewa kami.
          </p>

          <button onClick={handleOpenInvitation} className="opening-button">
            <Heart size={18} />
            <span>Buka Undangan</span>
          </button>

          <div className="opening-scroll">
            <ChevronDown size={18} />
          </div>
        </div>

        {invitation.music_url && (
          <audio ref={audioRef} loop preload="auto">
            <source src={invitation.music_url} type="audio/mpeg" />
          </audio>
        )}
      </main>
    );
  }

  return (
    <main
      className="luxury-page"
      style={{
        backgroundImage: invitation.cover_image
          ? `linear-gradient(rgba(10,10,10,0.55), rgba(10,10,10,0.55)), url(${invitation.cover_image})`
          : "linear-gradient(180deg, #0f172a 0%, #111827 100%)",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "scroll",
      }}
    >
      <div className="luxury-page-overlay"></div>
      <div className="luxury-page-blur"></div>

      {/* MUSIC BUTTON */}
      {invitation.music_url && (
        <button onClick={toggleMute} className="music-floating-btn">
          {isMuted ? <VolumeX size={18} /> : <Music2 size={18} />}
          <span>{isMuted ? "Musik Off" : "Musik On"}</span>
        </button>
      )}

      {/* HERO */}
      <section
        className="luxury-hero"
        style={{
          backgroundImage: invitation.cover_image
            ? `linear-gradient(rgba(8,8,8,0.45), rgba(8,8,8,0.45)), url(${invitation.cover_image})`
            : "linear-gradient(135deg, #111827 0%, #1f2937 100%)",
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="luxury-hero-overlay"></div>
        <div className="luxury-hero-pattern"></div>

        <motion.div
          className="luxury-container hero-content"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={staggerWrap}
        >
          <motion.p variants={fadeUp} className="section-kicker">
            {invitation.cover_title || "The Wedding Of"}
          </motion.p>

          <motion.h1 variants={fadeUp} className="hero-title">
            {invitation.groom_name || "Mempelai Pria"}
            <span>&</span>
            {invitation.bride_name || "Mempelai Wanita"}
          </motion.h1>

          <motion.p variants={fadeUp} className="hero-description">
            {invitation.cover_subtitle ||
              "Dengan penuh kebahagiaan, kami mengundang Anda untuk hadir dalam momen spesial kami."}
          </motion.p>

          <motion.div variants={fadeUp} className="hero-actions">
            <a href="#details" className="hero-btn primary">
              <CalendarDays size={18} />
              <span>Lihat Detail Acara</span>
            </a>

            {invitation.google_maps_url && (
              <a
                href={invitation.google_maps_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hero-btn secondary"
              >
                <MapPin size={18} />
                <span>Buka Maps</span>
              </a>
            )}
          </motion.div>
        </motion.div>
      </section>

      {/* COUNTDOWN */}
      <section className="luxury-section countdown-section">
        <div className="luxury-container">
          <div className="section-heading">
            <p className="section-kicker">Countdown</p>
            <h2>Menuju Hari Bahagia</h2>
            <p className="section-desc">
              Menghitung setiap detik menuju momen istimewa kami.
            </p>
          </div>

          <div className="countdown-wrapper">
            {[
              { label: "Hari", value: timeLeft.days },
              { label: "Jam", value: timeLeft.hours },
              { label: "Menit", value: timeLeft.minutes },
              { label: "Detik", value: timeLeft.seconds },
            ].map((item, index) => (
              <div key={item.label} className="countdown-lux-card">
                <div className="countdown-inner">
                  <span className="count-number">
                    {String(item.value).padStart(2, "0")}
                  </span>
                  <span className="count-label">{item.label}</span>
                </div>

                {index !== 3 && <div className="count-separator">:</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUOTE */}
      <section
        className="luxury-section quote-section"
        style={{
          backgroundImage: invitation.cover_image
            ? `url(${invitation.cover_image})`
            : "linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,41,59,0.95))",
        }}
      >
        <div className="quote-bg-overlay"></div>
        <div className="quote-bg-blur"></div>

        <div className="luxury-container">
          <div className="quote-card quote-card-image">
            <div className="quote-mark">“</div>
            <p>
              {invitation.quote ||
                "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan pasangan-pasangan untukmu agar kamu cenderung dan merasa tenteram kepadanya."}
            </p>
            <span>HariKita Invitation</span>
          </div>
        </div>
      </section>

      {/* EVENT DETAILS */}
      <section id="details" className="luxury-section details-section">
        <motion.div
          className="luxury-container"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerWrap}
        >
          <motion.div variants={fadeUp} className="section-heading">
            <p className="section-kicker">Event Details</p>
            <h2>Detail Acara</h2>
          </motion.div>

          <motion.div variants={staggerWrap} className="details-grid">
            <motion.div variants={fadeUp} className="detail-card glass-card">
              <div className="detail-icon">
                <CalendarDays size={22} />
              </div>
              <p className="detail-label">Tanggal Acara</p>
              <h3>{formattedDate}</h3>
              <p className="detail-address">{formattedTime} WIB</p>
            </motion.div>

            <motion.div variants={fadeUp} className="detail-card glass-card">
              <div className="detail-icon">
                <MapPin size={22} />
              </div>
              <p className="detail-label">Lokasi Acara</p>
              <h3>{invitation.location_name || "Lokasi belum tersedia"}</h3>
              <p className="detail-address">
                {invitation.location_address || "Alamat belum tersedia"}
              </p>

              {invitation.google_maps_url && (
                <a
                  href={invitation.google_maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="detail-map-btn"
                >
                  Lihat Lokasi
                </a>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* GALLERY */}
      <section className="luxury-section gallery-section">
        <motion.div
          className="luxury-container"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={staggerWrap}
        >
          <motion.div variants={fadeUp} className="section-heading">
            <p className="section-kicker">Gallery</p>
            <h2>Momen Kami</h2>
          </motion.div>

          {galleryImages.length > 0 ? (
            <motion.div variants={staggerWrap} className="gallery-grid">
              {galleryImages.map((img: string, index: number) => (
                <motion.div
                  key={index}
                  variants={fadeUp}
                  className="gallery-card glass-card"
                >
                  <img src={img} alt={`Gallery ${index + 1}`} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <p className="empty-text">Belum ada gallery foto.</p>
          )}
        </motion.div>
      </section>

      {/* STORY */}
      <section className="luxury-section story-section">
        <motion.div
          className="luxury-container"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={fadeUp}
        >
          <div className="story-card glass-card">
            <p className="section-kicker">Our Story</p>
            <h2>Cerita Singkat</h2>
            <p className="story-text">
              {invitation.story ||
                "Setiap pertemuan memiliki cerita, dan setiap cerita memiliki momen indah untuk dikenang bersama."}
            </p>
          </div>
        </motion.div>
      </section>

      {/* RSVP */}
      <section className="luxury-section rsvp-section">
        <motion.div
          className="luxury-container"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={staggerWrap}
        >
          <motion.div variants={fadeUp} className="section-heading">
            <p className="section-kicker">RSVP & Wishes</p>
            <h2>Konfirmasi Kehadiran & Ucapan</h2>
            <p className="section-desc">
              Mohon konfirmasi kehadiran Anda dan tinggalkan doa terbaik untuk
              kami.
            </p>
          </motion.div>

          <div className="rsvp-grid">
            <motion.div variants={fadeUp} className="rsvp-card glass-card">
              <h3>Isi RSVP</h3>

              <form onSubmit={handleSubmitRsvp} className="rsvp-form">
                <div className="field-group">
                  <label>Nama</label>
                  <input
                    type="text"
                    name="guest_name"
                    value={rsvpForm.guest_name}
                    onChange={handleRsvpChange}
                    placeholder="Masukkan nama Anda"
                    required
                  />
                </div>

                <div className="field-group">
                  <label>Konfirmasi Kehadiran</label>
                  <select
                    name="attendance_status"
                    value={rsvpForm.attendance_status}
                    onChange={handleRsvpChange}
                  >
                    <option value="hadir">Hadir</option>
                    <option value="tidak_hadir">Tidak Hadir</option>
                    <option value="masih_ragu">Masih Ragu</option>
                  </select>
                </div>

                <div className="field-group">
                  <label>Ucapan / Doa</label>
                  <textarea
                    name="message"
                    value={rsvpForm.message}
                    onChange={handleRsvpChange}
                    placeholder="Tulis ucapan terbaikmu..."
                    rows={5}
                  />
                </div>

                {rsvpSuccess && (
                  <div className="alert success">{rsvpSuccess}</div>
                )}
                {rsvpError && <div className="alert error">{rsvpError}</div>}

                <button
                  type="submit"
                  disabled={rsvpLoading}
                  className="submit-btn"
                >
                  <Send size={18} />
                  <span>{rsvpLoading ? "Mengirim..." : "Kirim RSVP"}</span>
                </button>
              </form>
            </motion.div>

            <motion.div variants={fadeUp} className="wishes-card glass-card">
              <h3>Ucapan Tamu</h3>

              <div className="wishes-list">
                {rsvps.length > 0 ? (
                  rsvps.map((item) => (
                    <div key={item.id} className="wish-item">
                      <div className="wish-head">
                        <h4>{item.guest_name}</h4>
                        <span
                          className={attendanceClass(item.attendance_status)}
                        >
                          {attendanceLabel(item.attendance_status)}
                        </span>
                      </div>
                      <p>{item.message || "Tidak meninggalkan ucapan."}</p>
                    </div>
                  ))
                ) : (
                  <p className="empty-text">Belum ada RSVP / ucapan masuk.</p>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="luxury-footer">
        <p>Terima kasih atas doa dan kehadiran Anda.</p>
        <h3>
          {invitation.groom_name || "Mempelai Pria"} <span>&</span>{" "}
          {invitation.bride_name || "Mempelai Wanita"}
        </h3>
      </footer>
    </main>
  );
}
