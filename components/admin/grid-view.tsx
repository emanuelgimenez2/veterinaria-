"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, PawPrint, Phone, MapPin, CheckCircle2, XCircle, AlertCircle } from "lucide-react"
import type { Turno } from "@/lib/firebase/firestore"

interface GridViewProps {
  turnos: Turno[]
  selectedDate: string
  onTurnoClick: (turno: Turno) => void
}

export function GridView({ turnos, selectedDate, onTurnoClick }: GridViewProps) {
  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return (
          <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/50 dark:text-amber-300 border-0 text-[9px] sm:text-[10px]">
            <Clock className="h-2 w-2 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
            Pendiente
          </Badge>
        )
      case "completado":
        return (
          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 border-0 text-[9px] sm:text-[10px]">
            <CheckCircle2 className="h-2 w-2 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
            Completado
          </Badge>
        )
      case "cancelado":
        return (
          <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-200 dark:bg-rose-950/50 dark:text-rose-400 border-0 text-[9px] sm:text-[10px]">
            <XCircle className="h-2 w-2 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
            Cancelado
          </Badge>
        )
      default:
        return <Badge variant="outline">{estado}</Badge>
    }
  }

  const now = new Date()
  const isToday = selectedDate === now.toISOString().split("T")[0]
  const sortedTurnos = [...turnos].sort((a, b) => a.turno.hora.localeCompare(b.turno.hora))

  if (sortedTurnos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 sm:py-16 lg:py-20">
        <div className="p-4 sm:p-5 lg:p-6 rounded-full bg-slate-100 dark:bg-slate-800 mb-4 sm:mb-6">
          <Clock className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-slate-400 dark:text-slate-600" />
        </div>
        <h3 className="text-base sm:text-lg lg:text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">
          No hay turnos agendados
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-500">
          No se encontraron turnos para esta fecha
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-2 sm:gap-3 lg:gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {sortedTurnos.map((turno) => {
        const turnoHour = Number.parseInt(turno.turno.hora.split(":")[0])
        const isUrgent = turno.estado === "pendiente" && isToday && turnoHour <= now.getHours() + 1

        return (
          <div
            key={turno.id}
            className={`group relative overflow-hidden rounded-lg sm:rounded-xl lg:rounded-2xl border sm:border-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
              turno.estado === "completado"
                ? "bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-emerald-200 dark:border-emerald-800"
                : turno.estado === "cancelado"
                  ? "bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/30 dark:to-slate-800/30 border-slate-300 dark:border-slate-700 opacity-60"
                  : isUrgent
                    ? "bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30 border-rose-300 dark:border-rose-700 shadow-lg shadow-rose-500/20"
                    : "bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800/50 border-slate-200 dark:border-slate-700"
            }`}
          >
            {/* Accent Bar */}
            <div
              className={`absolute left-0 top-0 right-0 h-1 sm:h-1.5 ${
                turno.estado === "completado"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                  : turno.estado === "cancelado"
                    ? "bg-gradient-to-r from-slate-400 to-slate-500"
                    : isUrgent
                      ? "bg-gradient-to-r from-rose-500 to-pink-500"
                      : "bg-gradient-to-r from-indigo-500 to-purple-500"
              }`}
            />

            <div className="p-3 sm:p-4 lg:p-5 pt-4 sm:pt-5 lg:pt-6">
              {/* Header */}
              <div className="flex items-start justify-between gap-2 mb-3 sm:mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base lg:text-lg font-black text-slate-900 dark:text-white truncate mb-1">
                    {turno.cliente.nombre}
                  </h3>
                  <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-slate-600 dark:text-slate-400">
                    <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{turno.turno.hora}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 sm:gap-2">
                  {getEstadoBadge(turno.estado)}
                  {isUrgent && (
                    <Badge className="bg-rose-500 text-white border-0 px-1.5 sm:px-2 py-0.5 text-[8px] sm:text-[9px] font-bold">
                      <AlertCircle className="h-2 w-2 sm:h-2.5 sm:w-2.5 mr-0.5" />
                      URGENTE
                    </Badge>
                  )}
                </div>
              </div>

              {/* Mascota Info */}
              <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
                <div className="flex items-center gap-2 p-2 sm:p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <PawPrint className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-pink-600 dark:text-pink-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] sm:text-xs font-semibold text-slate-900 dark:text-white truncate">
                      {turno.mascota.nombre}
                    </p>
                    <p className="text-[9px] sm:text-[10px] text-slate-600 dark:text-slate-400">
                      {turno.mascota.tipo} • {turno.mascota.raza}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2 sm:p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                  <p className="text-[10px] sm:text-xs font-semibold text-slate-900 dark:text-white truncate">
                    {turno.cliente.telefono}
                  </p>
                </div>

                <div className="flex items-start gap-2 p-2 sm:p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                  <p className="text-[9px] sm:text-[10px] font-medium text-slate-700 dark:text-slate-300 line-clamp-2">
                    {turno.cliente.direccion}
                  </p>
                </div>
              </div>

              <Button
                onClick={() => onTurnoClick(turno)}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg sm:rounded-xl h-7 sm:h-8 lg:h-9 text-[10px] sm:text-xs lg:text-sm shadow-lg"
              >
                Ver Detalles Completos
              </Button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
