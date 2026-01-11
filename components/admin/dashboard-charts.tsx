"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, CartesianGrid, Line, LineChart, Pie, PieChart, Cell, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend, Area, AreaChart } from "recharts"
import { getTurnos } from "@/lib/firebase/firestore"
import type { Turno } from "@/lib/firebase/firestore"
import { Calendar, TrendingUp, CheckCircle2, Clock, Activity, PawPrint } from "lucide-react"

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
      <div className="flex items-center justify-center py-16">
        <div className="relative">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-200 dark:border-emerald-900 border-t-emerald-600 dark:border-t-emerald-400" />
          <div className="absolute inset-0 h-12 w-12 animate-ping rounded-full border-4 border-emerald-400 opacity-20" />
        </div>
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
    { estado: "Pendientes", cantidad: estadosTurnos.pendiente, color: "#f59e0b", gradient: "from-amber-400 to-amber-600" },
    { estado: "Completados", cantidad: estadosTurnos.completado, color: "#10b981", gradient: "from-emerald-400 to-emerald-600" },
    { estado: "Cancelados", cantidad: estadosTurnos.cancelado, color: "#ef4444", gradient: "from-red-400 to-red-600" },
  ]

  const PIE_COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"]

  const totalTurnos = turnos.length
  const tasaCompletado = totalTurnos > 0 ? ((estadosTurnos.completado / totalTurnos) * 100).toFixed(0) : 0

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl p-3">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">{label}</p>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            {payload[0].name}: <span className="font-bold text-emerald-600 dark:text-emerald-400">{payload[0].value}</span>
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Stats Cards - Mejorados */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        {/* Total Turnos */}
        <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 dark:from-blue-500/20 dark:via-indigo-500/20 dark:to-purple-500/20 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">Total Turnos</CardTitle>
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/50">
              <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" strokeWidth={2.5} />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              {turnos.length}
            </div>
            <p className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-400 font-semibold mt-1">registrados</p>
          </CardContent>
        </Card>

        {/* Pendientes */}
        <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-yellow-500/10 dark:from-amber-500/20 dark:via-orange-500/20 dark:to-yellow-500/20 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">Pendientes</CardTitle>
            <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/50">
              <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" strokeWidth={2.5} />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent">
              {estadosTurnos.pendiente}
            </div>
            <p className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-400 font-semibold mt-1">por atender</p>
          </CardContent>
        </Card>

        {/* Completados */}
        <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-green-500/10 dark:from-emerald-500/20 dark:via-teal-500/20 dark:to-green-500/20 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">Completados</CardTitle>
            <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/50">
              <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" strokeWidth={2.5} />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
              {estadosTurnos.completado}
            </div>
            <p className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-400 font-semibold mt-1">atendidos</p>
          </CardContent>
        </Card>

        {/* Tasa Éxito */}
        <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-violet-500/10 via-purple-500/10 to-fuchsia-500/10 dark:from-violet-500/20 dark:via-purple-500/20 dark:to-fuchsia-500/20 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">Tasa Éxito</CardTitle>
            <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 shadow-lg shadow-violet-500/50">
              <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" strokeWidth={2.5} />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-violet-600 to-fuchsia-600 dark:from-violet-400 dark:to-fuchsia-400 bg-clip-text text-transparent">
              {tasaCompletado}%
            </div>
            <p className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-400 font-semibold mt-1">completados</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-4 sm:gap-5 lg:gap-6 lg:grid-cols-2">
        {/* Turnos por día - Area Chart */}
        <Card className="border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/30">
                <Activity className="h-4 w-4 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <CardTitle className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Turnos por Día</CardTitle>
                <CardDescription className="text-xs text-slate-600 dark:text-slate-400">Últimos 7 días con actividad</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={turnosPorDiaData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorCantidad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis 
                  dataKey="fecha" 
                  tick={{ fontSize: 11, fill: "#64748b", fontWeight: 600 }}
                  axisLine={{ stroke: "#cbd5e1" }}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 11, fill: "#64748b", fontWeight: 600 }}
                  axisLine={{ stroke: "#cbd5e1" }}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="cantidad" 
                  stroke="#10b981"
                  strokeWidth={3}
                  fill="url(#colorCantidad)"
                  dot={{ fill: "#10b981", strokeWidth: 2, r: 4, stroke: "#fff" }}
                  activeDot={{ r: 6, fill: "#10b981", stroke: "#fff", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Tipos de mascotas - Mejorado */}
        <Card className="border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30">
                <PawPrint className="h-4 w-4 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <CardTitle className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Tipos de Mascotas</CardTitle>
                <CardDescription className="text-xs text-slate-600 dark:text-slate-400">Distribución por especie</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie 
                  data={mascotasPorTipoData} 
                  dataKey="cantidad" 
                  nameKey="tipo" 
                  cx="50%" 
                  cy="50%" 
                  outerRadius={90}
                  innerRadius={50}
                  paddingAngle={2}
                  label={({ tipo, percent }) => `${tipo} ${(percent * 100).toFixed(0)}%`}
                  labelLine={{ stroke: "#94a3b8", strokeWidth: 1 }}
                  style={{ fontSize: "11px", fontWeight: 700 }}
                >
                  {mascotasPorTipoData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Estado de turnos - Bar Chart mejorado */}
        <Card className="lg:col-span-2 border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/30">
                <CheckCircle2 className="h-4 w-4 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <CardTitle className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Estado de Turnos</CardTitle>
                <CardDescription className="text-xs text-slate-600 dark:text-slate-400">Resumen por estado actual</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={estadosTurnosData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <defs>
                  {estadosTurnosData.map((entry, index) => (
                    <linearGradient key={index} id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={entry.color} stopOpacity={0.9}/>
                      <stop offset="100%" stopColor={entry.color} stopOpacity={0.6}/>
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis 
                  dataKey="estado" 
                  tick={{ fontSize: 12, fill: "#64748b", fontWeight: 700 }}
                  axisLine={{ stroke: "#cbd5e1" }}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 11, fill: "#64748b", fontWeight: 600 }}
                  axisLine={{ stroke: "#cbd5e1" }}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="cantidad" radius={[8, 8, 0, 0]} barSize={60}>
                  {estadosTurnosData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`url(#gradient-${index})`} />
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