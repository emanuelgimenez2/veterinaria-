"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createTurno, createCliente, getClienteByEmail, createMascota, getMascotasByClienteId } from "@/lib/firebase/firestore"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { CalendarIcon, Clock, User, Heart, FileText, PlusCircle } from "lucide-react"

export default function TurnoPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [clienteExistente, setClienteExistente] = useState<any>(null)
  const [mascotas, setMascotas] = useState<any[]>([])
  const [mostrarNuevaMascota, setMostrarNuevaMascota] = useState(true)

  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    email: "",
    mascotaExistenteId: "",
    nombreMascota: "",
    tipoMascota: "",
    edadMascota: "",
    razaMascota: "",
    pesoMascota: "",
    motivo: "",
    fecha: "",
    hora: "",
  })

  // Buscar cliente existente por email
  useEffect(() => {
    const buscarCliente = async () => {
      if (formData.email && formData.email.includes("@")) {
        try {
          const cliente = await getClienteByEmail(formData.email)
          if (cliente) {
            setClienteExistente(cliente)
            setFormData(prev => ({
              ...prev,
              nombre: cliente.nombre || prev.nombre,
              telefono: cliente.telefono || prev.telefono
            }))
            
            // Cargar mascotas del cliente
            const mascotasCliente = await getMascotasByClienteId(cliente.id)
            setMascotas(mascotasCliente)
            setMostrarNuevaMascota(mascotasCliente.length === 0)
          } else {
            setClienteExistente(null)
            setMascotas([])
            setMostrarNuevaMascota(true)
          }
        } catch (error) {
          console.error("Error buscando cliente:", error)
        }
      }
    }

    const debounce = setTimeout(buscarCliente, 500)
    return () => clearTimeout(debounce)
  }, [formData.email])

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    
    // Si selecciona una mascota existente, ocultar form de nueva mascota
    if (field === "mascotaExistenteId") {
      setMostrarNuevaMascota(value === "nueva")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let clienteId = clienteExistente?.id
      let mascotaId = formData.mascotaExistenteId !== "nueva" ? formData.mascotaExistenteId : null

      // 1. Crear o usar cliente existente
      if (!clienteId) {
        const clienteRef = await createCliente({
          nombre: formData.nombre,
          telefono: formData.telefono,
          email: formData.email,
        })
        clienteId = clienteRef.id
      }

      // 2. Crear nueva mascota si es necesario
      if (!mascotaId && mostrarNuevaMascota) {
        const mascotaRef = await createMascota(clienteId, {
          nombre: formData.nombreMascota,
          tipo: formData.tipoMascota,
          edad: formData.edadMascota,
          raza: formData.razaMascota,
          peso: formData.pesoMascota,
        })
        mascotaId = mascotaRef.id
        // La historia clínica se crea automáticamente en createMascota
      }

      // 3. Obtener datos de la mascota
      const mascotaSeleccionada = mostrarNuevaMascota 
        ? {
            nombre: formData.nombreMascota,
            tipo: formData.tipoMascota,
          }
        : mascotas.find(m => m.id === mascotaId) || { nombre: "", tipo: "" }

      // 4. Crear el turno
      await createTurno({
        clienteId: clienteId,
        mascotaId: mascotaId || "",
        cliente: {
          nombre: formData.nombre,
          telefono: formData.telefono,
          email: formData.email,
        },
        mascota: {
          nombre: mascotaSeleccionada.nombre,
          tipo: mascotaSeleccionada.tipo,
          motivo: formData.motivo,
        },
        fecha: formData.fecha,
        hora: formData.hora,
        estado: "pendiente",
      })

      toast({
        title: "✅ Turno agendado exitosamente",
        description: "Nos pondremos en contacto contigo para confirmar el turno a domicilio.",
      })

      setTimeout(() => {
        router.push("/")
      }, 2000)
    } catch (error) {
      console.error("Error creating turno:", error)
      toast({
        title: "❌ Error al agendar turno",
        description: "Por favor, intenta nuevamente.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-muted/30 via-muted/50 to-muted/30 py-8 md:py-16 overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container max-w-4xl px-4 sm:px-6 lg:px-8">
        <Card className="shadow-2xl border-2 backdrop-blur-sm bg-background/95 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <CardHeader className="space-y-4 text-center pb-8 border-b border-border/50">
            <div className="inline-flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-primary/10 ring-4 ring-primary/10">
              <CalendarIcon className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
              Agendar Turno a Domicilio
            </CardTitle>
            <CardDescription className="text-base md:text-lg max-w-2xl mx-auto">
              Completa el formulario y nos pondremos en contacto para confirmar tu turno
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 py-8 md:px-8 md:py-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Cliente Info */}
              <div className="space-y-5 animate-in fade-in slide-in-from-left-4 duration-700" style={{ animationDelay: '100ms' }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Información del Cliente</h3>
                </div>

                {clienteExistente && (
                  <div className="p-4 rounded-lg bg-green-500/10 border-2 border-green-500/20 animate-in fade-in duration-300">
                    <p className="text-sm font-semibold text-green-700 dark:text-green-400 flex items-center gap-2">
                      <Heart className="h-4 w-4 fill-current" />
                      ¡Cliente encontrado! Hemos cargado tu información.
                    </p>
                  </div>
                )}

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="nombre" className="text-sm font-semibold flex items-center gap-2">
                      Nombre y Apellido *
                    </Label>
                    <Input
                      id="nombre"
                      placeholder="Juan Pérez"
                      value={formData.nombre}
                      onChange={(e) => handleChange("nombre", e.target.value)}
                      required
                      className="h-11 border-2 focus-visible:ring-primary/50"
                      disabled={!!clienteExistente}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefono" className="text-sm font-semibold">
                      Teléfono *
                    </Label>
                    <Input
                      id="telefono"
                      type="tel"
                      placeholder="+54 11 1234-5678"
                      value={formData.telefono}
                      onChange={(e) => handleChange("telefono", e.target.value)}
                      required
                      className="h-11 border-2 focus-visible:ring-primary/50"
                      disabled={!!clienteExistente}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold">
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="juan@ejemplo.com"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    required
                    className="h-11 border-2 focus-visible:ring-primary/50"
                  />
                  <p className="text-xs text-muted-foreground">
                    Ingresa tu email para verificar si ya estás registrado
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/50" />
                </div>
                <div className="relative flex justify-center">
                  <div className="px-4 bg-background">
                    <Heart className="h-5 w-5 text-primary fill-primary/20" />
                  </div>
                </div>
              </div>

              {/* Mascota Info */}
              <div className="space-y-5 animate-in fade-in slide-in-from-left-4 duration-700" style={{ animationDelay: '200ms' }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Heart className="h-5 w-5 text-primary fill-current" />
                  </div>
                  <h3 className="text-xl font-bold">Información de la Mascota</h3>
                </div>

                {/* Selector de mascota existente */}
                {mascotas.length > 0 && (
                  <div className="space-y-2">
                    <Label htmlFor="mascotaExistente" className="text-sm font-semibold">
                      Selecciona una mascota o registra una nueva
                    </Label>
                    <Select value={formData.mascotaExistenteId || "nueva"} onValueChange={(value) => handleChange("mascotaExistenteId", value)}>
                      <SelectTrigger id="mascotaExistente" className="h-11 border-2">
                        <SelectValue placeholder="Selecciona una mascota..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nueva">
                          <div className="flex items-center gap-2">
                            <PlusCircle className="h-4 w-4" />
                            <span>Registrar nueva mascota</span>
                          </div>
                        </SelectItem>
                        {mascotas.map((mascota) => (
                          <SelectItem key={mascota.id} value={mascota.id}>
                            {mascota.nombre} - {mascota.tipo} {mascota.raza && `(${mascota.raza})`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Formulario de nueva mascota */}
                {mostrarNuevaMascota && (
                  <>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="nombreMascota" className="text-sm font-semibold">
                          Nombre de la Mascota *
                        </Label>
                        <Input
                          id="nombreMascota"
                          placeholder="Max"
                          value={formData.nombreMascota}
                          onChange={(e) => handleChange("nombreMascota", e.target.value)}
                          required
                          className="h-11 border-2 focus-visible:ring-primary/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tipoMascota" className="text-sm font-semibold">
                          Tipo de Mascota *
                        </Label>
                        <Select value={formData.tipoMascota} onValueChange={(value) => handleChange("tipoMascota", value)}>
                          <SelectTrigger id="tipoMascota" className="h-11 border-2">
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

                    <div className="grid gap-5 sm:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="edadMascota" className="text-sm font-semibold">
                          Edad
                        </Label>
                        <Input
                          id="edadMascota"
                          placeholder="2 años"
                          value={formData.edadMascota}
                          onChange={(e) => handleChange("edadMascota", e.target.value)}
                          className="h-11 border-2 focus-visible:ring-primary/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="razaMascota" className="text-sm font-semibold">
                          Raza
                        </Label>
                        <Input
                          id="razaMascota"
                          placeholder="Golden Retriever"
                          value={formData.razaMascota}
                          onChange={(e) => handleChange("razaMascota", e.target.value)}
                          className="h-11 border-2 focus-visible:ring-primary/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pesoMascota" className="text-sm font-semibold">
                          Peso
                        </Label>
                        <Input
                          id="pesoMascota"
                          placeholder="15 kg"
                          value={formData.pesoMascota}
                          onChange={(e) => handleChange("pesoMascota", e.target.value)}
                          className="h-11 border-2 focus-visible:ring-primary/50"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="motivo" className="text-sm font-semibold flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Motivo de la Consulta *
                  </Label>
                  <Textarea
                    id="motivo"
                    placeholder="Describe brevemente el motivo de la consulta..."
                    value={formData.motivo}
                    onChange={(e) => handleChange("motivo", e.target.value)}
                    required
                    rows={4}
                    className="border-2 focus-visible:ring-primary/50 resize-none"
                  />
                </div>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/50" />
                </div>
                <div className="relative flex justify-center">
                  <div className="px-4 bg-background">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </div>

              {/* Turno Info */}
              <div className="space-y-5 animate-in fade-in slide-in-from-left-4 duration-700" style={{ animationDelay: '300ms' }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <CalendarIcon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Fecha y Hora del Turno</h3>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fecha" className="text-sm font-semibold flex items-center gap-2">
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
                      className="h-11 border-2 focus-visible:ring-primary/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hora" className="text-sm font-semibold flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Hora *
                    </Label>
                    <Input
                      id="hora"
                      type="time"
                      value={formData.hora}
                      onChange={(e) => handleChange("hora", e.target.value)}
                      required
                      className="h-11 border-2 focus-visible:ring-primary/50"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Nota:</strong> El turno está sujeto a confirmación. Nos pondremos en contacto contigo para coordinar la visita a domicilio.
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full h-12 text-base md:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary disabled:opacity-50 disabled:cursor-not-allowed" 
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Agendando...
                    </span>
                  ) : (
                    "Agendar Turno a Domicilio"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </main>
  )
}