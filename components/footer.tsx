import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container px-4 py-8 md:py-12">
        <div className="grid gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <div>
            <div className="mb-3 flex items-center gap-2 md:mb-4">
              <div className="h-7 w-7 rounded-full bg-primary md:h-8 md:w-8" />
              <span className="text-lg font-bold md:text-xl">VetCare</span>
            </div>
            <p className="text-pretty text-sm text-muted-foreground">
              Cuidado profesional y amoroso para tus mascotas desde 1995
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold md:mb-4 md:text-base">Enlaces Rápidos</h3>
            <ul className="space-y-1.5 text-sm md:space-y-2">
              <li>
                <Link href="/" className="text-muted-foreground transition hover:text-foreground">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/turno" className="text-muted-foreground transition hover:text-foreground">
                  Sacar Turno
                </Link>
              </li>
              <li>
                <Link href="/servicios" className="text-muted-foreground transition hover:text-foreground">
                  Servicios
                </Link>
              </li>
              <li>
                <Link href="/productos" className="text-muted-foreground transition hover:text-foreground">
                  Productos
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold md:mb-4 md:text-base">Contacto</h3>
            <ul className="space-y-1.5 text-sm text-muted-foreground md:space-y-2">
              <li className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 flex-shrink-0 md:h-4 md:w-4" />
                <span className="break-words">Av. Principal 123</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 flex-shrink-0 md:h-4 md:w-4" />
                <span>+54 11 1234-5678</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 flex-shrink-0 md:h-4 md:w-4" />
                <span className="break-all">contacto@vetcare.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold md:mb-4 md:text-base">Síguenos</h3>
            <div className="flex gap-2 md:gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-primary/10 p-2 transition hover:bg-primary/20"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4 text-primary md:h-5 md:w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-primary/10 p-2 transition hover:bg-primary/20"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4 text-primary md:h-5 md:w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-primary/10 p-2 transition hover:bg-primary/20"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4 text-primary md:h-5 md:w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-border pt-6 text-center text-xs text-muted-foreground md:mt-8 md:pt-8 md:text-sm">
          <p>&copy; {new Date().getFullYear()} VetCare. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
