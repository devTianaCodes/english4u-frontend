const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

async function parseResponse(response) {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Request failed");
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {})
    },
    ...options
  });

  return parseResponse(response);
}

export const endpoints = {
  me: "/auth/me",
  dashboard: "/dashboard/me",
  courses: "/courses"
};
