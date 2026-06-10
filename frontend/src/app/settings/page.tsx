"use client";
import Loader from "@/components/common/Loader";
import AppLayout from "@/components/layout/AppLayout";
import EditProfileForm from "@/components/profile/EditProfileForm";
import { useUserProfile } from "@/hooks/useUserProfile";
export default function SettingsPage(){ const { profile, profileLoading }=useUserProfile(); return <AppLayout><header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/90 px-5 py-4"><h1 className="text-xl font-bold">Settings</h1></header>{profileLoading?<Loader text="Loading settings..."/>:profile?<EditProfileForm profile={profile}/>:<div className="p-8 text-center text-slate-400">Profile not found.</div>}</AppLayout>; }
