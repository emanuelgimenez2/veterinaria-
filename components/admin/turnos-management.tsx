"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { getTurnos, updateTurno, deleteTurno } from "@/lib/firebase/firestore"
import type { Turno } from "@/lib/firebase/firestore"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { CheckCircle2, XCircle, Edit, Trash2, CalendarIcon, Filter } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format, isToday, isThisWeek, isThisMonth, parseISO, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns"
import { es } from "date-fns/locale"

type FilterType = "all" | "today" | "week" | "month" | "custom"

export function TurnosManagement() {
  const [turnos, setTurnos] = useState<Turno[]>([])
  const [loading, setLoading] = useState(true)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedTurno, setSelectedTurno] = useState<Turno | null>(null)
  const [editData, setEditData] = useState({ fecha: "", hora: "" })
  const [filterType, setFilterType] = useState<FilterType>("all")
  const [customDate, setCustomDate] = useState<Date>()
  const { toast } = useToast()

  const fetchTurnos = async () => {
    try {
      const data = await getTurnos()
      setTurnos(data)
    } catch (error) {
      console.error("Error fetching turnos:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los turnos",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTurnos()
  }, [])

  const filterTurnos = (turnos: Turno[]) => {
    const today = new Date()
    
    switch (filterType) {
      case "today":
        return turnos.filter(turno => isToday(parseISO(turno.turno.fecha)))
      
      case "week":
        return turnos.filter(turno => {
          const fecha = parseISO(turno.turno.fecha)
          return fecha >= startOfWeek(today, { locale: es }) && fecha <= endOfWeek(today, { locale: es })
        })
      
      case "month":
        return turnos.filter(turno => {
          const fecha = parseISO(turno.turno.fecha)
          return fecha >= startOfMonth(today) && fecha <= endOfMonth(today)
        })
      
      case "custom":
        if (!customDate) return turnos
        return turnos.filter(turno => {
          const fechaTurno = parseISO(turno.turno.fecha)
          return format(fechaTurno, 'yyyy-MM-dd') === format(customDate, 'yyyy-MM-dd')
        })
      
      default:
        return turnos
    }
  }

  const filteredTurnos = filterTurnos(turnos)

  const handleMarkCompleted = async (turnoId: string) => {
    try {
      await updateTurno(turnoId, { estado: "completado" })
      toast({
        title: "✅ Turno completado",
        description: "El turno ha sido marcado como completado",
      })
      fetchTurnos()
    } catch (error) {
      console.error("Error updating turno:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar el turno",
        variant: "destructive",
      })
    }
  }

  const handleCancel = async (turnoId: string) => {
    try {
      await updateTurno(turnoId, { estado: "cancelado" })
      toast({
        title: "Turno cancelado",
        description: "El turno ha sido cancelado",
      })
      fetchTurnos()
    } catch (error) {
      console.error("Error canceling turno:", error)
      toast({
        title: "Error",
        description: "No se pudo cancelar el turno",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (turnoId: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este turno?")) return

    try {
      await deleteTurno(turnoId)
      toast({
        title: "Turno eliminado",
        description: "El turno ha sido eliminado correctamente",
      })
      fetchTurnos()
    } catch (error) {
      console.error("Error deleting turno:", error)
      toast({
        title: "Error",
        description: "No se pudo eliminar el turno",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (turno: Turno) => {
    setSelectedTurno(turno)
    setEditData({
      fecha: turno.turno.fecha,
      hora: turno.turno.hora,
    })
    setEditDialogOpen(true)
  }

  const handleSaveEdit = async () => {
    if (!selectedTurno?.id) return

    try {
      await updateTurno(selectedTurno.id, {
        turno: {
          ...selectedTurno.turno,
          fecha: editData.fecha,
          hora: editData.hora,
        },
      })
      toast({
        title: "✅ Turno actualizado",
        description: "La fecha y hora han sido actualizadas",
      })
      setEditDialogOpen(false)
      fetchTurnos()
    } catch (error) {
      console.error("Error updating turno:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar el turno",
        variant: "destructive",
      })
    }
  }

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return (
          <Badge variant="outline" className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 text-[10px] sm:text-xs">
            Pendiente
          </Badge>
        )
      case "completado":
        return (
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 text-[10px] sm:text-xs">
            Completado
          </Badge>
        )
      case "cancelado":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400 text-[10px] sm:text-xs">
            Cancelado
          </Badge>
        )
      default:
        return <Badge variant="outline" className="text-[10px] sm:text-xs">{estado}</Badge>
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
        <CardHeader className="space-y-4">
          <div>
            <CardTitle className="text-base font-semibold">Gestión de Turnos</CardTitle>
            <CardDescription className="text-xs">
              Administra todos los turnos agendados ({filteredTurnos.length} de {turnos.length})
            </CardDescription>
          </div>

          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Filter className="h-4 w-4" />
              <span className="font-medium">Filtrar:</span>
            </div>
            
            <Tabs value={filterType} onValueChange={(v) => setFilterType(v as FilterType)} className="w-full sm:w-auto">
              <TabsList className="grid grid-cols-4 h-auto w-full sm:inline-flex">
                <TabsTrigger value="all" className="text-xs py-2">Todos</TabsTrigger>
                <TabsTrigger value="today" className="text-xs py-2">Hoy</TabsTrigger>
                <TabsTrigger value="week" className="text-xs py-2">Semana</TabsTrigger>
                <TabsTrigger value="month" className="text-xs py-2">Mes</TabsTrigger>
              </TabsList>
            </Tabs>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="text-xs gap-2">
                  <CalendarIcon className="h-3 w-3" />
                  {customDate ? format(customDate, "dd/MM/yyyy", { locale: es }) : "Fecha personalizada"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={customDate}
                  onSelect={(date) => {
                    setCustomDate(date)
                    if (date) setFilterType("custom")
                  }}
                  locale={es}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="text-xs font-semibold">Cliente</TableHead>
                  <TableHead className="text-xs font-semibold">Mascota</TableHead>
                  <TableHead className="hidden sm:table-cell text-xs font-semibold">Tipo</TableHead>
                  <TableHead className="text-xs font-semibold">Fecha</TableHead>
                  <TableHead className="hidden lg:table-cell text-xs font-semibold">Hora</TableHead>
                  <TableHead className="hidden xl:table-cell text-xs font-semibold">Motivo</TableHead>
                  <TableHead className="text-xs font-semibold">Estado</TableHead>
                  <TableHead className="text-xs font-semibold text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTurnos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-sm text-muted-foreground">
                      No hay turnos para mostrar con el filtro seleccionado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTurnos.map((turno) => (
                    <TableRow key={turno.id} className="hover:bg-muted/30">
                      <TableCell className="text-xs font-medium">{turno.cliente.nombre}</TableCell>
                      <TableCell className="text-xs">{turno.mascota.nombre}</TableCell>
                      <TableCell className="hidden sm:table-cell text-xs capitalize">
                        {turno.mascota.tipo}
                      </TableCell>
                      <TableCell className="text-xs">{turno.turno.fecha}</TableCell>
                      <TableCell className="hidden lg:table-cell text-xs">{turno.turno.hora}</TableCell>
                      <TableCell className="hidden xl:table-cell max-w-[200px] truncate text-xs">
                        {turno.mascota.motivo}
                      </TableCell>
                      <TableCell>{getEstadoBadge(turno.estado)}</TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1">
                          <Button size="sm" variant="ghost" onClick={() => handleEdit(turno)} className="h-8 w-8 p-0">
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          {turno.estado === "pendiente" && (
                            <>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 hover:bg-emerald-50 hover:text-emerald-600"
                                onClick={() => turno.id && handleMarkCompleted(turno.id)}
                              >
                                <CheckCircle2 className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                                onClick={() => turno.id && handleCancel(turno.id)}
                              >
                                <XCircle className="h-3.5 w-3.5" />
                              </Button>
                            </>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                            onClick={() => turno.id && handleDelete(turno.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-base">Editar Turno</DialogTitle>
            <DialogDescription className="text-xs">
              Modifica la fecha y hora del turno
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-fecha" className="text-sm">
                Fecha
              </Label>
              <Input
                id="edit-fecha"
                type="date"
                value={editData.fecha}
                onChange={(e) => setEditData((prev) => ({ ...prev, fecha: e.target.value }))}
                className="text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-hora" className="text-sm">
                Hora
              </Label>
              <Input
                id="edit-hora"
                type="time"
                value={editData.hora}
                onChange={(e) => setEditData((prev) => ({ ...prev, hora: e.target.value }))}
                className="text-sm"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)} size="sm">
              Cancelar
            </Button>
            <Button onClick={handleSaveEdit} size="sm">
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster />
    </>
  )
}