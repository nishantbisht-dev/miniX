import { apiRequest } from "@/lib/api";
import { mapPost } from "@/lib/mappers";
import { Post } from "@/types";

export async function toggleBookmark(_userId: string, postId: string) { const data = await apiRequest<any>(`/social/bookmarks/${postId}`, { method: "POST" }); return data.bookmarked ? "saved" : "removed"; }
export function listenToBookmarkStatus(_userId: string, postId: string, callback: (isBookmarked: boolean) => void) { let active=true; async function load(){ try{ const data=await apiRequest<any>(`/social/bookmarks/${postId}/status`); if(active) callback(Boolean(data.bookmarked)); }catch{ if(active) callback(false);} } load(); const id=setInterval(load,5000); return()=>{active=false; clearInterval(id);}; }
export async function getBookmarkedPosts() { const data = await apiRequest<any>("/social/bookmarks"); return data.posts.map(mapPost); }
export function listenToUserBookmarks(_userId: string, callback: (posts: Post[]) => void) { let active=true; async function load(){ try{ const posts=await getBookmarkedPosts(); if(active) callback(posts);}catch(e){console.error(e); if(active) callback([]);} } load(); const id=setInterval(load,5000); return()=>{active=false; clearInterval(id);}; }
