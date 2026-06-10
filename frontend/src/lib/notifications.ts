import { apiRequest } from "@/lib/api";
import { mapNotification } from "@/lib/mappers";
import { Notification } from "@/types";

export function listenToNotifications(_userId: string, callback: (notifications: Notification[]) => void) { let active=true; async function load(){ try{ const data=await apiRequest<any>("/notifications"); if(active) callback(data.notifications.map(mapNotification)); }catch(e){console.error(e); if(active) callback([]);} } load(); const id=setInterval(load,5000); return()=>{active=false; clearInterval(id);}; }
export async function markNotificationAsRead(notificationId: string) { await apiRequest<any>(`/notifications/${notificationId}/read`, { method: "PATCH" }); }
export async function markAllNotificationsAsRead(_notifications: Notification[]) { await apiRequest<any>("/notifications/read-all", { method: "PATCH" }); }
