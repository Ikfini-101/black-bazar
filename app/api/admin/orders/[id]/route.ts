// GET /api/admin/orders/[id] — Détail commande (PRD §7.12)
// PATCH /api/admin/orders/[id] — Changer statut

import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { ORDER_STATUSES } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDb();

    const order = await db.select().from(orders).where(eq(orders.id, id)).get();
    if (!order) {
      return NextResponse.json({ error: "Commande non trouvée" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("[Admin Order Detail Error]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status } = await request.json();

    if (!status || !ORDER_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: `Statut invalide. Valeurs acceptées : ${ORDER_STATUSES.join(", ")}` },
        { status: 400 }
      );
    }

    const db = await getDb();

    const existing = await db.select().from(orders).where(eq(orders.id, id)).get();
    if (!existing) {
      return NextResponse.json({ error: "Commande non trouvée" }, { status: 404 });
    }

    await db.update(orders).set({ status }).where(eq(orders.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Update Order Status Error]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
