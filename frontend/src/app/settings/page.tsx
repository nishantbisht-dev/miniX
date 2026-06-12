"use client";

import EditProfileForm from "@/components/profile/EditProfileForm";
import LoginHistoryList from "@/components/profile/LoginHistoryList";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Loader2 } from "lucide-react";

export default function SettingsPage() {
  const { profile, profileLoading } = useUserProfile();

  if (profileLoading) {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-8 text-white">
        <div className="mx-auto flex max-w-3xl items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 p-10">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Loading settings...
        </div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-8 text-white">
        <div className="mx-auto max-w-3xl rounded-2xl border border-slate-800 bg-slate-900 p-6 text-center">
          <h1 className="text-xl font-bold">Profile not found</h1>
          <p className="mt-2 text-slate-400">
            Please login again to view your settings.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white">
      <div className="mx-auto max-w-3xl space-y-6">
        <section className="rounded-2xl border border-slate-800 bg-slate-900">
          <div className="border-b border-slate-800 p-5">
            <h1 className="text-2xl font-bold text-white">Settings</h1>
            <p className="mt-1 text-sm text-slate-400">
              Manage your profile, notification preferences, and account
              activity.
            </p>
          </div>

          <EditProfileForm profile={profile} />
        </section>

        <LoginHistoryList />
      </div>
    </main>
  );
}