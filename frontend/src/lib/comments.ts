import { apiRequest } from "@/lib/api";
import { mapComment } from "@/lib/mappers";
import { Comment } from "@/types";

export async function createComment(postId: string, text: string) {
  const data = await apiRequest<any>(`/posts/${postId}/comments`, { method: "POST", body: JSON.stringify({ text }) });
  return mapComment(data.comment);
}

export function listenToPostComments(postId: string, callback: (comments: Comment[]) => void) {
  let active = true;
  async function load(){ try{ const data = await apiRequest<any>(`/posts/${postId}/comments`); if(active) callback(data.comments.map(mapComment)); } catch(e){ console.error(e); if(active) callback([]); } }
  load(); const id = setInterval(load, 5000); return () => { active=false; clearInterval(id); };
}
