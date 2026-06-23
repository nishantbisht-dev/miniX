"use client";

import AppLayout from "@/components/layout/AppLayout";
import EditProfileForm from "@/components/profile/EditProfileForm";
import LoginHistoryList from "@/components/profile/LoginHistoryList";
import LanguageSettings from "@/components/settings/LanguageSettings";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Loader2, Settings } from "lucide-react";

export default function SettingsPage() {
  const { profile, profileLoading } = useUserProfile();

  return (
    <AppLayout>
      <div className="min-h-screen pb-24 xl:pb-0">
        <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/95 px-4 py-4 backdrop-blur sm:px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-sky-400">
              <Settings className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <h1 className="text-xl font-black text-white sm:text-2xl">
                Settings
              </h1>
              <p className="mt-1 text-sm leading-5 text-slate-500">
                Manage your profile, language, notifications, and login history.
              </p>
            </div>
          </div>
        </header>

        {profileLoading ? (
          <div className="p-4 sm:p-5">
            <div className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/40 p-5 text-slate-400">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Loading settings...</span>
            </div>
          </div>
        ) : !profile ? (
          <div className="p-4 sm:p-5">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
              <h2 className="text-lg font-bold text-white">
                Profile not found
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Please logout and login again to reload your profile settings.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-5 p-4 sm:p-5">
            <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
              <EditProfileForm profile={profile} />
            </section>

            <LanguageSettings />

            <LoginHistoryList />
          </div>
        )}
      </div>
    </AppLayout>
  );
}