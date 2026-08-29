// GET /api/products — Liste publique avec filtres (PRD §6)
// GET /api/products?category=X&country=Y&sort=price_asc&page=1

import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { eq, and, asc, desc, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 24;

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const category = url.searchParams.get("category");
    const country = url.searchParams.get("country");
    const sort = url.searchParams.get("sort") || "newest";
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"));
    const search = url.searchParams.get("q");

    const db = await getDb();

    const conditions = [eq(products.active, true)];
    if (category) conditions.push(eq(products.category, category));
    if (country) conditions.push(eq(products.country, country));
    if (search) {
      conditions.push(
        sql`(${products.name} LIKE ${"%" + search + "%"} OR ${products.description} LIKE ${"%" + search + "%"})`
      );
    }

    const where = conditions.length > 1 ? and(...conditions) : conditions[0];

    let orderBy;
    switch (sort) {
      case "price_asc":
        orderBy = asc(products.priceMin);
        break;
      case "price_desc":
        orderBy = desc(products.priceMin);
        break;
      default:
        orderBy = desc(products.createdAt);
    }

    const items = await db
      .select()
      .from(products)
      .where(where)
      .orderBy(orderBy)
      .limit(PAGE_SIZE)
      .offset((page - 1) * PAGE_SIZE);

    // Count total for pagination
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(products)
      .where(where);

    const total = countResult[0]?.count || 0;

    return NextResponse.json({
      products: items,
      pagination: {
        page,
        pageSize: PAGE_SIZE,
        total,
        totalPages: Math.ceil(total / PAGE_SIZE),
      },
    });
  } catch (error) {
    console.error("[Products List Error]", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
