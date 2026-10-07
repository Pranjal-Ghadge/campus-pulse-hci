const apiBaseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem("campusPulseToken");
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    if (
      response.status === 401 &&
      path !== "/api/auth/login" &&
      path !== "/api/auth/signup"
    ) {
      window.dispatchEvent(new Event("campusPulseUnauthorized"));
    }
    const error = new Error(payload?.message || "The request could not be completed.");
    error.status = response.status;
    throw error;
  }

  return payload;
}