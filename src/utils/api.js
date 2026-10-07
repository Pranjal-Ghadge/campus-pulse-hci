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

  const responseText = await response.text();
  let payload = null;
  try {
    payload = responseText ? JSON.parse(responseText) : null;
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
    const responseMessage = import.meta.env.DEV && responseText
      ? response.headers.get("content-type")?.includes("text/html")
        ? new DOMParser()
          .parseFromString(responseText, "text/html")
          .body.textContent?.trim()
          .replace(/\s+/g, " ")
        : responseText.trim()
      : "";
    const error = new Error(
      payload?.message || responseMessage || "The request could not be completed."
    );
    error.status = response.status;
    throw error;
  }

  return payload;
}