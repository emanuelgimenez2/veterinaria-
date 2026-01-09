import { HeroCarousel } from "@/components/hero-carousel"
import { ServicesSection } from "@/components/services-section"
import { ProductsSection } from "@/components/products-section"
import { LocationSection } from "@/components/location-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen w-full">
      <div className="container mx-auto py-8">
        <HeroCarousel />
      </div>
      <ServicesSection />
      <ProductsSection />
      <LocationSection />
      <TestimonialsSection />
      <Footer />
    </main>
  )
}
