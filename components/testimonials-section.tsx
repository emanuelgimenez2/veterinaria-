import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const testimonials = [
  {
    name: "María González",
    image: "/smiling-woman-portrait.png",
    text: "Excelente atención y profesionalismo. Mi perro Max se siente como en casa cada vez que vamos.",
    rating: 5,
  },
  {
    name: "Carlos Rodríguez",
    image: "/smiling-man-portrait.png",
    text: "La Dra. Laura salvó a mi gato cuando estaba muy enfermo. Siempre estaré agradecido.",
    rating: 5,
  },
  {
    name: "Ana Martínez",
    image: "/woman-glasses-portrait.png",
    text: "Instalaciones modernas y limpias. El personal es muy amable y paciente con los animales.",
    rating: 5,
  },
]

export function TestimonialsSection() {
  return (
    <section className="bg-muted/30 py-20">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-balance text-4xl font-bold">Lo que Dicen Nuestros Clientes</h2>
          <p className="mx-auto max-w-2xl text-pretty text-lg text-muted-foreground">
            La satisfacción de nuestros clientes y sus mascotas es nuestra mayor recompensa
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="transition-shadow hover:shadow-lg">
              <CardContent className="p-6">
                <div className="mb-4 flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="mb-6 text-pretty text-muted-foreground">{testimonial.text}</p>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={testimonial.image || "/placeholder.svg"} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">Cliente Satisfecho</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
