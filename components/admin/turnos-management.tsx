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
import { CheckCircle2, XCircle, Edit, Trash2, Calendar as CalendarIcon, ChevronLeft, ChevronRight, X, Clock, Users, Ban } from "lucide-react"
import { collection, doc, setDoc, getDoc, deleteDoc } from "firebase/firestore"
import { db } from "@/lib/firebase/config"

export function TurnosManagement() {
  const [turnos, setTurnos] = useState<Turno[]>([])
  const [loading, setLoading] = useState(true)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedTurno, setSelectedTurno] = useState<Turno | null>(null)
  const [editData, setEditData] = useState({ fecha: "", hora: "" })
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [blockedDates, setBlockedDates] = useState<string[]>([])
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
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

  const fetchBlockedDates = async () => {
    try {
      const docRef = doc(db, "settings", "blockedDates")
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        setBlockedDates(docSnap.data().dates || [])
      }
    } catch (error) {
      console.error("Error fetching blocked dates:", error)
    }
  }

  useEffect(() => {
    fetchTurnos()
    fetchBlockedDates()
  }, [])

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
        title: "❌ Turno cancelado",
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
        title: "🗑️ Turno eliminado",
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
        title: "✏️ Turno actualizado",
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

  const handleBlockDate = async (dateStr: string) => {
    // Verificar si es domingo
    const date = new Date(dateStr + 'T00:00:00')
    const isSunday = date.getDay() === 0
    
    if (isSunday) {
      toast({
        title: "⚠️ Domingo bloqueado automáticamente",
        description: "Los domingos están bloqueados por defecto y no se pueden desbloquear",
        variant: "destructive",
      })
      return
    }
    
    if (!confirm(`¿Bloquear la fecha ${dateStr}? No se podrán agendar turnos en este día.`)) return

    try {
      const docRef = doc(db, "settings", "blockedDates")
      const newBlockedDates = [...blockedDates, dateStr]
      await setDoc(docRef, { dates: newBlockedDates })
      setBlockedDates(newBlockedDates)
      toast({
        title: "🚫 Fecha bloqueada",
        description: `La fecha ${dateStr} ha sido bloqueada`,
      })
    } catch (error) {
      console.error("Error blocking date:", error)
      toast({
        title: "Error",
        description: "No se pudo bloquear la fecha",
        variant: "destructive",
      })
    }
  }

  const handleUnblockDate = async (dateStr: string) => {
    // Verificar si es domingo
    const date = new Date(dateStr + 'T00:00:00')
    const isSunday = date.getDay() === 0
    
    if (isSunday) {
      toast({
        title: "⚠️ No se puede desbloquear",
        description: "Los domingos están bloqueados automáticamente por política del negocio",
        variant: "destructive",
      })
      return
    }
    
    try {
      const docRef = doc(db, "settings", "blockedDates")
      const newBlockedDates = blockedDates.filter(d => d !== dateStr)
      await setDoc(docRef, { dates: newBlockedDates })
      setBlockedDates(newBlockedDates)
      toast({
        title: "✅ Fecha desbloqueada",
        description: `La fecha ${dateStr} ha sido desbloqueada`,
      })
    } catch (error) {
      console.error("Error unblocking date:", error)
      toast({
        title: "Error",
        description: "No se pudo desbloquear la fecha",
        variant: "destructive",
      })
    }
  }

  const handleDateClick = (dateStr: string) => {
    setSelectedDate(dateStr)
  }

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return (
          <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700">
            Pendiente
          </Badge>
        )
      case "completado":
        return (
          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800">
            Completado
          </Badge>
        )
      case "cancelado":
        return (
          <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-200 dark:bg-rose-950/50 dark:text-rose-400 border-rose-200 dark:border-rose-800">
            Cancelado
          </Badge>
        )
      default:
        return <Badge variant="outline">{estado}</Badge>
    }
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    return { daysInMonth, startingDayOfWeek, year, month }
  }

  const getTurnosForDate = (dateStr: string) => {
    return turnos.filter(t => t.turno.fecha === dateStr && t.estado !== "cancelado")
  }

  const isDateBlocked = (dateStr: string) => {
    // Verificar si es domingo (día 0)
    const date = new Date(dateStr + 'T00:00:00')
    const isSunday = date.getDay() === 0
    
    // Está bloqueado si es domingo O está en la lista de fechas bloqueadas manualmente
    return isSunday || blockedDates.includes(dateStr)
  }

  const selectedDateTurnos = selectedDate ? getTurnosForDate(selectedDate) : []
  const selectedDateStats = {
    total: selectedDateTurnos.length,
    pendientes: selectedDateTurnos.filter(t => t.estado === "pendiente").length,
    completados: selectedDateTurnos.filter(t => t.estado === "completado").length,
    isBlocked: selectedDate ? isDateBlocked(selectedDate) : false
  }

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth)
    const days = []
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="aspect-square" />)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      const turnosCount = getTurnosForDate(dateStr).length
      const isBlocked = isDateBlocked(dateStr)
      const isToday = new Date().toDateString() === new Date(year, month, day).toDateString()
      const isSelected = selectedDate === dateStr

      days.push(
        <div
          key={day}
          onClick={() => handleDateClick(dateStr)}
          className={`aspect-square p-0.5 border rounded-md flex flex-col items-center justify-center relative group hover:shadow-md transition-all cursor-pointer
            ${isToday ? 'ring-2 ring-emerald-500 dark:ring-emerald-400' : ''}
            ${isSelected ? 'ring-2 ring-rose-500 dark:ring-rose-400 bg-rose-50/50 dark:bg-rose-950/20' : ''}
            ${isBlocked ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'}
          `}
        >
          <span className={`text-xs sm:text-sm font-semibold ${isBlocked ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'}`}>
            {day}
          </span>
          {turnosCount > 0 && !isBlocked && (
            <div className="mt-0.5 sm:mt-1 px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-900/50 rounded-full">
              <span className="text-[9px] sm:text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                {turnosCount}
              </span>
            </div>
          )}
          {isBlocked && (
            <Ban className="absolute top-1 right-1 h-3 w-3 text-rose-500" />
          )}
        </div>
      )
    }

    return (
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            {monthNames[month]} {year}
          </h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setCurrentMonth(new Date(year, month - 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setCurrentMonth(new Date(year, month + 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map(day => (
            <div key={day} className="text-center text-[10px] sm:text-xs font-semibold text-slate-600 dark:text-slate-400 py-1 sm:py-2">
              {day}
            </div>
          ))}
          {days}
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3 text-[10px] sm:text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-emerald-100 dark:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800" />
            <span className="text-slate-600 dark:text-slate-400">Con turnos</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800" />
            <span className="text-slate-600 dark:text-slate-400">Bloqueada</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded ring-2 ring-rose-500" />
            <span className="text-slate-600 dark:text-slate-400">Seleccionada</span>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-10 w-10 animate-spin rounded-full border-3 border-slate-200 dark:border-slate-700 border-t-emerald-600 dark:border-t-emerald-500" />
      </div>
    )
  }

  return (
    <>
      <div className="grid gap-4 sm:gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                <CalendarIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" strokeWidth={2} />
              </div>
              <div>
                <CardTitle className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Calendario de Turnos</CardTitle>
                <CardDescription className="text-xs text-slate-500 dark:text-slate-500">Click en una fecha para ver turnos</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {renderCalendar()}
          </CardContent>
        </Card>

        <div className="space-y-4">
          {selectedDate ? (
            <>
              <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">
                    {new Date(selectedDate + 'T00:00:00').toLocaleDateString('es-AR', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Total turnos</span>
                    </div>
                    <span className="text-xl font-bold text-slate-900 dark:text-white">{selectedDateStats.total}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Pendientes</span>
                    </div>
                    <span className="text-xl font-bold text-slate-900 dark:text-white">{selectedDateStats.pendientes}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Completados</span>
                    </div>
                    <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{selectedDateStats.completados}</span>
                  </div>

                  {selectedDateStats.isBlocked ? (
                    <Button 
                      onClick={() => handleUnblockDate(selectedDate)}
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                      size="sm"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Desbloquear Fecha
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => handleBlockDate(selectedDate)}
                      variant="outline"
                      className="w-full border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-400 dark:hover:bg-rose-950/30"
                      size="sm"
                    >
                      <Ban className="h-4 w-4 mr-2" />
                      Bloquear Fecha
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Listado de turnos del día */}
              {selectedDateTurnos.length > 0 && (
                <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                  <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
                    <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">
                      Turnos Agendados
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                      {selectedDateTurnos
                        .sort((a, b) => a.turno.hora.localeCompare(b.turno.hora))
                        .map((turno) => (
                          <div 
                            key={turno.id}
                            className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                          >
                            <div className="flex-shrink-0 w-14 pt-0.5">
                              <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                {turno.turno.hora}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                                {turno.cliente.nombre}
                              </div>
                              <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                                🐾 {turno.mascota.nombre}
                              </div>
                              <div className="mt-1">
                                {getEstadoBadge(turno.estado)}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <CardContent className="pt-6 text-center">
                <CalendarIcon className="h-12 w-12 mx-auto text-slate-300 dark:text-slate-700 mb-3" />
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Selecciona una fecha del calendario para ver los detalles
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {selectedDate && selectedDateTurnos.length > 0 && (
        <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Turnos del {new Date(selectedDate + 'T00:00:00').toLocaleDateString('es-AR', { day: 'numeric', month: 'long' })}
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 dark:text-slate-500">
              {selectedDateTurnos.length} {selectedDateTurnos.length === 1 ? 'turno' : 'turnos'} agendados
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3">
              {selectedDateTurnos.map((turno) => (
                <div 
                  key={turno.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-slate-200 dark:border-slate-800 hover:shadow-md transition-all bg-slate-50/50 dark:bg-slate-800/30"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {turno.cliente.nombre}
                      </div>
                      {getEstadoBadge(turno.estado)}
                    </div>
                    <div className="mt-1 flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
                      <span>🐾 {turno.mascota.nombre} ({turno.mascota.tipo})</span>
                      <span>🕐 {turno.turno.hora}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {turno.estado === "pendiente" && (
                      <Button
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700 h-9"
                        onClick={() => turno.id && handleMarkCompleted(turno.id)}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Completar
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-9 hover:bg-slate-100 dark:hover:bg-slate-800"
                      onClick={() => handleEdit(turno)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800">
          <CardTitle className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Todos los Turnos</CardTitle>
          <CardDescription className="text-xs text-slate-500 dark:text-slate-500">
            Lista completa de turnos agendados
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 dark:bg-slate-800/50">
                  <TableHead className="text-xs font-semibold">Cliente</TableHead>
                  <TableHead className="text-xs font-semibold">Mascota</TableHead>
                  <TableHead className="hidden text-xs font-semibold sm:table-cell">Tipo</TableHead>
                  <TableHead className="text-xs font-semibold">Fecha</TableHead>
                  <TableHead className="hidden text-xs font-semibold lg:table-cell">Hora</TableHead>
                  <TableHead className="text-xs font-semibold">Estado</TableHead>
                  <TableHead className="text-xs font-semibold">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {turnos.map((turno) => (
                  <TableRow key={turno.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                    <TableCell className="text-xs font-medium">{turno.cliente.nombre}</TableCell>
                    <TableCell className="text-xs">{turno.mascota.nombre}</TableCell>
                    <TableCell className="hidden capitalize text-xs sm:table-cell">
                      {turno.mascota.tipo}
                    </TableCell>
                    <TableCell className="text-xs">{turno.turno.fecha}</TableCell>
                    <TableCell className="hidden text-xs lg:table-cell">{turno.turno.hora}</TableCell>
                    <TableCell>{getEstadoBadge(turno.estado)}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleEdit(turno)} 
                          className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        {turno.estado === "pendiente" && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0 hover:bg-emerald-100 dark:hover:bg-emerald-900/30"
                              onClick={() => turno.id && handleMarkCompleted(turno.id)}
                            >
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0 hover:bg-rose-100 dark:hover:bg-rose-900/30"
                              onClick={() => turno.id && handleCancel(turno.id)}
                            >
                              <XCircle className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
                            </Button>
                          </>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0 hover:bg-rose-100 dark:hover:bg-rose-900/30"
                          onClick={() => turno.id && handleDelete(turno.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
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
        <DialogContent className="sm:max-w-[425px] border-slate-200 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Editar Turno</DialogTitle>
            <DialogDescription className="text-xs text-slate-500">Modifica la fecha y hora del turno</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-fecha" className="text-sm font-semibold">Fecha</Label>
              <Input
                id="edit-fecha"
                type="date"
                value={editData.fecha}
                onChange={(e) => setEditData((prev) => ({ ...prev, fecha: e.target.value }))}
                className="text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-hora" className="text-sm font-semibold">Hora</Label>
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
            <Button 
              variant="outline" 
              onClick={() => setEditDialogOpen(false)}
              className="text-sm"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSaveEdit}
              className="bg-emerald-600 hover:bg-emerald-700 text-sm"
            >
              Guardar cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster />
    </>
  )
}