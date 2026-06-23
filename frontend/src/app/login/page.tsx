"use client";

import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import { auth } from "@/lib/firebase";
import {
  checkLoginSecurity,
  completeChromeLogin,
} from "@/lib/loginSecurity";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [otp, setOtp] = useState("");
  const [showOtpStep, setShowOtpStep] = useState(false);

  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

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
        Step 1:
        Login user using Firebase Auth.
      */
      await signInWithEmailAndPassword(auth, email.trim(), password);

      /*
        Step 2:
        Apply custom internship login security rules from backend.

        Rules:
        - Chrome login requires email OTP
        - Microsoft Edge login is allowed directly
        - Mobile login allowed only between 10 AM and 1 PM IST
      */
      const securityResult = await checkLoginSecurity();

      if (securityResult.action === "blocked") {
        await signOut(auth);
        toast.error(securityResult.message);
        return;
      }

      if (securityResult.action === "requires_otp") {
        setShowOtpStep(true);
        toast.success("OTP sent to your registered email");
        return;
      }

      toast.success("Login successful");
      router.push("/");
    } catch (error: any) {
      console.error(error);

      if (error.code === "auth/invalid-credential") {
        toast.error("Invalid email or password");
        return;
      }

      if (error.code === "auth/user-not-found") {
        toast.error("User not found");
        return;
      }

      if (error.code === "auth/wrong-password") {
        toast.error("Wrong password");
        return;
      }

      if (error.code === "auth/too-many-requests") {
        toast.error("Too many attempts. Please try again later");
        return;
      }

      toast.error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!otp.trim()) {
      toast.error("OTP is required");
      return;
    }

    if (otp.trim().length !== 6) {
      toast.error("OTP must be 6 digits");
      return;
    }

    try {
      setOtpLoading(true);

      /*
        Complete Chrome login after OTP verification.
      */
      const result = await completeChromeLogin(otp.trim());

      toast.success(result.message || "Login verified successfully");
      router.push("/");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "OTP verification failed");
    } finally {
      setOtpLoading(false);
    }
  }

  async function handleCancelOtpLogin() {
    await signOut(auth);

    setShowOtpStep(false);
    setOtp("");
    setPassword("");

    toast.success("Login cancelled");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold">Login to miniX</h1>
          <p className="mt-2 text-sm text-slate-400">
            Welcome back! Please login to continue.
          </p>
        </div>

        {!showOtpStep ? (
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

            <div className="text-right">
              <Link
                href="/forgot-password"
                className="text-sm font-semibold text-sky-400 transition hover:text-sky-300"
              >
                Forgot password?
              </Link>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Checking security..." : "Login"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="rounded-xl border border-sky-500/30 bg-sky-500/10 p-4">
              <h2 className="font-semibold text-sky-300">
                Chrome OTP Verification
              </h2>

              <p className="mt-1 text-sm leading-6 text-slate-300">
                You are logging in from Google Chrome. Please enter the OTP sent
                to your registered email address.
              </p>
            </div>

            <Input
              label="OTP"
              type="text"
              value={otp}
              onChange={(event) => setOtp(event.target.value)}
              placeholder="Enter 6-digit OTP"
            />

            <Button type="submit" disabled={otpLoading} className="w-full">
              {otpLoading ? "Verifying..." : "Verify OTP & Login"}
            </Button>

            <button
              type="button"
              onClick={handleCancelOtpLogin}
              className="w-full rounded-xl border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-800"
            >
              Cancel login
            </button>
          </form>
        )}

        {!showOtpStep && (
          <p className="mt-5 text-center text-sm text-slate-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-sky-400 transition hover:text-sky-300"
            >
              Register
            </Link>
          </p>
        )}
      </div>
    </main>
  );
}