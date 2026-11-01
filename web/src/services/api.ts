import type { Topic, Capsule, CheckAttempt, StreakState } from "../types/domain.ts";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new ApiError(response.status, `Error en petición: ${response.statusText}`);
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new Error(`No se pudo conectar con el servidor en ${url}`);
  }
}

export const apiService = {
  checkHealth: () => request<{ status: string }>("/api/health"),
  getTopics: () => request<Topic[]>("/api/topics"),
  getCapsule: (id: string) => request<Capsule>(`/api/capsules/${id}`),
  submitCheckAttempt: (capsuleId: string, checkId: string, selectedOptionId: string) =>
    request<CheckAttempt>(`/api/capsules/${capsuleId}/checks/${checkId}/attempts`, {
      method: "POST",
      body: JSON.stringify({ selectedOptionId }),
    }),
  getStreak: () => request<StreakState>("/api/profile/streak"),
  completeCapsule: (capsuleId: string) =>
    request<StreakState>("/api/progress/complete-capsule", {
      method: "POST",
      body: JSON.stringify({ capsuleId }),
    }),
};
