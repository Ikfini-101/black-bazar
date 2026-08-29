"use client";

import { useState, useEffect, use } from "react";
import { Header, Footer } from "@/components/storefront/Layout";
import WhatsAppButton from "@/components/WhatsAppButton";
import { RARITY_CONFIG, CURRENCY_SYMBOL } from "@/lib/constants";
import { useCart } from "@/lib/cart";
import { Loader2, ShoppingCart, Check, Info } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState<string>("");
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) {
          if (res.status === 404) notFound();
          throw new Error("Erreur");
        }
        const data = await res.json();
        setProduct(data);
        if (data.images?.[0]) setMainImage(data.images[0]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex justify-center items-center"><Loader2 className="animate-spin text-bb-gold" size={48} /></main>
      </div>
    );
  }

  if (!product) return notFound();

  const rarityConf = RARITY_CONFIG[product.rarity as keyof typeof RARITY_CONFIG] || RARITY_CONFIG.AVAILABLE;
  
  const handleAddToCart = () => {
    if (product.isNegotiable) return;
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.priceMin,
      quantity: 1,
      image: product.images?.[0],
      isNegotiable: false,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const whatsappMessage = `Bonjour, je suis intéressé(e) par ${product.name} (réf: ${product.id}). Prix affiché : ${product.priceMin}€–${product.priceMax}€. Est-ce disponible ?`;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          
          {/* GALERIE PHOTOS */}
          <div className="space-y-4">
            <div className="aspect-[4/3] bg-bb-gray rounded-xl overflow-hidden border border-bb-gray-mid">
              {mainImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={mainImage} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-bb-text-muted">Sans image</div>
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {product.images.map((img: string, i: number) => (
                  <button 
                    key={i} 
                    onClick={() => setMainImage(img)}
                    className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${mainImage === img ? 'border-bb-gold' : 'border-bb-gray-mid opacity-70 hover:opacity-100'}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* INFOS PRODUIT */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {product.country && (
                  <span className="px-3 py-1 bg-bb-gray border border-bb-gray-mid rounded-full text-xs font-bold uppercase tracking-wide">
                    {product.country}
                  </span>
                )}
                <span 
                  className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border backdrop-blur-sm"
                  style={{ color: rarityConf.color, backgroundColor: `${rarityConf.bgColor}90`, borderColor: `${rarityConf.color}40` }}
                >
                  {rarityConf.label}
                </span>
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold">{product.name}</h1>
              <p className="text-xl text-bb-text-muted">{product.category}</p>
            </div>

            <div className="py-6 border-y border-bb-gray-mid">
              {product.isNegotiable ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-bb-text-muted uppercase tracking-wider mb-1">Fourchette estimée</p>
                    <div className="flex items-end gap-4">
                      <span className="text-4xl font-bold text-bb-gold">
                        {product.priceMin}{CURRENCY_SYMBOL} – {product.priceMax}{CURRENCY_SYMBOL}
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-bb-gold/10 border border-bb-gold/20 p-4 rounded-lg flex items-start gap-3">
                    <Info size={20} className="text-bb-gold shrink-0 mt-0.5" />
                    <p className="text-sm text-bb-white/90">
                      Ce produit a un prix flexible basé sur le cours du marché et la quantité. Négociez directement avec nous sur WhatsApp pour obtenir le meilleur prix.
                    </p>
                  </div>

                  <WhatsAppButton showText message={whatsappMessage} />
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-bb-text-muted uppercase tracking-wider mb-1">Prix</p>
                    <span className="text-4xl font-bold">{product.priceMin}{CURRENCY_SYMBOL}</span>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={added}
                    className="w-full bg-gradient-to-r from-[#C9A84C] to-[#E8C97A] text-[#0A0A0A] font-bold uppercase tracking-wide py-4 rounded-xl flex justify-center items-center gap-3 hover:opacity-90 transition-all disabled:opacity-80"
                  >
                    {added ? (
                      <><Check size={24} /> Ajouté au panier</>
                    ) : (
                      <><ShoppingCart size={24} /> Ajouter au panier</>
                    )}
                  </button>
                  
                  {added && (
                    <div className="text-center">
                      <Link href="/panier" className="text-bb-gold text-sm hover:underline font-medium">
                        Voir mon panier →
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {product.description && (
              <div className="space-y-4">
                <h2 className="font-display text-2xl font-bold text-bb-gold">L&apos;histoire du produit</h2>
                <div className="prose prose-invert prose-bb max-w-none text-bb-white/80 leading-relaxed whitespace-pre-line">
                  {product.description}
                </div>
              </div>
            )}
          </div>
          
        </div>
      </main>

      <Footer />
      {!product.isNegotiable && <WhatsAppButton />}
    </div>
  );
}
