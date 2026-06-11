"use client";

import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import { updateUserProfile } from "@/lib/users";
import { UserProfile } from "@/types";
import { requestBrowserNotificationPermission } from "@/utils/browserNotification";
import { useState } from "react";
import toast from "react-hot-toast";

/*
  EditProfileForm updates the logged-in user's MongoDB profile.

  In this task, we also added:
  - browser notification enable/disable preference
*/

type EditProfileFormProps = {
  profile: UserProfile;
  onProfileUpdated?: (profile: UserProfile) => void;
};

export default function EditProfileForm({
  profile,
  onProfileUpdated,
}: EditProfileFormProps) {
  const [name, setName] = useState(profile.name);
  const [username, setUsername] = useState(profile.username);
  const [bio, setBio] = useState(profile.bio);

  const [browserNotificationsEnabled, setBrowserNotificationsEnabled] =
    useState(profile.browserNotificationsEnabled);

  const [loading, setLoading] = useState(false);

  async function handleNotificationToggle(value: boolean) {
    /*
      If user is enabling notifications, first ask browser permission.
    */
    if (value) {
      const permission = await requestBrowserNotificationPermission();

      if (permission === "unsupported") {
        toast.error("Browser notifications are not supported in this browser");
        return;
      }

      if (permission !== "granted") {
        toast.error("Please allow browser notification permission");
        return;
      }
    }

    setBrowserNotificationsEnabled(value);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setLoading(true);

      const updatedProfile = await updateUserProfile({
        uid: profile.uid,
        name,
        username,
        bio,
        browserNotificationsEnabled,
      });

      toast.success("Profile updated successfully");

      if (onProfileUpdated) {
        onProfileUpdated(updatedProfile);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 p-5">
      <Input
        label="Name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Enter your name"
      />

      <Input
        label="Username"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
        placeholder="Enter your username"
      />

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">
          Bio
        </label>

        <textarea
          value={bio}
          onChange={(event) => setBio(event.target.value)}
          placeholder="Tell something about yourself"
          rows={4}
          className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-sky-500"
        />
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-semibold text-white">
              Browser keyword notifications
            </h3>

            <p className="mt-1 text-sm leading-6 text-slate-400">
              Show browser popup notifications when a tweet contains keywords
              like cricket or science.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              handleNotificationToggle(!browserNotificationsEnabled)
            }
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              browserNotificationsEnabled
                ? "bg-sky-500 text-white hover:bg-sky-400"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            {browserNotificationsEnabled ? "Enabled" : "Disabled"}
          </button>
        </div>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save changes"}
      </Button>
    </form>
  );
}