"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  getTurnos,
  updateTurno,
  deleteTurno,
  getMascotas,
} from "@/lib/firebase/firestore";
import type { Turno, Mascota } from "@/lib/firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import {
  CheckCircle2,
  XCircle,
  Edit,
  Trash2,
  CalendarIcon,
  Clock,
  Users,
  Ban,
  Phone,
  MapPin,
  PawPrint,
  Mail,
  FileText,
  Sparkles,
  Activity,
  Lock,
  Unlock,
  LayoutGrid,
  LayoutList,
  ArrowRight,
} from "lucide-react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

import { CalendarView } from "./calendar-view";
import { TimelineView } from "./timeline-view";
import { GridView } from "./grid-view";

export default function TurnosManagement() {
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [blockDateDialogOpen, setBlockDateDialogOpen] = useState(false);
  const [selectedTurno, setSelectedTurno] = useState<Turno | null>(null);
  const [mascotaDetails, setMascotaDetails] = useState<Mascota | null>(null);
  const [loadingMascota, setLoadingMascota] = useState(false);
  const [editData, setEditData] = useState({ fecha: "", hora: "" });
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [selectedDateForBlock, setSelectedDateForBlock] = useState<string>("");
  const [dateRangeStart, setDateRangeStart] = useState<string>("");
  const [dateRangeEnd, setDateRangeEnd] = useState<string>("");
  const [singleDateBlock, setSingleDateBlock] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [viewMode, setViewMode] = useState<"timeline" | "grid">("timeline");
  const { toast } = useToast();

  const fetchTurnos = async () => {
    try {
      const data = await getTurnos();
      setTurnos(data);
    } catch (error) {
      console.error("Error fetching turnos:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los turnos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchBlockedDates = async () => {
    try {
      const docRef = doc(db, "settings", "blockedDates");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setBlockedDates(docSnap.data().dates || []);
      }
    } catch (error) {
      console.error("Error fetching blocked dates:", error);
    }
  };

  const fetchMascotaDetails = async (clienteId: string, mascotaId: string) => {
    if (!mascotaId || !clienteId) return null;

    setLoadingMascota(true);
    try {
      const mascotas = await getMascotas(clienteId);
      const mascota = mascotas.find((m) => m.id === mascotaId);
      setMascotaDetails(mascota || null);
      return mascota || null;
    } catch (error) {
      console.error("[v0] Error fetching mascota details:", error);
      return null;
    } finally {
      setLoadingMascota(false);
    }
  };

  useEffect(() => {
    fetchTurnos();
    fetchBlockedDates();
  }, []);

  const handleToggleBlockDate = async (dateStr: string) => {
    try {
      const isCurrentlyBlocked = blockedDates.includes(dateStr);
      let newBlockedDates: string[];

      if (isCurrentlyBlocked) {
        newBlockedDates = blockedDates.filter((d) => d !== dateStr);
        toast({
          title: "Fecha habilitada",
          description: `La fecha ${dateStr} ha sido habilitada`,
        });
      } else {
        newBlockedDates = [...blockedDates, dateStr];
        toast({
          title: "Fecha bloqueada",
          description: `La fecha ${dateStr} ha sido bloqueada`,
        });
      }

      await setDoc(doc(db, "settings", "blockedDates"), {
        dates: newBlockedDates,
      });
      setBlockedDates(newBlockedDates);
    } catch (error) {
      console.error("Error toggling block date:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado de la fecha",
        variant: "destructive",
      });
    }
  };

  const handleToggleSingleDate = async (action: "block" | "unblock") => {
    if (!singleDateBlock) {
      toast({
        title: "Error",
        description: "Debes seleccionar una fecha",
        variant: "destructive",
      });
      return;
    }

    try {
      let newBlockedDates: string[];

      if (action === "block") {
        newBlockedDates = [...new Set([...blockedDates, singleDateBlock])];
        toast({
          title: "Fecha bloqueada",
          description: `Se bloqueó la fecha ${singleDateBlock}`,
        });
      } else {
        newBlockedDates = blockedDates.filter((d) => d !== singleDateBlock);
        toast({
          title: "Fecha habilitada",
          description: `Se habilitó la fecha ${singleDateBlock}`,
        });
      }

      await setDoc(doc(db, "settings", "blockedDates"), {
        dates: newBlockedDates,
      });
      setBlockedDates(newBlockedDates);
      setBlockDateDialogOpen(false);
      setSingleDateBlock("");
    } catch (error) {
      console.error("Error toggling single date:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la fecha",
        variant: "destructive",
      });
    }
  };

  const handleToggleDateRange = async (action: "block" | "unblock") => {
    if (!dateRangeStart || !dateRangeEnd) {
      toast({
        title: "Error",
        description: "Debes seleccionar ambas fechas del rango",
        variant: "destructive",
      });
      return;
    }

    try {
      const start = new Date(dateRangeStart + "T00:00:00");
      const end = new Date(dateRangeEnd + "T00:00:00");

      if (start > end) {
        toast({
          title: "Error",
          description: "La fecha de inicio debe ser anterior a la de fin",
          variant: "destructive",
        });
        return;
      }

      const datesToModify: string[] = [];
      const currentDate = new Date(start);

      while (currentDate <= end) {
        const dateStr = currentDate.toISOString().split("T")[0];
        datesToModify.push(dateStr);
        currentDate.setDate(currentDate.getDate() + 1);
      }

      let newBlockedDates: string[];

      if (action === "block") {
        newBlockedDates = [...new Set([...blockedDates, ...datesToModify])];
        toast({
          title: "Rango bloqueado",
          description: `Se bloquearon ${datesToModify.length} fechas`,
        });
      } else {
        newBlockedDates = blockedDates.filter(
          (d) => !datesToModify.includes(d)
        );
        toast({
          title: "Rango habilitado",
          description: `Se habilitaron ${datesToModify.length} fechas`,
        });
      }

      await setDoc(doc(db, "settings", "blockedDates"), {
        dates: newBlockedDates,
      });
      setBlockedDates(newBlockedDates);
      setBlockDateDialogOpen(false);
      setDateRangeStart("");
      setDateRangeEnd("");
    } catch (error) {
      console.error("Error toggling date range:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el rango de fechas",
        variant: "destructive",
      });
    }
  };

  const handleMarkCompleted = async (turnoId: string) => {
    try {
      await updateTurno(turnoId, { estado: "completado" });
      toast({
        title: "Turno completado",
        description: "El turno ha sido marcado como completado",
      });
      await fetchTurnos();
      setDetailsDialogOpen(false);
      setSelectedTurno(null);
      setMascotaDetails(null);
    } catch (error) {
      console.error("Error updating turno:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el turno",
        variant: "destructive",
      });
    }
  };

  const handleCancel = async (turnoId: string) => {
    try {
      await updateTurno(turnoId, { estado: "cancelado" });
      toast({
        title: "Turno cancelado",
        description: "El turno ha sido cancelado",
      });
      fetchTurnos();
      setDetailsDialogOpen(false);
    } catch (error) {
      console.error("Error canceling turno:", error);
      toast({
        title: "Error",
        description: "No se pudo cancelar el turno",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (turnoId: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este turno?")) return;

    try {
      await deleteTurno(turnoId);
      toast({
        title: "Turno eliminado",
        description: "El turno ha sido eliminado correctamente",
      });
      fetchTurnos();
      setDetailsDialogOpen(false);
    } catch (error) {
      console.error("Error deleting turno:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el turno",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (turno: Turno) => {
    setSelectedTurno(turno);
    setEditData({
      fecha: turno.turno.fecha,
      hora: turno.turno.hora,
    });
    setEditDialogOpen(true);
    setDetailsDialogOpen(false);
  };

  const handleSaveEdit = async () => {
    if (!selectedTurno?.id) return;

    try {
      await updateTurno(selectedTurno.id, {
        turno: {
          ...selectedTurno.turno,
          fecha: editData.fecha,
          hora: editData.hora,
        },
      });
      toast({
        title: "Turno actualizado",
        description: "La fecha y hora han sido actualizadas",
      });
      setEditDialogOpen(false);
      fetchTurnos();
    } catch (error) {
      console.error("Error updating turno:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el turno",
        variant: "destructive",
      });
    }
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return (
          <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/50 dark:text-amber-300 border-0">
            <Clock className="h-3 w-3 mr-1" />
            Pendiente
          </Badge>
        );
      case "completado":
        return (
          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 border-0">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Completado
          </Badge>
        );
      case "cancelado":
        return (
          <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-200 dark:bg-rose-950/50 dark:text-rose-400 border-0">
            <XCircle className="h-3 w-3 mr-1" />
            Cancelado
          </Badge>
        );
      default:
        return <Badge variant="outline">{estado}</Badge>;
    }
  };

  const getTurnosForDate = (dateStr: string) => {
    return turnos.filter((t) => t.turno.fecha === dateStr);
  };

  const isDateBlocked = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00");
    const isSunday = date.getDay() === 0;
    return isSunday || blockedDates.includes(dateStr);
  };

  const getTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 20; hour++) {
      slots.push(`${String(hour).padStart(2, "0")}:00`);
    }
    return slots;
  };

  const selectedDateTurnos = getTurnosForDate(selectedDate);
  const pendientes = selectedDateTurnos.filter(
    (t) => t.estado === "pendiente"
  ).length;
  const completados = selectedDateTurnos.filter(
    (t) => t.estado === "completado"
  ).length;
  const totalSlots = getTimeSlots().length;
  const ocupacion = (
    (selectedDateTurnos.filter((t) => t.estado !== "cancelado").length /
      totalSlots) *
    100
  ).toFixed(0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="relative">
          <div className="h-12 w-12 sm:h-16 sm:w-16 lg:h-20 lg:w-20 animate-spin rounded-full border-2 sm:border-4 border-slate-200 dark:border-slate-700 border-t-indigo-500" />
          <div className="absolute inset-0 h-12 w-12 sm:h-16 sm:w-16 lg:h-20 lg:w-20 animate-ping rounded-full border-2 sm:border-4 border-indigo-400 opacity-20" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-2 sm:p-3 lg:p-6">
      <div className="mb-2 sm:mb-4 lg:mb-6 relative">
        <div className="absolute inset-0 bg-slate-200/50 dark:bg-slate-800/50 blur-3xl" />
        <div className="relative backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl lg:rounded-2xl p-2 sm:p-3 lg:p-6 shadow-2xl">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 lg:p-3 rounded-lg sm:rounded-xl bg-slate-700 dark:bg-slate-600 shadow-xl">
              <CalendarIcon
                className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white"
                strokeWidth={2}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-sm sm:text-xl lg:text-3xl font-black text-slate-900 dark:text-slate-100 truncate">
                Gestión de Turnos
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-0.5 text-[9px] sm:text-[10px] lg:text-sm font-medium truncate">
                {new Date(selectedDate + "T00:00:00").toLocaleDateString(
                  "es-AR",
                  {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-2 sm:gap-3 lg:gap-4 lg:grid-cols-12">
        <div className="lg:col-span-4 space-y-2 sm:space-y-3 lg:space-y-4">
          {/* Calendario */}
          <Card className="border-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-2xl">
            <CardHeader className="pb-1.5 sm:pb-2 lg:pb-3">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="p-1 sm:p-1.5 lg:p-2 rounded-md sm:rounded-lg bg-slate-700 dark:bg-slate-600 shadow-lg">
                  <CalendarIcon
                    className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-white"
                    strokeWidth={2.5}
                  />
                </div>
                <div>
                  <CardTitle className="text-xs sm:text-sm lg:text-base font-bold text-slate-900 dark:text-white">
                    Calendario
                  </CardTitle>
                  <CardDescription className="text-[8px] sm:text-[9px] lg:text-[10px] text-slate-600 dark:text-slate-400">
                    Selecciona una fecha
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-2 sm:p-3 lg:p-4">
              <CalendarView
                currentMonth={currentMonth}
                setCurrentMonth={setCurrentMonth}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                turnos={turnos}
                blockedDates={blockedDates}
                onToggleBlockDate={handleToggleBlockDate}
                onOpenBlockDialog={() => {
                  setSelectedDateForBlock(selectedDate);
                  setBlockDateDialogOpen(true);
                }}
              />
            </CardContent>
          </Card>

          {pendientes > 0 &&
            (() => {
              const proximoTurno = selectedDateTurnos
                .filter((t) => t.estado === "pendiente")
                .sort((a, b) => a.turno.hora.localeCompare(b.turno.hora))[0];

              if (proximoTurno) {
                return (
                  <Card className="border-0 bg-gradient-to-br from-slate-700 to-slate-800 dark:from-slate-800 dark:to-slate-900 shadow-2xl">
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-start gap-2 sm:gap-3">
                        <div className="p-2 sm:p-2.5 rounded-xl bg-white/20 backdrop-blur-sm">
                          <Sparkles
                            className="h-5 w-5 sm:h-6 sm:w-6 text-white"
                            strokeWidth={2.5}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] sm:text-xs font-bold text-white/90 mb-1">
                            PRÓXIMO TURNO
                          </p>
                          <p className="text-xl sm:text-2xl lg:text-3xl font-black text-white mb-1">
                            {proximoTurno.turno.hora}
                          </p>
                          <p className="text-sm sm:text-base font-bold text-white/95 truncate">
                            {proximoTurno.cliente.nombre}
                          </p>
                          <p className="text-xs sm:text-sm text-white/80 truncate flex items-center gap-1">
                            <PawPrint className="h-3 w-3" />
                            {proximoTurno.mascota.nombre} (
                            {proximoTurno.mascota.tipo})
                          </p>
                          <Button
                            onClick={() => {
                              setSelectedTurno(proximoTurno);
                              if (
                                proximoTurno.mascotaId &&
                                proximoTurno.clienteId
                              ) {
                                fetchMascotaDetails(
                                  proximoTurno.clienteId,
                                  proximoTurno.mascotaId
                                );
                              }
                              setDetailsDialogOpen(true);
                            }}
                            className="mt-2 sm:mt-3 w-full bg-white text-slate-800 hover:bg-white/90 font-bold shadow-lg text-xs sm:text-sm h-8 sm:h-9"
                          >
                            Ver Detalles y Aceptar
                            <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 ml-1.5" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              }
            })()}

          <Card className="border-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-2xl">
            <CardHeader className="pb-1.5 sm:pb-2 lg:pb-3">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="p-1 sm:p-1.5 lg:p-2 rounded-md sm:rounded-lg bg-slate-700 dark:bg-slate-600 shadow-lg">
                  <Activity
                    className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-white"
                    strokeWidth={2.5}
                  />
                </div>
                <div>
                  <CardTitle className="text-xs sm:text-sm lg:text-base font-bold text-slate-900 dark:text-white">
                    Estadísticas
                  </CardTitle>
                  <CardDescription className="text-[8px] sm:text-[9px] lg:text-[10px] text-slate-600 dark:text-slate-400">
                    {new Date(selectedDate + "T00:00:00").toLocaleDateString(
                      "es-AR",
                      {
                        day: "numeric",
                        month: "short",
                      }
                    )}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-1.5 sm:space-y-2 lg:space-y-3 p-2 sm:p-3 lg:p-4">
              {/* Ocupación */}
              <div className="space-y-1 sm:space-y-1.5">
                <div className="flex items-center justify-between text-[9px] sm:text-[10px] lg:text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Ocupación
                  </span>
                  <span className="font-black text-xs sm:text-sm lg:text-base text-slate-900 dark:text-slate-100">
                    {ocupacion}%
                  </span>
                </div>
                <div className="h-1.5 sm:h-2 lg:h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-slate-700 dark:bg-slate-600 transition-all duration-500 shadow-lg"
                    style={{ width: `${ocupacion}%` }}
                  />
                </div>
                <p className="text-[8px] sm:text-[9px] lg:text-[10px] text-slate-500 dark:text-slate-500">
                  {
                    selectedDateTurnos.filter((t) => t.estado !== "cancelado")
                      .length
                  }{" "}
                  de {totalSlots} ocupados
                </p>
              </div>

              {/* Pendientes y Completados en grid */}
              <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                <div className="p-1.5 sm:p-2 lg:p-3 rounded-md sm:rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    <div className="p-0.5 sm:p-1 rounded-sm sm:rounded-md bg-amber-500 shadow-lg">
                      <Clock
                        className="h-2.5 w-2.5 sm:h-3 sm:w-3 lg:h-4 lg:w-4 text-white"
                        strokeWidth={2.5}
                      />
                    </div>
                    <div>
                      <p className="text-[8px] sm:text-[9px] lg:text-[10px] font-semibold text-slate-600 dark:text-slate-400">
                        Pendientes
                      </p>
                      <p className="text-sm sm:text-base lg:text-lg font-black text-slate-900 dark:text-slate-100">
                        {pendientes}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-1.5 sm:p-2 lg:p-3 rounded-md sm:rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    <div className="p-0.5 sm:p-1 rounded-sm sm:rounded-md bg-emerald-500 shadow-lg">
                      <CheckCircle2
                        className="h-2.5 w-2.5 sm:h-3 sm:w-3 lg:h-4 lg:w-4 text-white"
                        strokeWidth={2.5}
                      />
                    </div>
                    <div>
                      <p className="text-[8px] sm:text-[9px] lg:text-[10px] font-semibold text-slate-600 dark:text-slate-400">
                        Completados
                      </p>
                      <p className="text-sm sm:text-base lg:text-lg font-black text-slate-900 dark:text-slate-100">
                        {completados}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-8">
          <Card className="border-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-2xl">
            <CardHeader className="pb-1.5 sm:pb-2 lg:pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between flex-wrap gap-1.5 sm:gap-2">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="p-1 sm:p-1.5 lg:p-2 rounded-md sm:rounded-lg bg-slate-700 dark:bg-slate-600 shadow-lg">
                    {viewMode === "timeline" ? (
                      <LayoutList
                        className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-white"
                        strokeWidth={2.5}
                      />
                    ) : (
                      <LayoutGrid
                        className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-white"
                        strokeWidth={2.5}
                      />
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-xs sm:text-sm lg:text-base font-bold text-slate-900 dark:text-white">
                      {viewMode === "timeline"
                        ? "Timeline del Día"
                        : "Vista de Tarjetas"}
                    </CardTitle>
                    <CardDescription className="text-[8px] sm:text-[9px] lg:text-[10px] text-slate-600 dark:text-slate-400">
                      {selectedDateTurnos.length} turnos agendados
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setViewMode(viewMode === "timeline" ? "grid" : "timeline")
                    }
                    className="h-6 sm:h-7 lg:h-8 text-[9px] sm:text-[10px] lg:text-xs px-2 sm:px-3"
                  >
                    {viewMode === "timeline" ? (
                      <>
                        <LayoutGrid className="h-2.5 w-2.5 sm:h-3 sm:w-3 lg:h-3.5 lg:w-3.5 mr-1" />
                        Tarjetas
                      </>
                    ) : (
                      <>
                        <LayoutList className="h-2.5 w-2.5 sm:h-3 sm:w-3 lg:h-3.5 lg:w-3.5 mr-1" />
                        Timeline
                      </>
                    )}
                  </Button>
                  {isDateBlocked(selectedDate) && (
                    <Badge className="bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300 border-0 text-[8px] sm:text-[9px] lg:text-[10px]">
                      <Ban className="h-2 w-2 sm:h-2.5 sm:w-2.5 mr-0.5 sm:mr-1" />
                      Bloqueado
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-2 sm:pt-3 lg:pt-4 p-2 sm:p-3 lg:p-4">
              {viewMode === "timeline" ? (
                <TimelineView
                  turnos={selectedDateTurnos}
                  selectedDate={selectedDate}
                  onTurnoClick={(turno) => {
                    setSelectedTurno(turno);
                    if (turno.mascotaId && turno.clienteId) {
                      fetchMascotaDetails(turno.clienteId, turno.mascotaId);
                    }
                    setDetailsDialogOpen(true);
                  }}
                />
              ) : (
                <GridView
                  turnos={selectedDateTurnos}
                  selectedDate={selectedDate}
                  onTurnoClick={(turno) => {
                    setSelectedTurno(turno);
                    if (turno.mascotaId && turno.clienteId) {
                      fetchMascotaDetails(turno.clienteId, turno.mascotaId);
                    }
                    setDetailsDialogOpen(true);
                  }}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal de Detalles */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="sm:max-w-2xl border-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="border-b border-slate-200 dark:border-slate-800 pb-3 sm:pb-4">
            <DialogTitle className="text-base sm:text-lg lg:text-xl font-black text-slate-900 dark:text-slate-100">
              Detalles del Turno
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Información completa del turno y acciones disponibles
            </DialogDescription>
          </DialogHeader>

          {selectedTurno && (
            <div className="space-y-3 sm:space-y-4 lg:space-y-6 py-2 sm:py-3 lg:py-4">
              {/* Estado Badge */}
              <div className="flex items-center justify-center">
                <div className="scale-110 sm:scale-125">
                  {getEstadoBadge(selectedTurno.estado)}
                </div>
              </div>

              {/* Grid de Información */}
              <div className="grid gap-3 sm:gap-4 lg:gap-6 sm:grid-cols-2">
                {/* Cliente */}
                <div className="space-y-2 sm:space-y-3 p-3 sm:p-4 lg:p-5 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 text-slate-700 dark:text-slate-300" />
                    <h3 className="font-bold text-xs sm:text-sm lg:text-base text-slate-900 dark:text-slate-100">
                      Información del Cliente
                    </h3>
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <div>
                      <p className="text-[9px] sm:text-[10px] lg:text-xs font-semibold text-slate-600 dark:text-slate-400 mb-0.5 sm:mb-1">
                        Nombre
                      </p>
                      <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                        {selectedTurno.cliente.nombre}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] sm:text-[10px] lg:text-xs font-semibold text-slate-600 dark:text-slate-400 mb-0.5 sm:mb-1 flex items-center gap-1">
                        <Phone className="h-2.5 w-2.5 sm:h-3 sm:w-3" /> Teléfono
                      </p>
                      <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                        {selectedTurno.cliente.telefono}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] sm:text-[10px] lg:text-xs font-semibold text-slate-600 dark:text-slate-400 mb-0.5 sm:mb-1 flex items-center gap-1">
                        <Mail className="h-2.5 w-2.5 sm:h-3 sm:w-3" /> Email
                      </p>
                      <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 break-all">
                        {selectedTurno.cliente.email}
                      </p>
                    </div>
                    <div className="p-2 sm:p-2.5 lg:p-3 rounded-lg sm:rounded-xl bg-slate-100 dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600">
                      <p className="text-[9px] sm:text-[10px] lg:text-xs font-bold text-slate-800 dark:text-slate-200 mb-1 flex items-center gap-1">
                        <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4" />{" "}
                        Dirección de Atención
                      </p>
                      <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                        {selectedTurno.cliente.domicilio || "No especificada"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mascota */}
                <div className="space-y-2 sm:space-y-3 p-3 sm:p-4 lg:p-5 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                    <PawPrint className="h-4 w-4 sm:h-5 sm:w-5 text-slate-700 dark:text-slate-300" />
                    <h3 className="font-bold text-xs sm:text-sm lg:text-base text-slate-900 dark:text-slate-100">
                      Información de la Mascota
                    </h3>
                  </div>
                  {loadingMascota ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
                    </div>
                  ) : (
                    <div className="space-y-1.5 sm:space-y-2">
                      <div>
                        <p className="text-[9px] sm:text-[10px] lg:text-xs font-semibold text-slate-600 dark:text-slate-400 mb-0.5 sm:mb-1">
                          Nombre
                        </p>
                        <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                          {selectedTurno.mascota.nombre}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 sm:gap-3">
                        <div>
                          <p className="text-[9px] sm:text-[10px] lg:text-xs font-semibold text-slate-600 dark:text-slate-400 mb-0.5 sm:mb-1">
                            Tipo
                          </p>
                          <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 capitalize">
                            {selectedTurno.mascota.tipo}
                          </p>
                        </div>
                        <div>
                          <p className="text-[9px] sm:text-[10px] lg:text-xs font-semibold text-slate-600 dark:text-slate-400 mb-0.5 sm:mb-1">
                            Raza
                          </p>
                          <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                            {mascotaDetails?.raza || "No especificada"}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 sm:gap-3">
                        <div>
                          <p className="text-[9px] sm:text-[10px] lg:text-xs font-semibold text-slate-600 dark:text-slate-400 mb-0.5 sm:mb-1">
                            Edad
                          </p>
                          <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                            {mascotaDetails?.edad || "No especificada"}{" "}
                            {mascotaDetails?.edad ? "años" : ""}
                          </p>
                        </div>
                        <div>
                          <p className="text-[9px] sm:text-[10px] lg:text-xs font-semibold text-slate-600 dark:text-slate-400 mb-0.5 sm:mb-1">
                            Peso
                          </p>
                          <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                            {mascotaDetails?.peso || "No especificado"}{" "}
                            {mascotaDetails?.peso ? "kg" : ""}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Información del Turno */}
              <div className="p-3 sm:p-4 lg:p-5 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                  <CalendarIcon className="h-4 w-4 sm:h-5 sm:w-5 text-slate-700 dark:text-slate-300" />
                  <h3 className="font-bold text-xs sm:text-sm lg:text-base text-slate-900 dark:text-slate-100">
                    Información del Turno
                  </h3>
                </div>
                <div className="grid gap-2 sm:gap-3 grid-cols-3">
                  <div>
                    <p className="text-[9px] sm:text-[10px] lg:text-xs font-semibold text-slate-600 dark:text-slate-400 mb-0.5 sm:mb-1">
                      Fecha
                    </p>
                    <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                      {new Date(
                        selectedTurno.turno.fecha + "T00:00:00"
                      ).toLocaleDateString("es-AR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] sm:text-[10px] lg:text-xs font-semibold text-slate-600 dark:text-slate-400 mb-0.5 sm:mb-1">
                      Hora
                    </p>
                    <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                      {selectedTurno.turno.hora}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] sm:text-[10px] lg:text-xs font-semibold text-slate-600 dark:text-slate-400 mb-0.5 sm:mb-1">
                      Estado
                    </p>
                    <div className="mt-1">
                      {getEstadoBadge(selectedTurno.estado)}
                    </div>
                  </div>
                </div>
                <div className="mt-2 sm:mt-3">
                  <p className="text-[9px] sm:text-[10px] lg:text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
                    <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3" /> Servicio
                    Requerido
                  </p>
                  <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                    {selectedTurno.servicio || "No especificado"}
                  </p>
                </div>
                <div className="mt-2 sm:mt-3 p-2 sm:p-2.5 lg:p-3 rounded-lg sm:rounded-xl bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600">
                  <p className="text-[9px] sm:text-[10px] lg:text-xs font-bold text-slate-800 dark:text-slate-200 mb-1 flex items-center gap-1">
                    <FileText className="h-2.5 w-2.5 sm:h-3 sm:w-3" /> Motivo de
                    Consulta
                  </p>
                  <p className="text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-100">
                    {selectedTurno.mascota.motivo || "No especificado"}
                  </p>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex flex-wrap gap-2 sm:gap-3 pt-2 sm:pt-3 lg:pt-4 border-t border-slate-200 dark:border-slate-800">
                {selectedTurno.estado === "pendiente" && (
                  <>
                    <Button
                      onClick={() =>
                        selectedTurno.id &&
                        handleMarkCompleted(selectedTurno.id)
                      }
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-lg h-8 sm:h-9 lg:h-10 text-[10px] sm:text-xs lg:text-sm"
                    >
                      <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      Completar
                    </Button>
                    <Button
                      onClick={() =>
                        selectedTurno.id && handleCancel(selectedTurno.id)
                      }
                      variant="outline"
                      className="flex-1 border-2 border-rose-300 text-rose-700 hover:bg-rose-50 dark:border-rose-700 dark:text-rose-400 dark:hover:bg-rose-950/30 font-semibold h-8 sm:h-9 lg:h-10 text-[10px] sm:text-xs lg:text-sm"
                    >
                      <XCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      Cancelar
                    </Button>
                  </>
                )}
                <Button
                  onClick={() => handleEdit(selectedTurno)}
                  variant="outline"
                  className="flex-1 border-2 border-indigo-300 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-700 dark:text-indigo-400 dark:hover:bg-indigo-950/30 font-semibold h-8 sm:h-9 lg:h-10 text-[10px] sm:text-xs lg:text-sm"
                >
                  <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Editar
                </Button>
                <Button
                  onClick={() =>
                    selectedTurno.id && handleDelete(selectedTurno.id)
                  }
                  variant="outline"
                  className="flex-1 border-2 border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-950/30 font-semibold h-8 sm:h-9 lg:h-10 text-[10px] sm:text-xs lg:text-sm"
                >
                  <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Eliminar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Edición */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md border-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl">
          <DialogHeader className="border-b border-slate-200 dark:border-slate-800 pb-3 sm:pb-4">
            <DialogTitle className="text-base sm:text-lg lg:text-xl font-black text-slate-900 dark:text-slate-100">
              Editar Turno
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Modifica la fecha y hora del turno
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 sm:space-y-4 py-2 sm:py-3 lg:py-4">
            <div className="space-y-1.5 sm:space-y-2">
              <Label
                htmlFor="edit-fecha"
                className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300"
              >
                Fecha
              </Label>
              <Input
                id="edit-fecha"
                type="date"
                value={editData.fecha}
                onChange={(e) =>
                  setEditData((prev) => ({ ...prev, fecha: e.target.value }))
                }
                className="border-2 border-slate-300 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-500 font-semibold h-8 sm:h-9 lg:h-10 text-xs sm:text-sm"
              />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label
                htmlFor="edit-hora"
                className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300"
              >
                Hora
              </Label>
              <Input
                id="edit-hora"
                type="time"
                value={editData.hora}
                onChange={(e) =>
                  setEditData((prev) => ({ ...prev, hora: e.target.value }))
                }
                className="border-2 border-slate-300 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-500 font-semibold h-8 sm:h-9 lg:h-10 text-xs sm:text-sm"
              />
            </div>
          </div>
          <DialogFooter className="flex gap-2 sm:gap-3 pt-2 sm:pt-3 lg:pt-4 border-t border-slate-200 dark:border-slate-800">
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
              className="flex-1 border-2 border-slate-300 dark:border-slate-700 font-semibold h-8 sm:h-9 lg:h-10 text-[10px] sm:text-xs lg:text-sm"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSaveEdit}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg h-8 sm:h-9 lg:h-10 text-[10px] sm:text-xs lg:text-sm"
            >
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={blockDateDialogOpen} onOpenChange={setBlockDateDialogOpen}>
        <DialogContent className="sm:max-w-md border-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl">
          <DialogHeader className="border-b border-slate-200 dark:border-slate-800 pb-3 sm:pb-4">
            <DialogTitle className="text-base sm:text-lg lg:text-xl font-black text-slate-900 dark:text-slate-100">
              Gestionar Fechas Bloqueadas
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Bloquea o desbloquea un día o rango de fechas
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 sm:space-y-5 py-2 sm:py-3 lg:py-4">
            <div className="space-y-2 sm:space-y-3 p-3 sm:p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                Un Solo Día
              </h3>
              <div className="space-y-1.5 sm:space-y-2">
                <Label
                  htmlFor="single-date"
                  className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300"
                >
                  Fecha
                </Label>
                <Input
                  id="single-date"
                  type="date"
                  value={singleDateBlock}
                  onChange={(e) => setSingleDateBlock(e.target.value)}
                  className="border-2 border-slate-300 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-500 font-semibold h-8 sm:h-9 lg:h-10 text-xs sm:text-sm"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleToggleSingleDate("block")}
                  className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-lg h-7 sm:h-8 text-[10px] sm:text-xs"
                >
                  <Lock className="h-3 w-3 mr-1" />
                  Bloquear
                </Button>
                <Button
                  onClick={() => handleToggleSingleDate("unblock")}
                  variant="outline"
                  className="flex-1 border-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-950/30 font-semibold h-7 sm:h-8 text-[10px] sm:text-xs"
                >
                  <Unlock className="h-3 w-3 mr-1" />
                  Habilitar
                </Button>
              </div>
            </div>

            {/* Rango de fechas */}
            <div className="space-y-2 sm:space-y-3 p-3 sm:p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                Rango de Fechas
              </h3>
              <div className="space-y-1.5 sm:space-y-2">
                <Label
                  htmlFor="date-range-start"
                  className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300"
                >
                  Fecha de inicio
                </Label>
                <Input
                  id="date-range-start"
                  type="date"
                  value={dateRangeStart}
                  onChange={(e) => setDateRangeStart(e.target.value)}
                  className="border-2 border-slate-300 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-500 font-semibold h-8 sm:h-9 lg:h-10 text-xs sm:text-sm"
                />
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <Label
                  htmlFor="date-range-end"
                  className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300"
                >
                  Fecha de fin
                </Label>
                <Input
                  id="date-range-end"
                  type="date"
                  value={dateRangeEnd}
                  onChange={(e) => setDateRangeEnd(e.target.value)}
                  className="border-2 border-slate-300 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-500 font-semibold h-8 sm:h-9 lg:h-10 text-xs sm:text-sm"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleToggleDateRange("block")}
                  className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-lg h-7 sm:h-8 text-[10px] sm:text-xs"
                >
                  <Lock className="h-3 w-3 mr-1" />
                  Bloquear
                </Button>
                <Button
                  onClick={() => handleToggleDateRange("unblock")}
                  variant="outline"
                  className="flex-1 border-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-950/30 font-semibold h-7 sm:h-8 text-[10px] sm:text-xs"
                >
                  <Unlock className="h-3 w-3 mr-1" />
                  Habilitar
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  );
}
