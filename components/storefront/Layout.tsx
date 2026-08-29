"use client";

import { ShoppingBag, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-bb-black/90 backdrop-blur-md border-b border-bb-gray-mid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="font-display text-2xl font-bold text-bb-gold">
              Black Bazaar
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-8 items-center">
            <Link href="/" className="text-sm font-medium hover:text-bb-gold transition-colors">Accueil</Link>
            <Link href="/catalogue" className="text-sm font-medium hover:text-bb-gold transition-colors">Catalogue</Link>
            <Link href="/panier" className="text-bb-gold hover:text-bb-gold-light transition-colors relative">
              <ShoppingBag size={24} />
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-4">
            <Link href="/panier" className="text-bb-gold relative">
              <ShoppingBag size={24} />
            </Link>
            <button onClick={() => setIsOpen(!isOpen)} className="text-bb-white p-2">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-bb-gray border-b border-bb-gray-mid absolute w-full left-0">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              href="/" 
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-[#2A2A2A] hover:text-bb-gold"
            >
              Accueil
            </Link>
            <Link 
              href="/catalogue" 
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-[#2A2A2A] hover:text-bb-gold"
            >
              Catalogue
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-bb-gray border-t border-bb-gray-mid mt-auto">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-center md:text-left">
          <p className="font-display text-xl text-bb-gold font-bold">Black Bazaar</p>
          <p className="text-sm text-bb-text-muted mt-1">L&apos;Afrique chez vous.</p>
        </div>
        <p className="text-sm text-bb-text-muted">© 2026 Black Bazaar. Tous droits réservés.</p>
      </div>
    </footer>
  );
}
