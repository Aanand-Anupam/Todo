import type { ApiResponse } from "../types";

const API_BASE = import.meta.env.VITE_API_URL ?? "/api";

console.log("API_BASE", API_BASE);

let accessToken: string | null = localStorage.getItem("accessToken");

export function getAccessToken() {
  return accessToken;
}

export function setAccessToken(token: string | null) {
  accessToken = token;
  if (token) {
    localStorage.setItem("accessToken", token);
  } else {
    localStorage.removeItem("accessToken");
  }
}

async function refreshAccessToken(): Promise<string | null> {
  try {
    const res = await fetch(`${API_BASE}/user/refresh`, {
      method: "GET",
      credentials: "include",
    });
    if (!res.ok) return null;
    const json: ApiResponse<{ accessToken: string }> = await res.json();
    if (json.data?.accessToken) {
      setAccessToken(json.data.accessToken);
      return json.data.accessToken;
    }
    return null;
  } catch {
    return null;
  }
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  retry = true,
): Promise<ApiResponse<T>> {
  const headers = new Headers(options.headers);

  if (accessToken && !headers.has("Authorization")) {
    headers.set("Authorization", accessToken);
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (res.status === 401 && retry && path !== "/user/refresh") {
    const newToken = await refreshAccessToken();
    if (newToken) {
      return apiFetch<T>(path, options, false);
    }
    setAccessToken(null);
  }

  const json: ApiResponse<T> = await res.json();

  if (!res.ok || !json.success) {
    throw new ApiError(json.message || "Request failed", res.status);
  }

  return json;
}

export async function apiFormData<T>(
  path: string,
  formData: FormData,
  method = "POST",
): Promise<ApiResponse<T>> {
  const headers = new Headers();
  if (accessToken) {
    headers.set("Authorization", accessToken);
  }

  const bodyEntries: [string, FormDataEntryValue][] = [];
  formData.forEach((value, key) => {
    bodyEntries.push([key, value]);
  });

  const buildBody = () => {
    const body = new FormData();
    bodyEntries.forEach(([key, value]) => {
      body.append(key, value);
    });
    return body;
  };

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    body: buildBody(),
    headers,
    credentials: "include",
  });

  if (res.status === 401) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      headers.set("Authorization", newToken);
      const retryRes = await fetch(`${API_BASE}${path}`, {
        method,
        body: buildBody(),
        headers,
        credentials: "include",
      });
      const retryJson: ApiResponse<T> = await retryRes.json();
      if (!retryRes.ok || !retryJson.success) {
        throw new ApiError(
          retryJson.message || "Request failed",
          retryRes.status,
        );
      }
      return retryJson;
    }
    setAccessToken(null);
  }

  const json: ApiResponse<T> = await res.json();

  if (!res.ok || !json.success) {
    throw new ApiError(json.message || "Request failed", res.status);
  }

  return json;
}
