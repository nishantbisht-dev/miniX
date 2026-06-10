import { Bell, Bookmark, Compass, Home, User } from "lucide-react";
import Link from "next/link";
const nav=[{href:"/feed",icon:Home},{href:"/explore",icon:Compass},{href:"/notifications",icon:Bell},{href:"/bookmarks",icon:Bookmark},{href:"/profile",icon:User}];
export default function MobileBottomNav(){ return <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around border-t border-slate-800 bg-slate-950 p-3 md:hidden">{nav.map(item=>{const Icon=item.icon;return <Link key={item.href} href={item.href} className="rounded-full p-2 text-slate-300 hover:bg-slate-900 hover:text-white"><Icon className="h-6 w-6"/></Link>})}</nav>; }
