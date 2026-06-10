"use client";
import CommentCard from "@/components/posts/CommentCard";
import { createComment, listenToPostComments } from "@/lib/comments";
import { Comment } from "@/types";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
type Props={ postId: string; postOwnerId?: string };
export default function CommentsSection({ postId }: Props){ const [comments,setComments]=useState<Comment[]>([]); const [text,setText]=useState(""); const [loading,setLoading]=useState(false); useEffect(()=>listenToPostComments(postId,setComments),[postId]); async function submit(){ if(!text.trim()) return; try{setLoading(true); await createComment(postId,text); setText(""); toast.success("Comment added");}catch(e:any){toast.error(e.message||"Failed to comment");}finally{setLoading(false);} } return <section className="bg-slate-950"><div className="border-t border-slate-800 p-4"><textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Write a comment..." className="min-h-20 w-full rounded-xl border border-slate-800 bg-slate-900 p-3 outline-none focus:border-sky-500"/><button onClick={submit} disabled={loading} className="mt-3 rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold disabled:opacity-50">{loading?"Sending...":"Comment"}</button></div>{comments.map(c=><CommentCard key={c.id} comment={c}/>)}</section>; }
