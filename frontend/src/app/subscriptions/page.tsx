"use client";

import Button from "@/components/common/Button";
import AppLayout from "@/components/layout/AppLayout";
import {
  createRazorpayOrder,
  getMySubscription,
  getSubscriptionPlans,
  SubscriptionPlanKey,
  SubscriptionPlansResponse,
  verifyRazorpayPayment,
} from "@/lib/subscriptions";
import { loadRazorpayScript } from "@/utils/loadRazorpay";
import { Crown, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const PLAN_ORDER: SubscriptionPlanKey[] = ["free", "bronze", "silver", "gold"];

type RazorpayResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: {
    name?: string;
    email?: string;
  };
  theme: {
    color: string;
  };
  handler: (response: RazorpayResponse) => void;
};

type RazorpayConstructor = new (options: RazorpayOptions) => {
  open: () => void;
};

export default function SubscriptionsPage() {
  const [plans, setPlans] = useState<SubscriptionPlansResponse | null>(null);
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlanKey>("free");
  const [subscriptionExpiresAt, setSubscriptionExpiresAt] = useState<
    string | null
  >(null);

  const [loading, setLoading] = useState(true);
  const [payingPlan, setPayingPlan] = useState<SubscriptionPlanKey | null>(null);

  async function loadData() {
    try {
      setLoading(true);

      const [plansData, subscriptionData] = await Promise.all([
        getSubscriptionPlans(),
        getMySubscription(),
      ]);

      setPlans(plansData);
      setCurrentPlan(subscriptionData.plan || "free");
      setSubscriptionExpiresAt(subscriptionData.subscriptionExpiresAt || null);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to load subscription plans");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handlePay(plan: SubscriptionPlanKey) {
    if (plan === "free") {
      toast.error("Free plan is already available by default");
      return;
    }

    try {
      setPayingPlan(plan);

      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded) {
        toast.error("Failed to load Razorpay checkout");
        return;
      }

      const orderData = await createRazorpayOrder(plan);

      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

      if (!razorpayKey) {
        toast.error("Razorpay key is missing");
        return;
      }

      const Razorpay = (window as unknown as { Razorpay: RazorpayConstructor })
        .Razorpay;

      if (!Razorpay) {
        toast.error("Razorpay is not available");
        return;
      }

      const options: RazorpayOptions = {
        key: razorpayKey,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "miniX",
        description: `${orderData.plan.name} Plan Subscription`,
        order_id: orderData.order.id,
        prefill: {
          name: orderData.user.name,
          email: orderData.user.email,
        },
        theme: {
          color: "#0ea5e9",
        },
        handler: async function (response: RazorpayResponse) {
          try {
            const verification = await verifyRazorpayPayment({
              subscriptionId: orderData.subscriptionId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            toast.success(
              verification.message || "Subscription activated successfully"
            );

            await loadData();
          } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Payment verification failed");
          }
        },
      };

      const razorpay = new Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Payment failed");
    } finally {
      setPayingPlan(null);
    }
  }

  return (
    <AppLayout>
      <div className="border-b border-slate-800 p-5">
        <h1 className="text-2xl font-bold text-white">Subscription Plans</h1>
        <p className="mt-1 text-sm text-slate-400">
          Choose a plan to control your monthly tweet posting limit.
        </p>
      </div>

      <div className="p-5">
        <div className="mb-5 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-4">
          <p className="text-sm leading-6 text-yellow-200">
            Payments are allowed only between 10:00 AM and 11:00 AM IST. After
            successful payment, invoice and plan details are sent by email.
          </p>
        </div>

        {subscriptionExpiresAt && (
          <div className="mb-5 rounded-2xl border border-sky-500/30 bg-sky-500/10 p-4">
            <p className="text-sm leading-6 text-sky-200">
              Current plan:{" "}
              <span className="font-semibold">{currentPlan.toUpperCase()}</span>{" "}
              valid until{" "}
              <span className="font-semibold">
                {new Date(subscriptionExpiresAt).toLocaleDateString("en-IN")}
              </span>
            </p>
          </div>
        )}

        {loading || !plans ? (
          <p className="text-slate-400">Loading plans...</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {PLAN_ORDER.map((planKey) => {
              const plan = plans[planKey];
              const isCurrent = currentPlan === planKey;
              const isGold = planKey === "gold";

              return (
                <div
                  key={planKey}
                  className={`rounded-2xl border p-5 ${
                    isCurrent
                      ? "border-sky-500 bg-sky-500/10"
                      : "border-slate-800 bg-slate-950"
                  }`}
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        {plan.name}
                      </h2>

                      <p className="mt-1 text-sm text-slate-400">
                        {planKey === "free"
                          ? "Default plan"
                          : "Monthly subscription"}
                      </p>
                    </div>

                    <div className="rounded-full bg-slate-800 p-3 text-sky-400">
                      {isGold ? (
                        <Crown className="h-5 w-5" />
                      ) : (
                        <Zap className="h-5 w-5" />
                      )}
                    </div>
                  </div>

                  <p className="text-3xl font-bold text-white">
                    ₹{plan.price}
                    <span className="text-sm font-normal text-slate-400">
                      /month
                    </span>
                  </p>

                  <p className="mt-3 text-sm text-slate-300">
                    Tweet limit:{" "}
                    <span className="font-semibold text-white">
                      {planKey === "gold"
                        ? "Unlimited"
                        : `${plan.tweetLimit} tweet(s)`}
                    </span>
                  </p>

                  <Button
                    type="button"
                    disabled={isCurrent || payingPlan === planKey}
                    onClick={() => handlePay(planKey)}
                    className="mt-5 w-full"
                  >
                    {isCurrent
                      ? "Current Plan"
                      : payingPlan === planKey
                      ? "Opening payment..."
                      : planKey === "free"
                      ? "Default"
                      : `Pay ₹${plan.price}`}
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}