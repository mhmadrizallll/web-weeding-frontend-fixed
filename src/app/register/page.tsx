"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import Link from "next/link";
import {
  User,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Heart,
  Wand2,
} from "lucide-react";

import "./css/register.css";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const getPasswordStrength = (password: string) => {
    if (!password) return { label: "Belum diisi", level: 0 };

    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return { label: "Lemah", level: 1 };
    if (score <= 4) return { label: "Sedang", level: 2 };
    return { label: "Kuat", level: 3 };
  };

  const passwordStrength = getPasswordStrength(form.password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      await authService.register(form);

      setSuccess("Register berhasil, mengarahkan ke halaman login...");

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error: any) {
      setError(error?.response?.data?.message || "Register gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="register-page">
      <div className="register-orb orb-a"></div>
      <div className="register-orb orb-b"></div>
      <div className="register-orb orb-c"></div>
      <div className="register-grid-pattern"></div>

      <div className="register-wrapper">
        {/* LEFT SIDE */}
        <div className="register-showcase">
          <div className="register-badge">
            <Sparkles size={15} />
            <span>Create Your Invitation Platform</span>
          </div>

          <h1 className="register-showcase-title">
            Mulai Bangun
            <span> Undangan Digital Premium</span>
          </h1>

          <p className="register-showcase-desc">
            Buat akun untuk mulai mengelola invitation, share link personal,
            RSVP dashboard, dan pengalaman undangan digital yang lebih modern.
          </p>

          <div className="register-feature-list">
            <div className="register-feature-card">
              <div className="register-feature-icon purple">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4>Akses Dashboard Profesional</h4>
                <p>Kelola undangan dengan tampilan yang lebih modern dan rapi.</p>
              </div>
            </div>

            <div className="register-feature-card">
              <div className="register-feature-icon pink">
                <Heart size={20} />
              </div>
              <div>
                <h4>Personal Untuk Setiap Tamu</h4>
                <p>Buat link undangan personal yang terasa lebih eksklusif.</p>
              </div>
            </div>

            <div className="register-feature-card">
              <div className="register-feature-icon amber">
                <Wand2 size={20} />
              </div>
              <div>
                <h4>Siap Jadi Produk Jualan</h4>
                <p>Bikin sistem undangan yang pantas dipakai untuk client.</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="register-card">
          <div className="register-card-header">
            <p className="register-mini-label">Get Started</p>
            <h2>Buat Akun Baru</h2>
            <p className="register-subtitle">
              Isi data di bawah untuk mulai membuat undangan digital kamu.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="register-form">
            <div className="register-form-group">
              <label>Nama Lengkap</label>
              <div className="register-input-wrap">
                <User size={18} className="register-input-icon" />
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Contoh: Muhammad Rizal"
                  required
                />
              </div>
            </div>

            <div className="register-form-group">
              <label>Email</label>
              <div className="register-input-wrap">
                <Mail size={18} className="register-input-icon" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="email@example.com"
                  required
                />
              </div>
            </div>

            <div className="register-form-group">
              <label>Password</label>
              <div className="register-input-wrap">
                <LockKeyhole size={18} className="register-input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Buat password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="password-meta">
                <div className="password-strength">
                  <div
                    className={`strength-bar ${
                      passwordStrength.level >= 1 ? "active weak" : ""
                    }`}
                  ></div>
                  <div
                    className={`strength-bar ${
                      passwordStrength.level >= 2 ? "active medium" : ""
                    }`}
                  ></div>
                  <div
                    className={`strength-bar ${
                      passwordStrength.level >= 3 ? "active strong" : ""
                    }`}
                  ></div>
                </div>
                <span className={`strength-label level-${passwordStrength.level}`}>
                  {passwordStrength.label}
                </span>
              </div>

              <p className="password-hint">
                Gunakan kombinasi huruf besar, angka, dan simbol agar lebih aman.
              </p>
            </div>

            {error && (
              <div className="register-error-box">
                <p>{error}</p>
              </div>
            )}

            {success && (
              <div className="register-success-box">
                <CheckCircle2 size={18} />
                <p>{success}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="register-submit-btn"
            >
              {loading ? (
                <>
                  <span className="btn-loader"></span>
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <span>Buat Akun Sekarang</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="register-footer">
            <p>
              Sudah punya akun? <Link href="/login">Login sekarang</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}