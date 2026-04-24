import api from "@/lib/axios";

export const uploadService = {
  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/uploads/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.data.url;
  },

  async uploadMusic(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/uploads/music", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.data.url;
  },
};