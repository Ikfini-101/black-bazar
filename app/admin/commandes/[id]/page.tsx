"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, Save, MapPin } from "lucide-react";
import { ORDER_STATUS_CONFIG, ORDER_STATUSES, CURRENCY_SYMBOL } from "@/lib/constants";

export default function OrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/admin/orders/${id}`);
        if (!res.ok) throw new Error("Non trouvé");
        const data = await res.json();
        setOrder(data);
        setStatus(data.status);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [id]);

  async function updateStatus() {
    setSaving(true);
    try {
      await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      // reload
      const res = await fetch(`/api/admin/orders/${id}`);
      setOrder(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-bb-gold" size={32} /></div>;
  if (!order) return <div className="text-center p-12 text-bb-rare">Commande introuvable.</div>;

  const currentStatusConf = ORDER_STATUS_CONFIG[order.status as keyof typeof ORDER_STATUS_CONFIG];

  return (
    <div className="space-y-6 pb-12">
      <Link href="/admin/commandes" className="text-bb-text-muted hover:text-bb-gold flex items-center gap-2 text-sm w-fit">
        <ArrowLeft size={16} />
        Retour aux commandes
      </Link>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-bb-gray-mid pb-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Commande</h1>
          <p className="text-sm text-bb-text-muted font-mono mt-1">{order.id}</p>
        </div>
        <div 
          className="text-sm px-3 py-1 rounded-full border bg-opacity-10 font-medium w-fit"
          style={{ color: currentStatusConf.color, borderColor: `${currentStatusConf.color}40`, backgroundColor: `${currentStatusConf.color}20` }}
        >
          {currentStatusConf.label}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Update Status */}
        <div className="bg-bb-gray border border-bb-gray-mid rounded-xl p-5 space-y-4">
          <h2 className="font-display text-xl text-bb-gold">Mettre à jour le statut</h2>
          <div className="flex gap-3">
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              className="flex-1 bg-[#0A0A0A] border border-bb-gray-mid rounded-lg p-3 focus:outline-none focus:border-bb-gold"
            >
              {ORDER_STATUSES.map(s => <option key={s} value={s}>{ORDER_STATUS_CONFIG[s].label}</option>)}
            </select>
            <button
              onClick={updateStatus}
              disabled={saving || status === order.status}
              className="bg-bb-gold text-bb-black px-4 rounded-lg font-medium hover:bg-bb-gold-light disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              <span className="hidden md:inline">Enregistrer</span>
            </button>
          </div>
        </div>

        {/* Customer Info */}
        <div className="bg-bb-gray border border-bb-gray-mid rounded-xl p-5 space-y-4">
          <h2 className="font-display text-xl text-bb-gold">Client & Livraison</h2>
          <div className="text-sm space-y-2">
            <p><span className="text-bb-text-muted">Email :</span> {order.customerEmail}</p>
            {order.customerName && <p><span className="text-bb-text-muted">Nom :</span> {order.customerName}</p>}
            
            <div className="flex gap-2 mt-4 pt-4 border-t border-bb-gray-mid">
              <MapPin size={18} className="text-bb-text-muted shrink-0 mt-0.5" />
              <div>
                <p>{order.shippingAddress?.street}</p>
                <p>{order.shippingAddress?.postalCode} {order.shippingAddress?.city}</p>
                <p>{order.shippingAddress?.country}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="bg-bb-gray border border-bb-gray-mid rounded-xl p-5">
        <h2 className="font-display text-xl text-bb-gold mb-4">Articles ({order.items.length})</h2>
        <div className="divide-y divide-bb-gray-mid">
          {order.items.map((item: any, i: number) => (
            <div key={i} className="py-3 flex justify-between items-center">
              <div className="flex items-center gap-3">
                {item.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.image} alt="" className="w-12 h-12 rounded object-cover border border-bb-gray-mid" />
                )}
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-bb-text-muted">Qté: {item.quantity}</p>
                </div>
              </div>
              <div className="font-medium">
                {(item.price * item.quantity).toFixed(2)}{CURRENCY_SYMBOL}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-bb-gray-mid">
          <span className="text-lg font-medium">Total payé</span>
          <span className="text-2xl font-bold text-bb-gold">{order.total.toFixed(2)}{CURRENCY_SYMBOL}</span>
        </div>
      </div>
    </div>
  );
}
