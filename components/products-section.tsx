"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Eye, Star } from "lucide-react"
import { useState } from "react"
import Image from "next/image"

const products = [
  {
    name: "Alimento Premium Perros",
    price: "$45.000",
    image: "/premium-dog-food-bag.png",
    description: "Nutrición balanceada para perros adultos",
    rating: 4.8,
    badge: "Más Vendido",
    badgeColor: "bg-blue-500"
  },
  {
    name: "Alimento Premium Gatos",
    price: "$38.000",
    image: "/premium-cat-food-bag.jpg",
    description: "Fórmula especial para gatos adultos",
    rating: 4.9,
    badge: "Recomendado",
    badgeColor: "bg-purple-500"
  },
  {
    name: "Collar Antipulgas",
    price: "$25.000",
    image: "/flea-collar-for-pets.jpg",
    description: "Protección por 8 meses",
    rating: 4.7,
    badge: "Nuevo",
    badgeColor: "bg-green-500"
  },
  {
    name: "Juguete Interactivo",
    price: "$18.000",
    image: "/interactive-pet-toy.jpg",
    description: "Estimula la mente de tu mascota",
    rating: 4.6,
    badge: "Oferta",
    badgeColor: "bg-red-500"
  },
]

export function ProductsSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section className="relative py-16 md:py-20 lg:py-28 overflow-hidden bg-gradient-to-b from-muted/30 via-muted/50 to-muted/30">
      {/* Decorative background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center md:mb-16 lg:mb-20 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-block">
            <span className="inline-block px-4 py-1.5 mb-4 text-sm font-semibold rounded-full bg-primary/10 text-primary border border-primary/20">
              Tienda
            </span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
            Productos Destacados
          </h2>
          <p className="mx-auto max-w-2xl text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed">
            Encuentra todo lo necesario para el cuidado y bienestar de tu mascota
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 md:gap-8">
          {products.map((product, index) => (
            <div
              key={index}
              className="animate-in fade-in slide-in-from-bottom-8 duration-700"
              style={{ animationDelay: `${index * 150}ms` }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <Card className="group relative h-full overflow-hidden border-2 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:-translate-y-2 backdrop-blur-sm bg-background/95">
                {/* Badge */}
                <div className={`absolute top-3 left-3 z-10 px-3 py-1 rounded-full text-xs font-bold text-white ${product.badgeColor} shadow-lg animate-in slide-in-from-left-4 duration-500`}>
                  {product.badge}
                </div>

                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden bg-muted/50">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-2"
                  />
                  
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="absolute inset-0 flex items-center justify-center gap-3">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="rounded-full shadow-lg transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 hover:scale-110"
                      >
                        <Eye className="h-5 w-5" />
                      </Button>
                      <Button
                        size="icon"
                        className="rounded-full shadow-lg transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-75 hover:scale-110"
                      >
                        <ShoppingCart className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>

                  {/* Shine effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
                  </div>
                </div>

                <CardContent className="relative p-5 space-y-3">
                  {/* Rating */}
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'fill-muted text-muted'
                        } transition-all duration-300`}
                      />
                    ))}
                    <span className="ml-1 text-sm font-medium text-muted-foreground">
                      {product.rating}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold leading-tight transition-colors duration-300 group-hover:text-primary sm:text-xl line-clamp-2">
                    {product.name}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 transition-colors duration-300 group-hover:text-foreground/70">
                    {product.description}
                  </p>

                  {/* Price */}
                  <div className="flex items-baseline gap-2 pt-2">
                    <p className="text-2xl font-bold text-primary md:text-3xl">
                      {product.price}
                    </p>
                    <span className="text-sm text-muted-foreground line-through opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      ${parseInt(product.price.replace(/[$.]/g, '')) + 5000}
                    </span>
                  </div>

                  {/* Progress indicator */}
                  <div className="flex gap-1 pt-1">
                    <div className={`h-1 rounded-full bg-primary transition-all duration-300 ${hoveredIndex === index ? 'w-12' : 'w-6'}`} />
                    <div className="h-1 w-6 rounded-full bg-primary/30" />
                    <div className="h-1 w-6 rounded-full bg-primary/30" />
                  </div>
                </CardContent>

                <CardFooter className="p-5 pt-0">
                  <Button 
                    variant="outline" 
                    className="w-full group/btn border-2 font-semibold transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:border-primary hover:shadow-lg hover:scale-105"
                  >
                    <span className="transition-transform duration-300 group-hover/btn:scale-110">
                      Ver Detalle
                    </span>
                  </Button>
                </CardFooter>

                {/* Bottom border animation */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/0 via-primary to-primary/0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              </Card>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center animate-in fade-in duration-1000" style={{ animationDelay: '800ms' }}>
          <Button 
            size="lg" 
            variant="outline"
            className="group border-2 font-semibold hover:bg-primary hover:text-primary-foreground hover:border-primary hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            Ver Todos los Productos
            <ShoppingCart className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
          </Button>
        </div>

        {/* Decorative line */}
        <div className="mt-12 flex justify-center animate-in fade-in duration-1000" style={{ animationDelay: '1000ms' }}>
          <div className="h-1 w-24 rounded-full bg-gradient-to-r from-primary/0 via-primary to-primary/0" />
        </div>
      </div>
    </section>
  )
}