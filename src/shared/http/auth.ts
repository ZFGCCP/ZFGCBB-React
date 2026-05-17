import { getApiBaseUrl } from "./api";
import { apiFetch } from "./apiFetch";

export async function logoutRequest(): Promise<void> {
  await apiFetch(`${getApiBaseUrl()}/users/auth/logout`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  }).catch(() => {});
}
