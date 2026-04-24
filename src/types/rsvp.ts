export interface Rsvp {
  id: number;
  invitation_id: number;
  guest_name: string;
  attendance_status: "hadir" | "tidak_hadir" | "masih_ragu";
  message?: string;
  created_at?: string;
}