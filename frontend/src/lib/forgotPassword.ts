import { apiRequest } from "@/lib/api";

export async function forgotPassword(identifier: string) {
  const data = await apiRequest<any>("/forgot-password", {
    method: "POST",
    body: JSON.stringify({ identifier }),
  });

  return data;
}