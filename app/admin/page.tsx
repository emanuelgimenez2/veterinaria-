"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardCharts } from "@/components/admin/dashboard-charts"
import { TurnosManagement } from "@/components/admin/turnos-management"
import { ClientesManagement } from "@/components/admin/clientes-management"
import { HistoriasManagement } from "@/components/admin/historias-management"
import { LayoutDashboard, Calendar, Users, FileText, Sparkles, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const router = useRouter()

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 dark:from-slate-950 dark:via-blue-950/30 dark:to-indigo-950 relative overflow-hidden">
      {/* Animated background decorations */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 dark:from-blue-500/10 dark:to-indigo-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 -left-40 w-96 h-96 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 dark:from-indigo-500/10 dark:to-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-blue-400/10 to-purple-400/10 dark:from-blue-500/5 dark:to-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header Section */}
      <div className="border-b border-white/20 dark:border-slate-800/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg">
        <div className="container px-4 py-6 md:py-8">
          <div className="flex items-start justify-between mb-4">
            <Button 
              variant="ghost" 
              onClick={() => router.push("/")}
              className="group hover:bg-white/50 dark:hover:bg-slate-900/50 backdrop-blur-sm transition-all -ml-3"
            >
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Volver
            </Button>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20 border border-blue-500/20 dark:border-blue-500/30">
              <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400 animate-pulse" />
              <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">Admin Panel</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 dark:shadow-blue-500/20">
              <LayoutDashboard className="h-8 w-8 text-white" strokeWidth={2.5} />
            </div>
            
            <div>
              <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                Panel de Administración
              </h1>
              <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium mt-1">
                📊 Gestiona turnos, clientes e historias clínicas
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container px-4 py-6 md:py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Enhanced Tabs List */}
          <div className="flex justify-center">
            <TabsList className="inline-flex h-auto gap-2 p-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-2 border-white/20 dark:border-slate-800/50 shadow-xl rounded-2xl">
              <TabsTrigger 
                value="dashboard" 
                className="flex items-center gap-2 px-4 py-3 text-sm font-semibold rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/50 dark:data-[state=active]:shadow-blue-500/30 transition-all duration-300 hover:scale-105"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
                <span className="sm:hidden">Inicio</span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="turnos" 
                className="flex items-center gap-2 px-4 py-3 text-sm font-semibold rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/50 dark:data-[state=active]:shadow-blue-500/30 transition-all duration-300 hover:scale-105"
              >
                <Calendar className="h-4 w-4" />
                Turnos
              </TabsTrigger>
              
              <TabsTrigger 
                value="clientes" 
                className="flex items-center gap-2 px-4 py-3 text-sm font-semibold rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/50 dark:data-[state=active]:shadow-blue-500/30 transition-all duration-300 hover:scale-105"
              >
                <Users className="h-4 w-4" />
                Clientes
              </TabsTrigger>
              
              <TabsTrigger 
                value="historias" 
                className="flex items-center gap-2 px-4 py-3 text-sm font-semibold rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/50 dark:data-[state=active]:shadow-blue-500/30 transition-all duration-300 hover:scale-105"
              >
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Historia Clínica</span>
                <span className="sm:hidden">Historia</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Contents with animation */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <TabsContent value="dashboard" className="space-y-4 mt-0">
              <DashboardCharts />
            </TabsContent>

            <TabsContent value="turnos" className="space-y-4 mt-0">
              <TurnosManagement />
            </TabsContent>

            <TabsContent value="clientes" className="space-y-4 mt-0">
              <ClientesManagement />
            </TabsContent>

            <TabsContent value="historias" className="space-y-4 mt-0">
              <HistoriasManagement />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </main>
  )
}