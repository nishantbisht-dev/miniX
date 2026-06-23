import { apiRequest } from "@/lib/api";

export type SubscriptionPlanKey = "free" | "bronze" | "silver" | "gold";

export type SubscriptionPlanDetails = {
  name: string;
  price: number;
  tweetLimit: number | null;
};

export type SubscriptionPlansResponse = Record<
  SubscriptionPlanKey,
  SubscriptionPlanDetails
>;

export type RazorpayOrderResponse = {
  success: boolean;
  message: string;
  order: {
    id: string;
    amount: number;
    currency: string;
  };
  subscriptionId: string;
  plan: {
    key: SubscriptionPlanKey;
    name: string;
    price: number;
  };
  user: {
    name: string;
    email: string;
  };
};

export async function getSubscriptionPlans() {
  const data = await apiRequest<any>("/subscriptions/plans");

  return data.plans as SubscriptionPlansResponse;
}

export async function getMySubscription() {
  const data = await apiRequest<any>("/subscriptions/me");

  return data.subscription;
}

export async function createRazorpayOrder(plan: SubscriptionPlanKey) {
  const data = await apiRequest<RazorpayOrderResponse>(
    "/subscriptions/create-order",
    {
      method: "POST",
      body: JSON.stringify({ plan }),
    }
  );

  return data;
}

export async function verifyRazorpayPayment({
  subscriptionId,
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
}: {
  subscriptionId: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) {
  const data = await apiRequest<any>("/subscriptions/verify-payment", {
    method: "POST",
    body: JSON.stringify({
      subscriptionId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    }),
  });

  return data;
}

export async function activateSubscriptionManually(plan: SubscriptionPlanKey) {
  const data = await apiRequest<any>("/subscriptions/manual-activate", {
    method: "POST",
    body: JSON.stringify({ plan }),
  });

  return data;
}