"use client";

import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "@/hooks/useTranslation";
import {
  Bell,
  Bookmark,
  Compass,
  Crown,
  Home,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";

const navItems = [
  {
    href: "/",
    labelKey: "home",
    icon: Home,
  },
  {
    href: "/explore",
    labelKey: "explore",
    icon: Compass,
  },
  {
    href: "/notifications",
    labelKey: "notifications",
    icon: Bell,
  },
  {
    href: "/bookmarks",
    labelKey: "bookmarks",
    icon: Bookmark,
  },
  {
    href: "/profile",
    labelKey: "profile",
    icon: User,
  },
  {
    href: "/subscriptions",
    labelKey: "subscriptions",
    icon: Crown,
  },
  {
    href: "/settings",
    labelKey: "settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const { t } = useTranslation();

  async function handleLogout() {
    try {
      await logout();
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Logout failed");
    }
  }

  return (
    <aside className="sticky top-0 hidden h-screen w-20 shrink-0 border-r border-slate-800 bg-slate-950 px-3 py-5 xl:block 2xl:w-64">
      <div className="flex h-full flex-col justify-between">
        <div>
          <Link
            href="/"
            className="mb-8 flex items-center justify-center gap-3 rounded-2xl px-2 2xl:justify-start"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-500 text-xl font-black text-white">
              m
            </div>

            <div className="hidden 2xl:block">
              <h1 className="text-xl font-black text-white">miniX</h1>
              <p className="text-xs text-slate-500">Social platform</p>
            </div>
          </Link>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-center gap-4 rounded-2xl px-3 py-3 text-base font-semibold transition 2xl:justify-start 2xl:px-4 ${
                    isActive
                      ? "bg-sky-500 text-white shadow-lg shadow-sky-500/20"
                      : "text-slate-300 hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span className="hidden 2xl:inline">{t(item.labelKey)}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-4 rounded-2xl px-3 py-3 text-base font-semibold text-red-400 transition hover:bg-red-500/10 2xl:justify-start 2xl:px-4"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <span className="hidden 2xl:inline">Logout</span>
          </button>

          <div className="hidden rounded-2xl border border-slate-800 bg-slate-900 p-4 2xl:block">
            <p className="text-sm font-semibold text-white">Build in public</p>
            <p className="mt-1 text-xs leading-5 text-slate-400">
              Keep improving miniX one feature at a time.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}