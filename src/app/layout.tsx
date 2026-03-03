import type { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import { GOOGLE_FONTS_URL } from "@/lib/fonts";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  weight: ["400", "600", "700", "800", "900"],
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FoodSocial AI — Transforma tus platos en publicaciones irresistibles",
  description:
    "IA que convierte las fotos de tus platos en contenido profesional para redes sociales. Créditos on-demand, sin suscripción.",
  keywords: ["food photography", "AI", "social media", "restaurant marketing", "content creation"],
  openGraph: {
    title: "FoodSocial AI",
    description: "Transforma las fotos de tus platos en publicaciones irresistibles con IA",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        {/* Canvas fonts (Google Fonts for Fabric.js text overlays) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href={GOOGLE_FONTS_URL} rel="stylesheet" />
      </head>
      <body
        className={`${playfair.variable} ${poppins.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
