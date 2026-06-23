import { apiRequest } from "@/lib/api";

export type LoginSecurityAction = "allowed" | "requires_otp" | "blocked";

export type LoginSecurityResponse = {
  success: boolean;
  action: LoginSecurityAction;
  message: string;
};

export async function checkLoginSecurity() {
  const data = await apiRequest<LoginSecurityResponse>("/login-security/check", {
    method: "POST",
  });

  return data;
}

export async function completeChromeLogin(otp: string) {
  const data = await apiRequest<LoginSecurityResponse>(
    "/login-security/complete-chrome-login",
    {
      method: "POST",
      body: JSON.stringify({ otp }),
    }
  );

  return data;
}