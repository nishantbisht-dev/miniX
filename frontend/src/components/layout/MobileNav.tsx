"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { Bell, Bookmark, Crown, Home, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const mobileItems = [
  {
    href: "/",
    labelKey: "home",
    icon: Home,
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

export default function MobileNav() {
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-800 bg-slate-950/95 backdrop-blur xl:hidden">
      <div className="grid grid-cols-5">
        {mobileItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 px-2 py-3 text-xs font-semibold transition ${
                isActive ? "text-sky-400" : "text-slate-400"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="max-w-full truncate">{t(item.labelKey)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}