"use client";

import { getMyLoginHistory, LoginHistoryItem } from "@/lib/loginHistory";
import { Monitor, Smartphone, Tablet, Laptop } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

/*
  LoginHistoryList shows user's recent login sessions.

  It displays:
  - browser
  - OS
  - device
  - IP address
  - login time
*/

function getDeviceIcon(device: LoginHistoryItem["device"]) {
  if (device === "mobile") {
    return <Smartphone className="h-5 w-5" />;
  }

  if (device === "tablet") {
    return <Tablet className="h-5 w-5" />;
  }

  if (device === "desktop") {
    return <Monitor className="h-5 w-5" />;
  }

  return <Laptop className="h-5 w-5" />;
}

export default function LoginHistoryList() {
  const [history, setHistory] = useState<LoginHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      try {
        const data = await getMyLoginHistory();
        setHistory(data);
      } catch (error: any) {
        console.error(error);
        toast.error(error.message || "Failed to load login history");
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 text-slate-400">
        Loading login history...
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 text-slate-400">
        No login history found yet.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950">
      <div className="border-b border-slate-800 p-5">
        <h2 className="text-lg font-bold text-white">Login History</h2>
        <p className="mt-1 text-sm text-slate-400">
          Recent devices and browsers used to access your account.
        </p>
      </div>

      <div className="divide-y divide-slate-800">
        {history.map((item) => (
          <div key={item._id} className="flex gap-4 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-sky-400">
              {getDeviceIcon(item.device)}
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold text-white">
                  {item.browser} on {item.os}
                </h3>

                <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-semibold text-emerald-400">
                  {item.status}
                </span>
              </div>

              <p className="mt-1 text-sm text-slate-400">
                Device: {item.device}
              </p>

              <p className="mt-1 text-sm text-slate-400">
                IP Address: {item.ipAddress}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {new Date(item.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}