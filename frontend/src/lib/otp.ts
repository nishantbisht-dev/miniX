import { apiRequest } from "@/lib/api";

/*
  OTP frontend API helpers.

  These functions call Express backend.
*/

export async function sendOtp(purpose: string) {
  const data = await apiRequest<any>("/otp/send", {
    method: "POST",
    body: JSON.stringify({ purpose }),
  });

  return data;
}

export async function verifyOtp(purpose: string, otp: string) {
  const data = await apiRequest<any>("/otp/verify", {
    method: "POST",
    body: JSON.stringify({ purpose, otp }),
  });

  return data;
}

export async function checkOtpStatus(purpose: string) {
  const data = await apiRequest<any>(`/otp/status/${purpose}`);

  return Boolean(data.verified);
}