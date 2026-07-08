import { Platform } from "react-native";
import { api } from "./api";

export const uploadService = {
  async uploadImage(uri: string) {
    const formData = new FormData();

    if (Platform.OS === "web") {
      const response = await fetch(uri);
      const blob = await response.blob();

      const file = new File([blob], `recipe-${Date.now()}.jpg`, {
        type: blob.type || "image/jpeg",
      });

      formData.append("file", file);
    } else {
      formData.append("file", {
        uri,
        name: `recipe-${Date.now()}.jpg`,
        type: "image/jpeg",
      } as any);
    }

    const response = await api.post<{ imageUrl: string }>(
      "/Upload/image",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data.imageUrl;
  },
};
