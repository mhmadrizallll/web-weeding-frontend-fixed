"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { invitationService } from "@/services/invitation.service";
import { rsvpService } from "@/services/rsvp.service";
import { Invitation } from "@/types/invitation";
import { Rsvp } from "@/types/rsvp";
import {
  Heart,
  Sparkles,
  Music4,
  CalendarHeart,
  AlertCircle,
} from "lucide-react";

import LuxuryTemplate from "./templates/LuxuryTemplate";
import MinimalTemplate from "./templates/MinimalTemplate";
import RomanticTemplate from "./templates/RomanticTemplate";

import "./css/invitation.css";

export default function PublicInvitationPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const guestName = searchParams.get("to") || "Tamu Undangan";

  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageReady, setPageReady] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [rsvps, setRsvps] = useState<Rsvp[]>([]);
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [rsvpSuccess, setRsvpSuccess] = useState("");
  const [rsvpError, setRsvpError] = useState("");

  const [rsvpForm, setRsvpForm] = useState({
    guest_name: guestName !== "Tamu Undangan" ? guestName : "",
    attendance_status: "hadir",
    message: "",
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const fetchRsvps = async (invitationId: number) => {
    try {
      const data = await rsvpService.getByInvitationId(invitationId);
      setRsvps(data);
    } catch (error) {
      console.error("Failed to fetch RSVPs:", error);
    }
  };

  useEffect(() => {
    const fetchInvitation = async () => {
      const startTime = Date.now();
      const MIN_LOADING_TIME = 1400; // 1.8 detik

      try {
        const data = await invitationService.getBySlug(slug);
        setInvitation(data);

        if (data?.id) {
          await fetchRsvps(data.id);
        }
      } catch (error) {
        console.error("Failed to fetch invitation:", error);
      } finally {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(MIN_LOADING_TIME - elapsed, 0);

        setTimeout(() => {
          setLoading(false);

          setTimeout(() => {
            setPageReady(true);
          }, 250);
        }, remaining);
      }
    };

    if (slug) {
      fetchInvitation();
    }
  }, [slug]);

  useEffect(() => {
    if (!invitation?.event_date) return;

    const updateCountdown = () => {
      const eventDate = new Date(invitation.event_date as string).getTime();
      const now = new Date().getTime();
      const distance = eventDate - now;

      if (distance <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((distance / (1000 * 60)) % 60),
        seconds: Math.floor((distance / 1000) % 60),
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [invitation?.event_date]);

  const galleryImages = useMemo(() => {
    if (!invitation?.gallery_images) return [];

    if (Array.isArray(invitation.gallery_images)) {
      return invitation.gallery_images;
    }

    try {
      return JSON.parse(invitation.gallery_images);
    } catch {
      return [];
    }
  }, [invitation]);

  const handleOpenInvitation = async () => {
    setIsOpened(true);

    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 100);

    if (audioRef.current && invitation?.music_url) {
      try {
        audioRef.current.volume = 0.6;
        audioRef.current.muted = false;
        await audioRef.current.play();
        setIsMuted(false);
      } catch (error) {
        console.warn("Autoplay blocked:", error);
      }
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;

    const nextMuted = !isMuted;
    audioRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const handleRsvpChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setRsvpForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitRsvp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!invitation?.id) return;

    setRsvpLoading(true);
    setRsvpSuccess("");
    setRsvpError("");

    try {
      await rsvpService.create({
        invitation_id: invitation.id,
        guest_name: rsvpForm.guest_name,
        attendance_status: rsvpForm.attendance_status as
          | "hadir"
          | "tidak_hadir"
          | "masih_ragu",
        message: rsvpForm.message,
      });

      setRsvpSuccess("Terima kasih, RSVP & ucapan berhasil dikirim ✨");
      setRsvpForm({
        guest_name: guestName !== "Tamu Undangan" ? guestName : "",
        attendance_status: "hadir",
        message: "",
      });

      await fetchRsvps(invitation.id);
    } catch (error: any) {
      console.error(error);
      setRsvpError(error?.response?.data?.message || "Gagal mengirim RSVP");
    } finally {
      setRsvpLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="inv-shell">
        <div className="inv-bg inv-bg-1"></div>
        <div className="inv-bg inv-bg-2"></div>
        <div className="inv-bg inv-bg-3"></div>
        <div className="inv-grid"></div>

        <section className="inv-state-card">
          <div className="inv-loader-ring"></div>

          <div className="inv-state-icon soft-pink">
            <CalendarHeart size={26} />
          </div>

          <p className="inv-state-kicker">Preparing Your Invitation</p>
          <h1 className="inv-state-title">Menyiapkan Momen Spesial...</h1>
          <p className="inv-state-desc">
            Undangan sedang dipersiapkan agar tampil lebih indah untuk tamu yang
            berharga.
          </p>

          <div className="inv-loading-steps">
            <div className="step-chip active">
              <Sparkles size={14} />
              <span>Template</span>
            </div>
            <div className="step-chip active">
              <Music4 size={14} />
              <span>Audio</span>
            </div>
            <div className="step-chip">
              <Heart size={14} />
              <span>RSVP</span>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (!invitation) {
    return (
      <main className="inv-shell">
        <div className="inv-bg inv-bg-1"></div>
        <div className="inv-bg inv-bg-2"></div>
        <div className="inv-bg inv-bg-3"></div>
        <div className="inv-grid"></div>

        <section className="inv-state-card error">
          <div className="inv-state-icon soft-red">
            <AlertCircle size={28} />
          </div>

          <p className="inv-state-kicker">Invitation Not Found</p>
          <h1 className="inv-state-title">Undangan tidak ditemukan</h1>
          <p className="inv-state-desc">
            Link undangan yang kamu buka mungkin salah, sudah dihapus, belum
            dipublikasikan, atau sedang tidak tersedia.
          </p>

          <div className="inv-state-divider"></div>

          <div className="inv-state-meta">
            <div className="meta-box">
              <span className="meta-label">Slug</span>
              <span className="meta-value">/invite/{slug}</span>
            </div>
            <div className="meta-box">
              <span className="meta-label">Tamu</span>
              <span className="meta-value">{guestName}</span>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const templateProps = {
    invitation,
    guestName,
    isOpened,
    setIsOpened,
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
  };

  return (
    <main className={`invitation-page-fade ${pageReady ? "ready" : ""}`}>
      {invitation.template_key === "minimal" ? (
        <MinimalTemplate {...templateProps} />
      ) : invitation.template_key === "romantic" ? (
        <RomanticTemplate {...templateProps} />
      ) : (
        <LuxuryTemplate {...templateProps} />
      )}
    </main>
  );
}