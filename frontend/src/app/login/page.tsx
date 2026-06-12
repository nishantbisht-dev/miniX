"use client";

import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import { auth } from "@/lib/firebase";
import { saveLoginHistory } from "@/lib/loginHistory";
import { signInWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }

    if (!password.trim()) {
      toast.error("Password is required");
      return;
    }

    try {
      setLoading(true);

      /*
        First login user with Firebase Auth.
      */
      await signInWithEmailAndPassword(auth, email, password);

      /*
        After Firebase login succeeds, save login history in MongoDB.

        This API will store:
        - browser type
        - operating system
        - device category
        - IP address
        - login time
      */
      await saveLoginHistory();

      toast.success("Login successful");

      router.push("/");
    } catch (error: any) {
      console.error(error);

      if (error.code === "auth/invalid-credential") {
        toast.error("Invalid email or password");
        return;
      }

      toast.error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-white">Login to miniX</h1>
          <p className="mt-2 text-sm text-slate-400">
            Welcome back! Please login to continue.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter your email"
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
          />

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-400">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-sky-400">
            Register
          </Link>
        </p>
      </div>
    </main>
  );
}