const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("VITE_API_BASE_URL is not configured.");
}

let accessTokenGetter: (() => string | null) | null = null;

let refreshAccessToken: (() => Promise<string | null>) | null = null;

let refreshPromise: Promise<string | null> | null = null;

async function getRefreshedAccessToken(): Promise<string | null> {
  if (!refreshAccessToken) {
    return null;
  }

  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

export function setRefreshAccessToken(
  refresher: (() => Promise<string | null>) | null,
) {
  refreshAccessToken = refresher;
}

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
  const isRefreshRequest = endpoint === "/auth/refresh";

  const { accessToken, headers: customHeaders, ...requestOptions } = options;

  const isFormData = requestOptions.body instanceof FormData;

  const sendRequest = async (token: string | null): Promise<Response> => {
    const headers = new Headers(customHeaders);

    if (!isFormData && requestOptions.body !== undefined) {
      headers.set("Content-Type", "application/json");
    }

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    } else {
      headers.delete("Authorization");
    }

    return fetch(url, {
      ...requestOptions,
      headers,
      credentials: "include",
    });
  };

  const parseResponse = async (response: Response): Promise<ApiResponse<T>> => {
    try {
      return (await response.json()) as ApiResponse<T>;
    } catch {
      throw new ApiError(
        "The server returned an invalid response.",
        response.status,
      );
    }
  };

  const initialToken =
    accessToken !== undefined ? accessToken : (accessTokenGetter?.() ?? null);

  const response = await sendRequest(initialToken);
  const result = await parseResponse(response);

  const isExpiredAccessToken =
    response.status === 401 &&
    result.message === "Invalid or expired access token.";

  if (
    isExpiredAccessToken &&
    !isRefreshRequest &&
    initialToken !== null     //will replace incase accessToken
  ) {
    let newToken: string | null;

    try {
      newToken = await getRefreshedAccessToken();
    } catch {
      throw new ApiError(
        result.message,
        result.statusCode || response.status,
        result.data,
      );
    }

    if (newToken) {
      const retryResponse = await sendRequest(newToken);
      const retryResult = await parseResponse(retryResponse);

      if (!retryResponse.ok || !retryResult.success) {
        throw new ApiError(
          retryResult.message || "Something went wrong.",
          retryResult.statusCode || retryResponse.status,
          retryResult.data,
        );
      }

      return retryResult.data as T;
    }
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
