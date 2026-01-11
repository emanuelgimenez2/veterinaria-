"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardCharts } from "@/components/admin/dashboard-charts"
import { TurnosManagement } from "@/components/admin/turnos-management"
import { ClientesManagement } from "@/components/admin/clientes-management"
import { HistoriasManagement } from "@/components/admin/historias-management"
import { LayoutDashboard, Calendar, Users, FileText, Shield, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const router = useRouter()

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 relative">
      {/* Fondo sutil */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 dark:bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-rose-500/5 dark:bg-rose-500/5 rounded-full blur-3xl" />
      </div>

      {/* Header profesional */}
      <div className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-sm">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 md:py-6">
          <div className="flex items-center justify-between mb-4 sm:mb-5 md:mb-6">
            <Button 
              variant="ghost" 
              onClick={() => router.push("/")}
              className="hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 h-9 sm:h-10 px-3 sm:px-4 rounded-lg"
              size="sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Volver</span>
            </Button>
            
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800">
              <Shield className="h-4 w-4 text-emerald-600 dark:text-emerald-400" strokeWidth={2} />
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">Admin</span>
            </div>
          </div>
          
          {/* Título centrado */}
          <div className="text-center">
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
              Panel de Control
            </h1>
            <p className="text-xs xs:text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium mt-1.5 sm:mt-2">
              Gestión completa del sistema
            </p>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Tabs profesionales */}
          <div className="w-full overflow-x-auto overflow-y-visible pb-2 scrollbar-hide">
            <div className="flex justify-start sm:justify-center min-w-max">
              <TabsList className="inline-flex h-auto gap-2 p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-xl">
                <TabsTrigger 
                  value="dashboard" 
                  className="relative flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 text-sm font-semibold rounded-lg transition-all duration-200 whitespace-nowrap data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=inactive]:text-slate-600 dark:data-[state=inactive]:text-slate-400 data-[state=inactive]:hover:bg-slate-100 dark:data-[state=inactive]:hover:bg-slate-800"
                >
                  <LayoutDashboard className="h-4 w-4" strokeWidth={2} />
                  <span className="hidden xs:inline">Dashboard</span>
                  <span className="xs:hidden">Inicio</span>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="turnos" 
                  className="relative flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 text-sm font-semibold rounded-lg transition-all duration-200 whitespace-nowrap data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=inactive]:text-slate-600 dark:data-[state=inactive]:text-slate-400 data-[state=inactive]:hover:bg-slate-100 dark:data-[state=inactive]:hover:bg-slate-800"
                >
                  <Calendar className="h-4 w-4" strokeWidth={2} />
                  <span>Turnos</span>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="clientes" 
                  className="relative flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 text-sm font-semibold rounded-lg transition-all duration-200 whitespace-nowrap data-[state=active]:bg-rose-600 data-[state=active]:text-white data-[state=inactive]:text-slate-600 dark:data-[state=inactive]:text-slate-400 data-[state=inactive]:hover:bg-slate-100 dark:data-[state=inactive]:hover:bg-slate-800"
                >
                  <Users className="h-4 w-4" strokeWidth={2} />
                  <span>Clientes</span>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="historias" 
                  className="relative flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 text-sm font-semibold rounded-lg transition-all duration-200 whitespace-nowrap data-[state=active]:bg-rose-600 data-[state=active]:text-white data-[state=inactive]:text-slate-600 dark:data-[state=inactive]:text-slate-400 data-[state=inactive]:hover:bg-slate-100 dark:data-[state=inactive]:hover:bg-slate-800"
                >
                  <FileText className="h-4 w-4" strokeWidth={2} />
                  <span className="hidden sm:inline">Historia Clínica</span>
                  <span className="sm:hidden">Historia</span>
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          {/* Contenido de tabs */}
          <div className="animate-in fade-in duration-500">
            <TabsContent value="dashboard" className="space-y-6 mt-0">
              <DashboardCharts />
            </TabsContent>

            <TabsContent value="turnos" className="space-y-6 mt-0">
              <TurnosManagement />
            </TabsContent>

           /*  <TabsContent value="clientes" className="space-y-6 mt-0">
              <ClientesManagement />
            </TabsContent>

            <TabsContent value="historias" className="space-y-6 mt-0">
              <HistoriasManagement />
            </TabsContent> */
          </div>
        </Tabs>
      </div>
    </main>
  )
}