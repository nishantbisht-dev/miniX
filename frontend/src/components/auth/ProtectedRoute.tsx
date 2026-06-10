"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import Loader from "@/components/common/Loader";
export default function ProtectedRoute({ children }: { children: ReactNode }) { const { currentUser, loading } = useAuth(); const router = useRouter(); useEffect(()=>{ if(!loading && !currentUser) router.push("/login"); },[currentUser, loading, router]); if(loading || !currentUser) return <main className="min-h-screen bg-slate-950 text-white"><Loader text="Checking authentication..."/></main>; return <>{children}</>; }
