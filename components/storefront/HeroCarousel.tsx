"use client";

import { useEffect, useRef, useState } from "react";
import ProductCard from "@/components/storefront/ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function HeroCarousel({ products }: { products: any[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Vérifier si on peut scroller
  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [products]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8; // Scroll 80% of width
      scrollRef.current.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
    }
  };

  // Autoplay simple (optionnel, mais sympa pour un hero)
  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (scrollLeft >= scrollWidth - clientWidth - 10) {
          // Retour au début
          scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          // Avancer
          scroll("right");
        }
      }
    }, 4000); // Défile toutes les 4s
    return () => clearInterval(interval);
  }, []);

  if (!products || products.length === 0) return null;

  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 py-8 overflow-hidden group">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-gray-800 tracking-tight glass-md inline-block px-4 py-2">
          À la une
        </h2>
        <div className="flex gap-2">
          <button 
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className="p-2 rounded-full glass-md hover:bg-white/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Précédent"
          >
            <ChevronLeft size={24} className="text-gray-800" />
          </button>
          <button 
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className="p-2 rounded-full glass-md hover:bg-white/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Suivant"
          >
            <ChevronRight size={24} className="text-gray-800" />
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 pt-2 -mx-4 px-4 scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }} // Cache la scrollbar
      >
        {products.map((product) => (
          <div key={product.id} className="min-w-[280px] md:min-w-[320px] lg:min-w-[360px] snap-center snap-always shrink-0">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
