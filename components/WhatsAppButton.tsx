"use client";

import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";

export default function WhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false);

  // Pour éviter des problèmes d'hydratation, on ne l'affiche qu'côté client
  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (!isVisible) return null;

  return (
    <a
      href="https://wa.me/33700000000"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
      aria-label="Contactez-nous sur WhatsApp"
    >
      <MessageCircle size={28} />
      
      {/* Tooltip au hover */}
      <span className="absolute right-full mr-4 glass-sm text-gray-800 text-sm font-bold px-4 py-2 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md border border-white/60">
        Besoin d&apos;aide ?
      </span>
    </a>
  );
}
