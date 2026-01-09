"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

const slides = [
  {
    image: "/happy-dog-at-veterinary-clinic.jpg",
    title: "Cuidado Profesional para tus Mascotas",
    subtitle: "Servicios veterinarios de calidad con tecnología moderna",
  },
  {
    image: "/cat-being-examined-by-veterinarian.jpg",
    title: "Atención Personalizada",
    subtitle: "Cada mascota recibe el cuidado especial que merece",
  },
  {
    image: "/veterinary-clinic-waiting-room-modern.jpg",
    title: "Instalaciones Modernas",
    subtitle: "Equipamiento de última generación para diagnósticos precisos",
  },
]

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <div className="relative h-[400px] w-full overflow-hidden rounded-lg md:h-[500px] md:rounded-2xl lg:h-[600px]">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <img src={slide.image || "/placeholder.svg"} alt={slide.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-4 text-center md:gap-6">
            <h1 className="max-w-4xl text-balance text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
              {slide.title}
            </h1>
            <p className="max-w-2xl text-pretty text-base text-white/90 sm:text-lg md:text-xl lg:text-2xl">
              {slide.subtitle}
            </p>
            <Link href="/turno">
              <Button size="lg" className="mt-2 text-base md:mt-4 md:text-lg">
                Sacar Turno Ahora
              </Button>
            </Link>
          </div>
        </div>
      ))}

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-1.5 backdrop-blur-sm transition hover:bg-white/30 md:left-4 md:p-2"
        aria-label="Anterior"
      >
        <ChevronLeft className="h-5 w-5 text-white md:h-6 md:w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-1.5 backdrop-blur-sm transition hover:bg-white/30 md:right-4 md:p-2"
        aria-label="Siguiente"
      >
        <ChevronRight className="h-5 w-5 text-white md:h-6 md:w-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2 md:bottom-4">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-1.5 rounded-full transition-all md:h-2 ${
              index === currentSlide ? "w-6 bg-white md:w-8" : "w-1.5 bg-white/50 md:w-2"
            }`}
            aria-label={`Ir a slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
