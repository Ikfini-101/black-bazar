"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Header, Footer } from "@/components/storefront/Layout";
import { useCart } from "@/lib/cart";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");
  const { clearCart } = useCart();

  useEffect(() => {
    if (orderId) {
      clearCart();
    }
  }, [orderId, clearCart]);

  return (
    <div className="flex-1 flex items-center justify-center py-20 px-4">
      <div className="max-w-md w-full bg-bb-gray border border-bb-gray-mid rounded-2xl p-8 text-center space-y-6 shadow-2xl">
        <div className="w-20 h-20 bg-bb-stock-bg text-bb-stock rounded-full flex items-center justify-center mx-auto mb-2">
          <CheckCircle2 size={48} />
        </div>
        
        <h1 className="font-display text-3xl font-bold">Commande confirmée !</h1>
        
        <div className="space-y-2 text-bb-white/80">
          <p>Merci pour votre achat sur Black Bazaar.</p>
          <p>Un email de confirmation vous sera envoyé prochainement avec les détails de livraison.</p>
        </div>

        {orderId && (
          <div className="bg-[#0A0A0A] p-3 rounded-lg border border-bb-gray-mid">
            <p className="text-xs text-bb-text-muted uppercase tracking-wider mb-1">N° de commande</p>
            <p className="font-mono text-bb-gold">{orderId}</p>
          </div>
        )}

        <div className="pt-4 border-t border-bb-gray-mid">
          <Link 
            href="/catalogue"
            className="w-full bg-bb-white text-bb-black font-bold uppercase tracking-wide py-3 rounded-xl flex justify-center items-center gap-2 hover:bg-bb-gold transition-colors"
          >
            Continuer mes achats
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Suspense fallback={<div className="flex-1 flex items-center justify-center">Chargement...</div>}>
        <ConfirmationContent />
      </Suspense>
      <Footer />
    </div>
  );
}
