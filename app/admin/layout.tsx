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

  // Uses BB-07 light theme with Inter font globally in admin
  return (
    <div className="min-h-screen bg-admin-bg text-admin-text font-sans flex flex-col md:flex-row selection:bg-admin-primary-500 selection:text-white">
      {/* Sidebar Mobile (Bottom Nav) & Desktop */}
      <nav className="fixed bottom-0 w-full md:relative md:w-64 bg-admin-surface border-t md:border-t-0 md:border-r border-admin-border z-50 shadow-sm md:shadow-none">
        <div className="hidden md:flex p-6 border-b border-admin-border items-center justify-center">
          <h1 className="text-xl font-bold text-admin-primary-500">Black Bazaar</h1>
        </div>
        
        <ul className="flex md:flex-col justify-around md:justify-start p-2 md:p-4 gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            const Icon = item.icon;
            
            return (
              <li key={item.href} className="flex-1 md:flex-none">
                <Link
                  href={item.href}
                  className={`flex flex-col md:flex-row items-center gap-1 md:gap-3 p-3 rounded-xl transition-colors ${
                    isActive 
                      ? "bg-admin-primary-50 text-admin-primary-500 font-bold" 
                      : "text-admin-text-muted hover:text-admin-text hover:bg-neutral-100"
                  }`}
                >
                  <Icon size={20} className={isActive ? "text-admin-primary-500" : ""} />
                  <span className="text-xs md:text-sm">{item.label}</span>
                </Link>
              </li>
            );
          })}
          
          <li className="hidden md:block mt-auto pt-8 border-t border-admin-border mt-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors text-sm font-medium"
            >
              <LogOut size={20} />
              Déconnexion
            </button>
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
