"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, Pie, PieChart, Cell, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { getTurnos } from "@/lib/firebase/firestore"
import type { Turno } from "@/lib/firebase/firestore"
import { Calendar, PawPrint, CheckCircle2 } from "lucide-react"

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
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
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
      fecha,
      cantidad,
    }))
    .slice(0, 7)
    .reverse()

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
    { estado: "Pendientes", cantidad: estadosTurnos.pendiente },
    { estado: "Completados", cantidad: estadosTurnos.completado },
    { estado: "Cancelados", cantidad: estadosTurnos.cancelado },
  ]

  const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))"]

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Turnos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{turnos.length}</div>
            <p className="text-xs text-muted-foreground">Turnos registrados</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Turnos Pendientes</CardTitle>
            <PawPrint className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estadosTurnos.pendiente}</div>
            <p className="text-xs text-muted-foreground">Por atender</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Turnos Completados</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estadosTurnos.completado}</div>
            <p className="text-xs text-muted-foreground">Atendidos</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Turnos por Día</CardTitle>
            <CardDescription className="text-xs md:text-sm">Últimos 7 días con turnos</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                cantidad: {
                  label: "Turnos",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[250px] md:h-[300px]"
            >
              <LineChart data={turnosPorDiaData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fecha" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Line type="monotone" dataKey="cantidad" stroke="hsl(var(--chart-1))" strokeWidth={2} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Tipos de Mascotas</CardTitle>
            <CardDescription className="text-xs md:text-sm">Distribución de mascotas atendidas</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                cantidad: {
                  label: "Cantidad",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[250px] md:h-[300px]"
            >
              <PieChart>
                <Pie data={mascotasPorTipoData} dataKey="cantidad" nameKey="tipo" cx="50%" cy="50%" outerRadius={80}>
                  {mascotasPorTipoData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Estado de Turnos</CardTitle>
            <CardDescription className="text-xs md:text-sm">Pendientes vs Completados vs Cancelados</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                cantidad: {
                  label: "Cantidad",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-[250px] md:h-[300px]"
            >
              <BarChart data={estadosTurnosData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="estado" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Bar dataKey="cantidad" fill="hsl(var(--chart-3))" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
