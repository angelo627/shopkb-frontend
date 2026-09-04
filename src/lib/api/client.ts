const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("VITE_API_BASE_URL is not configured.");
}

let accessTokenGetter: (() => string | null) | null = null;

export function setAccessTokenGetter(getter: (() => string | null) | null) {
  accessTokenGetter = getter;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T | null;
}

export class ApiError extends Error {
  statusCode: number;
  data: unknown;

  constructor(message: string, statusCode: number, data: unknown = null) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.data = data;
  }
}

export interface ApiClientOptions extends RequestInit {
  accessToken?: string | null;
}

export async function apiClient<T>(
  endpoint: string,
  options: ApiClientOptions = {},
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const { accessToken, headers: customHeaders, ...requestOptions } = options;

  const isFormData = requestOptions.body instanceof FormData;

  const headers = new Headers(customHeaders);

  if (!isFormData && requestOptions.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  const token =
    accessToken !== undefined ? accessToken : (accessTokenGetter?.() ?? null);

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...requestOptions,
    headers,
    credentials: "include",
  });

  let result: ApiResponse<T>;

  try {
    result = await response.json();
  } catch {
    throw new ApiError(
      "The server returned an invalid response.",
      response.status,
    );
  }

  if (!response.ok || !result.success) {
    throw new ApiError(
      result.message || "Something went wrong.",
      result.statusCode || response.status,
      result.data,
    );
  }

  return result.data as T;
}
