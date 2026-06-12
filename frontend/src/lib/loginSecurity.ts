import { apiRequest } from "@/lib/api";

export type LoginSecurityAction = "allowed" | "requires_otp" | "blocked";

export type LoginSecurityResponse = {
  success: boolean;
  action: LoginSecurityAction;
  message: string;
};

/*
  Called after Firebase login succeeds.

  Backend checks:
  - browser
  - device
  - IP
  - login rules
*/
export async function checkLoginSecurity() {
  const data = await apiRequest<LoginSecurityResponse>("/login-security/check", {
    method: "POST",
  });

  return data;
}

/*
  Called when Chrome user enters OTP.

  Backend verifies OTP and saves login history.
*/
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