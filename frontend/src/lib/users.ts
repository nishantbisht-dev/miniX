import { apiRequest } from "@/lib/api";
import { mapUser } from "@/lib/mappers";
import { UserProfile } from "@/types";

export async function syncCurrentUser(username?: string) {
  const data = await apiRequest<any>("/users/sync", { method: "POST", body: JSON.stringify({ username }) });
  return mapUser(data.user);
}

export async function getCurrentUserProfile() {
  const data = await apiRequest<any>("/users/me");
  return mapUser(data.user);
}

export async function updateUserProfile({ name, username, bio }: { uid?: string; name: string; username: string; bio: string }) {
  const data = await apiRequest<any>("/users/me", { method: "PATCH", body: JSON.stringify({ name, username, bio }) });
  return mapUser(data.user);
}

export async function getUserProfileByUsername(username: string) {
  const data = await apiRequest<any>(`/users/${username}`);
  return mapUser(data.user);
}

export function listenToUserProfileByUsername(username: string, callback: (profile: UserProfile | null) => void) {
  let active = true;
  async function load() { try { const profile = await getUserProfileByUsername(username); if (active) callback(profile); } catch { if (active) callback(null); } }
  load(); const id = setInterval(load, 5000);
  return () => { active = false; clearInterval(id); };
}

export async function searchUsers(searchText: string) {
  const data = await apiRequest<any>(`/users/search?query=${encodeURIComponent(searchText)}`);
  return data.users.map(mapUser);
}

export function getProfileInitialValues(profile: UserProfile) {
  return { name: profile.name || "", username: profile.username || "", bio: profile.bio || "" };
}
