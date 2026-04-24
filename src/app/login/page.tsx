"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import Link from "next/link";
import {
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  HeartHandshake,
  Star,
} from "lucide-react";

import "./css/login.css";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const result = await authService.login(form);

      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));

      router.push("/dashboard");
    } catch (error: any) {
      setError(error?.response?.data?.message || "Login gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-orb orb-a"></div>
      <div className="login-orb orb-b"></div>
      <div className="login-orb orb-c"></div>
      <div className="login-grid-pattern"></div>

      <div className="login-wrapper">
        {/* LEFT PANEL */}
        <div className="login-showcase">
          <div className="login-badge">
            <Sparkles size={15} />
            <span>Invitation Platform</span>
          </div>

          <h1 className="login-showcase-title">
            Kelola Undangan Digital
            <span> Lebih Modern, Elegan & Premium</span>
          </h1>

          <p className="login-showcase-desc">
            Bangun pengalaman undangan digital yang lebih eksklusif, interaktif,
            dan siap dipakai untuk produk yang benar-benar layak jual.
          </p>

          <div className="login-feature-list">
            <div className="login-feature-card">
              <div className="login-feature-icon purple">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4>Dashboard Aman</h4>
                <p>Akses data invitation dengan login yang aman dan rapi.</p>
              </div>
            </div>

            <div className="login-feature-card">
              <div className="login-feature-icon pink">
                <HeartHandshake size={20} />
              </div>
              <div>
                <h4>Siap Untuk Klien</h4>
                <p>Tampilan profesional yang cocok untuk produk komersial.</p>
              </div>
            </div>

            <div className="login-feature-card">
              <div className="login-feature-icon amber">
                <Star size={20} />
              </div>
              <div>
                <h4>Brand Lebih Premium</h4>
                <p>Bangun kesan “mahal” sejak pertama kali user masuk.</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="login-card">
          <div className="login-card-header">
            <p className="login-mini-label">Welcome</p>
            <h2>Masuk ke Dashboard</h2>
            <p className="login-subtitle">
              Login untuk mengelola invitation, share link, dan data RSVP.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-form-group">
              <label>Email</label>
              <div className="login-input-wrap">
                <Mail size={18} className="login-input-icon" />
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

            <div className="login-form-group">
              <label>Password</label>
              <div className="login-input-wrap">
                <LockKeyhole size={18} className="login-input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Masukkan password"
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
            </div>

            {error && (
              <div className="login-error-box">
                <p>{error}</p>
              </div>
            )}

            <button type="submit" disabled={loading} className="login-submit-btn">
              {loading ? (
                <>
                  <span className="btn-loader"></span>
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <span>Login Sekarang</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="login-footer">
            <p>
              Belum punya akun?{" "}
              <Link href="/register">Daftar sekarang</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}