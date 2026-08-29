import { Header, Footer } from "@/components/storefront/Layout";
import WhatsAppButton from "@/components/WhatsAppButton";
import Link from "next/link";
import { CATEGORIES, CATEGORY_ICONS } from "@/lib/constants";
import { getDb } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import ProductCard from "@/components/storefront/ProductCard";

export const dynamic = "force-dynamic";

export default async function Home() {
  const db = await getDb();
  
  // 12 derniers produits actifs
  const recentProducts = await db
    .select()
    .from(products)
    .where(eq(products.active, true))
    .orderBy(desc(products.createdAt))
    .limit(12);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center bg-bb-gray overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0A0A0A] z-10" />
          <div className="relative z-20 text-center px-4 max-w-3xl mx-auto space-y-6">
            <h1 className="font-display text-4xl md:text-6xl font-bold text-bb-white tracking-tight">
              L&apos;Afrique livrée <br />
              <span className="text-bb-gold">chez vous.</span>
            </h1>
            <p className="text-lg md:text-xl text-bb-cream/90 max-w-xl mx-auto">
              Découvrez notre sélection de produits africains rares et authentiques. De nos producteurs directement à votre porte.
            </p>
            <div className="pt-4">
              <Link 
                href="/catalogue"
                className="inline-block bg-gradient-to-r from-[#C9A84C] to-[#E8C97A] text-[#0A0A0A] font-bold uppercase tracking-wide py-4 px-8 rounded-lg hover:scale-105 transition-transform"
              >
                Explorer le marché
              </Link>
            </div>
          </div>
        </section>

        {/* CATEGORIES */}
        <section className="py-16 px-4 max-w-7xl mx-auto">
          <h2 className="font-display text-3xl font-bold mb-8 text-center text-bb-gold">Nos Rayons</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map((category) => (
              <Link 
                key={category} 
                href={`/catalogue?category=${encodeURIComponent(category)}`}
                className="bg-bb-gray border border-bb-gray-mid p-6 rounded-xl text-center hover:border-bb-gold transition-colors group flex flex-col items-center justify-center gap-3 aspect-square"
              >
                <span className="text-4xl group-hover:scale-110 transition-transform">
                  {CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS]}
                </span>
                <span className="font-medium text-sm md:text-base group-hover:text-bb-gold transition-colors">
                  {category}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* DERNIERS PRODUITS */}
        <section className="py-16 px-4 max-w-7xl mx-auto border-t border-bb-gray-mid">
          <div className="flex justify-between items-end mb-8">
            <h2 className="font-display text-3xl font-bold">Derniers Arrivages</h2>
            <Link href="/catalogue" className="text-bb-gold hover:underline font-medium">Voir tout</Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
