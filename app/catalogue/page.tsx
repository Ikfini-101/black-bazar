import { Header, Footer } from "@/components/storefront/Layout";
import ProductCard from "@/components/storefront/ProductCard";
import { getDb } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { and, eq, sql, desc, asc } from "drizzle-orm";
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
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="w-full md:w-64 shrink-0 space-y-6">
          <div>
            <h2 className="font-display text-xl font-bold mb-4 text-bb-gold border-b border-bb-gray-mid pb-2">Catégories</h2>
            <div className="space-y-2">
              <Link 
                href="/catalogue" 
                className={`block text-sm ${!category ? 'text-bb-gold font-bold' : 'text-bb-text-muted hover:text-bb-white'}`}
              >
                Toutes les catégories
              </Link>
              {CATEGORIES.map(c => (
                <Link 
                  key={c}
                  href={`/catalogue?category=${encodeURIComponent(c)}${country ? `&country=${encodeURIComponent(country)}` : ''}`}
                  className={`block text-sm ${category === c ? 'text-bb-gold font-bold' : 'text-bb-text-muted hover:text-bb-white'}`}
                >
                  {c}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold mb-4 text-bb-gold border-b border-bb-gray-mid pb-2">Origine</h2>
            <div className="space-y-2">
              <Link 
                href={`/catalogue${category ? `?category=${encodeURIComponent(category)}` : ''}`} 
                className={`block text-sm ${!country ? 'text-bb-gold font-bold' : 'text-bb-text-muted hover:text-bb-white'}`}
              >
                Tous les pays
              </Link>
              {COUNTRIES.map(c => (
                <Link 
                  key={c.name}
                  href={`/catalogue?country=${encodeURIComponent(c.name)}${category ? `&category=${encodeURIComponent(category)}` : ''}`}
                  className={`block text-sm ${country === c.name ? 'text-bb-gold font-bold' : 'text-bb-text-muted hover:text-bb-white'}`}
                >
                  {c.flag} {c.name}
                </Link>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h1 className="font-display text-2xl md:text-3xl font-bold">
              {category ? category : "Tous les produits"} 
              <span className="text-bb-text-muted text-lg ml-2 font-sans font-normal">({items.length})</span>
            </h1>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-20 bg-bb-gray border border-bb-gray-mid rounded-xl">
              <Search size={48} className="mx-auto text-bb-text-muted mb-4" />
              <p className="text-lg text-bb-white mb-2">Aucun produit trouvé</p>
              <p className="text-bb-text-muted">Essayez de modifier vos filtres.</p>
              <Link href="/catalogue" className="inline-block mt-4 text-bb-gold hover:underline">
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
