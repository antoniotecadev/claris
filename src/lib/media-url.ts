const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

const API_PUBLIC_BASE_URL = API_BASE_URL.replace(/\/api\/v1\/?$/, "/");

export function normalizeMediaUrl(value?: string | null) {
  const url = value?.trim();

  if (!url) return undefined;

  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("data:") ||
    url.startsWith("blob:")
  ) {
    return url;
  }

  return new URL(url.startsWith("/") ? url : `/${url}`, API_PUBLIC_BASE_URL)
    .href;
}
