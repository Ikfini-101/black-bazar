"use client";

import { useEffect, useState, use } from "react";
import { Header, Footer } from "@/components/storefront/Layout";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, Loader2, MessageCircle } from "lucide-react";
import { useCart } from "@/lib/cart";
import { RARITY_CONFIG, CURRENCY_SYMBOL } from "@/lib/constants";
import { useRouter } from "next/navigation";

export default function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const router = useRouter();
  
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/admin/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex flex-col bg-transparent">
      <Header />
      <div className="flex-1 flex justify-center items-center"><Loader2 className="animate-spin text-bb-gold" size={48} /></div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex flex-col bg-transparent">
      <Header />
      <div className="flex-1 flex justify-center items-center flex-col gap-4">
        <p className="text-xl text-gray-800 font-bold">Produit introuvable</p>
        <Link href="/catalogue" className="text-bb-gold font-bold hover:underline">Retour au catalogue</Link>
      </div>
    </div>
  );

  const rarityConf = RARITY_CONFIG[product.rarity as keyof typeof RARITY_CONFIG] || RARITY_CONFIG.AVAILABLE;

  const handleAddToCart = () => {
    addItem(product, quantity);
    router.push('/panier');
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`Bonjour, je suis intéressé par le produit "${product.name}". Est-il possible d'en discuter ?`);
    window.open(`https://wa.me/33700000000?text=${text}`, '_blank');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <Link href="/catalogue" className="text-gray-500 hover:text-bb-gold font-bold flex items-center gap-2 text-sm w-fit mb-8 transition-colors">
          <ArrowLeft size={16} /> Retour au catalogue
        </Link>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
          {/* Images Section */}
          <div className="space-y-4">
            <div className="aspect-[4/3] w-full glass-sm border border-white/60 rounded-2xl overflow-hidden relative shadow-md">
              {product.images?.[activeImage] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={product.images[activeImage]} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500 font-medium">Sans image</div>
              )}
            </div>
            
            {product.images?.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {product.images.map((img: string, idx: number) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`w-20 h-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-bb-gold shadow-md scale-105' : 'border-transparent opacity-70 hover:opacity-100'}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="flex flex-col admin-glass-panel border-0">
            <div className="mb-6 space-y-4 border-b border-white/60 pb-6">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-bb-gold glass-gold px-3 py-1 rounded-full">{product.category}</span>
                {product.country && <span className="text-sm font-bold text-gray-800 border border-white/60 glass-sm px-3 py-1 rounded-full">{product.country}</span>}
              </div>
              
              <h1 className="text-4xl md:text-5xl font-black text-gray-800 tracking-tight">{product.name}</h1>
              
              <div className="flex items-center gap-4">
                {product.isNegotiable ? (
                  <span className="text-3xl font-black text-admin-accent-500">
                    {product.priceMin}{CURRENCY_SYMBOL} – {product.priceMax}{CURRENCY_SYMBOL}
                  </span>
                ) : (
                  <span className="text-3xl font-black text-bb-gold">
                    {product.priceMin}{CURRENCY_SYMBOL}
                  </span>
                )}
                <span 
                  className="px-3 py-1 text-sm font-bold rounded-lg border glass-sm shadow-md"
                  style={{ color: rarityConf.color, borderColor: `${rarityConf.color}40` }}
                >
                  {rarityConf.label}
                </span>
              </div>
            </div>

            <div className="prose prose-admin mb-8 text-gray-500 font-medium">
              <p className="whitespace-pre-wrap leading-relaxed">{product.description || "Aucune description disponible pour ce produit."}</p>
            </div>

            {/* Action Box */}
            <div className="mt-auto glass-sm border border-white/60 rounded-2xl p-6 shadow-md">
              {product.isNegotiable ? (
                <div className="space-y-4">
                  <div className="bg-admin-accent-50 border border-admin-accent-200 rounded-xl p-4 flex gap-4">
                    <MessageCircle className="text-admin-accent-600 shrink-0" size={24} />
                    <div>
                      <h4 className="font-bold text-admin-accent-900 mb-1">Produit rare à négocier</h4>
                      <p className="text-sm text-admin-accent-800 font-medium">
                        Ce produit d'exception est disponible sur demande. Contactez-nous sur WhatsApp pour finaliser le prix et organiser la livraison.
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={handleWhatsApp}
                    className="w-full bg-[#25D366] hover:bg-[#1ebc59] text-white font-bold text-lg py-4 rounded-xl flex items-center justify-center gap-2 transition-transform hover:-translate-y-1 shadow-lg shadow-[#25D366]/30"
                  >
                    <MessageCircle size={24} />
                    Négocier sur WhatsApp
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-gray-800">Quantité</span>
                    <div className="flex items-center bg-transparent border border-white/60 rounded-xl">
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-3 hover:bg-neutral-200 transition-colors font-bold text-gray-800 rounded-l-xl">-</button>
                      <span className="w-12 text-center font-bold text-gray-800">{quantity}</span>
                      <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-3 hover:bg-neutral-200 transition-colors font-bold text-gray-800 rounded-r-xl">+</button>
                    </div>
                  </div>
                  
                  <button 
                    onClick={handleAddToCart}
                    className="w-full glass-gold hover:glass-gold text-gray-800 font-bold text-lg py-4 rounded-xl flex items-center justify-center gap-2 transition-transform hover:-translate-y-1 shadow-lg shadow-bb-gold/30"
                  >
                    <ShoppingBag size={24} />
                    Ajouter au panier • {(product.priceMin * quantity).toFixed(2)}{CURRENCY_SYMBOL}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
