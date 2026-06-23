"use client";

import Sidebar from "@/components/layout/Sidebar";
import MobileNav from "@/components/layout/MobileNav";
import RightSidebar from "@/components/layout/RightSidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl">
        <Sidebar />

        <section className="min-h-screen w-full border-x border-slate-800 lg:max-w-2xl">
          {children}
        </section>

        <RightSidebar />
      </div>

      <MobileNav />
    </main>
  );
}