import { apiRequest } from "@/lib/api";

export type LoginHistoryItem = {
  _id: string;
  browser: string;
  os: string;
  device: "desktop" | "mobile" | "tablet" | "unknown";
  ipAddress: string;
  status: "success" | "blocked";
  createdAt: string;
};

/*
  Save login history after user logs in.
*/
export async function saveLoginHistory() {
  const data = await apiRequest<any>("/login-history", {
    method: "POST",
  });

  return data.history;
}

/*
  Get current user's login history.
*/
export async function getMyLoginHistory() {
  const data = await apiRequest<any>("/login-history/me");

  return data.history as LoginHistoryItem[];
}