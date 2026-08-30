import { Header, Footer } from "@/components/storefront/Layout";
import Link from "next/link";
import { CheckCircle2, Package, ArrowRight } from "lucide-react";

export default async function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const orderId = resolvedParams.id as string;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-20 flex flex-col items-center justify-center">
        <div className="admin-glass-panel text-center w-full relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 glass-gold"></div>
          
          <div className="w-20 h-20 glass-gold rounded-full flex items-center justify-center mx-auto mb-6 shadow-md border border-bb-gold">
            <CheckCircle2 size={40} className="text-bb-gold" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-black mb-4 text-gray-800 tracking-tight">Commande confirmée !</h1>
          
          <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto font-medium leading-relaxed">
            Merci pour votre confiance. Votre commande est en cours de préparation et sera expédiée très prochainement.
          </p>

          <div className="bg-transparent border border-white/60 rounded-xl p-6 mb-8 max-w-sm mx-auto shadow-inner text-left">
            <div className="flex items-center gap-3 mb-2 text-gray-500 font-bold text-sm uppercase tracking-wider">
              <Package size={18} className="text-admin-accent-500" />
              Numéro de suivi
            </div>
            <p className="font-mono font-medium text-gray-800 break-all glass-sm p-3 rounded-lg border border-white/60 text-center text-sm">
              {orderId || "BB-XXXXXXXX"}
            </p>
          </div>

          <Link 
            href="/catalogue"
            className="inline-flex items-center gap-2 glass-gold text-gray-800 font-bold py-4 px-8 rounded-xl hover:glass-gold transition-all shadow-lg shadow-bb-gold/30 hover:-translate-y-1"
          >
            Continuer vos achats <ArrowRight size={20} />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
