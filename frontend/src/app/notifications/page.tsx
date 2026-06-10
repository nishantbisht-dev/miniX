"use client";
import EmptyState from "@/components/common/EmptyState";
import Loader from "@/components/common/Loader";
import AppLayout from "@/components/layout/AppLayout";
import NotificationCard from "@/components/notifications/NotificationCard";
import { useAuth } from "@/context/AuthContext";
import { listenToNotifications, markAllNotificationsAsRead } from "@/lib/notifications";
import { Notification } from "@/types";
import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
export default function NotificationsPage(){ const { currentUser }=useAuth(); const [items,setItems]=useState<Notification[]>([]); const [loading,setLoading]=useState(true); const unread=items.filter(i=>!i.read).length; useEffect(()=>{ if(!currentUser)return; return listenToNotifications(currentUser.uid,(n)=>{setItems(n); setLoading(false);});},[currentUser]); async function mark(){ try{await markAllNotificationsAsRead(items); toast.success("Marked read");}catch(e:any){toast.error(e.message||"Failed");} } return <AppLayout><header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-800 bg-slate-950/90 px-5 py-4"><div><h1 className="text-xl font-bold">Notifications</h1><p className="text-sm text-slate-500">{unread} unread</p></div><button onClick={mark} disabled={!unread} className="rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold disabled:opacity-50">Mark all read</button></header>{loading?<Loader text="Loading notifications..."/>:items.length?items.map(n=><NotificationCard key={n.id} notification={n}/>):<EmptyState icon={<Bell className="h-7 w-7"/>} title="No notifications" description="Likes, comments and follows show here."/>}</AppLayout>; }
