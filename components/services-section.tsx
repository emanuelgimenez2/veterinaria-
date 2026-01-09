import { Stethoscope, Scissors, Syringe, Heart } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const services = [
  {
    icon: Stethoscope,
    title: "Consultas Generales",
    description: "Exámenes completos y diagnósticos profesionales para tu mascota",
  },
  {
    icon: Scissors,
    title: "Cirugías",
    description: "Procedimientos quirúrgicos con equipamiento de última generación",
  },
  {
    icon: Syringe,
    title: "Vacunación",
    description: "Plan de vacunación completo para proteger a tu mascota",
  },
  {
    icon: Heart,
    title: "Urgencias",
    description: "Atención de emergencia las 24 horas del día",
  },
]

export function ServicesSection() {
  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="container px-4">
        <div className="mb-8 text-center md:mb-12">
          <h2 className="mb-3 text-balance text-3xl font-bold md:mb-4 md:text-4xl">Nuestros Servicios</h2>
          <p className="mx-auto max-w-2xl text-pretty text-base text-muted-foreground md:text-lg">
            Ofrecemos atención integral para el bienestar de tu mascota con profesionales altamente capacitados
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
          {services.map((service, index) => (
            <Card key={index} className="transition-all hover:shadow-lg">
              <CardContent className="flex flex-col items-center gap-3 p-5 text-center md:gap-4 md:p-6">
                <div className="rounded-full bg-primary/10 p-3 md:p-4">
                  <service.icon className="h-7 w-7 text-primary md:h-8 md:w-8" />
                </div>
                <h3 className="text-lg font-semibold md:text-xl">{service.title}</h3>
                <p className="text-pretty text-sm text-muted-foreground md:text-base">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
