// API Helper with authentication and error handling
export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
) {
  const token = localStorage.getItem("token");

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (res.status === 401) {
    // Token expired or invalid → force logout
    localStorage.removeItem("token");
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const { error } = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(error || "Request failed");
  }

  return res.json();
}

// Public API calls (no authentication required)
export async function fetchPublic(
  url: string,
  options: RequestInit = {}
) {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const { error } = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(error || "Request failed");
  }

  return res.json();
}

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: "/api/auth/login",
  REGISTER: "/api/auth/register",
  
  // Public (no auth)
  SITES: "/api/sites",
  SUBMIT_WASTE: "/api/waste",
  
  // Protected (requires auth)
  WASTE_REPORTS: "/api/waste",
  UPDATE_WASTE_STATUS: (id: number) => `/api/waste/${id}/status`,
} as const;

// Base URL configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Helper to build full URLs
export function buildUrl(endpoint: string): string {
  return `${API_BASE_URL}${endpoint}`;
}
