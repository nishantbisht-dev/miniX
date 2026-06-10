"use client";
import EmptyState from "@/components/common/EmptyState";
import Loader from "@/components/common/Loader";
import PostCard from "@/components/posts/PostCard";
import { listenToUserPosts } from "@/lib/posts";
import { Post } from "@/types";
import { MessageSquareText } from "lucide-react";
import { useEffect, useState } from "react";
export default function ProfilePosts({ userId }: { userId: string }){ const [posts,setPosts]=useState<Post[]>([]); const [loading,setLoading]=useState(true); useEffect(()=>listenToUserPosts(userId,(p)=>{setPosts(p); setLoading(false);}),[userId]); if(loading)return <Loader text="Loading posts..."/>; if(!posts.length)return <EmptyState icon={<MessageSquareText className="h-7 w-7"/>} title="No posts yet" description="Posts will appear here."/>; return <section>{posts.map(p=><PostCard key={p.id} post={p}/>)}</section>; }
