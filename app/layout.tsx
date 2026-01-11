import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Navbar } from "@/components/navbar"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Clínica Veterinaria Priscila Silva - Cardióloga Veterinaria",
  description: "Cardióloga veterinaria especializada en el cuidado del corazón de tus mascotas. Servicios veterinarios de calidad y atención profesional.",
  generator: "v0.app",
  keywords: ["veterinaria", "cardiología veterinaria", "Priscila Silva", "clínica veterinaria", "mascotas", "cardióloga"],
  authors: [{ name: "Priscila Silva" }],
  creator: "Priscila Silva",
  
  // Open Graph (Facebook, WhatsApp, LinkedIn)
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "https://veterinaria-priscila.com", // Cambia por tu dominio real
    siteName: "Clínica Veterinaria Priscila Silva",
    title: "Priscila Silva - Cardióloga Veterinaria",
    description: "Cardióloga veterinaria especializada en el cuidado del corazón de tus mascotas. Atención profesional y de calidad.",
    images: [
      {
        url: "/og-image.png", // Crea esta imagen de 1200x630px
        width: 1200,
        height: 630,
        alt: "Clínica Veterinaria Priscila Silva",
      },
      {
        url: "/logo1.png",
        width: 800,
        height: 600,
        alt: "Logo Priscila Silva Veterinaria",
      },
    ],
  },

  // Twitter
  twitter: {
    card: "summary_large_image",
    title: "Priscila Silva - Cardióloga Veterinaria",
    description: "Cardióloga veterinaria especializada en el cuidado del corazón de tus mascotas.",
    images: ["/og-image.png"], // Misma imagen que Open Graph
    creator: "@tuusuario", // Opcional: tu usuario de Twitter
  },

  // Iconos
  icons: {
    icon: [
      {
        url: "/icon-light.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/logo111.png",
        type: "image/png",
      },
    ],
    apple: "/logo111.png",
  },

  // Configuración adicional
  metadataBase: new URL("https://veterinaria-priscila.com"), // Cambia por tu dominio
  alternates: {
    canonical: "/",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`font-sans antialiased`}>
        <Navbar />
        {children}
        <Analytics />
      </body>
    </html>
  )
}