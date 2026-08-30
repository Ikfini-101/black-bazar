"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, ShoppingBag, Plus, ArrowRight } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [prodRes, ordRes] = await Promise.all([
          fetch("/api/admin/products"),
          fetch("/api/admin/orders?status=PENDING"),
        ]);
        const products = await prodRes.json();
        const orders = await ordRes.json();
        
        setStats({
          products: products.products?.filter((p: any) => p.active).length || 0,
          orders: orders.orders?.length || 0,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold">Tableau de bord</h1>
        <Link 
          href="/admin/produits/nouveau"
          className="bg-admin-primary-500 text-white hover:bg-admin-primary-600 transition duration-300 font-bold rounded-lg p-2 md:px-4 md:py-3 flex items-center gap-2 shadow-sm"
        >
          <Plus size={20} />
          <span className="hidden md:inline">Nouveau produit</span>
        </Link>
      </header>

      {loading ? (
        <div className="animate-pulse flex gap-4">
          <div className="h-32 bg-admin-surface border border-admin-border rounded-2xl flex-1"></div>
          <div className="h-32 bg-admin-surface border border-admin-border rounded-2xl flex-1"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div className="admin-glass-panel flex flex-col justify-between">
            <div className="flex items-center gap-3 text-admin-text-muted mb-4">
              <Package size={20} className="text-admin-accent-500" />
              <h2 className="text-sm font-medium">Produits Actifs</h2>
            </div>
            <p className="text-3xl md:text-4xl font-bold">{stats.products}</p>
          </div>
          
          <div className="admin-glass-panel flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center gap-3 text-admin-text-muted mb-4">
              <ShoppingBag size={20} className="text-admin-accent-500" />
              <h2 className="text-sm font-medium">Commandes à traiter</h2>
            </div>
            <p className="text-3xl md:text-4xl font-bold">{stats.orders}</p>
            {stats.orders > 0 && (
              <div className="absolute top-0 right-0 w-2 h-full bg-admin-accent-500"></div>
            )}
          </div>
        </div>
      )}

      <div className="pt-6">
        <h2 className="text-xl font-bold mb-4">Actions rapides</h2>
        <div className="grid gap-3">
          <Link 
            href="/admin/commandes" 
            className="flex items-center justify-between p-4 bg-admin-surface border border-admin-border rounded-xl hover:border-admin-primary-400 hover:shadow-sm transition-all group"
          >
            <span className="font-medium text-admin-text">Voir toutes les commandes</span>
            <ArrowRight size={18} className="text-admin-text-muted group-hover:text-admin-primary-500 transition-colors" />
          </Link>
          <Link 
            href="/admin/produits" 
            className="flex items-center justify-between p-4 bg-admin-surface border border-admin-border rounded-xl hover:border-admin-primary-400 hover:shadow-sm transition-all group"
          >
            <span className="font-medium text-admin-text">Gérer le catalogue</span>
            <ArrowRight size={18} className="text-admin-text-muted group-hover:text-admin-primary-500 transition-colors" />
          </Link>
        </div>
      </div>
    </div>
  );
}
