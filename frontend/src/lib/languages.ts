import { apiRequest } from "@/lib/api";
import { LanguageCode } from "@/i18n/translations";

export async function getMyLanguage() {
  const data = await apiRequest<any>("/languages/me");

  return data;
}

export async function requestLanguageSwitch(language: LanguageCode) {
  const data = await apiRequest<any>("/languages/request-switch", {
    method: "POST",
    body: JSON.stringify({ language }),
  });

  return data;
}

export async function verifyLanguageSwitch({
  language,
  otp,
}: {
  language: LanguageCode;
  otp: string;
}) {
  const data = await apiRequest<any>("/languages/verify-switch", {
    method: "POST",
    body: JSON.stringify({ language, otp }),
  });

  return data;
}