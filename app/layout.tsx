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
    <html lang="fr" className={`${inter.variable} ${playfair.variable}`} style={{ backgroundImage: "url('/bg-market.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed", backgroundRepeat: "no-repeat" }}>
      <body
        className="min-h-screen font-sans text-gray-800 selection:text-gray-900 flex flex-col"
        style={{ background: "transparent", minHeight: "100vh" }}
      >
        {children}
      </body>
    </html>
  );
}
