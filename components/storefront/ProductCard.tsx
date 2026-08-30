import Link from "next/link";
import { RARITY_CONFIG, CURRENCY_SYMBOL } from "@/lib/constants";

export default function ProductCard({ product }: { product: any }) {
  const rarityConf = RARITY_CONFIG[product.rarity as keyof typeof RARITY_CONFIG] || RARITY_CONFIG.AVAILABLE;

  return (
    <Link href={`/produit/${product.id}`} className="group glass-sm flex flex-col overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-300 relative">
      {/* Badge Rareté */}
      <div className="absolute top-3 right-3 z-10 px-3 py-1 text-xs font-bold glass-xs" style={{ color: rarityConf.color }}>
        {rarityConf.label}
      </div>

      {/* Pays */}
      {product.country && (
        <div className="absolute top-3 left-3 z-10 px-3 py-1 text-xs font-bold text-gray-600 glass-xs">
          {product.country}
        </div>
      )}

      {/* Image */}
      <div className="aspect-[4/3] bg-gray-200/50 relative overflow-hidden rounded-t-xl">
        {product.images?.[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 font-medium text-sm">Sans image</div>
        )}
      </div>

      {/* Infos */}
      <div className="p-5 flex flex-col gap-3 flex-1 justify-between">
        <div>
          <h3 className="text-base font-bold text-gray-800 truncate group-hover:text-bb-gold transition-colors">{product.name}</h3>
          <p className="text-xs text-gray-500 truncate mt-0.5">{product.category}</p>
        </div>
        
        {/* Curseur de prix flexible */}
        <div className="mt-auto space-y-2 pt-2">
          <div className="flex justify-between items-center text-xs font-bold text-gray-700">
            <span>{product.priceMin}{CURRENCY_SYMBOL}</span>
            <span className="uppercase tracking-wider text-[9px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Flexible</span>
            <span>{product.priceMax ? product.priceMax : Math.round(product.priceMin * 1.5)}{CURRENCY_SYMBOL}</span>
          </div>
          <div className="relative w-full h-1.5 bg-gray-200 rounded-full">
             <div className="absolute top-0 left-[20%] right-[30%] h-full bg-bb-gold/80 rounded-full"></div>
             <div className="absolute top-1/2 left-[45%] -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white border-2 border-bb-gold rounded-full shadow-sm"></div>
          </div>
        </div>
      </div>
    </Link>
  );
}
