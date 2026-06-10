"use client";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Sidebar from "@/components/layout/Sidebar";
import RightSidebar from "@/components/layout/RightSidebar";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import { ReactNode } from "react";
export default function AppLayout({ children }: { children: ReactNode }) { return <ProtectedRoute><main className="min-h-screen bg-slate-950 text-white"><div className="mx-auto grid max-w-7xl grid-cols-1 md:grid-cols-[260px_minmax(0,650px)] lg:grid-cols-[260px_minmax(0,650px)_320px]"><Sidebar/><section className="min-h-screen border-x border-slate-800 pb-20 md:pb-0">{children}</section><RightSidebar/></div><MobileBottomNav/></main></ProtectedRoute>; }
