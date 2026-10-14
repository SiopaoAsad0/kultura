const API_HOST = "http://127.0.0.1:8000";

export function mediaUrl(path) {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
    return path;
  }
  if (path.startsWith("/Photos") || path.startsWith("Photos/")) {
    return path.startsWith("/") ? path : `/${path}`;
  }
  if (path.includes("default-product")) {
    return path.startsWith("http") ? path : `${API_HOST}${path.startsWith("/") ? path : `/${path}`}`;
  }
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized.startsWith("/storage")) {
    return `${API_HOST}${normalized}`;
  }
  return path;
}

export function formatRating(value) {
  const n = Number(value);
  if (!n) return "No ratings yet";
  return `${n.toFixed(1)} / 5`;
}
