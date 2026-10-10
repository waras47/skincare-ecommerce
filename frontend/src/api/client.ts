import axios, { type AxiosError } from "axios";

export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string };

export const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function safeRequest<T>(fn: () => Promise<{ data: { success: true; data: T } }>): Promise<ApiResult<T>> {
  try {
    const res = await fn();
    return { ok: true, data: res.data.data };
  } catch (err) {
    return { ok: false, error: extractError(err) };
  }
}

function extractError(err: unknown): string {
  const axiosErr = err as AxiosError<{ error?: string }>;
  return axiosErr.response?.data?.error ?? "Unexpected error, please try again.";
}
