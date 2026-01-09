"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getClientes, getMascotas, getHistorias } from "@/lib/firebase/firestore"
import type { Cliente, Mascota, Historia } from "@/lib/firebase/firestore"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Search, PawPrint, FileText } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"

export function ClientesManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null)
  const [mascotas, setMascotas] = useState<Mascota[]>([])
  const [historiasPorMascota, setHistoriasPorMascota] = useState<Record<string, Historia[]>>({})
  const [loading, setLoading] = useState(false)
  const [searching, setSearching] = useState(false)
  const { toast } = useToast()

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast({
        title: "Ingresa un término de búsqueda",
        description: "Escribe el nombre o email del cliente",
        variant: "destructive",
      })
      return
    }

    setSearching(true)
    try {
      const allClientes = await getClientes()
      const filtered = allClientes.filter(
        (c) =>
          c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )

      setClientes(filtered)

      if (filtered.length === 0) {
        toast({
          title: "No se encontraron clientes",
          description: "Intenta con otro término de búsqueda",
        })
      }
    } catch (error) {
      console.error("Error searching clientes:", error)
      toast({
        title: "Error",
        description: "No se pudo realizar la búsqueda",
        variant: "destructive",
      })
    } finally {
      setSearching(false)
    }
  }

  const handleSelectCliente = async (cliente: Cliente) => {
    setSelectedCliente(cliente)
    setLoading(true)

    try {
      if (cliente.id) {
        const mascotasData = await getMascotas(cliente.id)
        setMascotas(mascotasData)

        const historiasMap: Record<string, Historia[]> = {}
        for (const mascota of mascotasData) {
          if (mascota.id) {
            const historias = await getHistorias(cliente.id, mascota.id)
            historiasMap[mascota.id] = historias
          }
        }
        setHistoriasPorMascota(historiasMap)
      }
    } catch (error) {
      console.error("Error loading mascotas:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar las mascotas",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-base md:text-lg">Búsqueda de Clientes</CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Busca clientes por nombre o email para ver sus mascotas e historias
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="flex-1">
              <Label htmlFor="search" className="sr-only">
                Buscar cliente
              </Label>
              <Input
                id="search"
                placeholder="Buscar por nombre o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="text-sm md:text-base"
              />
            </div>
            <Button onClick={handleSearch} disabled={searching} className="text-sm md:text-base">
              <Search className="mr-2 h-4 w-4" />
              {searching ? "Buscando..." : "Buscar"}
            </Button>
          </div>

          {clientes.length > 0 && (
            <div className="mt-4 space-y-2 md:mt-6">
              <h3 className="text-sm font-semibold md:text-base">Resultados ({clientes.length})</h3>
              <div className="space-y-2">
                {clientes.map((cliente) => (
                  <Card
                    key={cliente.id}
                    className="cursor-pointer transition-colors hover:bg-muted/50"
                    onClick={() => handleSelectCliente(cliente)}
                  >
                    <CardContent className="flex items-center justify-between p-3 md:p-4">
                      <div>
                        <p className="text-sm font-semibold md:text-base">{cliente.nombre}</p>
                        <p className="text-xs text-muted-foreground md:text-sm">{cliente.email}</p>
                        <p className="text-xs text-muted-foreground md:text-sm">{cliente.telefono}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Ver Mascotas
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedCliente && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Cliente: {selectedCliente.nombre}</CardTitle>
            <CardDescription className="text-xs md:text-sm">Mascotas e historias clínicas</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            ) : mascotas.length === 0 ? (
              <p className="text-center text-xs text-muted-foreground md:text-sm">
                Este cliente no tiene mascotas registradas
              </p>
            ) : (
              <Accordion type="single" collapsible className="w-full">
                {mascotas.map((mascota) => (
                  <AccordionItem key={mascota.id} value={mascota.id || ""}>
                    <AccordionTrigger>
                      <div className="flex items-center gap-2">
                        <PawPrint className="h-3.5 w-3.5 text-primary md:h-4 md:w-4" />
                        <span className="text-sm font-semibold md:text-base">{mascota.nombre}</span>
                        <Badge variant="outline" className="capitalize text-xs">
                          {mascota.tipo}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 pl-4 md:space-y-4 md:pl-6">
                        <div>
                          <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold md:text-base">
                            <FileText className="h-3.5 w-3.5 md:h-4 md:w-4" />
                            Historia Clínica
                          </h4>
                          {mascota.id && historiasPorMascota[mascota.id]?.length > 0 ? (
                            <div className="space-y-2 md:space-y-3">
                              {historiasPorMascota[mascota.id].map((historia) => (
                                <Card key={historia.id}>
                                  <CardContent className="p-3 md:p-4">
                                    <div className="space-y-2">
                                      <div className="flex items-center justify-between">
                                        <p className="text-xs font-semibold md:text-sm">
                                          Fecha: {historia.fechaAtencion}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-xs font-semibold text-muted-foreground">Diagnóstico:</p>
                                        <p className="text-xs md:text-sm">{historia.diagnostico}</p>
                                      </div>
                                      <div>
                                        <p className="text-xs font-semibold text-muted-foreground">Tratamiento:</p>
                                        <p className="text-xs md:text-sm">{historia.tratamiento}</p>
                                      </div>
                                      {historia.observaciones && (
                                        <div>
                                          <p className="text-xs font-semibold text-muted-foreground">Observaciones:</p>
                                          <p className="text-xs md:text-sm">{historia.observaciones}</p>
                                        </div>
                                      )}
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-muted-foreground md:text-sm">
                              No hay historias clínicas registradas
                            </p>
                          )}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </CardContent>
        </Card>
      )}

      <Toaster />
    </>
  )
}
