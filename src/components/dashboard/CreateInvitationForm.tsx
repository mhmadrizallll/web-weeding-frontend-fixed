"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { invitationService } from "@/services/invitation.service";
import { uploadService } from "@/services/upload.service";
import { userService } from "@/services/user.service";
import { User } from "@/types/user";
import { getAuthUser, isAdminRole } from "@/utils/auth";

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

export default function CreateInvitationForm() {
  const router = useRouter();

  const [authUser, setAuthUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const [form, setForm] = useState({
    user_id: 0,
    template_key: "luxury",
    slug: "",
    event_type: "wedding",
    title: "Undangan Pernikahan",
    groom_name: "",
    bride_name: "",

    // ✅ NEW
    groom_image: "",
    bride_image: "",

    cover_title: "The Wedding Of",
    cover_subtitle: "",
    quote: "",
    story: "",

    // ✅ NEW STORY IMAGES
    story_image_1: "",
    story_image_2: "",
    story_image_3: "",

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

  const [uploading, setUploading] = useState({
    cover: false,
    gallery1: false,
    gallery2: false,
    gallery3: false,
    music: false,

    // ✅ NEW
    groom: false,
    bride: false,
    story1: false,
    story2: false,
    story3: false,
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

  useEffect(() => {
    const user = getAuthUser();
    setAuthUser(user);

    if (!user) return;

    // kalau admin/superadmin -> bisa pilih user
    if (isAdminRole(user.role)) {
      fetchUsers();
    }

    // default owner invitation
    setForm((prev) => ({
      ...prev,
      user_id: user.id,
    }));
  }, []);

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const data = await userService.getAssignableUsers();
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoadingUsers(false);
    }
  };

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
      cover_subtitle:
        prev.cover_subtitle || `${form.groom_name} & ${form.bride_name}`,
    }));
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field:
      | "cover_image"
      | "gallery_image_1"
      | "gallery_image_2"
      | "gallery_image_3"
      | "music_url"
      | "groom_image"
      | "bride_image"
      | "story_image_1"
      | "story_image_2"
      | "story_image_3",
    type: "image" | "music",
    loadingKey:
      | "cover"
      | "gallery1"
      | "gallery2"
      | "gallery3"
      | "music"
      | "groom"
      | "bride"
      | "story1"
      | "story2"
      | "story3",
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
      console.error(error);
      alert("Upload gagal");
    } finally {
      setUploading((prev) => ({ ...prev, [loadingKey]: false }));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : name === "user_id"
            ? Number(value)
            : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!form.user_id) {
        setError("Pemilik invitation wajib dipilih.");
        setLoading(false);
        return;
      }

      if (!form.slug) {
        setError("Slug undangan wajib diisi.");
        setLoading(false);
        return;
      }

      const payload = {
        user_id: form.user_id,
        template_key: form.template_key,
        slug: form.slug,
        event_type: form.event_type,
        title: form.title,
        groom_name: form.groom_name,
        bride_name: form.bride_name,

        // ✅ TAMBAH INI
        groom_image: form.groom_image,
        bride_image: form.bride_image,

        cover_title: form.cover_title,
        cover_subtitle: form.cover_subtitle,
        quote: form.quote,
        story: form.story,

        // ✅ TAMBAH INI JUGA
        story_images: [
          form.story_image_1,
          form.story_image_2,
          form.story_image_3,
        ].filter(Boolean),

        music_url: form.music_url,
        location_name: form.location_name,
        location_address: form.location_address,
        google_maps_url: form.google_maps_url,
        event_date: form.event_date,
        event_time: form.event_time,
        is_published: form.is_published,
        cover_image: form.cover_image,

        // ✅ FIX UTAMA (hapus stringify)
        gallery_images: [
          form.gallery_image_1,
          form.gallery_image_2,
          form.gallery_image_3,
        ].filter(Boolean),
      };

      await invitationService.create(payload);
      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || "Gagal membuat invitation");
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

  const selectedOwner = users.find((u) => u.id === form.user_id) || authUser;
  const canAssignUser = isAdminRole(authUser?.role);

  return (
    <section className="create-invitation-page">
      <div className="create-bg-orb orb-1"></div>
      <div className="create-bg-orb orb-2"></div>
      <div className="create-bg-orb orb-3"></div>

      <div className="create-container">
        {/* HEADER */}
        <div className="create-page-header">
          <div>
            <div className="create-badge">
              <Sparkles size={14} />
              <span>Create Invitation</span>
            </div>
            <h1>Buat Undangan Baru</h1>
            <p>
              Susun undangan digital yang lebih premium, personal, dan siap
              dibagikan ke tamu.
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
          {/* LEFT FORM */}
          <form onSubmit={handleSubmit} className="create-form-shell">
            {error && (
              <div className="create-error-box">
                <p>{error}</p>
              </div>
            )}

            {/* SECTION: BASIC */}
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
                {/* PEMILIK INVITATION */}
                <div className="field-full">
                  <label>Pemilik Invitation</label>

                  {canAssignUser ? (
                    <select
                      name="user_id"
                      value={form.user_id}
                      onChange={handleChange}
                    >
                      <option value={0}>-- Pilih User --</option>
                      {users
                        .filter((u) => u.role === "user")
                        .map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.name} - {user.email}
                          </option>
                        ))}
                    </select>
                  ) : (
                    <input type="text" value={authUser?.name || ""} disabled />
                  )}
                </div>

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

                <div className="upload-card">
                  <h4>Foto Mempelai Pria</h4>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleFileUpload(e, "groom_image", "image", "groom")
                    }
                  />

                  {uploading.groom && <p>Uploading...</p>}

                  {form.groom_image && (
                    <img src={form.groom_image} className="media-preview" />
                  )}
                </div>

                <div className="upload-card">
                  <h4>Foto Mempelai Wanita</h4>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleFileUpload(e, "bride_image", "image", "bride")
                    }
                  />

                  {uploading.bride && <p>Uploading...</p>}

                  {form.bride_image && (
                    <img src={form.bride_image} className="media-preview" />
                  )}
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

            {/* SECTION: COVER */}
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
                {[
                  ["story_image_1", "story1", "Story Image 1"],
                  ["story_image_2", "story2", "Story Image 2"],
                  ["story_image_3", "story3", "Story Image 3"],
                ].map(([field, key, label]) => (
                  <div className="upload-card" key={field}>
                    <h4>{label}</h4>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleFileUpload(e, field as any, "image", key as any)
                      }
                    />

                    {uploading[key as keyof typeof uploading] && (
                      <p>Uploading...</p>
                    )}

                    {form[field as keyof typeof form] && (
                      <img
                        src={form[field as keyof typeof form] as string}
                        className="media-preview"
                      />
                    )}
                  </div>
                ))}
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

            {/* SECTION: EVENT */}
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

            {/* SECTION: MEDIA */}
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
                            loadingKey as "gallery1" | "gallery2" | "gallery3",
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

            {/* SECTION: PUBLISH */}
            <div className="create-section-card">
              <div className="section-heading">
                <div className="section-heading-icon emerald">
                  <Globe size={18} />
                </div>
                <div>
                  <h2>Publish Settings</h2>
                  <p>
                    Tentukan apakah undangan langsung aktif atau masih draft.
                  </p>
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
                      ? "Undangan bisa langsung dibagikan setelah dibuat."
                      : "Undangan belum tampil ke tamu sampai kamu publish."}
                  </small>
                </div>
              </label>
            </div>

            {/* ACTIONS */}
            <div className="create-actions">
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="btn-secondary"
              >
                <ArrowLeft size={18} />
                Kembali
              </button>

              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? (
                  <>
                    <Loader2 size={18} className="spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    Simpan Undangan
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* RIGHT SIDEBAR */}
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
                    <strong>{selectedOwner?.name || "Belum dipilih"}</strong>
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
                    <strong>
                      {selectedTemplate?.title || "Belum dipilih"}
                    </strong>
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
                    <strong>
                      {form.music_url ? "Sudah ada" : "Belum ada"}
                    </strong>
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

              {loadingUsers && (
                <p
                  style={{ marginTop: "12px", fontSize: "14px", opacity: 0.7 }}
                >
                  Memuat data user...
                </p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
