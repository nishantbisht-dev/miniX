"use client";

import { translations, LanguageCode } from "@/i18n/translations";
import { useUserProfile } from "@/hooks/useUserProfile";

export function useTranslation() {
  const { profile } = useUserProfile();

  const language = (profile?.preferredLanguage || "en") as LanguageCode;

  function t(key: string) {
    return translations[language]?.[key] || translations.en[key] || key;
  }

  return {
    t,
    language,
  };
}