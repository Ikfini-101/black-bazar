"use client";

import { useState } from "react";
import { Header, Footer } from "@/components/storefront/Layout";
import { useCart } from "@/lib/cart";
import { CURRENCY_SYMBOL } from "@/lib/constants";
import { Trash2, Minus, Plus, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { loadStripe } from "@stripe/stripe-js";

// Init Stripe Client (requires NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_placeholder");

export default function CartPage() {
  const { cart, mounted, removeFromCart, updateQuantity, total } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    street: "",
    city: "",
    postalCode: "",
    country: "France",
  });

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          address: {
            street: formData.street,
            city: formData.city,
            postalCode: formData.postalCode,
            country: formData.country,
          },
          items: cart.map(i => ({
            productId: i.productId,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
            image: i.image,
          })),
        }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Erreur de création de commande");
      }

      if (data.checkoutUrl) {
        // Redirection vers Stripe
        window.location.href = data.checkoutUrl;
      } else {
        // Mode fallback (clés de test invalides)
        if (data.warning) console.warn(data.warning);
        window.location.href = `/commande/confirmation?order=${data.orderId}`;
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (!mounted) return <div className="min-h-screen"><Header /></div>;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-8">Votre Panier</h1>

        {cart.length === 0 ? (
          <div className="text-center py-20 bg-bb-gray border border-bb-gray-mid rounded-xl">
            <p className="text-xl text-bb-white mb-6">Votre panier est vide.</p>
            <Link 
              href="/catalogue"
              className="inline-block bg-bb-gold text-bb-black font-bold uppercase tracking-wide py-3 px-8 rounded-lg hover:bg-bb-gold-light transition-colors"
            >
              Découvrir nos produits
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-12">
            
            {/* LISTE PRODUITS */}
            <div className="lg:col-span-7 space-y-6">
              {cart.map((item) => (
                <div key={item.productId} className="flex gap-4 p-4 bg-bb-gray border border-bb-gray-mid rounded-xl">
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg" />
                  ) : (
                    <div className="w-24 h-24 bg-[#0A0A0A] rounded-lg flex items-center justify-center text-bb-text-muted text-xs">Sans image</div>
                  )}
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-lg leading-tight">{item.name}</h3>
                      <button 
                        onClick={() => removeFromCart(item.productId)}
                        className="text-bb-text-muted hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    
                    <div className="flex justify-between items-end">
                      <div className="flex items-center gap-3 bg-[#0A0A0A] border border-bb-gray-mid rounded-lg p-1">
                        <button 
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="p-1 text-bb-text-muted hover:text-bb-white"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="font-medium w-6 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="p-1 text-bb-text-muted hover:text-bb-white"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <span className="font-bold text-bb-gold">
                        {(item.price * item.quantity).toFixed(2)}{CURRENCY_SYMBOL}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* FORMULAIRE & CHECKOUT */}
            <div className="lg:col-span-5">
              <form onSubmit={handleCheckout} className="bg-bb-gray border border-bb-gray-mid rounded-xl p-6 sticky top-24 space-y-6">
                <h2 className="font-display text-2xl font-bold border-b border-bb-gray-mid pb-4">Livraison</h2>
                
                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-lg">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Email *</label>
                    <input type="email" required value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} className="w-full bg-[#0A0A0A] border border-bb-gray-mid rounded-lg p-2.5 focus:border-bb-gold focus:outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Nom complet *</label>
                    <input type="text" required value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} className="w-full bg-[#0A0A0A] border border-bb-gray-mid rounded-lg p-2.5 focus:border-bb-gold focus:outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Adresse postale *</label>
                    <input type="text" required value={formData.street} onChange={e=>setFormData({...formData, street: e.target.value})} className="w-full bg-[#0A0A0A] border border-bb-gray-mid rounded-lg p-2.5 focus:border-bb-gold focus:outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Code postal *</label>
                      <input type="text" required value={formData.postalCode} onChange={e=>setFormData({...formData, postalCode: e.target.value})} className="w-full bg-[#0A0A0A] border border-bb-gray-mid rounded-lg p-2.5 focus:border-bb-gold focus:outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Ville *</label>
                      <input type="text" required value={formData.city} onChange={e=>setFormData({...formData, city: e.target.value})} className="w-full bg-[#0A0A0A] border border-bb-gray-mid rounded-lg p-2.5 focus:border-bb-gold focus:outline-none" />
                    </div>
                  </div>
                </div>

                <div className="border-t border-bb-gray-mid pt-4 mt-6">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-lg">Total</span>
                    <span className="text-2xl font-bold text-bb-gold">{total.toFixed(2)}{CURRENCY_SYMBOL}</span>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-bb-white text-bb-black font-bold uppercase tracking-wide py-4 rounded-xl flex justify-center items-center gap-2 hover:bg-bb-gold transition-colors disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : "Payer en toute sécurité"}
                    {!loading && <ArrowRight size={20} />}
                  </button>
                  <p className="text-center text-xs text-bb-text-muted mt-3 flex items-center justify-center gap-1">
                    🔒 Paiement sécurisé via Stripe
                  </p>
                </div>
              </form>
            </div>

          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
