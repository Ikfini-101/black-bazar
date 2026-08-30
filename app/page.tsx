import { Header, Footer } from "@/components/storefront/Layout";
import WhatsAppButton from "@/components/WhatsAppButton";
import Link from "next/link";
import { CATEGORIES } from "@/lib/constants";
import { getDb } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import ProductCard from "@/components/storefront/ProductCard";
import HeroCarousel from "@/components/storefront/HeroCarousel";
import { ShoppingBasket, Sparkles, Shirt, Palette, Leaf, BookOpen } from "lucide-react";

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  "Alimentation":    ShoppingBasket,
  "Beauté & Corps":  Sparkles,
  "Mode & Textile":  Shirt,
  "Art & Artisanat": Palette,
  "Bien-être":       Leaf,
  "Culture":         BookOpen,
};

export const dynamic = "force-dynamic";

export default async function Home() {
  const db = await getDb();
  const recentProducts = await db.select().from(products).where(eq(products.active, true)).orderBy(desc(products.createdAt)).limit(12);
  
  // Prendre une sélection aléatoire ou les premiers pour le carrousel à la une (ex: 8 produits)
  const featuredProducts = await db.select().from(products).where(eq(products.active, true)).limit(8);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">

        {/* CARROUSEL À LA UNE (JUSTE APRÈS LA NAVBAR) */}
        <HeroCarousel products={featuredProducts} />

        {/* HERO */}
        <section className="relative py-16 md:py-24 flex items-center justify-center px-4 overflow-hidden">
          {/* Blobs gris doux derrière le verre */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-gray-300/60 blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-gray-200/60 blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-bb-gold/10 blur-3xl"></div>
          </div>

          <div className="relative z-10 glass-lg text-center max-w-4xl mx-auto p-10 md:p-16 space-y-8">
            <h1 className="text-5xl md:text-7xl font-black text-gray-800 tracking-tight leading-tight">
              Tous vos commandes <br />
              <span className="text-bb-gold">livrées chez vous.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
              Découvrez notre sélection de produits africains rares et authentiques. De nos producteurs directement à votre porte.
            </p>
            <Link href="/catalogue" className="inline-block glass-gold text-gray-900 font-bold text-lg py-4 px-10 rounded-2xl hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
              Explorer le marché →
            </Link>
          </div>
        </section>

        {/* CATEGORIES */}
        <section className="py-16 px-4 max-w-7xl mx-auto">
          <h2 className="text-3xl font-black mb-10 text-center text-gray-700 tracking-tight">Nos Rayons</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {CATEGORIES.map((category) => (
              <Link
                key={category}
                href={`/catalogue?category=${encodeURIComponent(category)}`}
                aria-label={`Voir les produits : ${category}`}
                className="glass-sm p-6 text-center hover:border-bb-gold/50 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group flex flex-col items-center justify-center gap-4 aspect-square"
              >
                {(() => {
                  const Icon = CATEGORY_ICONS[category];
                  return Icon ? (
                    <Icon
                      size={36}
                      strokeWidth={1.75}
                      aria-hidden="true"
                      focusable="false"
                      className="text-gray-700 group-hover:text-bb-gold transition-colors duration-300"
                    />
                  ) : null;
                })()}
                {/* text-gray-800 sur fond glass blanc = ratio ~14:1 ✅ WCAG AAA */}
                <span className="font-bold text-sm text-gray-800 group-hover:text-gray-900 transition-colors leading-tight">
                  {category}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* DERNIERS ARRIVAGES */}
        <section className="py-16 px-4 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
            <h2 className="text-3xl font-black text-gray-700 tracking-tight">Derniers Arrivages</h2>
            <Link href="/catalogue" className="text-bb-gold hover:text-bb-gold-light font-bold flex items-center gap-1 group">
              Voir tout <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
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
