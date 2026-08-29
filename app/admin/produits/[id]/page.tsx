"use client";

import { useEffect, useState, use } from "react";
import ProductForm from "@/components/admin/ProductForm";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/admin/products/${id}`);
        if (!res.ok) throw new Error("Non trouvé");
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

  return (
    <div className="space-y-6">
      <Link href="/admin/produits" className="text-bb-text-muted hover:text-bb-gold flex items-center gap-2 text-sm w-fit">
        <ArrowLeft size={16} />
        Retour au catalogue
      </Link>
      
      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="animate-spin text-bb-gold" size={32} />
        </div>
      ) : product ? (
        <ProductForm initialData={product} />
      ) : (
        <div className="text-center p-12 text-bb-rare">
          Produit introuvable.
        </div>
      )}
    </div>
  );
}
