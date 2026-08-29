// GET /api/admin/orders — Liste commandes admin (PRD §7.11)
// PATCH handled via /api/admin/orders/[id]

import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get("status");

    const db = await getDb();

    let query = db.select().from(orders).orderBy(desc(orders.createdAt));

    if (status) {
      const items = await db
        .select()
        .from(orders)
        .where(eq(orders.status, status))
        .orderBy(desc(orders.createdAt));
      return NextResponse.json({ orders: items });
    }

    const items = await query;
    return NextResponse.json({ orders: items });
  } catch (error) {
    console.error("[Admin Orders Error]", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
