"use client";
import EmptyState from "@/components/common/EmptyState";
import Loader from "@/components/common/Loader";
import AppLayout from "@/components/layout/AppLayout";
import CommentsSection from "@/components/posts/CommentsSection";
import PostCard from "@/components/posts/PostCard";
import { listenToPostById } from "@/lib/posts";
import { Post } from "@/types";
import { ArrowLeft, MessageSquareX } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
export default function PostDetailPage(){ const router=useRouter(); const { id }=useParams<{id:string}>(); const [post,setPost]=useState<Post|null>(null); const [loading,setLoading]=useState(true); useEffect(()=>listenToPostById(id,(p)=>{setPost(p); setLoading(false);}),[id]); return <AppLayout><header className="sticky top-0 z-40 flex items-center gap-4 border-b border-slate-800 bg-slate-950/90 px-5 py-4"><button onClick={()=>router.back()}><ArrowLeft className="h-5 w-5"/></button><h1 className="text-xl font-bold">Post</h1></header>{loading?<Loader text="Loading post..."/>:post?<><PostCard post={post}/><div className="border-b border-slate-800 px-5 py-4"><h2 className="font-bold">Comments</h2></div><CommentsSection postId={post.id} postOwnerId={post.userId}/></>:<EmptyState icon={<MessageSquareX className="h-7 w-7"/>} title="Post not found" description="This post was deleted or link is wrong."/>}</AppLayout>; }
