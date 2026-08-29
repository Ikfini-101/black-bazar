// Stripe helper — BB-03 §8

import Stripe from "stripe";

let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key || key === "sk_test_placeholder") {
      console.warn("[Stripe] No API key configured — using placeholder mode");
    }
    stripeInstance = new Stripe(key || "sk_test_placeholder", {
      apiVersion: "2025-06-30",
    });
  }
  return stripeInstance;
}

export async function createCheckoutSession(params: {
  items: Array<{
    name: string;
    price: number; // in EUR cents
    quantity: number;
    image?: string;
  }>;
  orderId: string;
  customerEmail: string;
  successUrl: string;
  cancelUrl: string;
}) {
  const stripe = getStripe();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: params.customerEmail,
    line_items: params.items.map((item) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.name,
          ...(item.image ? { images: [item.image] } : {}),
        },
        unit_amount: Math.round(item.price * 100), // EUR → cents
      },
      quantity: item.quantity,
    })),
    metadata: { orderId: params.orderId },
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
  });

  return session;
}

export async function verifyWebhookSignature(
  body: string,
  signature: string
): Promise<Stripe.Event> {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "whsec_placeholder";
  return stripe.webhooks.constructEvent(body, signature, webhookSecret);
}
