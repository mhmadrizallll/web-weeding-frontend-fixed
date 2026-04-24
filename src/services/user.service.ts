import api from "@/lib/axios";
import { User } from "@/types/user";

export const userService = {
  async getAll(): Promise<User[]> {
    const res = await api.get("/users");
    return res.data.data || res.data;
  },

  async getAssignableUsers(): Promise<User[]> {
    const res = await api.get("/users/assignable");
    return res.data.data || res.data;
  },
};