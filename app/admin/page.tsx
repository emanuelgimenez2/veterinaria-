"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardCharts } from "@/components/admin/dashboard-charts"
import { TurnosManagement } from "@/components/admin/turnos-management"
import { ClientesManagement } from "@/components/admin/clientes-management"
import { HistoriasManagement } from "@/components/admin/historias-management"
import { LayoutDashboard, Calendar, Users, FileText } from "lucide-react"

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <main className="min-h-screen bg-muted/30">
      <div className="border-b border-border bg-background">
        <div className="container px-4 py-4 md:py-6">
          <h1 className="text-2xl font-bold md:text-3xl">Panel de Administración</h1>
          <p className="text-sm text-muted-foreground md:text-base">Gestiona turnos, clientes e historias clínicas</p>
        </div>
      </div>

      <div className="container px-4 py-4 md:py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 md:space-y-6">
          <TabsList className="grid h-auto w-full grid-cols-2 gap-1 p-1 sm:inline-flex sm:w-auto sm:flex-row">
            <TabsTrigger value="dashboard" className="flex items-center gap-1.5 text-xs sm:gap-2 sm:text-sm">
              <LayoutDashboard className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Dashboard</span>
              <span className="sm:hidden">Inicio</span>
            </TabsTrigger>
            <TabsTrigger value="turnos" className="flex items-center gap-1.5 text-xs sm:gap-2 sm:text-sm">
              <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Turnos
            </TabsTrigger>
            <TabsTrigger value="clientes" className="flex items-center gap-1.5 text-xs sm:gap-2 sm:text-sm">
              <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Clientes
            </TabsTrigger>
            <TabsTrigger value="historias" className="flex items-center gap-1.5 text-xs sm:gap-2 sm:text-sm">
              <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Historia Clínica</span>
              <span className="sm:hidden">Historia</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4">
            <DashboardCharts />
          </TabsContent>

          <TabsContent value="turnos" className="space-y-4">
            <TurnosManagement />
          </TabsContent>

          <TabsContent value="clientes" className="space-y-4">
            <ClientesManagement />
          </TabsContent>

          <TabsContent value="historias" className="space-y-4">
            <HistoriasManagement />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
