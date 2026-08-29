// PATCH /api/admin/products/[id] — Éditer / publier / dépublier (PRD §7.10)
// DELETE /api/admin/products/[id] — Supprimer

import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const db = await getDb();

    // Check product exists
    const existing = await db.select().from(products).where(eq(products.id, id)).get();
    if (!existing) {
      return NextResponse.json({ error: "Produit non trouvé" }, { status: 404 });
    }

    // Validate negotiable price logic
    const isNeg = body.isNegotiable ?? existing.isNegotiable;
    const pMin = body.priceMin ?? existing.priceMin;
    const pMax = body.priceMax ?? existing.priceMax;

    if (isNeg && (!pMax || pMax <= pMin)) {
      return NextResponse.json(
        { error: "Prix max requis et supérieur au prix min pour négociable" },
        { status: 400 }
      );
    }

    // Build update object
    const update: Record<string, unknown> = {};
    if (body.name !== undefined) update.name = body.name;
    if (body.description !== undefined) update.description = body.description;
    if (body.category !== undefined) update.category = body.category;
    if (body.country !== undefined) update.country = body.country;
    if (body.priceMin !== undefined) update.priceMin = body.priceMin;
    if (body.priceMax !== undefined) update.priceMax = isNeg ? body.priceMax : null;
    if (body.isNegotiable !== undefined) {
      update.isNegotiable = body.isNegotiable;
      if (!body.isNegotiable) update.priceMax = null;
    }
    if (body.rarity !== undefined) update.rarity = body.rarity;
    if (body.images !== undefined) update.images = body.images;
    if (body.active !== undefined) update.active = body.active;

    await db.update(products).set(update).where(eq(products.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Update Product Error]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDb();

    const existing = await db.select().from(products).where(eq(products.id, id)).get();
    if (!existing) {
      return NextResponse.json({ error: "Produit non trouvé" }, { status: 404 });
    }

    await db.delete(products).where(eq(products.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Delete Product Error]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// GET for admin single product (including inactive)
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDb();
    const product = await db.select().from(products).where(eq(products.id, id)).get();
    if (!product) {
      return NextResponse.json({ error: "Produit non trouvé" }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    console.error("[Admin Product Detail Error]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
