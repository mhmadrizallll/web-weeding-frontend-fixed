export interface Invitation {
  id: number;
  user_id?: number;
  template_key: string;
  slug: string;
  event_type: string;
  title: string;
  groom_name: string;
  bride_name: string;
  cover_title?: string;
  cover_subtitle?: string;
  quote?: string;
  story?: string;
  music_url?: string;
  location_name?: string;
  location_address?: string;
  google_maps_url?: string;
  event_date?: string;
  event_time?: string;
  is_published?: boolean;
  cover_image?: string;
  gallery_images?: string[] | string;
  created_at?: string;
  updated_at?: string;
}