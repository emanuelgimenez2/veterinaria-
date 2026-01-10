"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getClientes, getMascotas, getHistorias } from "@/lib/firebase/firestore"
import type { Cliente, Mascota, Historia } from "@/lib/firebase/firestore"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Search, PawPrint, FileText, User } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"

export function ClientesManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [allClientes, setAllClientes] = useState<Cliente[]>([])
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null)
  const [mascotas, setMascotas] = useState<Mascota[]>([])
  const [historiasPorMascota, setHistoriasPorMascota] = useState<Record<string, Historia[]>>({})
  const [loading, setLoading] = useState(true)
  const [loadingMascotas, setLoadingMascotas] = useState(false)
  const { toast } = useToast()

  // Cargar todos los clientes al montar el componente
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const data = await getClientes()
        setAllClientes(data)
      } catch (error) {
        console.error("Error fetching clientes:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los clientes",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchClientes()
  }, [])

  // Filtrar clientes en tiempo real
  const filteredClientes = allClientes.filter(
    (c) =>
      c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.telefono.includes(searchTerm)
  )

  const handleSelectCliente = async (cliente: Cliente) => {
    setSelectedCliente(cliente)
    setLoadingMascotas(true)

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
      setLoadingMascotas(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-900 dark:border-slate-100 border-t-transparent" />
      </div>
    )
  }

  return (
    <>
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Clientes</CardTitle>
          <CardDescription className="text-xs">
            Busca y selecciona un cliente para ver sus mascotas e historias clínicas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Buscador */}
          <div className="mb-4">
            <Label htmlFor="search" className="sr-only">
              Buscar cliente
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Buscar por nombre, email o teléfono..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-sm"
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {filteredClientes.length} cliente{filteredClientes.length !== 1 ? 's' : ''} encontrado{filteredClientes.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Lista de clientes */}
          {filteredClientes.length === 0 ? (
            <div className="text-center py-8">
              <User className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">
                {searchTerm ? "No se encontraron clientes" : "No hay clientes registrados"}
              </p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              {/* Header */}
              <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-3 bg-muted/50 p-3 border-b">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold">Nombre</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold">Email</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold">Teléfono</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold w-20"></p>
              </div>
              
              {/* Lista */}
              <div className="max-h-[400px] overflow-y-auto">
                {filteredClientes.map((cliente) => (
                  <div
                    key={cliente.id}
                    className={`grid grid-cols-[1fr_1fr_1fr_auto] gap-3 p-3 border-b last:border-b-0 cursor-pointer transition-colors ${
                      selectedCliente?.id === cliente.id
                        ? "bg-blue-50 dark:bg-blue-950/20"
                        : "hover:bg-muted/30"
                    }`}
                    onClick={() => handleSelectCliente(cliente)}
                  >
                    <p className="text-sm font-semibold truncate">{cliente.nombre}</p>
                    <p className="text-sm truncate">{cliente.email}</p>
                    <p className="text-sm">{cliente.telefono}</p>
                    <div className="w-20 flex justify-end">
                      {selectedCliente?.id === cliente.id && (
                        <Badge variant="outline" className="text-[10px] bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400">
                          Activo
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detalles del cliente seleccionado */}
      {selectedCliente && (
        <Card className="border shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">
                  {selectedCliente.nombre}
                </CardTitle>
                <CardDescription className="text-xs">
                  Mascotas e historias clínicas
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-xs">
                {mascotas.length} mascota{mascotas.length !== 1 ? 's' : ''}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {loadingMascotas ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-900 dark:border-slate-100 border-t-transparent" />
              </div>
            ) : mascotas.length === 0 ? (
              <div className="text-center py-8">
                <PawPrint className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground">
                  Este cliente no tiene mascotas registradas
                </p>
              </div>
            ) : (
              <Accordion type="single" collapsible className="w-full">
                {mascotas.map((mascota) => (
                  <AccordionItem key={mascota.id} value={mascota.id || ""} className="border rounded-lg mb-2 px-4">
                    <AccordionTrigger className="hover:no-underline py-3">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                          <PawPrint className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="text-left flex-1">
                          <p className="text-sm font-semibold">{mascota.nombre}</p>
                          <div className="flex gap-2 mt-0.5">
                            <Badge variant="outline" className="text-[10px] capitalize">
                              {mascota.tipo}
                            </Badge>
                            {historiasPorMascota[mascota.id || ""]?.length > 0 && (
                              <Badge variant="outline" className="text-[10px]">
                                {historiasPorMascota[mascota.id || ""].length} registro{historiasPorMascota[mascota.id || ""].length !== 1 ? 's' : ''}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 pt-2 pb-3">
                        <div>
                          <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            Historia Clínica
                          </h4>
                          {mascota.id && historiasPorMascota[mascota.id]?.length > 0 ? (
                            <div className="space-y-2">
                              {historiasPorMascota[mascota.id].map((historia) => (
                                <Card key={historia.id} className="border-l-4 border-l-blue-500">
                                  <CardContent className="p-3">
                                    <div className="space-y-2">
                                      <div className="flex items-center justify-between">
                                        <Badge variant="outline" className="text-[10px]">
                                          {historia.fechaAtencion}
                                        </Badge>
                                      </div>
                                      <div>
                                        <p className="text-xs font-semibold text-muted-foreground mb-1">Diagnóstico:</p>
                                        <p className="text-sm">{historia.diagnostico}</p>
                                      </div>
                                      <div>
                                        <p className="text-xs font-semibold text-muted-foreground mb-1">Tratamiento:</p>
                                        <p className="text-sm">{historia.tratamiento}</p>
                                      </div>
                                      {historia.observaciones && (
                                        <div>
                                          <p className="text-xs font-semibold text-muted-foreground mb-1">Observaciones:</p>
                                          <p className="text-sm text-muted-foreground">{historia.observaciones}</p>
                                        </div>
                                      )}
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-6 border border-dashed rounded-lg">
                              <FileText className="h-8 w-8 mx-auto text-muted-foreground/30 mb-2" />
                              <p className="text-xs text-muted-foreground">
                                No hay historias clínicas registradas
                              </p>
                            </div>
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