"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getClientes, getMascotas, createHistoria } from "@/lib/firebase/firestore"
import type { Cliente, Mascota } from "@/lib/firebase/firestore"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { FilePlus } from "lucide-react"

export function HistoriasManagement() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [mascotas, setMascotas] = useState<Mascota[]>([])
  const [selectedClienteId, setSelectedClienteId] = useState("")
  const [selectedMascotaId, setSelectedMascotaId] = useState("")
  const [loading, setLoading] = useState(false)
  const [loadingClientes, setLoadingClientes] = useState(true)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    fechaAtencion: "",
    diagnostico: "",
    tratamiento: "",
    observaciones: "",
  })

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const data = await getClientes()
        setClientes(data)
      } catch (error) {
        console.error("[v0] Error fetching clientes:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los clientes",
          variant: "destructive",
        })
      } finally {
        setLoadingClientes(false)
      }
    }

    fetchClientes()
  }, [])

  useEffect(() => {
    const fetchMascotas = async () => {
      if (!selectedClienteId) {
        setMascotas([])
        setSelectedMascotaId("")
        return
      }

      try {
        const data = await getMascotas(selectedClienteId)
        setMascotas(data)
        setSelectedMascotaId("")
      } catch (error) {
        console.error("[v0] Error fetching mascotas:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar las mascotas",
          variant: "destructive",
        })
      }
    }

    fetchMascotas()
  }, [selectedClienteId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedClienteId || !selectedMascotaId) {
      toast({
        title: "Selecciona cliente y mascota",
        description: "Debes seleccionar un cliente y una mascota",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      await createHistoria(selectedClienteId, selectedMascotaId, formData)

      toast({
        title: "Historia clínica creada",
        description: "La historia clínica se ha guardado correctamente",
      })

      // Reset form
      setFormData({
        fechaAtencion: "",
        diagnostico: "",
        tratamiento: "",
        observaciones: "",
      })
      setSelectedClienteId("")
      setSelectedMascotaId("")
    } catch (error) {
      console.error("[v0] Error creating historia:", error)
      toast({
        title: "Error",
        description: "No se pudo guardar la historia clínica",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loadingClientes) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FilePlus className="h-6 w-6" />
            Nueva Historia Clínica
          </CardTitle>
          <CardDescription>Registra una nueva historia clínica para una mascota</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="cliente">Cliente *</Label>
                <Select value={selectedClienteId} onValueChange={setSelectedClienteId}>
                  <SelectTrigger id="cliente">
                    <SelectValue placeholder="Selecciona un cliente..." />
                  </SelectTrigger>
                  <SelectContent>
                    {clientes.map((cliente) => (
                      <SelectItem key={cliente.id} value={cliente.id || ""}>
                        {cliente.nombre} - {cliente.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mascota">Mascota *</Label>
                <Select value={selectedMascotaId} onValueChange={setSelectedMascotaId} disabled={!selectedClienteId}>
                  <SelectTrigger id="mascota">
                    <SelectValue placeholder="Selecciona una mascota..." />
                  </SelectTrigger>
                  <SelectContent>
                    {mascotas.map((mascota) => (
                      <SelectItem key={mascota.id} value={mascota.id || ""}>
                        {mascota.nombre} ({mascota.tipo})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fechaAtencion">Fecha de Atención *</Label>
              <Input
                id="fechaAtencion"
                type="date"
                value={formData.fechaAtencion}
                onChange={(e) => setFormData((prev) => ({ ...prev, fechaAtencion: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="diagnostico">Diagnóstico *</Label>
              <Textarea
                id="diagnostico"
                placeholder="Describe el diagnóstico..."
                value={formData.diagnostico}
                onChange={(e) => setFormData((prev) => ({ ...prev, diagnostico: e.target.value }))}
                required
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tratamiento">Tratamiento *</Label>
              <Textarea
                id="tratamiento"
                placeholder="Describe el tratamiento indicado..."
                value={formData.tratamiento}
                onChange={(e) => setFormData((prev) => ({ ...prev, tratamiento: e.target.value }))}
                required
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="observaciones">Observaciones</Label>
              <Textarea
                id="observaciones"
                placeholder="Observaciones adicionales (opcional)..."
                value={formData.observaciones}
                onChange={(e) => setFormData((prev) => ({ ...prev, observaciones: e.target.value }))}
                rows={3}
              />
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "Guardando..." : "Guardar Historia Clínica"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Toaster />
    </>
  )
}
