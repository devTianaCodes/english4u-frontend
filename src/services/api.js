const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

async function parseResponse(response) {
  if (!response.ok) {
    const text = await response.text();
    let message = text || "Request failed";

    try {
      const data = text ? JSON.parse(text) : {};
      message = data.error || message;
    } catch {
      // Fall back to the raw response text when the body is not JSON.
    }

    throw new Error(message);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    credentials: "include",
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
  profile: "/users/me",
  dashboard: "/dashboard/me",
  courses: "/courses",
  review: "/review/me"
};
