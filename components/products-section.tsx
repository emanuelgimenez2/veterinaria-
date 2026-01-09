import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const products = [
  {
    name: "Alimento Premium Perros",
    price: "$45.000",
    image: "/premium-dog-food-bag.png",
    description: "Nutrición balanceada para perros adultos",
  },
  {
    name: "Alimento Premium Gatos",
    price: "$38.000",
    image: "/premium-cat-food-bag.jpg",
    description: "Fórmula especial para gatos adultos",
  },
  {
    name: "Collar Antipulgas",
    price: "$25.000",
    image: "/flea-collar-for-pets.jpg",
    description: "Protección por 8 meses",
  },
  {
    name: "Juguete Interactivo",
    price: "$18.000",
    image: "/interactive-pet-toy.jpg",
    description: "Estimula la mente de tu mascota",
  },
]

export function ProductsSection() {
  return (
    <section className="bg-muted/30 py-12 md:py-16 lg:py-20">
      <div className="container px-4">
        <div className="mb-8 text-center md:mb-12">
          <h2 className="mb-3 text-balance text-3xl font-bold md:mb-4 md:text-4xl">Productos Destacados</h2>
          <p className="mx-auto max-w-2xl text-pretty text-base text-muted-foreground md:text-lg">
            Encuentra todo lo necesario para el cuidado y bienestar de tu mascota
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
          {products.map((product, index) => (
            <Card key={index} className="overflow-hidden transition-all hover:shadow-lg">
              <div className="aspect-square overflow-hidden">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform hover:scale-105"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="mb-2 text-base font-semibold md:text-lg">{product.name}</h3>
                <p className="mb-2 text-xs text-muted-foreground md:text-sm">{product.description}</p>
                <p className="text-xl font-bold text-primary md:text-2xl">{product.price}</p>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button variant="outline" className="w-full bg-transparent text-sm md:text-base">
                  Ver Detalle
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
