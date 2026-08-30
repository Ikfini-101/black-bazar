import { getDb } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { NextResponse } from "next/server";
import { CATEGORIES } from "@/lib/constants";

export async function POST() {
  try {
    const db = await getDb();
    
    // We will generate 10 products per category
    const mockProducts: any[] = [];
    
    const imagePlaceholders = [
      "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&q=80", // food
      "https://images.unsplash.com/photo-1615397323055-668b594b5936?w=500&q=80", // beauty
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&q=80", // fashion
      "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=500&q=80", // craft
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=500&q=80", // wellness
      "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=500&q=80", // culture
    ];

    CATEGORIES.forEach((category, catIndex) => {
      const img = imagePlaceholders[catIndex % imagePlaceholders.length];
      for (let i = 1; i <= 10; i++) {
        const isNeg = Math.random() > 0.8;
        mockProducts.push({
          id: crypto.randomUUID(),
          name: `Produit ${category} ${i}`,
          description: `Une magnifique création de la catégorie ${category}, directement venue d'Afrique. Qualité exceptionnelle garantie.`,
          country: ["Sénégal", "Mali", "Côte d'Ivoire", "Cameroun", "Maroc", "Madagascar"][Math.floor(Math.random() * 6)],
          category: category,
          priceMin: Math.floor(Math.random() * 50) + 10,
          priceMax: isNeg ? Math.floor(Math.random() * 50) + 60 : null,
          isNegotiable: isNeg,
          rarity: ["AVAILABLE", "IN_STOCK", "RARE"][Math.floor(Math.random() * 3)],
          images: [img],
          active: true,
        });
      }
    });

    for (const p of mockProducts) {
      await db.insert(products).values(p);
    }
    
    return NextResponse.json({ success: true, count: mockProducts.length });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
