const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || "Request failed");
  }

  return payload;
}

export function fetchEvents() {
  return request("/events");
}

export function createEvent(data) {
  return request("/events", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function registerForEvent(id) {
  return request(`/events/${id}/register`, {
    method: "POST",
  });
}
