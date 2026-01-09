"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createTurno, createCliente, getClienteByEmail, createMascota } from "@/lib/firebase/firestore"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { CalendarIcon, Clock } from "lucide-react"

export default function TurnoPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    email: "",
    nombreMascota: "",
    tipoMascota: "",
    motivo: "",
    fecha: "",
    hora: "",
  })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const cliente = await getClienteByEmail(formData.email)
      let clienteId = cliente?.id

      if (!cliente) {
        const clienteRef = await createCliente({
          nombre: formData.nombre,
          telefono: formData.telefono,
          email: formData.email,
        })
        clienteId = clienteRef.id
      }

      if (clienteId) {
        await createMascota(clienteId, {
          nombre: formData.nombreMascota,
          tipo: formData.tipoMascota,
        })
      }

      await createTurno({
        clienteId: clienteId || "",
        cliente: {
          nombre: formData.nombre,
          telefono: formData.telefono,
          email: formData.email,
        },
        mascota: {
          nombre: formData.nombreMascota,
          tipo: formData.tipoMascota,
          motivo: formData.motivo,
        },
        turno: {
          fecha: formData.fecha,
          hora: formData.hora,
          timestamp: null,
        },
        estado: "pendiente",
      })

      toast({
        title: "Turno agendado exitosamente",
        description: "Nos pondremos en contacto contigo para confirmar el turno.",
      })

      setTimeout(() => {
        router.push("/")
      }, 2000)
    } catch (error) {
      console.error("[v0] Error creating turno:", error)
      toast({
        title: "Error al agendar turno",
        description: "Por favor, intenta nuevamente.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-muted/30 py-6 md:py-12">
      <div className="container max-w-3xl px-4">
        <Card className="shadow-lg">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-2xl md:text-3xl">Agendar Turno</CardTitle>
            <CardDescription className="text-sm md:text-base">
              Completa el formulario para solicitar un turno con nuestros veterinarios
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 pb-6 md:px-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Cliente Info */}
              <div className="space-y-4">
                <h3 className="text-base font-semibold md:text-lg">Información del Cliente</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="nombre" className="text-sm md:text-base">
                      Nombre y Apellido *
                    </Label>
                    <Input
                      id="nombre"
                      placeholder="Juan Pérez"
                      value={formData.nombre}
                      onChange={(e) => handleChange("nombre", e.target.value)}
                      required
                      className="text-sm md:text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefono" className="text-sm md:text-base">
                      Teléfono *
                    </Label>
                    <Input
                      id="telefono"
                      type="tel"
                      placeholder="+54 11 1234-5678"
                      value={formData.telefono}
                      onChange={(e) => handleChange("telefono", e.target.value)}
                      required
                      className="text-sm md:text-base"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm md:text-base">
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="juan@ejemplo.com"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    required
                    className="text-sm md:text-base"
                  />
                </div>
              </div>

              {/* Mascota Info */}
              <div className="space-y-4">
                <h3 className="text-base font-semibold md:text-lg">Información de la Mascota</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="nombreMascota" className="text-sm md:text-base">
                      Nombre de la Mascota *
                    </Label>
                    <Input
                      id="nombreMascota"
                      placeholder="Max"
                      value={formData.nombreMascota}
                      onChange={(e) => handleChange("nombreMascota", e.target.value)}
                      required
                      className="text-sm md:text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tipoMascota" className="text-sm md:text-base">
                      Tipo de Mascota *
                    </Label>
                    <Select value={formData.tipoMascota} onValueChange={(value) => handleChange("tipoMascota", value)}>
                      <SelectTrigger id="tipoMascota" className="text-sm md:text-base">
                        <SelectValue placeholder="Selecciona..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="perro">Perro</SelectItem>
                        <SelectItem value="gato">Gato</SelectItem>
                        <SelectItem value="conejo">Conejo</SelectItem>
                        <SelectItem value="ave">Ave</SelectItem>
                        <SelectItem value="otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="motivo" className="text-sm md:text-base">
                    Motivo de la Consulta *
                  </Label>
                  <Textarea
                    id="motivo"
                    placeholder="Describe brevemente el motivo de la consulta..."
                    value={formData.motivo}
                    onChange={(e) => handleChange("motivo", e.target.value)}
                    required
                    rows={4}
                    className="text-sm md:text-base"
                  />
                </div>
              </div>

              {/* Turno Info */}
              <div className="space-y-4">
                <h3 className="text-base font-semibold md:text-lg">Fecha y Hora del Turno</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fecha" className="flex items-center gap-2 text-sm md:text-base">
                      <CalendarIcon className="h-4 w-4" />
                      Fecha *
                    </Label>
                    <Input
                      id="fecha"
                      type="date"
                      value={formData.fecha}
                      onChange={(e) => handleChange("fecha", e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      required
                      className="text-sm md:text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hora" className="flex items-center gap-2 text-sm md:text-base">
                      <Clock className="h-4 w-4" />
                      Hora *
                    </Label>
                    <Input
                      id="hora"
                      type="time"
                      value={formData.hora}
                      onChange={(e) => handleChange("hora", e.target.value)}
                      required
                      className="text-sm md:text-base"
                    />
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full text-base md:text-lg" size="lg" disabled={loading}>
                {loading ? "Agendando..." : "Agendar Turno"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </main>
  )
}
