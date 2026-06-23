"use client";

import CommentsSection from "@/components/posts/CommentsSection";
import { useAuth } from "@/context/AuthContext";
import { listenToBookmarkStatus, toggleBookmark } from "@/lib/bookmarks";
import { deletePost, listenToUserLike, toggleLike } from "@/lib/posts";
import { Post } from "@/types";
import { formatRelativeTime } from "@/utils/date";
import {
  Bookmark,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Music,
  Repeat2,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

/*
  PostCard shows a single post.

  It supports:
  - normal text posts
  - audio tweets
  - likes
  - comments
  - bookmarks
  - delete own post
*/

export default function PostCard({ post }: { post: Post }) {
  const { currentUser } = useAuth();

  const [showMenu, setShowMenu] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const isOwner = currentUser?.uid === post.firebaseUid;

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    return listenToUserLike(post.id, currentUser.uid, setIsLiked);
  }, [post.id, currentUser]);

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    return listenToBookmarkStatus(currentUser.uid, post.id, setIsBookmarked);
  }, [post.id, currentUser]);

  async function handleLike() {
    try {
      await toggleLike(post.id);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Like failed");
    }
  }

  async function handleBookmark() {
    if (!currentUser) {
      toast.error("Please login first");
      return;
    }

    try {
      const result = await toggleBookmark(currentUser.uid, post.id);

      toast.success(
        result === "saved" ? "Post saved" : "Removed from bookmarks"
      );
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Bookmark failed");
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this post?")) {
      return;
    }

    try {
      await deletePost(post.id);
      toast.success("Post deleted");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Delete failed");
    }
  }

  const authorInitial = post.authorName
    ? post.authorName.charAt(0).toUpperCase()
    : "U";

  return (
    <article className="border-b border-slate-800 transition hover:bg-slate-900/30">
      <div className="p-5">
        <div className="flex gap-4">
          <Link
            href={`/profile/${post.authorUsername}`}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-700 font-bold text-white"
          >
            {post.authorPhotoURL ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={post.authorPhotoURL}
                alt={post.authorName}
                className="h-11 w-11 rounded-full object-cover"
              />
            ) : (
              authorInitial
            )}
          </Link>

          <div className="min-w-0 flex-1">
            <div className="flex justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="flex flex-wrap items-center gap-x-1">
                  <Link
                    href={`/profile/${post.authorUsername}`}
                    className="font-semibold text-white hover:underline"
                  >
                    {post.authorName}
                  </Link>

                  <Link
                    href={`/profile/${post.authorUsername}`}
                    className="text-sm text-slate-500 hover:underline"
                  >
                    @{post.authorUsername}
                  </Link>

                  <span className="text-sm text-slate-500">·</span>

                  <span className="text-sm text-slate-500">
                    {formatRelativeTime(post.createdAt)}
                  </span>
                </p>

                {post.text && (
                  <Link href={`/post/${post.id}`}>
                    <p className="mt-2 whitespace-pre-wrap break-words leading-7 text-slate-100 hover:text-slate-300">
                      {post.text}
                    </p>
                  </Link>
                )}

                {post.imageURL && (
                  <div className="mt-4 overflow-hidden rounded-2xl border border-slate-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.imageURL}
                      alt="Post image"
                      className="max-h-[520px] w-full object-cover"
                    />
                  </div>
                )}

                {post.type === "audio" && post.audioUrl && (
                  <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950 p-4">
                    <div className="mb-3 flex items-center gap-2 text-sky-400">
                      <Music className="h-5 w-5" />
                      <p className="text-sm font-semibold">
                        Audio Tweet
                        {post.audioDuration
                          ? ` • ${Math.round(post.audioDuration)} sec`
                          : ""}
                      </p>
                    </div>

                    <audio controls src={post.audioUrl} className="w-full" />

                    {post.audioSize ? (
                      <p className="mt-2 text-xs text-slate-500">
                        Size: {(post.audioSize / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    ) : null}
                  </div>
                )}
              </div>

              {isOwner && (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowMenu((previous) => !previous)}
                    className="rounded-full p-2 text-slate-500 transition hover:bg-slate-800 hover:text-white"
                  >
                    <MoreHorizontal className="h-5 w-5" />
                  </button>

                  {showMenu && (
                    <div className="absolute right-0 top-10 z-20 w-44 rounded-xl border border-slate-800 bg-slate-950 p-2 shadow-xl">
                      <button
                        type="button"
                        onClick={handleDelete}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-400 transition hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete post
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mt-4 flex max-w-md items-center justify-between text-slate-500">
              <button
                type="button"
                onClick={() => setShowComments((previous) => !previous)}
                className={`flex items-center gap-2 transition ${
                  showComments ? "text-sky-400" : "hover:text-sky-400"
                }`}
              >
                <MessageCircle className="h-5 w-5" />
                <span className="text-sm">{post.commentsCount}</span>
              </button>

              <button
                type="button"
                className="flex items-center gap-2 transition hover:text-emerald-400"
              >
                <Repeat2 className="h-5 w-5" />
                <span className="text-sm">{post.repostsCount}</span>
              </button>

              <button
                type="button"
                onClick={handleLike}
                className={`flex items-center gap-2 transition ${
                  isLiked ? "text-pink-500" : "hover:text-pink-400"
                }`}
              >
                <Heart
                  className="h-5 w-5"
                  fill={isLiked ? "currentColor" : "none"}
                />
                <span className="text-sm">{post.likesCount}</span>
              </button>

              <button
                type="button"
                onClick={handleBookmark}
                className={`transition ${
                  isBookmarked ? "text-sky-400" : "hover:text-sky-400"
                }`}
              >
                <Bookmark
                  className="h-5 w-5"
                  fill={isBookmarked ? "currentColor" : "none"}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {showComments && (
        <CommentsSection postId={post.id} postOwnerId={post.userId} />
      )}
    </article>
  );
}