"use client";
import Loader from "@/components/common/Loader";
import AppLayout from "@/components/layout/AppLayout";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfilePosts from "@/components/profile/ProfilePosts";
import { useUserProfile } from "@/hooks/useUserProfile";
export default function MyProfilePage(){ const { profile, profileLoading }=useUserProfile(); return <AppLayout>{profileLoading?<Loader text="Loading profile..."/>:profile?<><header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/90 px-5 py-4"><h1 className="text-xl font-bold">{profile.name}</h1><p className="text-sm text-slate-500">{profile.postsCount} posts</p></header><ProfileHeader profile={profile}/><ProfilePosts userId={profile.uid}/></>:<div className="p-8 text-center text-slate-400">Profile not found. Try logging in again.</div>}</AppLayout>; }
