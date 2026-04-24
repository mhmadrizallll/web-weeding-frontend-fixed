import api from "@/lib/axios";

export const rsvpService = {
  async getByInvitationId(invitationId: number) {
    const response = await api.get(`/rsvps/invitation/${invitationId}`);
    return response.data.data;
  },

  async create(data: {
    invitation_id: number;
    guest_name: string;
    attendance_status: string;
    message: string;
  }) {
    const response = await api.post("/rsvps", data);
    return response.data.data;
  },
};