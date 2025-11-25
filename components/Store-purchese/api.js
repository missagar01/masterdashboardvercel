// src/api.js

import { STORE_API_BASE } from "../../lib/apiEndpoints";

// Base API URL (configurable)
export const API_URL = STORE_API_BASE;


// ================= AUTH HELPERS =================

export function isTokenExpired(token) {
  if (!token) return true;

  try {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return true;

    const expirationTime = decoded.exp * 1000; // seconds → ms
    const currentTime = Date.now();

    return currentTime >= expirationTime - 5000; // 5s buffer
  } catch (e) {
    return true;
  }
}

export async function loginUser(identifier, password) {
  const isEmployeeId = /^S\d+$/i.test(identifier.trim());

  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(
      isEmployeeId
        ? { employee_id: identifier, password }
        : { user_name: identifier, password }
    ),
  });

  // 🔹 404 / empty response ke case me JSON.parse error na aaye:
  const text = await res.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { message: text || "Unknown error" };
  }

  if (!res.ok) {
    throw new Error(data.error || data.message || "Login failed");
  }

  if (data.success && data.token) {
    localStorage.setItem("token", data.token);
  }

  return data;
}

export async function logoutUser() {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  return res.json().catch(() => ({}));
}

export function decodeToken(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch (e) {
    console.error("Invalid token:", e);
    return null;
  }
}

export function handleAuthError() {
  localStorage.removeItem("token");
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
}

// ================= STORE INDENT APIs =================

function buildAuthHeaders() {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function safeJsonParse(response) {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

export async function fetchAllIndents() {
  const res = await fetch(`${API_URL}/indent/all`, {
    headers: {
      "Content-Type": "application/json",
      ...buildAuthHeaders(),
    },
  });

  const data = await safeJsonParse(res);
  if (!res.ok) {
    throw new Error(data?.message || "Failed to fetch indents");
  }

  // API might return {data: []} or bare array
  return Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
}

export async function fetchFilteredIndents({ fromDate, toDate, productName, requesterName }) {
  const params = new URLSearchParams();
  if (fromDate) params.append("fromDate", fromDate);
  if (toDate) params.append("toDate", toDate);
  if (productName) params.append("productName", productName);
  if (requesterName) params.append("requesterName", requesterName);

  const res = await fetch(`${API_URL}/indent/filter?${params.toString()}`, {
    headers: {
      "Content-Type": "application/json",
      ...buildAuthHeaders(),
    },
  });

  const data = await safeJsonParse(res);
  if (!res.ok) {
    throw new Error(data?.message || "Failed to filter indents");
  }

  return Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
}
