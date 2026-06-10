"use client";
import { useAuth } from "@/context/AuthContext";
import { getCurrentUserProfile } from "@/lib/users";
import { UserProfile } from "@/types";
import { useEffect, useState } from "react";

export function useUserProfile() {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  useEffect(() => { let active=true; async function load(){ if(!currentUser){ setProfile(null); setProfileLoading(false); return; } try{ setProfileLoading(true); const p=await getCurrentUserProfile(); if(active) setProfile(p); }catch(e){ console.error(e); if(active) setProfile(null); } finally{ if(active) setProfileLoading(false); } } load(); return()=>{active=false}; }, [currentUser]);
  return { profile, profileLoading };
}
