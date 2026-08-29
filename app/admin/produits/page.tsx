"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit2, Loader2, Image as ImageIcon } from "lucide-react";
import { CURRENCY_SYMBOL } from "@/lib/constants";

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function toggleActive(id: string, currentActive: boolean) {
    // Optimistic update
    setProducts(products.map(p => p.id === id ? { ...p, active: !currentActive } : p));
    try {
      await fetch(`/api/admin/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !currentActive }),
      });
    } catch (err) {
      // Revert on error
      setProducts(products.map(p => p.id === id ? { ...p, active: currentActive } : p));
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="font-display text-2xl md:text-3xl font-bold">Produits</h1>
        <Link 
          href="/admin/produits/nouveau"
          className="bg-bb-gold text-bb-black p-2 md:px-4 md:py-2 rounded-lg flex items-center gap-2 font-medium hover:bg-bb-gold-light transition-colors"
        >
          <Plus size={20} />
          <span className="hidden md:inline">Ajouter</span>
        </Link>
      </header>

      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="animate-spin text-bb-gold" size={32} />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center p-12 bg-bb-gray border border-bb-gray-mid rounded-xl">
          <Package size={48} className="mx-auto text-bb-text-muted mb-4" />
          <p className="text-bb-text-muted mb-4">Aucun produit dans le catalogue.</p>
          <Link href="/admin/produits/nouveau" className="text-bb-gold font-medium">Créer le premier produit</Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {products.map((product) => (
            <div key={product.id} className="bg-bb-gray border border-bb-gray-mid rounded-xl p-3 md:p-4 flex items-center gap-4">
              <div className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0 bg-[#0A0A0A] rounded-lg overflow-hidden border border-bb-gray-mid flex items-center justify-center">
                {product.images?.[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="text-bb-text-muted" size={24} />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-bb-white truncate">{product.name}</h3>
                <div className="flex items-center gap-2 text-xs md:text-sm text-bb-text-muted mt-1">
                  <span>{product.category}</span>
                  <span>•</span>
                  <span className="text-bb-gold font-medium">
                    {product.isNegotiable ? `${product.priceMin}${CURRENCY_SYMBOL} - ${product.priceMax}${CURRENCY_SYMBOL}` : `${product.priceMin}${CURRENCY_SYMBOL}`}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 md:gap-4">
                <button
                  onClick={() => toggleActive(product.id, product.active)}
                  className={`w-12 h-6 md:w-14 md:h-7 rounded-full transition-colors relative flex items-center px-1 ${product.active ? 'bg-bb-stock' : 'bg-bb-gray-mid'}`}
                >
                  <div className={`w-4 h-4 md:w-5 md:h-5 bg-white rounded-full transition-transform ${product.active ? 'translate-x-6 md:translate-x-7' : 'translate-x-0'}`} />
                </button>
                
                <Link 
                  href={`/admin/produits/${product.id}`}
                  className="p-2 md:p-3 text-bb-text-muted hover:text-bb-gold hover:bg-[#2A2A2A] rounded-lg transition-colors"
                >
                  <Edit2 size={18} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Keep Package icon local for empty state
import { Package } from "lucide-react";
