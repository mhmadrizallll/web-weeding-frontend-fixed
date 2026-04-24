"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { invitationService } from "@/services/invitation.service";
import { uploadService } from "@/services/upload.service";
import { userService } from "@/services/user.service";
import { User } from "@/types/user";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Crown,
  Globe,
  Heart,
  ImageIcon,
  Loader2,
  MapPin,
  Mic2,
  Music4,
  Sparkles,
  UploadCloud,
  User2,
  Wand2,
} from "lucide-react";

import "./css/create-invitation.css";

interface EditInvitationFormProps {
  id: string;
}

export default function EditInvitationForm({
  id,
}: EditInvitationFormProps) {
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [pageLoading, setPageLoading] = useState(true);

  const [form, setForm] = useState({
    assigned_user_id: "",
    template_key: "luxury",
    slug: "",
    event_type: "wedding",
    title: "Undangan Pernikahan",
    groom_name: "",
    bride_name: "",
    cover_title: "The Wedding Of",
    cover_subtitle: "",
    quote: "",
    story: "",
    music_url: "",
    location_name: "",
    location_address: "",
    google_maps_url: "",
    event_date: "",
    event_time: "",
    is_published: false,
    cover_image: "",
    gallery_image_1: "",
    gallery_image_2: "",
    gallery_image_3: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [uploading, setUploading] = useState<{
    cover: boolean;
    gallery1: boolean;
    gallery2: boolean;
    gallery3: boolean;
    music: boolean;
  }>({
    cover: false,
    gallery1: false,
    gallery2: false,
    gallery3: false,
    music: false,
  });

  const templateOptions = [
    {
      key: "luxury",
      title: "Luxury Gold",
      desc: "Elegan, premium, mewah",
      icon: Crown,
    },
    {
      key: "minimal",
      title: "Minimal Clean",
      desc: "Bersih, modern, simple",
      icon: Sparkles,
    },
    {
      key: "romantic",
      title: "Romantic Pink",
      desc: "Lembut, manis, romantis",
      icon: Heart,
    },
  ];

  const generateSlug = (groom: string, bride: string) => {
    const combined = `${groom}-${bride}`
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-");

    return combined || "";
  };

  const handleAutoSlug = () => {
    const autoSlug = generateSlug(form.groom_name, form.bride_name);
    setForm((prev) => ({
      ...prev,
      slug: autoSlug,
    }));
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field:
      | "cover_image"
      | "gallery_image_1"
      | "gallery_image_2"
      | "gallery_image_3"
      | "music_url",
    type: "image" | "music",
    loadingKey: "cover" | "gallery1" | "gallery2" | "gallery3" | "music"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading((prev) => ({ ...prev, [loadingKey]: true }));

      const url =
        type === "image"
          ? await uploadService.uploadImage(file)
          : await uploadService.uploadMusic(file);

      setForm((prev) => ({
        ...prev,
        [field]: url,
      }));
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload gagal, coba lagi.");
    } finally {
      setUploading((prev) => ({ ...prev, [loadingKey]: false }));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : value,
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setPageLoading(true);
        setError("");

        const [invitation, usersData] = await Promise.all([
          invitationService.getById(Number(id)),
          userService.getAll(),
        ]);

        let galleryImages: string[] = [];

        try {
          if (Array.isArray(invitation.gallery_images)) {
            galleryImages = invitation.gallery_images;
          } else if (typeof invitation.gallery_images === "string") {
            galleryImages = JSON.parse(invitation.gallery_images);
          }
        } catch (error) {
          console.error("Failed parse gallery_images:", error);
          galleryImages = [];
        }

        setUsers(usersData);

        setForm({
          assigned_user_id: invitation.user_id
            ? String(invitation.user_id)
            : "",
          template_key: invitation.template_key || "luxury",
          slug: invitation.slug || "",
          event_type: invitation.event_type || "wedding",
          title: invitation.title || "Undangan Pernikahan",
          groom_name: invitation.groom_name || "",
          bride_name: invitation.bride_name || "",
          cover_title: invitation.cover_title || "The Wedding Of",
          cover_subtitle: invitation.cover_subtitle || "",
          quote: invitation.quote || "",
          story: invitation.story || "",
          music_url: invitation.music_url || "",
          location_name: invitation.location_name || "",
          location_address: invitation.location_address || "",
          google_maps_url: invitation.google_maps_url || "",
          event_date: invitation.event_date
            ? String(invitation.event_date).slice(0, 10)
            : "",
          event_time: invitation.event_time || "",
          is_published: !!invitation.is_published,
          cover_image: invitation.cover_image || "",
          gallery_image_1: galleryImages[0] || "",
          gallery_image_2: galleryImages[1] || "",
          gallery_image_3: galleryImages[2] || "",
        });
      } catch (err: any) {
        console.error(err);
        setError(
          err?.response?.data?.message || "Gagal memuat data invitation"
        );
      } finally {
        setPageLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        user_id: form.assigned_user_id
          ? Number(form.assigned_user_id)
          : null,
        template_key: form.template_key,
        slug: form.slug.trim(),
        event_type: form.event_type,
        title: form.title.trim(),
        groom_name: form.groom_name.trim(),
        bride_name: form.bride_name.trim(),
        cover_title: form.cover_title.trim(),
        cover_subtitle: form.cover_subtitle.trim(),
        quote: form.quote.trim(),
        story: form.story.trim(),
        music_url: form.music_url.trim(),
        location_name: form.location_name.trim(),
        location_address: form.location_address.trim(),
        google_maps_url: form.google_maps_url.trim(),
        event_date: form.event_date || null,
        event_time: form.event_time.trim(),
        is_published: form.is_published,
        cover_image: form.cover_image.trim(),
        gallery_images: JSON.stringify(
          [
            form.gallery_image_1,
            form.gallery_image_2,
            form.gallery_image_3,
          ].filter(Boolean)
        ),
      };

      await invitationService.update(Number(id), payload);
      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || "Gagal update invitation");
    } finally {
      setLoading(false);
    }
  };

  const selectedTemplate = useMemo(() => {
    return templateOptions.find((t) => t.key === form.template_key);
  }, [form.template_key]);

  const galleryCount = [
    form.gallery_image_1,
    form.gallery_image_2,
    form.gallery_image_3,
  ].filter(Boolean).length;

  const assignedUserName =
    users.find((u) => String(u.id) === form.assigned_user_id)?.name || "-";

  if (pageLoading) {
    return (
      <section className="create-invitation-page">
        <div className="create-container">
          <div className="rounded-3xl border border-[#e8dfd2] bg-white p-10 shadow-sm">
            <p className="text-[#666] flex items-center gap-2">
              <Loader2 className="animate-spin" size={18} />
              Memuat data invitation...
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="create-invitation-page">
      <div className="create-bg-orb orb-1"></div>
      <div className="create-bg-orb orb-2"></div>
      <div className="create-bg-orb orb-3"></div>

      <div className="create-container">
        <div className="create-page-header">
          <div>
            <div className="create-badge">
              <Sparkles size={14} />
              <span>Edit Invitation</span>
            </div>
            <h1>Edit Undangan</h1>
            <p>
              Perbarui undangan digital dengan tampilan premium dan siap
              dibagikan.
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="create-back-btn"
          >
            <ArrowLeft size={18} />
            <span>Kembali</span>
          </button>
        </div>

        <div className="create-layout">
          <form onSubmit={handleSubmit} className="create-form-shell">
            {error && (
              <div className="create-error-box">
                <p>{error}</p>
              </div>
            )}

            <div className="create-section-card">
              <div className="section-heading">
                <div className="section-heading-icon purple">
                  <User2 size={18} />
                </div>
                <div>
                  <h2>Pemilik Undangan</h2>
                  <p>Tentukan undangan ini dimiliki oleh user siapa.</p>
                </div>
              </div>

              <div className="create-grid">
                <div className="field-full">
                  <label>Pilih User Pemilik</label>
                  <select
                    name="assigned_user_id"
                    value={form.assigned_user_id}
                    onChange={handleChange}
                  >
                    <option value="">-- Pilih User --</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="create-section-card">
              <div className="section-heading">
                <div className="section-heading-icon purple">
                  <User2 size={18} />
                </div>
                <div>
                  <h2>Informasi Dasar</h2>
                  <p>Isi identitas utama undangan kamu.</p>
                </div>
              </div>

              <div className="create-grid">
                <div className="field-full">
                  <label>Template Undangan</label>
                  <div className="template-grid">
                    {templateOptions.map((template) => {
                      const Icon = template.icon;
                      const active = form.template_key === template.key;

                      return (
                        <button
                          key={template.key}
                          type="button"
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              template_key: template.key,
                            }))
                          }
                          className={`template-option ${active ? "active" : ""}`}
                        >
                          <div className="template-option-top">
                            <div className="template-icon">
                              <Icon size={18} />
                            </div>
                            {active && <CheckCircle2 size={18} />}
                          </div>
                          <h4>{template.title}</h4>
                          <p>{template.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label>Nama Mempelai Pria</label>
                  <input
                    type="text"
                    name="groom_name"
                    value={form.groom_name}
                    onChange={handleChange}
                    placeholder="Contoh: Andi"
                  />
                </div>

                <div>
                  <label>Nama Mempelai Wanita</label>
                  <input
                    type="text"
                    name="bride_name"
                    value={form.bride_name}
                    onChange={handleChange}
                    placeholder="Contoh: Sari"
                  />
                </div>

                <div className="field-full">
                  <label>Slug Undangan</label>
                  <div className="slug-row">
                    <input
                      type="text"
                      name="slug"
                      value={form.slug}
                      onChange={handleChange}
                      placeholder="contoh: andi-sari"
                    />
                    <button
                      type="button"
                      onClick={handleAutoSlug}
                      className="auto-slug-btn"
                    >
                      <Wand2 size={16} />
                      Auto
                    </button>
                  </div>
                </div>

                <div>
                  <label>Jenis Acara</label>
                  <select
                    name="event_type"
                    value={form.event_type}
                    onChange={handleChange}
                  >
                    <option value="wedding">Wedding</option>
                    <option value="engagement">Engagement</option>
                    <option value="birthday">Birthday</option>
                  </select>
                </div>

                <div>
                  <label>Judul Halaman</label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Undangan Pernikahan"
                  />
                </div>
              </div>
            </div>

            <div className="create-section-card">
              <div className="section-heading">
                <div className="section-heading-icon pink">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h2>Cover & Opening</h2>
                  <p>Atur tampilan pembuka undangan.</p>
                </div>
              </div>

              <div className="create-grid">
                <div>
                  <label>Judul Cover</label>
                  <input
                    type="text"
                    name="cover_title"
                    value={form.cover_title}
                    onChange={handleChange}
                    placeholder="The Wedding Of"
                  />
                </div>

                <div>
                  <label>Sub Judul Cover</label>
                  <input
                    type="text"
                    name="cover_subtitle"
                    value={form.cover_subtitle}
                    onChange={handleChange}
                    placeholder="Andi & Sari"
                  />
                </div>

                <div className="field-full">
                  <label>Quote / Caption</label>
                  <textarea
                    name="quote"
                    value={form.quote}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Tulis quote, ayat, atau caption romantis..."
                  />
                </div>

                <div className="field-full">
                  <label>Cerita / Story (Opsional)</label>
                  <textarea
                    name="story"
                    value={form.story}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Ceritakan perjalanan kisah kalian..."
                  />
                </div>
              </div>
            </div>

            <div className="create-section-card">
              <div className="section-heading">
                <div className="section-heading-icon amber">
                  <CalendarDays size={18} />
                </div>
                <div>
                  <h2>Lokasi & Waktu</h2>
                  <p>Isi detail acara agar tamu mudah hadir.</p>
                </div>
              </div>

              <div className="create-grid">
                <div>
                  <label>Nama Lokasi</label>
                  <input
                    type="text"
                    name="location_name"
                    value={form.location_name}
                    onChange={handleChange}
                    placeholder="Gedung Serbaguna"
                  />
                </div>

                <div>
                  <label>Tanggal Acara</label>
                  <input
                    type="date"
                    name="event_date"
                    value={form.event_date}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label>Jam Acara</label>
                  <input
                    type="text"
                    name="event_time"
                    value={form.event_time}
                    onChange={handleChange}
                    placeholder="09:00 WIB"
                  />
                </div>

                <div>
                  <label>Google Maps URL</label>
                  <input
                    type="text"
                    name="google_maps_url"
                    value={form.google_maps_url}
                    onChange={handleChange}
                    placeholder="https://maps.google.com/..."
                  />
                </div>

                <div className="field-full">
                  <label>Alamat Lengkap</label>
                  <textarea
                    name="location_address"
                    value={form.location_address}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Jl. Mawar No. 10, Jakarta"
                  />
                </div>
              </div>
            </div>

            <div className="create-section-card">
              <div className="section-heading">
                <div className="section-heading-icon blue">
                  <ImageIcon size={18} />
                </div>
                <div>
                  <h2>Media & Gallery</h2>
                  <p>Upload cover, gallery, dan musik untuk undangan.</p>
                </div>
              </div>

              <div className="upload-grid">
                <div className="upload-card upload-card-large">
                  <div className="upload-card-head">
                    <div className="upload-card-title">
                      <ImageIcon size={18} />
                      <span>Cover Image</span>
                    </div>
                  </div>

                  <label className="upload-dropzone">
                    <UploadCloud size={22} />
                    <span>Upload cover image</span>
                    <small>PNG, JPG, WEBP</small>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleFileUpload(e, "cover_image", "image", "cover")
                      }
                      hidden
                    />
                  </label>

                  {uploading.cover && (
                    <p className="uploading-text">
                      <Loader2 size={16} className="spin" />
                      Uploading cover...
                    </p>
                  )}

                  {form.cover_image && (
                    <img
                      src={form.cover_image}
                      alt="Cover Preview"
                      className="media-preview cover-preview"
                    />
                  )}
                </div>

                {[
                  ["gallery_image_1", "gallery1", "Gallery 1"],
                  ["gallery_image_2", "gallery2", "Gallery 2"],
                  ["gallery_image_3", "gallery3", "Gallery 3"],
                ].map(([field, loadingKey, label]) => (
                  <div className="upload-card" key={field}>
                    <div className="upload-card-head">
                      <div className="upload-card-title">
                        <ImageIcon size={18} />
                        <span>{label}</span>
                      </div>
                    </div>

                    <label className="upload-dropzone compact">
                      <UploadCloud size={20} />
                      <span>Upload image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleFileUpload(
                            e,
                            field as
                              | "gallery_image_1"
                              | "gallery_image_2"
                              | "gallery_image_3",
                            "image",
                            loadingKey as "gallery1" | "gallery2" | "gallery3"
                          )
                        }
                        hidden
                      />
                    </label>

                    {uploading[loadingKey as keyof typeof uploading] && (
                      <p className="uploading-text">
                        <Loader2 size={16} className="spin" />
                        Uploading...
                      </p>
                    )}

                    {form[field as keyof typeof form] && (
                      <img
                        src={form[field as keyof typeof form] as string}
                        alt={label}
                        className="media-preview"
                      />
                    )}
                  </div>
                ))}

                <div className="upload-card upload-card-music">
                  <div className="upload-card-head">
                    <div className="upload-card-title">
                      <Music4 size={18} />
                      <span>Background Music</span>
                    </div>
                  </div>

                  <label className="upload-dropzone compact">
                    <Mic2 size={20} />
                    <span>Upload audio</span>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={(e) =>
                        handleFileUpload(e, "music_url", "music", "music")
                      }
                      hidden
                    />
                  </label>

                  {uploading.music && (
                    <p className="uploading-text">
                      <Loader2 size={16} className="spin" />
                      Uploading music...
                    </p>
                  )}

                  {form.music_url && (
                    <audio controls className="audio-preview">
                      <source src={form.music_url} />
                    </audio>
                  )}
                </div>
              </div>
            </div>

            <div className="create-section-card">
              <div className="section-heading">
                <div className="section-heading-icon emerald">
                  <Globe size={18} />
                </div>
                <div>
                  <h2>Publish Settings</h2>
                  <p>Tentukan apakah undangan aktif atau masih draft.</p>
                </div>
              </div>

              <label className="publish-toggle">
                <input
                  type="checkbox"
                  name="is_published"
                  checked={form.is_published}
                  onChange={handleChange}
                />
                <span className="publish-slider"></span>
                <div className="publish-text">
                  <strong>
                    {form.is_published
                      ? "Undangan akan dipublish"
                      : "Simpan sebagai draft"}
                  </strong>
                  <small>
                    {form.is_published
                      ? "Undangan bisa langsung dibagikan setelah diupdate."
                      : "Undangan belum tampil ke tamu sampai dipublish."}
                  </small>
                </div>
              </label>
            </div>

            <div className="create-actions">
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="btn-secondary"
              >
                <ArrowLeft size={18} />
                Kembali
              </button>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    Update Undangan
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </form>

          <aside className="create-preview-sidebar">
            <div className="preview-card">
              <div className="preview-top">
                <p className="preview-label">Live Summary</p>
                <h3>{form.cover_title || "The Wedding Of"}</h3>
                <p className="preview-couple">
                  {form.groom_name || "Mempelai Pria"} &{" "}
                  {form.bride_name || "Mempelai Wanita"}
                </p>
              </div>

              <div className="preview-cover">
                {form.cover_image ? (
                  <img src={form.cover_image} alt="Preview Cover" />
                ) : (
                  <div className="preview-cover-empty">
                    <ImageIcon size={30} />
                    <span>Belum ada cover image</span>
                  </div>
                )}
              </div>

              <div className="preview-meta-list">
                <div className="preview-meta-item">
                  <User2 size={17} />
                  <div>
                    <span>Pemilik</span>
                    <strong>{assignedUserName}</strong>
                  </div>
                </div>

                <div className="preview-meta-item">
                  <CalendarDays size={17} />
                  <div>
                    <span>Tanggal Acara</span>
                    <strong>{form.event_date || "Belum diisi"}</strong>
                  </div>
                </div>

                <div className="preview-meta-item">
                  <MapPin size={17} />
                  <div>
                    <span>Lokasi</span>
                    <strong>{form.location_name || "Belum diisi"}</strong>
                  </div>
                </div>

                <div className="preview-meta-item">
                  <Sparkles size={17} />
                  <div>
                    <span>Template</span>
                    <strong>{selectedTemplate?.title || "Belum dipilih"}</strong>
                  </div>
                </div>

                <div className="preview-meta-item">
                  <ImageIcon size={17} />
                  <div>
                    <span>Gallery</span>
                    <strong>{galleryCount} foto terupload</strong>
                  </div>
                </div>

                <div className="preview-meta-item">
                  <Music4 size={17} />
                  <div>
                    <span>Music</span>
                    <strong>{form.music_url ? "Sudah ada" : "Belum ada"}</strong>
                  </div>
                </div>
              </div>

              <div className="preview-status-box">
                <span
                  className={`status-dot ${
                    form.is_published ? "published" : "draft"
                  }`}
                ></span>
                <div>
                  <p>Status</p>
                  <strong>{form.is_published ? "Published" : "Draft"}</strong>
                </div>
              </div>

              {form.slug && (
                <div className="preview-link-box">
                  <p>URL Undangan</p>
                  <strong>/invite/{form.slug}</strong>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}