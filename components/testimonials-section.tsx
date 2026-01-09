"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Star, Quote, Heart } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState } from "react"

const testimonials = [
  {
    name: "María González",
    image: "/smiling-woman-portrait.png",
    text: "Excelente atención y profesionalismo. Mi perro Max se siente como en casa cada vez que vamos.",
    rating: 5,
    pet: "Max - Golden Retriever",
    color: "from-pink-500/10 to-rose-500/10",
    accentColor: "text-pink-600",
    borderColor: "group-hover:border-pink-500/50"
  },
  {
    name: "Carlos Rodríguez",
    image: "/smiling-man-portrait.png",
    text: "La Dra. Laura salvó a mi gato cuando estaba muy enfermo. Siempre estaré agradecido.",
    rating: 5,
    pet: "Michi - Gato Persa",
    color: "from-blue-500/10 to-cyan-500/10",
    accentColor: "text-blue-600",
    borderColor: "group-hover:border-blue-500/50"
  },
  {
    name: "Ana Martínez",
    image: "/woman-glasses-portrait.png",
    text: "Instalaciones modernas y limpias. El personal es muy amable y paciente con los animales.",
    rating: 5,
    pet: "Luna - Husky Siberiano",
    color: "from-purple-500/10 to-indigo-500/10",
    accentColor: "text-purple-600",
    borderColor: "group-hover:border-purple-500/50"
  },
]

export function TestimonialsSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section className="relative py-16 md:py-20 lg:py-28 overflow-hidden bg-gradient-to-b from-muted/20 via-muted/40 to-muted/20">
      {/* Decorative background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/3 rounded-full blur-3xl" />
      </div>

      <div className="container px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center md:mb-16 lg:mb-20 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-block">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 text-sm font-semibold rounded-full bg-primary/10 text-primary border border-primary/20">
              <Heart className="h-4 w-4 fill-current animate-pulse" />
              Testimonios
            </span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
            Lo que Dicen Nuestros Clientes
          </h2>
          <p className="mx-auto max-w-2xl text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed">
            La satisfacción de nuestros clientes y sus mascotas es nuestra mayor recompensa
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="animate-in fade-in slide-in-from-bottom-8 duration-700"
              style={{ animationDelay: `${index * 150}ms` }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <Card className={`group relative h-full border-2 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:-translate-y-2 ${testimonial.borderColor} backdrop-blur-sm bg-background/95`}>
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${testimonial.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg`} />
                
                {/* Decorative quote icon */}
                <div className="absolute -top-4 -left-4 z-10">
                  <div className={`relative p-3 rounded-full bg-gradient-to-br ${testimonial.color} shadow-lg ring-4 ring-background transition-all duration-500 group-hover:scale-110 group-hover:rotate-12`}>
                    <Quote className={`h-6 w-6 ${testimonial.accentColor} fill-current`} />
                  </div>
                </div>

                <CardContent className="relative p-6 sm:p-7 md:p-8 space-y-5">
                  {/* Stars with animation */}
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 fill-yellow-400 text-yellow-400 transition-all duration-300 ${
                          hoveredIndex === index ? 'scale-110 rotate-12' : ''
                        }`}
                        style={{ 
                          transitionDelay: hoveredIndex === index ? `${i * 50}ms` : '0ms' 
                        }}
                      />
                    ))}
                  </div>

                  {/* Testimonial text */}
                  <blockquote className="relative">
                    <p className="text-base sm:text-lg leading-relaxed text-foreground/90 transition-colors duration-300 group-hover:text-foreground italic">
                      "{testimonial.text}"
                    </p>
                  </blockquote>

                  {/* Divider line */}
                  <div className="relative py-2">
                    <div className={`h-[2px] w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent transition-all duration-500 ${
                      hoveredIndex === index ? 'via-primary/60' : ''
                    }`} />
                  </div>

                  {/* Author info */}
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Avatar className="h-14 w-14 ring-2 ring-primary/20 transition-all duration-500 group-hover:ring-4 group-hover:ring-primary/40 group-hover:scale-110">
                        <AvatarImage 
                          src={testimonial.image || "/placeholder.svg"} 
                          alt={testimonial.name}
                          className="object-cover"
                        />
                        <AvatarFallback className="text-lg font-bold bg-gradient-to-br from-primary/20 to-primary/10">
                          {testimonial.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      {/* Online indicator */}
                      <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-500 ring-2 ring-background animate-pulse" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-base sm:text-lg truncate transition-colors duration-300 group-hover:text-primary">
                        {testimonial.name}
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground font-medium truncate">
                        {testimonial.pet}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                        
                      </div>
                    </div>
                  </div>

                  {/* Progress dots */}
                  <div className="flex justify-center gap-1.5 pt-2">
                    <div className={`h-1.5 w-1.5 rounded-full bg-primary/40 transition-all duration-300 ${hoveredIndex === index ? 'w-8 bg-primary' : ''}`} />
                    <div className="h-1.5 w-1.5 rounded-full bg-primary/40" />
                    <div className="h-1.5 w-1.5 rounded-full bg-primary/40" />
                  </div>
                </CardContent>

                {/* Shine effect */}
                <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden">
                  <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
                </div>
              </Card>
            </div>
          ))}
        </div>

     

        {/* Decorative line */}
        <div className="mt-12 flex justify-center animate-in fade-in duration-1000" style={{ animationDelay: '1000ms' }}>
          <div className="h-1 w-24 rounded-full bg-gradient-to-r from-primary/0 via-primary to-primary/0" />
        </div>
      </div>
    </section>
  )
}