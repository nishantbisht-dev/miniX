import { apiRequest } from "@/lib/api";

export async function toggleFollow(_followerId: string, followingId: string): Promise<"followed" | "unfollowed"> {
  const data = await apiRequest<any>(`/social/follow/${followingId}`, { method: "POST" });
  return data.following ? "followed" : "unfollowed";
}

export function listenToFollowStatus(_followerId: string, followingId: string, callback: (isFollowing: boolean) => void) {
  let active = true;
  async function load(){ try{ const data = await apiRequest<any>(`/social/follow/${followingId}/status`); if(active) callback(Boolean(data.following)); } catch { if(active) callback(false); } }
  load(); const id = setInterval(load, 5000); return () => { active=false; clearInterval(id); };
}
