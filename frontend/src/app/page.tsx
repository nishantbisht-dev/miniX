"use client";

import EmptyState from "@/components/common/EmptyState";
import Loader from "@/components/common/Loader";
import AppLayout from "@/components/layout/AppLayout";
import AudioTweetBox from "@/components/posts/AudioTweetBox";
import CreatePostBox from "@/components/posts/CreatePostBox";
import FeedHeader from "@/components/posts/FeedHeader";
import PostCard from "@/components/posts/PostCard";
import { listenToPosts } from "@/lib/posts";
import type { Post } from "@/types";
import { MessageSquareText } from "lucide-react";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = listenToPosts((latestPosts: Post[]) => {
      setPosts(latestPosts);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AppLayout>
      <FeedHeader />

      <div className="pb-24 xl:pb-0">
        <CreatePostBox />

        <AudioTweetBox />

        <section>
          {loading ? (
            <Loader text="Loading posts..." />
          ) : posts.length > 0 ? (
            posts.map((post) => <PostCard key={post.id} post={post} />)
          ) : (
            <EmptyState
              icon={<MessageSquareText className="h-7 w-7" />}
              title="No posts yet"
              description="Be the first to post something on miniX."
            />
          )}
        </section>
      </div>
    </AppLayout>
  );
}