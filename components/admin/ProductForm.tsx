"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Loader2, X, AlertTriangle } from "lucide-react";
import { CATEGORIES, COUNTRIES, RARITY, CURRENCY_SYMBOL } from "@/lib/constants";

export default function ProductForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    category: initialData?.category || CATEGORIES[0],
    country: initialData?.country || COUNTRIES[0].name,
    isNegotiable: initialData?.isNegotiable || false,
    priceMin: initialData?.priceMin || "",
    priceMax: initialData?.priceMax || "",
    rarity: initialData?.rarity || "AVAILABLE",
    active: initialData?.active ?? true,
    images: initialData?.images || [] as string[],
  });

  const [uploadingImages, setUploadingImages] = useState(false);

  async function compressImage(file: File): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 1600;
          const MAX_HEIGHT = 1600;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob);
              else reject(new Error("Compression échouée"));
            },
            "image/jpeg",
            0.8
          );
        };
      };
    });
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (formData.images.length + files.length > 5) {
      setError("Maximum 5 photos par produit");
      return;
    }

    setUploadingImages(true);
    setError("");

    try {
      const newImages = [...formData.images];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const compressedBlob = await compressImage(file);
        
        const uploadData = new FormData();
        uploadData.append("file", compressedBlob, "image.jpg");
        if (initialData?.id) uploadData.append("productId", initialData.id);

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: uploadData,
        });

        if (!res.ok) throw new Error("Erreur lors de l'upload");
        const { url } = await res.json();
        newImages.push(url);
      }
      setFormData({ ...formData, images: newImages });
    } catch (err: any) {
      setError(err.message || "Erreur upload d'image");
    } finally {
      setUploadingImages(false);
    }
  }

  function removeImage(index: number) {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData({ ...formData, images: newImages });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (formData.images.length === 0) {
      setError("Il faut au moins 1 photo pour publier un produit.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const pMin = parseFloat(formData.priceMin as string);
    const pMax = parseFloat(formData.priceMax as string);

    if (formData.isNegotiable && (!pMax || pMax <= pMin)) {
      setError("Le prix maximum doit être supérieur au prix minimum.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...formData,
        priceMin: pMin,
        priceMax: formData.isNegotiable ? pMax : null,
      };

      const url = initialData ? `/api/admin/products/${initialData.id}` : "/api/admin/products";
      const method = initialData ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur sauvegarde");

      router.push("/admin/produits");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8 max-w-2xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">
          {initialData ? "Modifier" : "Nouveau produit"}
        </h1>
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium">Actif</label>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, active: !formData.active })}
            className={`w-14 h-7 rounded-full transition-colors relative flex items-center px-1 ${formData.active ? 'bg-bb-stock' : 'bg-bb-gray-mid'}`}
          >
            <div className={`w-5 h-5 bg-white rounded-full transition-transform ${formData.active ? 'translate-x-7' : 'translate-x-0'}`} />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 flex items-start gap-3">
          <AlertTriangle size={20} className="shrink-0 mt-0.5" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* SECTION PHOTOS */}
      <div className="bg-bb-gray border border-bb-gray-mid rounded-xl p-4 md:p-6 space-y-4">
        <h2 className="font-display text-xl text-bb-gold">Photos (1 à 5)</h2>
        
        <div className="flex flex-wrap gap-4">
          {formData.images.map((url, i) => (
            <div key={i} className="relative w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden border border-bb-gray-mid group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`Photo ${i+1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 bg-red-500/80 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={16} />
              </button>
            </div>
          ))}

          {formData.images.length < 5 && (
            <label className="w-24 h-24 md:w-32 md:h-32 border-2 border-dashed border-bb-gray-mid hover:border-bb-gold rounded-lg flex flex-col items-center justify-center cursor-pointer text-bb-text-muted hover:text-bb-gold transition-colors">
              {uploadingImages ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <>
                  <Camera size={24} className="mb-2" />
                  <span className="text-xs font-medium">Ajouter</span>
                </>
              )}
              {/* capture="environment" force the rear camera on mobile */}
              <input
                type="file"
                accept="image/*"
                capture="environment"
                multiple
                className="hidden"
                onChange={handleImageUpload}
                disabled={uploadingImages}
              />
            </label>
          )}
        </div>
      </div>

      {/* SECTION INFO */}
      <div className="bg-bb-gray border border-bb-gray-mid rounded-xl p-4 md:p-6 space-y-5">
        <h2 className="font-display text-xl text-bb-gold">Informations</h2>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Nom du produit *</label>
          <input
            required
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-[#0A0A0A] border border-bb-gray-mid rounded-lg p-3 focus:outline-none focus:border-bb-gold"
            placeholder="Ex: Beurre de Karité pur"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Description</label>
          <textarea
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            className="w-full bg-[#0A0A0A] border border-bb-gray-mid rounded-lg p-3 min-h-[120px] focus:outline-none focus:border-bb-gold"
            placeholder="Racontez l'histoire de ce produit..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-sm font-medium">Catégorie *</label>
            <select
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value })}
              className="w-full bg-[#0A0A0A] border border-bb-gray-mid rounded-lg p-3 focus:outline-none focus:border-bb-gold"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Pays d'origine</label>
            <select
              value={formData.country}
              onChange={e => setFormData({ ...formData, country: e.target.value })}
              className="w-full bg-[#0A0A0A] border border-bb-gray-mid rounded-lg p-3 focus:outline-none focus:border-bb-gold"
            >
              {COUNTRIES.map(c => <option key={c.name} value={c.name}>{c.flag} {c.name}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Rareté</label>
            <select
              value={formData.rarity}
              onChange={e => setFormData({ ...formData, rarity: e.target.value })}
              className="w-full bg-[#0A0A0A] border border-bb-gray-mid rounded-lg p-3 focus:outline-none focus:border-bb-gold"
            >
              {RARITY.map(r => <option key={r} value={r}>{r === 'IN_STOCK' ? 'En stock' : r === 'AVAILABLE' ? 'Disponible' : 'Rare'}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* SECTION PRIX */}
      <div className="bg-bb-gray border border-bb-gray-mid rounded-xl p-4 md:p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-bb-gray-mid pb-4">
          <div>
            <h2 className="font-display text-xl text-bb-gold">Prix Flexible</h2>
            <p className="text-xs text-bb-text-muted mt-1">Activer pour la négociation via WhatsApp</p>
          </div>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, isNegotiable: !formData.isNegotiable })}
            className={`w-14 h-7 rounded-full transition-colors relative flex items-center px-1 ${formData.isNegotiable ? 'bg-bb-gold' : 'bg-bb-gray-mid'}`}
          >
            <div className={`w-5 h-5 bg-white rounded-full transition-transform ${formData.isNegotiable ? 'translate-x-7' : 'translate-x-0'}`} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {formData.isNegotiable ? "Prix minimum *" : "Prix de vente *"}
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={formData.priceMin}
                onChange={e => setFormData({ ...formData, priceMin: e.target.value })}
                className="w-full bg-[#0A0A0A] border border-bb-gray-mid rounded-lg p-3 pr-10 focus:outline-none focus:border-bb-gold"
                placeholder="0.00"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-bb-text-muted">
                {CURRENCY_SYMBOL}
              </div>
            </div>
          </div>

          {formData.isNegotiable && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-bb-gold">Prix maximum *</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={formData.priceMax}
                  onChange={e => setFormData({ ...formData, priceMax: e.target.value })}
                  className="w-full bg-[#0A0A0A] border border-bb-gold/50 rounded-lg p-3 pr-10 focus:outline-none focus:border-bb-gold"
                  placeholder="0.00"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-bb-text-muted">
                  {CURRENCY_SYMBOL}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || uploadingImages}
        className="w-full bg-gradient-to-r from-[#C9A84C] to-[#E8C97A] text-[#0A0A0A] font-bold uppercase tracking-wide py-4 rounded-xl flex justify-center items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 shadow-lg shadow-bb-gold/20"
      >
        {loading ? <Loader2 className="animate-spin" size={24} /> : (initialData ? "Enregistrer les modifications" : "Publier le produit")}
      </button>
    </form>
  );
}
