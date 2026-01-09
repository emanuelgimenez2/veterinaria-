import { MapPin, Clock, Phone, Mail } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function LocationSection() {
  return (
    <section className="py-20">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-balance text-4xl font-bold">Visitanos</h2>
          <p className="mx-auto max-w-2xl text-pretty text-lg text-muted-foreground">
            Estamos ubicados en el corazón de la ciudad, listos para atender a tu mascota
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold">Dirección</h3>
                    <p className="text-muted-foreground">Av. Principal 123, Ciudad, País</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold">Horarios</h3>
                    <p className="text-muted-foreground">Lunes a Viernes: 9:00 - 20:00</p>
                    <p className="text-muted-foreground">Sábados: 9:00 - 14:00</p>
                    <p className="text-muted-foreground">Domingos: Cerrado</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold">Teléfono</h3>
                    <p className="text-muted-foreground">+54 11 1234-5678</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold">Email</h3>
                    <p className="text-muted-foreground">contacto@vetcare.com</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="h-[400px] overflow-hidden rounded-2xl lg:h-full">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.0168878424426!2d-58.38375908477049!3d-34.60373098045947!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bccacf7f4e8c3d%3A0x2d5e8a6d8a7c6e9!2sBuenos%20Aires%2C%20Argentina!5e0!3m2!1sen!2sus!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación de VetCare"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
