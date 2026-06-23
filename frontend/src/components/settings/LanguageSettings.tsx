"use client";

import Button from "@/components/common/Button";
import { languageNames, LanguageCode } from "@/i18n/translations";
import {
  getMyLanguage,
  requestLanguageSwitch,
  verifyLanguageSwitch,
} from "@/lib/languages";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const LANGUAGE_OPTIONS: LanguageCode[] = ["en", "es", "hi", "pt", "zh", "fr"];

export default function LanguageSettings() {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>("en");
  const [selectedLanguage, setSelectedLanguage] =
    useState<LanguageCode>("en");

  const [otp, setOtp] = useState("");
  const [otpStep, setOtpStep] = useState(false);
  const [otpChannel, setOtpChannel] = useState<"email" | "phone" | "">("");

  const [loading, setLoading] = useState(true);
  const [requestLoading, setRequestLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);

  async function loadLanguage() {
    try {
      setLoading(true);

      const data = await getMyLanguage();

      setCurrentLanguage(data.preferredLanguage || "en");
      setSelectedLanguage(data.preferredLanguage || "en");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to load language settings");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLanguage();
  }, []);

  async function handleRequestOtp() {
    if (selectedLanguage === currentLanguage) {
      toast.error("This language is already selected");
      return;
    }

    try {
      setRequestLoading(true);

      const response = await requestLanguageSwitch(selectedLanguage);

      setOtpStep(true);
      setOtpChannel(response.channel || "");

      toast.success(response.message || "OTP sent successfully");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to request OTP");
    } finally {
      setRequestLoading(false);
    }
  }

  async function handleVerifyOtp() {
    if (!otp.trim()) {
      toast.error("OTP is required");
      return;
    }

    try {
      setVerifyLoading(true);

      const response = await verifyLanguageSwitch({
        language: selectedLanguage,
        otp: otp.trim(),
      });

      setCurrentLanguage(response.preferredLanguage || selectedLanguage);
      setOtp("");
      setOtpStep(false);
      setOtpChannel("");

      toast.success(response.message || "Language changed successfully");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "OTP verification failed");
    } finally {
      setVerifyLoading(false);
    }
  }

  if (loading) {
    return (
      <section className="rounded-2xl border border-slate-800 bg-slate-950 p-5 text-slate-400">
        Loading language settings...
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
      <div className="border-b border-slate-800 p-5">
        <h2 className="text-lg font-bold text-white">Language Settings</h2>
        <p className="mt-1 text-sm leading-6 text-slate-400">
          Select your preferred language. French requires email OTP. Other
          languages use mobile OTP flow.
        </p>
      </div>

      <div className="space-y-5 p-5">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-sm text-slate-400">Current Language</p>
          <p className="mt-1 font-semibold text-white">
            {languageNames[currentLanguage]}
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Choose Language
          </label>

          <select
            value={selectedLanguage}
            onChange={(event) =>
              setSelectedLanguage(event.target.value as LanguageCode)
            }
            className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none focus:border-sky-500"
          >
            {LANGUAGE_OPTIONS.map((language) => (
              <option key={language} value={language}>
                {languageNames[language]}
              </option>
            ))}
          </select>
        </div>

        {!otpStep ? (
          <Button
            type="button"
            onClick={handleRequestOtp}
            disabled={requestLoading || selectedLanguage === currentLanguage}
            className="w-full sm:w-auto"
          >
            {requestLoading ? "Sending OTP..." : "Request OTP"}
          </Button>
        ) : (
          <div className="rounded-xl border border-sky-500/30 bg-sky-500/10 p-4">
            <p className="text-sm leading-6 text-sky-200">
              OTP sent via{" "}
              <span className="font-semibold">
                {otpChannel === "email"
                  ? "registered email"
                  : "registered mobile"}
              </span>
              .
            </p>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                value={otp}
                onChange={(event) => setOtp(event.target.value)}
                placeholder="Enter OTP"
                className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-sky-500"
              />

              <Button
                type="button"
                onClick={handleVerifyOtp}
                disabled={verifyLoading}
                className="w-full sm:w-auto"
              >
                {verifyLoading ? "Verifying..." : "Verify OTP"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}