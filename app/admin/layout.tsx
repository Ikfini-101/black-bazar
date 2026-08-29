"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Package, ShoppingBag, LogOut } from "lucide-react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Produits", href: "/admin/produits", icon: Package },
    { label: "Commandes", href: "/admin/commandes", icon: ShoppingBag },
  ];

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-bb-black flex flex-col md:flex-row">
      {/* Sidebar Mobile (Bottom Nav) & Desktop */}
      <nav className="fixed bottom-0 w-full md:relative md:w-64 bg-bb-gray border-t md:border-t-0 md:border-r border-bb-gray-mid z-50">
        <div className="hidden md:flex p-6 border-b border-bb-gray-mid items-center justify-center">
          <h1 className="font-display text-xl font-bold text-bb-gold">Black Bazaar</h1>
        </div>
        
        <ul className="flex md:flex-col justify-around md:justify-start p-2 md:p-4 gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            const Icon = item.icon;
            
            return (
              <li key={item.href} className="flex-1 md:flex-none">
                <Link
                  href={item.href}
                  className={`flex flex-col md:flex-row items-center gap-1 md:gap-3 p-3 rounded-lg transition-colors ${
                    isActive 
                      ? "bg-bb-gold/10 text-bb-gold font-medium" 
                      : "text-bb-text-muted hover:text-white hover:bg-[#2A2A2A]"
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-xs md:text-sm">{item.label}</span>
                </Link>
              </li>
            );
          })}
          
          <li className="hidden md:block mt-auto pt-8">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-3 text-bb-rare hover:bg-bb-rare-bg rounded-lg transition-colors text-sm"
            >
              <LogOut size={20} />
              Déconnexion
            </button>
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
