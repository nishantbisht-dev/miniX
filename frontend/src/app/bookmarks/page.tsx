"use client";
import EmptyState from "@/components/common/EmptyState";
import Loader from "@/components/common/Loader";
import AppLayout from "@/components/layout/AppLayout";
import PostCard from "@/components/posts/PostCard";
import { useAuth } from "@/context/AuthContext";
import { listenToUserBookmarks } from "@/lib/bookmarks";
import { Post } from "@/types";
import { Bookmark } from "lucide-react";
import { useEffect, useState } from "react";
export default function BookmarksPage(){ const { currentUser }=useAuth(); const [posts,setPosts]=useState<Post[]>([]); const [loading,setLoading]=useState(true); useEffect(()=>{ if(!currentUser)return; return listenToUserBookmarks(currentUser.uid,(p)=>{setPosts(p); setLoading(false);});},[currentUser]); return <AppLayout><header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/90 px-5 py-4"><h1 className="text-xl font-bold">Bookmarks</h1></header>{loading?<Loader text="Loading bookmarks..."/>:posts.length?posts.map(p=><PostCard key={p.id} post={p}/>):<EmptyState icon={<Bookmark className="h-7 w-7"/>} title="No bookmarks yet" description="Saved posts appear here."/>}</AppLayout>; }
