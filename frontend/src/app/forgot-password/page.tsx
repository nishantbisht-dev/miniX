"use client";

import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import { forgotPassword } from "@/lib/forgotPassword";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleForgotPassword(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!identifier.trim()) {
      toast.error("Email or phone number is required");
      return;
    }

    try {
      setLoading(true);

      const response = await forgotPassword(identifier.trim());

      toast.success(response.message || "Password reset successfully");
      setIdentifier("");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold">Forgot Password</h1>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Enter your registered email or phone number. A new generated
            password will be sent to your registered email.
          </p>
        </div>

        <form onSubmit={handleForgotPassword} className="space-y-4">
          <Input
            label="Email or Phone Number"
            type="text"
            value={identifier}
            onChange={(event) => setIdentifier(event.target.value)}
            placeholder="Enter email or phone number"
          />

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
            <p className="text-sm leading-6 text-slate-400">
              Note: You can use this option only one time per day. The generated
              password will contain only uppercase and lowercase letters.
            </p>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Resetting..." : "Reset Password"}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-400">
          Remember your password?{" "}
          <Link href="/login" className="font-semibold text-sky-400">
            Back to Login
          </Link>
        </p>
      </div>
    </main>
  );
}