import { User } from "@/types/user";

export function getAuthUser(): User | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem("user");
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function isAdminRole(role?: string) {
  return role === "admin" || role === "superadmin";
}