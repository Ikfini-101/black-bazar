"use client";

import ProductForm from "@/components/admin/ProductForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <Link href="/admin/produits" className="text-bb-text-muted hover:text-bb-gold flex items-center gap-2 text-sm w-fit">
        <ArrowLeft size={16} />
        Retour au catalogue
      </Link>
      <ProductForm />
    </div>
  );
}
