"use client";
import EmptyState from "@/components/common/EmptyState";
import Loader from "@/components/common/Loader";
import AppLayout from "@/components/layout/AppLayout";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfilePosts from "@/components/profile/ProfilePosts";
import { listenToUserProfileByUsername } from "@/lib/users";
import { UserProfile } from "@/types";
import { ArrowLeft, UserX } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
export default function PublicProfilePage(){ const router=useRouter(); const { username }=useParams<{username:string}>(); const [profile,setProfile]=useState<UserProfile|null>(null); const [loading,setLoading]=useState(true); useEffect(()=>listenToUserProfileByUsername(username,(p)=>{setProfile(p); setLoading(false);}),[username]); return <AppLayout><header className="sticky top-0 z-40 flex items-center gap-4 border-b border-slate-800 bg-slate-950/90 px-5 py-4"><button onClick={()=>router.back()}><ArrowLeft className="h-5 w-5"/></button><div><h1 className="text-xl font-bold">{profile?.name||"Profile"}</h1>{profile&&<p className="text-sm text-slate-500">{profile.postsCount} posts</p>}</div></header>{loading?<Loader text="Loading profile..."/>:profile?<><ProfileHeader profile={profile}/><ProfilePosts userId={profile.uid}/></>:<EmptyState icon={<UserX className="h-7 w-7"/>} title="User not found" description="This profile does not exist."/>}</AppLayout>; }
