"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, CartesianGrid, Line, LineChart, Pie, PieChart, Cell, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import { getTurnos } from "@/lib/firebase/firestore"
import type { Turno } from "@/lib/firebase/firestore"
import { Calendar, TrendingUp, CheckCircle2, Clock } from "lucide-react"

export function DashboardCharts() {
  const [turnos, setTurnos] = useState<Turno[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTurnos = async () => {
      try {
        const data = await getTurnos()
        setTurnos(data)
      } catch (error) {
        console.error("Error fetching turnos:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTurnos()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-900 dark:border-slate-100 border-t-transparent" />
      </div>
    )
  }

  // Process data for charts
  const turnosPorDia = turnos.reduce(
    (acc, turno) => {
      const fecha = turno.turno.fecha
      acc[fecha] = (acc[fecha] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const turnosPorDiaData = Object.entries(turnosPorDia)
    .map(([fecha, cantidad]) => ({
      fecha: new Date(fecha + 'T00:00:00').toLocaleDateString('es-AR', { month: 'short', day: 'numeric' }),
      cantidad,
    }))
    .slice(-7)

  const mascotasPorTipo = turnos.reduce(
    (acc, turno) => {
      const tipo = turno.mascota.tipo
      acc[tipo] = (acc[tipo] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const mascotasPorTipoData = Object.entries(mascotasPorTipo).map(([tipo, cantidad]) => ({
    tipo: tipo.charAt(0).toUpperCase() + tipo.slice(1),
    cantidad,
  }))

  const estadosTurnos = {
    pendiente: turnos.filter((t) => t.estado === "pendiente").length,
    completado: turnos.filter((t) => t.estado === "completado").length,
    cancelado: turnos.filter((t) => t.estado === "cancelado").length,
  }

  const estadosTurnosData = [
    { estado: "Pendientes", cantidad: estadosTurnos.pendiente, color: "#64748b" },
    { estado: "Completados", cantidad: estadosTurnos.completado, color: "#059669" },
    { estado: "Cancelados", cantidad: estadosTurnos.cancelado, color: "#dc2626" },
  ]

  const PIE_COLORS = ["#1e40af", "#7c3aed", "#db2777", "#ea580c", "#0891b2"]

  const totalTurnos = turnos.length
  const tasaCompletado = totalTurnos > 0 ? ((estadosTurnos.completado / totalTurnos) * 100).toFixed(0) : 0

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Total Turnos</CardTitle>
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-xl sm:text-2xl font-semibold">{turnos.length}</div>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">registrados</p>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Pendientes</CardTitle>
            <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-xl sm:text-2xl font-semibold">{estadosTurnos.pendiente}</div>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">por atender</p>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Completados</CardTitle>
            <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-xl sm:text-2xl font-semibold">{estadosTurnos.completado}</div>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">atendidos</p>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Tasa Éxito</CardTitle>
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-xl sm:text-2xl font-semibold">{tasaCompletado}%</div>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">completados</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-4 lg:gap-6 lg:grid-cols-2">
        {/* Turnos por día */}
        <Card className="border shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold">Turnos por Día</CardTitle>
            <CardDescription className="text-xs">Últimos 7 días con actividad</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={turnosPorDiaData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis 
                  dataKey="fecha" 
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  axisLine={{ stroke: "#e5e7eb" }}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  axisLine={{ stroke: "#e5e7eb" }}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "#fff", 
                    border: "1px solid #e5e7eb",
                    borderRadius: "6px",
                    fontSize: "12px"
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="cantidad" 
                  stroke="#1e40af" 
                  strokeWidth={2}
                  dot={{ fill: "#1e40af", r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Tipos de mascotas */}
        <Card className="border shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold">Tipos de Mascotas</CardTitle>
            <CardDescription className="text-xs">Distribución por especie</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie 
                  data={mascotasPorTipoData} 
                  dataKey="cantidad" 
                  nameKey="tipo" 
                  cx="50%" 
                  cy="50%" 
                  outerRadius={90}
                  label={({ tipo, percent }) => `${tipo} ${(percent * 100).toFixed(0)}%`}
                  labelLine={{ stroke: "#94a3b8", strokeWidth: 1 }}
                  style={{ fontSize: "11px" }}
                >
                  {mascotasPorTipoData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "#fff", 
                    border: "1px solid #e5e7eb",
                    borderRadius: "6px",
                    fontSize: "12px"
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Estado de turnos */}
        <Card className="lg:col-span-2 border shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold">Estado de Turnos</CardTitle>
            <CardDescription className="text-xs">Resumen por estado</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={estadosTurnosData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis 
                  dataKey="estado" 
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  axisLine={{ stroke: "#e5e7eb" }}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  axisLine={{ stroke: "#e5e7eb" }}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "#fff", 
                    border: "1px solid #e5e7eb",
                    borderRadius: "6px",
                    fontSize: "12px"
                  }}
                />
                <Bar dataKey="cantidad" radius={[4, 4, 0, 0]}>
                  {estadosTurnosData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}