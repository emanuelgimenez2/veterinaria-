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
import { getTurnos, updateTurno, deleteTurno } from "@/lib/firebase/firestore"
import type { Turno } from "@/lib/firebase/firestore"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { CheckCircle2, XCircle, Edit, Trash2 } from "lucide-react"

export function TurnosManagement() {
  const [turnos, setTurnos] = useState<Turno[]>([])
  const [loading, setLoading] = useState(true)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedTurno, setSelectedTurno] = useState<Turno | null>(null)
  const [editData, setEditData] = useState({ fecha: "", hora: "" })
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

  const handleMarkCompleted = async (turnoId: string) => {
    try {
      await updateTurno(turnoId, { estado: "completado" })
      toast({
        title: "Turno completado",
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
        title: "Turno actualizado",
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
          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-400">
            Pendiente
          </Badge>
        )
      case "completado":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-700 dark:text-green-400">
            Completado
          </Badge>
        )
      case "cancelado":
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-700 dark:text-red-400">
            Cancelado
          </Badge>
        )
      default:
        return <Badge variant="outline">{estado}</Badge>
    }
  }

  if (loading) {
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
          <CardTitle className="text-base md:text-lg">Gestión de Turnos</CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Administra todos los turnos agendados en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs md:text-sm">Cliente</TableHead>
                  <TableHead className="text-xs md:text-sm">Mascota</TableHead>
                  <TableHead className="hidden text-xs sm:table-cell md:text-sm">Tipo</TableHead>
                  <TableHead className="text-xs md:text-sm">Fecha</TableHead>
                  <TableHead className="hidden text-xs lg:table-cell md:text-sm">Hora</TableHead>
                  <TableHead className="hidden text-xs xl:table-cell md:text-sm">Motivo</TableHead>
                  <TableHead className="text-xs md:text-sm">Estado</TableHead>
                  <TableHead className="text-xs md:text-sm">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {turnos.map((turno) => (
                  <TableRow key={turno.id}>
                    <TableCell className="text-xs font-medium md:text-sm">{turno.cliente.nombre}</TableCell>
                    <TableCell className="text-xs md:text-sm">{turno.mascota.nombre}</TableCell>
                    <TableCell className="hidden capitalize text-xs sm:table-cell md:text-sm">
                      {turno.mascota.tipo}
                    </TableCell>
                    <TableCell className="text-xs md:text-sm">{turno.turno.fecha}</TableCell>
                    <TableCell className="hidden text-xs lg:table-cell md:text-sm">{turno.turno.hora}</TableCell>
                    <TableCell className="hidden max-w-[200px] truncate text-xs xl:table-cell md:text-sm">
                      {turno.mascota.motivo}
                    </TableCell>
                    <TableCell>{getEstadoBadge(turno.estado)}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(turno)} className="h-7 w-7 p-0">
                          <Edit className="h-3 w-3" />
                        </Button>
                        {turno.estado === "pendiente" && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 w-7 bg-green-500/10 p-0 hover:bg-green-500/20"
                              onClick={() => turno.id && handleMarkCompleted(turno.id)}
                            >
                              <CheckCircle2 className="h-3 w-3 text-green-600" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 w-7 bg-red-500/10 p-0 hover:bg-red-500/20"
                              onClick={() => turno.id && handleCancel(turno.id)}
                            >
                              <XCircle className="h-3 w-3 text-red-600" />
                            </Button>
                          </>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 w-7 bg-destructive/10 p-0 hover:bg-destructive/20"
                          onClick={() => turno.id && handleDelete(turno.id)}
                        >
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-base md:text-lg">Editar Turno</DialogTitle>
            <DialogDescription className="text-xs md:text-sm">Modifica la fecha y hora del turno</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
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
