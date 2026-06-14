"use client";

import EditProfileForm from "@/components/profile/EditProfileForm";
import LoginHistoryList from "@/components/profile/LoginHistoryList";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Loader2 } from "lucide-react";

export default function SettingsPage() {
  const { profile, profileLoading } = useUserProfile();

  if (profileLoading) {
    return (
      <div className="border-b border-slate-800 p-8 text-white">
        <div className="flex items-center gap-2 text-slate-400">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading settings...
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="border-b border-slate-800 p-8 text-white">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="mt-2 text-slate-400">
          Please login again to view your settings.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      <div className="border-b border-slate-800 p-5">
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <div className="space-y-6 p-5">
        <section className="rounded-2xl border border-slate-800 bg-slate-950">
          <EditProfileForm profile={profile} />
        </section>

        <LoginHistoryList />
      </div>
    </div>
  );
}