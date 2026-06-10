"use client";
import EmptyState from "@/components/common/EmptyState";
import Loader from "@/components/common/Loader";
import AppLayout from "@/components/layout/AppLayout";
import CreatePostBox from "@/components/posts/CreatePostBox";
import FeedHeader from "@/components/posts/FeedHeader";
import PostCard from "@/components/posts/PostCard";
import { listenToPosts } from "@/lib/posts";
import { Post } from "@/types";
import { MessageSquareText } from "lucide-react";
import { useEffect, useState } from "react";
export default function FeedPage(){ const [posts,setPosts]=useState<Post[]>([]); const [loading,setLoading]=useState(true); useEffect(()=>listenToPosts((p)=>{setPosts(p); setLoading(false);}),[]); return <AppLayout><FeedHeader/><CreatePostBox/><section>{loading?<Loader text="Loading posts..."/>:posts.length?posts.map(p=><PostCard key={p.id} post={p}/>):<EmptyState icon={<MessageSquareText className="h-7 w-7"/>} title="No posts yet" description="Be the first to post."/>}</section></AppLayout>; }
