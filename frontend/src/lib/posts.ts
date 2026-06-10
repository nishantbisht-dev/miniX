import { apiRequest } from "@/lib/api";
import { mapPost } from "@/lib/mappers";
import { Post } from "@/types";

export async function createPost(text: string) { const data = await apiRequest<any>("/posts", { method: "POST", body: JSON.stringify({ text }) }); return mapPost(data.post); }
export async function getFeedPosts() { const data = await apiRequest<any>("/posts"); return data.posts.map(mapPost); }
export function listenToPosts(callback: (posts: Post[]) => void) { let active = true; async function load(){ try{ const posts = await getFeedPosts(); if(active) callback(posts);}catch(e){console.error(e); if(active) callback([]);} } load(); const id=setInterval(load,5000); return()=>{active=false; clearInterval(id);}; }
export async function getPostById(postId: string) { const data = await apiRequest<any>(`/posts/${postId}`); return mapPost(data.post); }
export function listenToPostById(postId: string, callback: (post: Post | null) => void) { let active=true; async function load(){ try{ const post=await getPostById(postId); if(active) callback(post);}catch{ if(active) callback(null);} } load(); const id=setInterval(load,5000); return()=>{active=false; clearInterval(id);}; }
export async function deletePost(postId: string) { await apiRequest<any>(`/posts/${postId}`, { method: "DELETE" }); }
export async function toggleLike(postId: string) { const data = await apiRequest<any>(`/posts/${postId}/like`, { method: "POST" }); return data.liked ? "liked" : "unliked"; }
export async function getLikeStatus(postId: string) { const data = await apiRequest<any>(`/posts/${postId}/like-status`); return Boolean(data.liked); }
export function listenToUserLike(postId: string, _userId: string, callback: (liked: boolean) => void) { let active=true; async function load(){ try{ const liked=await getLikeStatus(postId); if(active) callback(liked);}catch{ if(active) callback(false);} } load(); const id=setInterval(load,5000); return()=>{active=false; clearInterval(id);}; }
export function listenToUserPosts(userId: string, callback: (posts: Post[]) => void) { let active=true; async function load(){ try{ const data=await apiRequest<any>(`/posts/user/${userId}`); if(active) callback(data.posts.map(mapPost)); }catch(e){console.error(e); if(active) callback([]);} } load(); const id=setInterval(load,5000); return()=>{active=false; clearInterval(id);}; }
