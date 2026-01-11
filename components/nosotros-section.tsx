"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Heart, Award, Users, Clock, Sparkles, CheckCircle2 } from "lucide-react"
import { useState } from "react"
import Image from "next/image"

const stats = [
  
]

const values = [
  {
    title: "Profesionalismo",
    description: "Equipo altamente capacitado con formación continua en cardiología veterinaria"
  },
  {
    title: "Empatía",
    description: "Tratamos a cada mascota con el amor y cuidado que merecen"
  },
  {
    title: "Innovación",
    description: "Tecnología de última generación para diagnósticos precisos"
  },
  {
    title: "Compromiso",
    description: "Dedicados al bienestar integral de tu compañero de vida"
  },
]

export function NosotrosSection() {
  const [hoveredStatIndex, setHoveredStatIndex] = useState<number | null>(null)
  const [hoveredValueIndex, setHoveredValueIndex] = useState<number | null>(null)

  return (
    <section id="sobre-nosotros" className="relative py-16 md:py-20 lg:py-28 overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-primary/[0.02] to-background" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      
      <div className="container px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center md:mb-16 lg:mb-20 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-block">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 text-sm font-semibold rounded-full bg-primary/10 text-primary border border-primary/20">
              <Sparkles className="h-4 w-4" />
              Conócenos
            </span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
            Sobre Nosotros
          </h2>
          <p className="mx-auto max-w-2xl text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed">
            Especialistas en cardiología veterinaria comprometidos con la salud de tu mascota
          </p>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 mb-16 items-center">
          {/* Left Column - Image */}
          <div className="animate-in fade-in slide-in-from-left-8 duration-700">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500" />
              <div className="relative aspect-[3/3] rounded-3xl overflow-hidden border-4 border-primary/10 shadow-2xl group-hover:border-primary/30 transition-all duration-500">
                <Image
                  src="/Dra.jpg"
                  alt="Dra. Priscila Silva"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-700" style={{ animationDelay: '200ms' }}>
            <div className="space-y-4">
              <h3 className="text-2xl sm:text-3xl font-bold text-foreground">
                Dra. Priscila Silva
              </h3>
              <p className="text-lg font-semibold text-primary">
                Especialista en Cardiología Veterinaria
              </p>
            </div>

            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p className="text-base sm:text-lg">
                Experiencia dedicada al cuidado cardiovascular de mascotas, nuestra misión es brindar atención médica de excelencia con un toque humano y profesional.
              </p>
              <p className="text-base sm:text-lg">
                Nos especializamos en el diagnóstico y tratamiento de enfermedades cardíacas, utilizando tecnología de vanguardia y técnicas mínimamente invasivas para garantizar la mejor calidad de vida para tu compañero.
              </p>
            </div>

            {/* Values list */}
            <div className="space-y-3 pt-4">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 group cursor-pointer"
                  onMouseEnter={() => setHoveredValueIndex(index)}
                  onMouseLeave={() => setHoveredValueIndex(null)}
                >
                  <div className="mt-1">
                    <CheckCircle2 className={`h-5 w-5 transition-all duration-300 ${
                      hoveredValueIndex === index 
                        ? 'text-primary scale-110' 
                        : 'text-primary/60'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-semibold text-base transition-colors duration-300 ${
                      hoveredValueIndex === index ? 'text-primary' : 'text-foreground'
                    }`}>
                      {value.title}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {value.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 md:gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="animate-in fade-in slide-in-from-bottom-8 duration-700"
              style={{ animationDelay: `${index * 100}ms` }}
              onMouseEnter={() => setHoveredStatIndex(index)}
              onMouseLeave={() => setHoveredStatIndex(null)}
            >
              <Card className={`group relative h-full border-2 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:-translate-y-2 ${stat.borderColor} backdrop-blur-sm bg-background/50`}>
                {/* Gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg`} />
                
                <CardContent className="relative flex flex-col items-center gap-4 p-6 text-center sm:p-7">
                  {/* Icon */}
                  <div className={`relative rounded-2xl bg-gradient-to-br ${stat.color} p-4 shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                    <div className={`absolute inset-0 rounded-2xl ${stat.color} blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500`} />
                    <stat.icon 
                      className={`relative h-8 w-8 ${stat.iconColor} transition-transform duration-500 ${hoveredStatIndex === index ? 'scale-110' : ''}`}
                      strokeWidth={2.5}
                    />
                  </div>

                  {/* Value */}
                  <div className="space-y-2">
                    <p className="text-4xl sm:text-5xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent transition-all duration-300 group-hover:scale-110">
                      {stat.value}
                    </p>
                    <p className="text-sm sm:text-base font-semibold text-muted-foreground transition-colors duration-300 group-hover:text-foreground/80">
                      {stat.label}
                    </p>
                  </div>

                  {/* Progress dots */}
                  <div className="flex gap-1.5 mt-2">
                    <div className={`h-1.5 w-1.5 rounded-full bg-primary/40 transition-all duration-300 ${hoveredStatIndex === index ? 'w-8 bg-primary' : ''}`} />
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

        {/* Bottom decorative line */}
        <div className="mt-16 flex justify-center animate-in fade-in duration-1000" style={{ animationDelay: '800ms' }}>
          <div className="h-1 w-24 rounded-full bg-gradient-to-r from-primary/0 via-primary to-primary/0" />
        </div>
      </div>
    </section>
  )
}