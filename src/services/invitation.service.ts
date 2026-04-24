import api from "@/lib/axios";

export const invitationService = {
  async getAll() {
    const res = await api.get("/invitations");
    return res.data.data;
  },

  async getById(id: number) {
    const res = await api.get(`/invitations/${id}`);
    return res.data.data;
  },

  async getBySlug(slug: string) {
    const res = await api.get(`/invitations/public/${slug}`);
    return res.data.data;
  },

  async create(payload: any) {
    const res = await api.post("/invitations", payload);
    return res.data.data;
  },

  async update(id: number, payload: any) {
    const res = await api.put(`/invitations/${id}`, payload);
    return res.data.data;
  },

  async delete(id: number) {
    const res = await api.delete(`/invitations/${id}`);
    return res.data;
  },
};