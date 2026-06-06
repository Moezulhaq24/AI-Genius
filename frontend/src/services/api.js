const API_URL = "http://localhost:8000";

export const api = {
  login: async (email, password) => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // REQUIRED to send/receive cookies
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error("Login failed");
    return res.json();
  },

  getMe: async (token) => {
    const res = await fetch(`${API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    });
    if (!res.ok) throw new Error("Not authenticated");
    return res.json();
  },

  callAI: async (endpoint, method, token) => {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: method,
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    });
    if (res.status === 403) throw new Error("Access Denied: Insufficient Permissions");
    if (!res.ok) throw new Error("API call failed");
    return res.json();
  }
};