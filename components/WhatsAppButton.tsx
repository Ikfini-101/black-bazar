"use client";

import { MessageCircle } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/lib/constants";

export default function WhatsAppButton({ 
  message = "Bonjour, j'aimerais avoir plus d'informations sur vos produits.",
  showText = false
}: { 
  message?: string;
  showText?: boolean;
}) {
  const url = `https://wa.me/${WHATSAPP_NUMBER.replace(/\+/g, "")}?text=${encodeURIComponent(message)}`;

  if (showText) {
    return (
      <a 
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full bg-transparent border-2 border-[#C9A84C] text-[#C9A84C] font-bold uppercase tracking-wide py-3.5 rounded-lg flex justify-center items-center gap-2 hover:bg-[#C9A84C] hover:text-[#0A0A0A] transition-colors"
      >
        <MessageCircle size={20} />
        Je suis intéressé(e)
      </a>
    );
  }

  // Floating button
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-105 transition-transform flex items-center justify-center"
      aria-label="Contactez-nous sur WhatsApp"
    >
      <MessageCircle size={28} />
    </a>
  );
}
