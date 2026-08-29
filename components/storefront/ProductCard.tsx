import Link from "next/link";
import { RARITY_CONFIG, CURRENCY_SYMBOL } from "@/lib/constants";

export default function ProductCard({ product }: { product: any }) {
  const rarityConf = RARITY_CONFIG[product.rarity as keyof typeof RARITY_CONFIG] || RARITY_CONFIG.AVAILABLE;

  return (
    <Link href={`/produit/${product.id}`} className="group block bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl overflow-hidden hover:border-[#C9A84C] transition-colors relative">
      {/* Badge Rareté */}
      <div 
        className="absolute top-3 right-3 z-10 px-2 py-1 text-xs font-bold rounded border backdrop-blur-sm shadow-sm"
        style={{ 
          color: rarityConf.color, 
          backgroundColor: `${rarityConf.bgColor}90`,
          borderColor: `${rarityConf.color}40`
        }}
      >
        {rarityConf.label}
      </div>

      {/* Pays */}
      {product.country && (
        <div className="absolute top-3 left-3 z-10 px-2 py-1 text-xs font-bold rounded bg-bb-black/70 text-bb-white backdrop-blur-sm border border-bb-gray-mid shadow-sm">
          {product.country}
        </div>
      )}

      {/* Image */}
      <div className="aspect-[4/3] bg-[#0A0A0A] relative overflow-hidden">
        {product.images?.[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img 
            src={product.images[0]} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#2A2A2A]">
            Sans image
          </div>
        )}
      </div>

      {/* Contenu */}
      <div className="p-4 flex flex-col h-[130px] justify-between">
        <div>
          <h3 className="font-display text-lg font-bold text-bb-white truncate">{product.name}</h3>
          <p className="text-sm text-[#888888] truncate mt-1">{product.category}</p>
        </div>

        <div className="flex items-center justify-between mt-2">
          {product.isNegotiable ? (
            <div className="flex flex-col">
              <span className="text-[#C9A84C] font-bold">
                {product.priceMin}{CURRENCY_SYMBOL} – {product.priceMax}{CURRENCY_SYMBOL}
              </span>
              <span className="text-xs text-[#888888]">💬 Négociable</span>
            </div>
          ) : (
            <span className="text-xl font-bold text-bb-white">
              {product.priceMin}{CURRENCY_SYMBOL}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
