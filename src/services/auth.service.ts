import api from "@/lib/axios";

export const authService = {
  async register(data: { name: string; email: string; password: string }) {
    const response = await api.post("/auth/register", data);
    return response.data.data;
  },

  async login(data: { email: string; password: string }) {
    const response = await api.post("/auth/login", data);
    return response.data.data;
  },

  async me() {
    const response = await api.get("/auth/me");
    return response.data.data;
  },
};