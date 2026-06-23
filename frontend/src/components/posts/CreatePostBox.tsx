"use client";

import Button from "@/components/common/Button";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useTranslation } from "@/hooks/useTranslation";
import { createPost } from "@/lib/posts";
import {
  containsNotificationKeyword,
  showKeywordBrowserNotification,
} from "@/utils/browserNotification";
import { ImageIcon, Smile } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function CreatePostBox() {
  const { profile, profileLoading } = useUserProfile();
  const { t } = useTranslation();

  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const charactersLeft = 280 - text.length;

  async function handleCreatePost() {
    if (!text.trim()) {
      toast.error("Post cannot be empty");
      return;
    }

    if (text.length > 280) {
      toast.error("Post cannot be more than 280 characters");
      return;
    }

    if (!profile) {
      toast.error("User profile not loaded");
      return;
    }

    try {
      setLoading(true);

      await createPost(text.trim());

      /*
        Browser Notification API task:
        If notification preference is enabled and tweet contains
        "cricket" or "science", show popup notification.
      */
      if (
        profile.browserNotificationsEnabled &&
        containsNotificationKeyword(text)
      ) {
        showKeywordBrowserNotification(text);
      }

      setText("");
      toast.success("Post created");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="border-b border-slate-800 p-5">
      <div className="flex gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-sky-500 font-bold text-white">
          {profile?.photoURL ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.photoURL}
              alt={profile.name}
              className="h-full w-full object-cover"
            />
          ) : (
            profile?.name?.charAt(0).toUpperCase() || "U"
          )}
        </div>

        <div className="flex-1">
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder={
              profileLoading ? "Loading profile..." : t("whatIsHappening")
            }
            disabled={profileLoading || loading}
            rows={3}
            className="w-full resize-none bg-transparent text-lg text-white outline-none placeholder:text-slate-500 disabled:cursor-not-allowed"
          />

          <div className="mt-4 flex items-center justify-between border-t border-slate-800 pt-4">
            <div className="flex items-center gap-4 text-sky-400">
              <button
                type="button"
                className="rounded-full p-2 transition hover:bg-sky-500/10"
                title="Image upload coming soon"
              >
                <ImageIcon className="h-5 w-5" />
              </button>

              <button
                type="button"
                className="rounded-full p-2 transition hover:bg-sky-500/10"
                title="Emoji picker coming soon"
              >
                <Smile className="h-5 w-5" />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <span
                className={`text-sm ${
                  charactersLeft < 0 ? "text-red-400" : "text-slate-500"
                }`}
              >
                {charactersLeft}
              </span>

              <Button
                type="button"
                onClick={handleCreatePost}
                disabled={
                  loading ||
                  profileLoading ||
                  !text.trim() ||
                  charactersLeft < 0
                }
              >
                {loading ? "Posting..." : t("post")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}