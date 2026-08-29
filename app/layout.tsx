import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata = {
  title: "Black Bazaar — L'Afrique chez vous",
  description: "Découvrez des produits africains rares et authentiques, livrés en France.",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="fr" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-[#0A0A0A] text-white min-h-screen font-sans selection:bg-[#C9A84C] selection:text-[#0A0A0A]">
        {children}
      </body>
    </html>
  );
}
