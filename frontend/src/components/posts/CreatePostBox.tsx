"use client";
import Button from "@/components/common/Button";
import { useUserProfile } from "@/hooks/useUserProfile";
import { createPost } from "@/lib/posts";
import { useState } from "react";
import toast from "react-hot-toast";
export default function CreatePostBox(){ const { profile } = useUserProfile(); const [text,setText]=useState(""); const [loading,setLoading]=useState(false); async function submit(){ if(!text.trim()) return toast.error("Write something first"); try{setLoading(true); await createPost(text); setText(""); toast.success("Post created");}catch(e:any){toast.error(e.message||"Failed to post");}finally{setLoading(false);} } return <section className="border-b border-slate-800 p-5"><div className="flex gap-4"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sky-500 font-bold">{profile?.name?.[0]?.toUpperCase() || "U"}</div><div className="flex-1"><textarea value={text} onChange={e=>setText(e.target.value)} placeholder="What is happening?" maxLength={280} className="min-h-24 w-full bg-transparent text-lg outline-none placeholder:text-slate-500"/><div className="flex items-center justify-between border-t border-slate-800 pt-4"><span className="text-sm text-slate-500">{text.length}/280</span><Button onClick={submit} disabled={loading}>{loading?"Posting...":"Post"}</Button></div></div></div></section>; }
