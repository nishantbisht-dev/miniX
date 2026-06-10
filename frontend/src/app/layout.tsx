import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";
export const metadata: Metadata = { title: "miniX", description: "A mini Twitter/X-style social platform" };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en"><body><AuthProvider>{children}</AuthProvider><Toaster position="top-center"/></body></html>; }
