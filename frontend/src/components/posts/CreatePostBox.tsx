"use client";

import Button from "@/components/common/Button";
import { useUserProfile } from "@/hooks/useUserProfile";
import { createPost } from "@/lib/posts";
import {
  containsNotificationKeyword,
  showKeywordBrowserNotification,
} from "@/utils/browserNotification";
import { ImageIcon, Smile } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

/*
  CreatePostBox lets logged-in users create a new text post.

  Task 1 addition:
  After creating a post, if text contains "cricket" or "science",
  and user has enabled browser notifications,
  we show a browser popup notification with full tweet content.
*/

export default function CreatePostBox() {
  const { profile, profileLoading } = useUserProfile();

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

      await createPost(text);

      /*
        Browser Notification API task.

        Conditions:
        1. User preference must be enabled
        2. Tweet must contain "cricket" or "science"
        3. Browser notification permission must already be granted
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
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sky-500 font-bold text-white">
          {profile?.name?.charAt(0).toUpperCase() || "U"}
        </div>

        <div className="flex-1">
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder={
              profileLoading ? "Loading profile..." : "What is happening?"
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
              >
                <ImageIcon className="h-5 w-5" />
              </button>

              <button
                type="button"
                className="rounded-full p-2 transition hover:bg-sky-500/10"
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
                disabled={loading || profileLoading || !text.trim()}
              >
                {loading ? "Posting..." : "Post"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}