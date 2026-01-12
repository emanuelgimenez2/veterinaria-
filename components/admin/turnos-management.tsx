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
import { getTurnos, updateTurno, deleteTurno } from "@/lib/firebase/firestore";
import type { Turno } from "@/lib/firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import {
  CheckCircle2,
  XCircle,
  Edit,
  Trash2,
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Users,
  Ban,
  Phone,
  MapPin,
  AlertCircle,
  PawPrint,
  Mail,
  FileText,
  Sparkles,
  Activity,
} from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export default function TurnosManagement() {
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedTurno, setSelectedTurno] = useState<Turno | null>(null);
  const [editData, setEditData] = useState({ fecha: "", hora: "" });
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
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

  useEffect(() => {
    fetchTurnos();
    fetchBlockedDates();
  }, []);

  const handleMarkCompleted = async (turnoId: string) => {
    try {
      await updateTurno(turnoId, { estado: "completado" });
      toast({
        title: "✅ Turno completado",
        description: "El turno ha sido marcado como completado",
      });
      fetchTurnos();
      setDetailsDialogOpen(false);
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
        title: "❌ Turno cancelado",
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
        title: "🗑️ Turno eliminado",
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
        title: "✏️ Turno actualizado",
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

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
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
  const totalSlots = 12;
  const ocupacion = (
    (selectedDateTurnos.filter((t) => t.estado !== "cancelado").length /
      totalSlots) *
    100
  ).toFixed(0);

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek, year, month } =
      getDaysInMonth(currentMonth);
    const days = [];
    const monthNames = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="aspect-square" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
        day
      ).padStart(2, "0")}`;
      const dayTurnos = getTurnosForDate(dateStr).filter(
        (t) => t.estado !== "cancelado"
      );
      const turnosCount = dayTurnos.length;
      const isBlocked = isDateBlocked(dateStr);
      const isToday =
        new Date().toDateString() === new Date(year, month, day).toDateString();
      const isSelected = selectedDate === dateStr;

      let ocupacionLevel = "low";
      if (turnosCount >= 10) ocupacionLevel = "high";
      else if (turnosCount >= 6) ocupacionLevel = "medium";

      days.push(
        <button
          key={day}
          onClick={() => setSelectedDate(dateStr)}
          className={`aspect-square p-1 border rounded-xl flex flex-col items-center justify-center relative group transition-all duration-300 ${
            isBlocked
              ? "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 cursor-pointer opacity-70 hover:opacity-90"
              : isSelected
              ? "bg-gradient-to-br from-indigo-500 to-purple-600 border-indigo-400 shadow-lg shadow-indigo-500/50 scale-105"
              : isToday
              ? "bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-400 dark:border-emerald-600 ring-2 ring-emerald-400"
              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-md hover:scale-105"
          }`}
        >
          <span
            className={`text-sm font-bold ${
              isSelected
                ? "text-white"
                : isToday
                ? "text-emerald-700 dark:text-emerald-300"
                : "text-slate-900 dark:text-white"
            }`}
          >
            {day}
          </span>
          {turnosCount > 0 && !isBlocked && (
            <div
              className={`mt-1 px-2 py-0.5 rounded-full text-[10px] font-black ${
                isSelected
                  ? "bg-white/30 text-white"
                  : ocupacionLevel === "high"
                  ? "bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300"
                  : ocupacionLevel === "medium"
                  ? "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300"
                  : "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300"
              }`}
            >
              {turnosCount}
            </div>
          )}
          {isBlocked && (
            <Ban className="absolute top-1 right-1 h-3 w-3 text-slate-400" />
          )}
        </button>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
            {monthNames[month]} {year}
          </h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-9 w-9 p-0 rounded-xl border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 bg-transparent"
              onClick={() =>
                setCurrentMonth(
                  new Date(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth() - 1
                  )
                )
              }
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-9 w-9 p-0 rounded-xl border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 bg-transparent"
              onClick={() =>
                setCurrentMonth(
                  new Date(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth() + 1
                  )
                )
              }
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
            <div
              key={day}
              className="text-center text-xs font-bold text-slate-600 dark:text-slate-400 py-2"
            >
              {day}
            </div>
          ))}
          {days}
        </div>
        <div className="flex flex-wrap gap-3 text-xs pt-2 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-emerald-100 dark:bg-emerald-900/50 border border-emerald-300" />
            <span className="text-slate-600 dark:text-slate-400 font-medium">
              1-5 turnos
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-amber-100 dark:bg-amber-900/50 border border-amber-300" />
            <span className="text-slate-600 dark:text-slate-400 font-medium">
              6-9 turnos
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-rose-100 dark:bg-rose-900/50 border border-rose-300" />
            <span className="text-slate-600 dark:text-slate-400 font-medium">
              10+ turnos
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderTimeline = () => {
    const timeSlots = getTimeSlots();
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const isToday = selectedDate === now.toISOString().split("T")[0];

    return (
      <div className="relative">
        {/* Timeline */}
        <div className="space-y-0">
          {timeSlots.map((slot, index) => {
            const hourTurnos = selectedDateTurnos.filter((t) =>
              t.turno.hora.startsWith(slot.split(":")[0])
            );
            const hour = Number.parseInt(slot.split(":")[0]);
            const isPast = isToday && hour < currentHour;
            const isCurrentHour = isToday && hour === currentHour;

            return (
              <div
                key={slot}
                className="relative flex items-start border-l-4 border-slate-200 dark:border-slate-800 pl-6 pb-4 ml-16"
              >
                {/* Time Label */}
                <div
                  className={`absolute -left-16 top-0 w-14 text-right ${
                    isCurrentHour
                      ? "text-indigo-600 dark:text-indigo-400 font-black"
                      : "text-slate-600 dark:text-slate-400 font-semibold"
                  }`}
                >
                  <div className="text-sm">{slot}</div>
                </div>

                {/* Time Dot */}
                <div
                  className={`absolute -left-[11px] top-1 w-5 h-5 rounded-full border-4 ${
                    isCurrentHour
                      ? "bg-indigo-500 border-indigo-200 dark:border-indigo-800 shadow-lg shadow-indigo-500/50"
                      : hourTurnos.length > 0
                      ? "bg-emerald-500 border-emerald-200 dark:border-emerald-800"
                      : "bg-slate-200 dark:bg-slate-700 border-slate-100 dark:border-slate-800"
                  }`}
                />

                {/* Turnos Cards */}
                <div className="flex-1 space-y-3">
                  {hourTurnos.length > 0 ? (
                    hourTurnos.map((turno) => {
                      const isUrgent =
                        turno.estado === "pendiente" &&
                        isToday &&
                        hour <= currentHour + 1;
                      return (
                        <div
                          key={turno.id}
                          className={`group relative overflow-hidden rounded-2xl border-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
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
                            className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                              turno.estado === "completado"
                                ? "bg-gradient-to-b from-emerald-500 to-teal-500"
                                : turno.estado === "cancelado"
                                ? "bg-gradient-to-b from-slate-400 to-slate-500"
                                : isUrgent
                                ? "bg-gradient-to-b from-rose-500 to-pink-500"
                                : "bg-gradient-to-b from-indigo-500 to-purple-500"
                            }`}
                          />

                          <div className="p-4 pl-5">
                            <div className="flex items-start justify-between gap-3 mb-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-base font-black text-slate-900 dark:text-white truncate">
                                    {turno.cliente.nombre}
                                  </span>
                                  {isUrgent && (
                                    <Badge className="bg-rose-500 text-white border-0 px-2 py-0.5 text-[10px] font-bold">
                                      <AlertCircle className="h-3 w-3 mr-1" />
                                      PRÓXIMO
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                  <PawPrint className="h-4 w-4" />
                                  <span className="font-semibold">
                                    {turno.mascota.nombre}
                                  </span>
                                  <span className="text-xs">
                                    ({turno.mascota.tipo})
                                  </span>
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                {getEstadoBadge(turno.estado)}
                                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                                  {turno.turno.hora}
                                </span>
                              </div>
                            </div>

                            <Button
                              onClick={() => {
                                setSelectedTurno(turno);
                                setDetailsDialogOpen(true);
                              }}
                              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl h-9 text-sm shadow-lg"
                            >
                              Ver Detalles Completos
                            </Button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div
                      className={`rounded-2xl border-2 border-dashed p-4 text-center ${
                        isPast
                          ? "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30"
                          : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/50"
                      }`}
                    >
                      <Clock
                        className={`h-6 w-6 mx-auto mb-2 ${
                          isPast
                            ? "text-slate-300 dark:text-slate-700"
                            : "text-slate-400 dark:text-slate-600"
                        }`}
                      />
                      <p
                        className={`text-xs font-semibold ${
                          isPast
                            ? "text-slate-400 dark:text-slate-600"
                            : "text-slate-500 dark:text-slate-500"
                        }`}
                      >
                        {isPast ? "Horario pasado" : "Horario disponible"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Current Time Indicator */}
        {isToday && currentHour >= 8 && currentHour <= 20 && (
          <div
            className="absolute left-0 right-0 z-10 pointer-events-none"
            style={{
              top: `${(currentHour - 8) * 100 + (currentMinute / 60) * 100}px`,
            }}
          >
            <div className="flex items-center">
              <div className="w-14 h-px bg-gradient-to-r from-transparent to-indigo-500" />
              <div className="w-3 h-3 rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/50 animate-pulse" />
              <div className="flex-1 h-px bg-gradient-to-r from-indigo-500 to-transparent" />
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="relative">
          <div className="h-20 w-20 animate-spin rounded-full border-4 border-slate-200 dark:border-slate-700 border-t-indigo-500" />
          <div className="absolute inset-0 h-20 w-20 animate-ping rounded-full border-4 border-indigo-400 opacity-20" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-3xl" />
        <div className="relative backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border border-white/20 dark:border-slate-700/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl shadow-indigo-500/50">
              <CalendarIcon
                className="h-6 w-6 sm:h-8 sm:w-8 text-white"
                strokeWidth={2}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 truncate">
                Gestión de Turnos
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1 text-xs sm:text-sm lg:text-base font-medium truncate">
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

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Sidebar: Calendario y Stats */}
        <div className="lg:col-span-4 space-y-6">
          {/* Calendario */}
          <Card className="border-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-2xl">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
                  <CalendarIcon
                    className="h-5 w-5 text-white"
                    strokeWidth={2.5}
                  />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">
                    Calendario
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-600 dark:text-slate-400">
                    Selecciona una fecha
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>{renderCalendar()}</CardContent>
          </Card>

          {/* Stats del día */}
          <Card className="border-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-2xl">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
                  <Activity className="h-5 w-5 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">
                    Estadísticas del Día
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-600 dark:text-slate-400">
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
            <CardContent className="space-y-4">
              {/* Ocupación */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Ocupación del día
                  </span>
                  <span className="font-black text-base sm:text-lg text-indigo-600 dark:text-indigo-400">
                    {ocupacion}%
                  </span>
                </div>
                <div className="h-2.5 sm:h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500 shadow-lg"
                    style={{ width: `${ocupacion}%` }}
                  />
                </div>
                <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-500">
                  {
                    selectedDateTurnos.filter((t) => t.estado !== "cancelado")
                      .length
                  }{" "}
                  de {totalSlots} horarios ocupados
                </p>
              </div>

              {/* Pendientes */}
              <div className="p-3 sm:p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-2 border-amber-200 dark:border-amber-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-1.5 sm:p-2 rounded-lg bg-amber-500 shadow-lg">
                      <Clock
                        className="h-4 w-4 sm:h-5 sm:w-5 text-white"
                        strokeWidth={2.5}
                      />
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-xs font-semibold text-amber-700 dark:text-amber-300">
                        Pendientes
                      </p>
                      <p className="text-xl sm:text-2xl font-black text-amber-900 dark:text-amber-100">
                        {pendientes}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Completados */}
              <div className="p-3 sm:p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-2 border-emerald-200 dark:border-emerald-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-1.5 sm:p-2 rounded-lg bg-emerald-500 shadow-lg">
                      <CheckCircle2
                        className="h-4 w-4 sm:h-5 sm:w-5 text-white"
                        strokeWidth={2.5}
                      />
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                        Completados
                      </p>
                      <p className="text-xl sm:text-2xl font-black text-emerald-900 dark:text-emerald-100">
                        {completados}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Próximo Turno */}
              {pendientes > 0 &&
                (() => {
                  const now = new Date();
                  const proximoTurno = selectedDateTurnos
                    .filter((t) => t.estado === "pendiente")
                    .sort((a, b) =>
                      a.turno.hora.localeCompare(b.turno.hora)
                    )[0];

                  if (proximoTurno) {
                    return (
                      <div className="p-3 sm:p-4 rounded-xl bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 border-2 border-rose-300 dark:border-rose-700">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-rose-600 dark:text-rose-400" />
                          <p className="text-[10px] sm:text-xs font-bold text-rose-700 dark:text-rose-300">
                            PRÓXIMO TURNO
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-base sm:text-lg font-black text-rose-900 dark:text-rose-100">
                            {proximoTurno.turno.hora}
                          </p>
                          <p className="text-xs sm:text-sm font-semibold text-rose-800 dark:text-rose-200">
                            {proximoTurno.cliente.nombre}
                          </p>
                          <p className="text-[10px] sm:text-xs text-rose-600 dark:text-rose-400">
                            🐾 {proximoTurno.mascota.nombre}
                          </p>
                        </div>
                      </div>
                    );
                  }
                })()}
            </CardContent>
          </Card>
        </div>

        {/* Timeline Principal */}
        <div className="lg:col-span-8">
          <Card className="border-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-2xl">
            <CardHeader className="pb-3 sm:pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between flex-wrap gap-2 sm:gap-3">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
                    <CalendarIcon
                      className="h-4 w-4 sm:h-5 sm:w-5 text-white"
                      strokeWidth={2.5}
                    />
                  </div>
                  <div>
                    <CardTitle className="text-sm sm:text-lg font-bold text-slate-900 dark:text-white">
                      Timeline del Día
                    </CardTitle>
                    <CardDescription className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-400">
                      {selectedDateTurnos.length} turnos agendados
                    </CardDescription>
                  </div>
                </div>
                {isDateBlocked(selectedDate) && (
                  <Badge className="bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300 border-0 text-[10px] sm:text-xs">
                    <Ban className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                    Día Bloqueado
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-4 sm:pt-6">
              {renderTimeline()}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal de Detalles */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto border-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl">
          {selectedTurno && (
            <div className="space-y-6">
              <DialogHeader className="border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <DialogTitle className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                      Detalles del Turno
                    </DialogTitle>
                    <DialogDescription className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      {selectedTurno.turno.fecha} a las{" "}
                      {selectedTurno.turno.hora}
                    </DialogDescription>
                  </div>
                  {getEstadoBadge(selectedTurno.estado)}
                </div>
              </DialogHeader>

              {/* Grid de Información */}
              <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                {/* Cliente */}
                <div className="space-y-3 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-800">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600 dark:text-indigo-400" />
                    <h3 className="text-sm sm:text-base font-bold text-indigo-900 dark:text-indigo-100">
                      Información del Cliente
                    </h3>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 mb-1">
                        Nombre
                      </p>
                      <p className="text-sm font-bold text-indigo-900 dark:text-indigo-100">
                        {selectedTurno.cliente.nombre}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 mb-1 flex items-center gap-1">
                        <Phone className="h-3 w-3" /> Teléfono
                      </p>
                      <p className="text-sm font-bold text-indigo-900 dark:text-indigo-100">
                        {selectedTurno.cliente.telefono}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 mb-1 flex items-center gap-1">
                        <Mail className="h-3 w-3" /> Email
                      </p>
                      <p className="text-sm font-bold text-indigo-900 dark:text-indigo-100 break-all">
                        {selectedTurno.cliente.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 mb-1 flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> Dirección
                      </p>
                      <p className="text-sm font-bold text-indigo-900 dark:text-indigo-100">
                        {selectedTurno.cliente.direccion}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mascota */}
                <div className="space-y-3 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 border border-pink-200 dark:border-pink-800">
                  <div className="flex items-center gap-2 mb-3">
                    <PawPrint className="h-4 w-4 sm:h-5 sm:w-5 text-pink-600 dark:text-pink-400" />
                    <h3 className="text-sm sm:text-base font-bold text-pink-900 dark:text-pink-100">
                      Información de la Mascota
                    </h3>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs font-semibold text-pink-700 dark:text-pink-300 mb-1">
                        Nombre
                      </p>
                      <p className="text-sm font-bold text-pink-900 dark:text-pink-100">
                        {selectedTurno.mascota.nombre}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs font-semibold text-pink-700 dark:text-pink-300 mb-1">
                          Tipo
                        </p>
                        <p className="text-sm font-bold text-pink-900 dark:text-pink-100 capitalize">
                          {selectedTurno.mascota.tipo}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-pink-700 dark:text-pink-300 mb-1">
                          Raza
                        </p>
                        <p className="text-sm font-bold text-pink-900 dark:text-pink-100">
                          {selectedTurno.mascota.raza}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs font-semibold text-pink-700 dark:text-pink-300 mb-1">
                          Edad
                        </p>
                        <p className="text-sm font-bold text-pink-900 dark:text-pink-100">
                          {selectedTurno.mascota.edad} años
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-pink-700 dark:text-pink-300 mb-1">
                          Peso
                        </p>
                        <p className="text-sm font-bold text-pink-900 dark:text-pink-100">
                          {selectedTurno.mascota.peso} kg
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Turno Info */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-center gap-2 mb-3">
                  <CalendarIcon className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600 dark:text-emerald-400" />
                  <h3 className="text-sm sm:text-base font-bold text-emerald-900 dark:text-emerald-100">
                    Información del Turno
                  </h3>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div>
                    <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 mb-1">
                      Fecha
                    </p>
                    <p className="text-sm font-bold text-emerald-900 dark:text-emerald-100">
                      {selectedTurno.turno.fecha}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 mb-1">
                      Hora
                    </p>
                    <p className="text-sm font-bold text-emerald-900 dark:text-emerald-100">
                      {selectedTurno.turno.hora}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 mb-1">
                      ID
                    </p>
                    <p className="text-sm font-bold text-emerald-900 dark:text-emerald-100 truncate">
                      {selectedTurno.id}
                    </p>
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 mb-1 flex items-center gap-1">
                    <FileText className="h-3 w-3" /> Motivo de Consulta
                  </p>
                  <p className="text-sm font-bold text-emerald-900 dark:text-emerald-100">
                    {selectedTurno.turno.motivo}
                  </p>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex flex-wrap gap-2 sm:gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                {selectedTurno.estado === "pendiente" && (
                  <>
                    <Button
                      onClick={() =>
                        selectedTurno.id &&
                        handleMarkCompleted(selectedTurno.id)
                      }
                      className="flex-1 text-xs sm:text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold shadow-lg"
                    >
                      <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      Marcar Completado
                    </Button>
                    <Button
                      onClick={() =>
                        selectedTurno.id && handleCancel(selectedTurno.id)
                      }
                      variant="outline"
                      className="flex-1 text-xs sm:text-sm border-2 border-rose-300 text-rose-700 hover:bg-rose-50 dark:border-rose-700 dark:text-rose-400 dark:hover:bg-rose-950/30 font-semibold"
                    >
                      <XCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      Cancelar Turno
                    </Button>
                  </>
                )}
                <Button
                  onClick={() => handleEdit(selectedTurno)}
                  variant="outline"
                  className="flex-1 text-xs sm:text-sm border-2 border-indigo-300 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-700 dark:text-indigo-400 dark:hover:bg-indigo-950/30 font-semibold"
                >
                  <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Editar
                </Button>
                <Button
                  onClick={() =>
                    selectedTurno.id && handleDelete(selectedTurno.id)
                  }
                  variant="outline"
                  className="flex-1 text-xs sm:text-sm border-2 border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-950/30 font-semibold"
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
          <DialogHeader className="border-b border-slate-200 dark:border-slate-800 pb-4">
            <DialogTitle className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              Editar Turno
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-600 dark:text-slate-400">
              Modifica la fecha y hora del turno
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label
                htmlFor="edit-fecha"
                className="text-sm font-bold text-slate-700 dark:text-slate-300"
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
                className="border-2 border-slate-300 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-500 font-semibold"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="edit-hora"
                className="text-sm font-bold text-slate-700 dark:text-slate-300"
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
                className="border-2 border-slate-300 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-500 font-semibold"
              />
            </div>
          </div>
          <DialogFooter className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
              className="flex-1 border-2 border-slate-300 dark:border-slate-700 font-semibold"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSaveEdit}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-lg"
            >
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  );
}
