import { Header, Footer } from "@/components/storefront/Layout";
import ProductCard from "@/components/storefront/ProductCard";
import { getDb } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { and, eq, desc, asc } from "drizzle-orm";
import { CATEGORIES, COUNTRIES } from "@/lib/constants";
import Link from "next/link";
import { Search } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CataloguePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const category = typeof resolvedParams.category === 'string' ? resolvedParams.category : undefined;
  const country = typeof resolvedParams.country === 'string' ? resolvedParams.country : undefined;
  const sort = typeof resolvedParams.sort === 'string' ? resolvedParams.sort : undefined;
  
  const db = await getDb();
  
  const conditions = [eq(products.active, true)];
  if (category) conditions.push(eq(products.category, category));
  if (country) conditions.push(eq(products.country, country));

  const where = conditions.length > 1 ? and(...conditions) : conditions[0];
  
  let orderBy = desc(products.createdAt);
  if (sort === "price_asc") orderBy = asc(products.priceMin);
  if (sort === "price_desc") orderBy = desc(products.priceMin);

  const items = await db
    .select()
    .from(products)
    .where(where)
    .orderBy(orderBy);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="w-full md:w-64 shrink-0 space-y-8">
          <div className="glass-sm p-6 rounded-2xl border border-white/60 shadow-md">
            <h2 className="text-lg font-black mb-4 text-gray-800 border-b border-white/60 pb-3">Catégories</h2>
            <div className="space-y-3">
              <Link 
                href="/catalogue" 
                className={`block text-sm font-medium transition-colors ${!category ? 'text-bb-gold font-bold' : 'text-gray-500 hover:text-bb-gold'}`}
              >
                Toutes les catégories
              </Link>
              {CATEGORIES.map(c => (
                <Link 
                  key={c}
                  href={`/catalogue?category=${encodeURIComponent(c)}${country ? `&country=${encodeURIComponent(country)}` : ''}`}
                  className={`block text-sm font-medium transition-colors ${category === c ? 'text-bb-gold font-bold' : 'text-gray-500 hover:text-bb-gold'}`}
                >
                  {c}
                </Link>
              ))}
            </div>
          </div>

          <div className="glass-sm p-6 rounded-2xl border border-white/60 shadow-md">
            <h2 className="text-lg font-black mb-4 text-gray-800 border-b border-white/60 pb-3">Origine</h2>
            <div className="space-y-3">
              <Link 
                href={`/catalogue${category ? `?category=${encodeURIComponent(category)}` : ''}`} 
                className={`block text-sm font-medium transition-colors ${!country ? 'text-bb-gold font-bold' : 'text-gray-500 hover:text-bb-gold'}`}
              >
                Tous les pays
              </Link>
              {COUNTRIES.map(c => (
                <Link 
                  key={c.name}
                  href={`/catalogue?country=${encodeURIComponent(c.name)}${category ? `&category=${encodeURIComponent(category)}` : ''}`}
                  className={`block text-sm font-medium transition-colors ${country === c.name ? 'text-bb-gold font-bold' : 'text-gray-500 hover:text-bb-gold'}`}
                >
                  {c.flag} {c.name}
                </Link>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-8 admin-glass-panel py-4 px-6 rounded-2xl">
            <h1 className="text-3xl font-black text-gray-800">
              {category ? category : "Tous les produits"} 
              <span className="text-gray-500 text-xl ml-3 font-medium">({items.length})</span>
            </h1>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-20 glass-sm border border-white/60 rounded-2xl shadow-md">
              <Search size={48} className="mx-auto text-gray-500 mb-4" />
              <p className="text-xl font-bold text-gray-800 mb-2">Aucun produit trouvé</p>
              <p className="text-gray-500 font-medium">Essayez de modifier vos filtres.</p>
              <Link href="/catalogue" className="inline-block mt-6 px-6 py-2 glass-gold text-bb-gold font-bold rounded-lg hover:glass-gold transition-colors">
                Réinitialiser les filtres
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
