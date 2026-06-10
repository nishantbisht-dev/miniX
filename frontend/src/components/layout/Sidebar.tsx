"use client";
import { useAuth } from "@/context/AuthContext";
import { APP_NAME } from "@/constants/app";
import { Bell, Bookmark, Compass, Home, LogOut, Settings, User } from "lucide-react";
import Link from "next/link";
const nav=[{href:"/feed",label:"Feed",icon:Home},{href:"/explore",label:"Explore",icon:Compass},{href:"/notifications",label:"Notifications",icon:Bell},{href:"/bookmarks",label:"Bookmarks",icon:Bookmark},{href:"/profile",label:"Profile",icon:User},{href:"/settings",label:"Settings",icon:Settings}];
export default function Sidebar(){ const { logout } = useAuth(); return <aside className="sticky top-0 hidden h-screen p-5 md:block"><Link href="/feed" className="text-3xl font-black text-sky-400">{APP_NAME}</Link><nav className="mt-8 space-y-2">{nav.map(item=>{const Icon=item.icon;return <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-full px-4 py-3 text-lg transition hover:bg-slate-900"><Icon className="h-5 w-5"/>{item.label}</Link>})}</nav><button onClick={logout} className="mt-8 flex items-center gap-3 rounded-full px-4 py-3 text-red-400 transition hover:bg-red-500/10"><LogOut className="h-5 w-5"/>Logout</button></aside>; }
