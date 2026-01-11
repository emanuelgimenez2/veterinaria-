"use client"

import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Heart, Send } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export function Footer() {
  const [email, setEmail] = useState("")
  const [hoveredSocial, setHoveredSocial] = useState<string | null>(null)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter subscription
    console.log("Subscribed:", email)
    setEmail("")
  }

  return (
    <footer className="relative border-t border-border/40 bg-gradient-to-b from-card via-card to-muted/20 overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-12 md:py-16 lg:py-20">
        {/* Main Footer Content */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-12 md:gap-10 lg:gap-12">
          {/* Brand Section - Takes more space */}
          <div className="lg:col-span-4 space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Link href="/" className="flex items-center gap-3 group w-fit">
              <div className="relative h-12 w-12 rounded-full overflow-hidden bg-white shadow-lg ring-2 ring-primary/20 transition-all duration-300 group-hover:ring-primary/50 group-hover:scale-110">
                <Image
                  src="/logo1.png"
                  alt="VetCare Logo"
                  width={48}
                  height={48}
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight md:text-2xl"
                      style={{ 
                        fontFamily: "'Brush Script MT', cursive",
                        color: '#F08CAE'
                      }}>
                  Priscila Silva
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase"
                      style={{ 
                        color: '#2C5F4F',
                        letterSpacing: '0.15em'
                      }}>
                  Cardióloga Veterinaria
                </span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground max-w-sm">
              Cuidado profesional y amoroso para tus mascotas. Especialistas en cardiología veterinaria con más de 10 años de experiencia.
            </p>
            
           
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: '100ms' }}>
            <h3 className="mb-5 text-base font-bold text-foreground md:text-lg flex items-center gap-2">
              Enlaces Rápidos
              <div className="h-[2px] flex-1 bg-gradient-to-r from-primary/50 to-transparent max-w-[60px]" />
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                { href: "/", label: "Inicio" },
                { href: "/turno", label: "Sacar Turno" },
                { href: "/servicios", label: "Servicios" },
                { href: "/productos", label: "Productos" },
                { href: "/sobre-nosotros", label: "Sobre Nosotros" },
              ].map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href} 
                    className="group flex items-center gap-2 text-muted-foreground transition-all hover:text-primary hover:translate-x-1"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-primary/40 transition-all group-hover:w-3 group-hover:bg-primary" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="lg:col-span-3 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: '200ms' }}>
            <h3 className="mb-5 text-base font-bold text-foreground md:text-lg flex items-center gap-2">
              Servicios
              <div className="h-[2px] flex-1 bg-gradient-to-r from-primary/50 to-transparent max-w-[60px]" />
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                "Consultas Generales",
                "Telemedicina",
                "Vacunación",
                "Urgencias 24/7",
               
                "Análisis Clínicos"
              ].map((service, index) => (
                <li key={index}>
                  <span className="group flex items-center gap-2 text-muted-foreground">
                    <Heart className="h-3.5 w-3.5 text-primary/60 fill-primary/20 transition-all group-hover:fill-primary/40" />
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: '300ms' }}>
            <h3 className="mb-5 text-base font-bold text-foreground md:text-lg flex items-center gap-2">
              Contacto
              <div className="h-[2px] flex-1 bg-gradient-to-r from-primary/50 to-transparent max-w-[60px]" />
            </h3>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex items-start gap-3 group">
                <div className="mt-0.5 p-2 rounded-lg bg-primary/10 text-primary transition-all group-hover:bg-primary/20 group-hover:scale-110">
                  <MapPin className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground mb-0.5">Dirección</p>
                  <span className="text-sm">Av. Principal 123, Buenos Aires</span>
                </div>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="mt-0.5 p-2 rounded-lg bg-primary/10 text-primary transition-all group-hover:bg-primary/20 group-hover:scale-110">
                  <Phone className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground mb-0.5">Teléfono</p>
                  <a href="tel:+541112345678" className="text-sm hover:text-primary transition-colors">
                    +54 11 1234-5678
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="mt-0.5 p-2 rounded-lg bg-primary/10 text-primary transition-all group-hover:bg-primary/20 group-hover:scale-110">
                  <Mail className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground mb-0.5">Email</p>
                  <a href="mailto:contacto@vetcare.com" className="text-sm hover:text-primary transition-colors break-all">
                    contacto@vetcare.com
                  </a>
                </div>
              </li>
            </ul>

            {/* Social Media */}
            <div className="mt-6 space-y-3">
              <p className="text-sm font-semibold text-foreground">Síguenos</p>
              <div className="flex gap-2">
                {[
                  { icon: Facebook, href: "https://facebook.com", name: "facebook", color: "hover:bg-blue-500" },
                  { icon: Instagram, href: "https://instagram.com", name: "instagram", color: "hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500" },
                  { icon: Twitter, href: "https://twitter.com", name: "twitter", color: "hover:bg-sky-500" },
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group relative rounded-xl bg-primary/10 p-3 transition-all duration-300 hover:scale-110 hover:shadow-lg ${social.color} hover:text-white`}
                    aria-label={social.name}
                    onMouseEnter={() => setHoveredSocial(social.name)}
                    onMouseLeave={() => setHoveredSocial(null)}
                  >
                    <social.icon className={`h-5 w-5 text-primary transition-colors group-hover:text-white ${hoveredSocial === social.name ? 'scale-110' : ''}`} />
                    
                    {/* Tooltip */}
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-foreground text-background text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      {social.name.charAt(0).toUpperCase() + social.name.slice(1)}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Divider with decoration */}
        <div className="relative my-10 md:my-12">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/50" />
          </div>
          <div className="relative flex justify-center">
            <div className="px-4 bg-card">
              <Heart className="h-6 w-6 text-primary fill-primary/20 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row animate-in fade-in duration-700" style={{ animationDelay: '400ms' }}>
          <p className="text-center text-xs text-muted-foreground sm:text-left md:text-sm">
            &copy; {new Date().getFullYear()} Priscila Silva - Cardióloga Veterinaria. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4 text-xs md:text-sm">
            <Link href="/privacidad" className="text-muted-foreground hover:text-primary transition-colors">
              Privacidad
            </Link>
            <span className="text-muted-foreground/50">•</span>
            <Link href="/terminos" className="text-muted-foreground hover:text-primary transition-colors">
              Términos
            </Link>
            <span className="text-muted-foreground/50">•</span>
            <span className="flex items-center gap-1 text-muted-foreground">
              Hecho con <Heart className="h-3 w-3 fill-primary text-primary animate-pulse" /> en Argentina
            </span>
          </div>
        </div>
      </div>

      {/* Decorative bottom gradient */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary to-transparent" />
    </footer>
  )
}