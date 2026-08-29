// POST /api/orders — Créer commande + checkout Stripe (PRD §7.5)

import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { createCheckoutSession } from "@/lib/stripe";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, address, items } = body;

    if (!email || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Email et articles requis" },
        { status: 400 }
      );
    }

    if (!address || !address.street || !address.city || !address.postalCode || !address.country) {
      return NextResponse.json(
        { error: "Adresse complète requise" },
        { status: 400 }
      );
    }

    // Calculate total
    const total = items.reduce(
      (sum: number, item: { price: number; quantity: number }) =>
        sum + item.price * item.quantity,
      0
    );

    // Create order in DB with status PENDING (PRD §7.5 AC)
    const orderId = crypto.randomUUID();
    const db = await getDb();

    await db.insert(orders).values({
      id: orderId,
      customerEmail: email,
      customerName: name || null,
      shippingAddress: address,
      status: "PENDING",
      items,
      total,
    });

    // Create Stripe Checkout Session
    const origin = new URL(request.url).origin;
    try {
      const session = await createCheckoutSession({
        items,
        orderId,
        customerEmail: email,
        successUrl: `${origin}/commande/confirmation?order=${orderId}`,
        cancelUrl: `${origin}/panier`,
      });

      // Save Stripe session ID
      await db
        .update(orders)
        .set({ stripeSessionId: session.id })
        .where(({ id }) => id.equals(orderId));

      return NextResponse.json({
        orderId,
        checkoutUrl: session.url,
      });
    } catch (stripeError) {
      // If Stripe fails (e.g. placeholder keys), still return order ID
      console.warn("[Stripe] Checkout creation failed:", stripeError);
      return NextResponse.json({
        orderId,
        checkoutUrl: null,
        warning: "Paiement Stripe non configuré — commande créée en mode test",
      });
    }
  } catch (error) {
    console.error("[Create Order Error]", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
