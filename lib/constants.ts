// BB-PRD §8 — Règles métier transverses

export const CATEGORIES = [
  "Alimentation",
  "Beauté & Corps",
  "Mode & Textile",
  "Art & Artisanat",
  "Bien-être",
  "Culture",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_ICONS: Record<Category, string> = {
  "Alimentation": "🌿",
  "Beauté & Corps": "💆",
  "Mode & Textile": "👗",
  "Art & Artisanat": "🏺",
  "Bien-être": "🌱",
  "Culture": "🎵",
};

export const COUNTRIES = [
  { name: "Sénégal", flag: "🇸🇳" },
  { name: "Côte d'Ivoire", flag: "🇨🇮" },
  { name: "Maroc", flag: "🇲🇦" },
  { name: "Ghana", flag: "🇬🇭" },
  { name: "Cameroun", flag: "🇨🇲" },
  { name: "Nigeria", flag: "🇳🇬" },
] as const;

export type CountryName = (typeof COUNTRIES)[number]["name"];

export const RARITY = ["RARE", "AVAILABLE", "IN_STOCK"] as const;
export type Rarity = (typeof RARITY)[number];

export const RARITY_CONFIG: Record<Rarity, { label: string; color: string; bgColor: string }> = {
  RARE: { label: "Rare", color: "#FC8181", bgColor: "#E53E3E20" },
  AVAILABLE: { label: "Disponible", color: "#C9A84C", bgColor: "#C9A84C20" },
  IN_STOCK: { label: "En stock", color: "#38A169", bgColor: "#38A16920" },
};

export const ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ORDER_STATUS_CONFIG: Record<OrderStatus, { label: string; color: string }> = {
  PENDING: { label: "En attente", color: "#ECC94B" },
  CONFIRMED: { label: "Confirmée", color: "#4299E1" },
  SHIPPED: { label: "Expédiée", color: "#9F7AEA" },
  DELIVERED: { label: "Livrée", color: "#38A169" },
  CANCELLED: { label: "Annulée", color: "#E53E3E" },
};

export const WHATSAPP_NUMBER = process.env.WHATSAPP_NUMBER || "+33600000000";

export const CURRENCY = "EUR";
export const CURRENCY_SYMBOL = "€";
