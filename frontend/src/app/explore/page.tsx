"use client";
import EmptyState from "@/components/common/EmptyState";
import Loader from "@/components/common/Loader";
import AppLayout from "@/components/layout/AppLayout";
import UserSearchCard from "@/components/profile/UserSearchCard";
import { searchUsers } from "@/lib/users";
import { UserProfile } from "@/types";
import { Search, Users } from "lucide-react";
import { useEffect, useState } from "react";
export default function ExplorePage(){ const [q,setQ]=useState(""); const [users,setUsers]=useState<UserProfile[]>([]); const [loading,setLoading]=useState(true); useEffect(()=>{ const t=setTimeout(async()=>{try{setLoading(true); setUsers(await searchUsers(q));}catch{setUsers([])}finally{setLoading(false)}},350); return()=>clearTimeout(t);},[q]); return <AppLayout><header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/90 px-5 py-4 backdrop-blur"><h1 className="text-xl font-bold">Explore</h1><div className="relative mt-4"><Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500"/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search users..." className="w-full rounded-full border border-slate-800 bg-slate-900 py-3 pl-12 pr-4 outline-none focus:border-sky-500"/></div></header><section>{loading?<Loader text="Searching..."/>:users.length?users.map(u=><UserSearchCard key={u.uid} user={u}/>):<EmptyState icon={<Users className="h-7 w-7"/>} title="No users found" description="Try another search."/>}</section></AppLayout>; }
