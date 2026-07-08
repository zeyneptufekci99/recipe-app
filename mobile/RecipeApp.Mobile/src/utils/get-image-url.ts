import { ENV } from "@/config/env";

export function getImageUrl(imageUrl?: string | null) {
  if (!imageUrl) return null;

  if (imageUrl.startsWith("http")) {
    return imageUrl;
  }

  return `${ENV.API_URL.replace("/api", "")}${imageUrl}`;
}
