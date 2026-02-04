"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Clock,
  Phone,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Dog,
  Cat,
  Bird,
  PawPrint,
  Calendar,
  LayoutGrid,
} from "lucide-react";
import type { Turno } from "@/lib/firebase/firestore";

function getMascotaIcon(tipo: string) {
  const t = tipo?.toLowerCase() || "";
  if (t.includes("perro") || t.includes("dog")) return Dog;
  if (t.includes("gato") || t.includes("cat")) return Cat;
  if (t.includes("ave") || t.includes("bird") || t.includes("pájaro")) return Bird;
  return PawPrint;
}

interface GridViewProps {
  turnos: Turno[];
  selectedDate: string;
  onTurnoClick: (turno: Turno) => void;
  /** Modo de la vista Grid: por fecha seleccionada o historial completo */
  gridMode?: "date" | "full";
  onGridModeChange?: (mode: "date" | "full") => void;
  onToggleView?: () => void;
}

const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export function GridView({
  turnos,
  selectedDate,
  onTurnoClick,
  gridMode = "date",
  onGridModeChange,
  onToggleView,
}: GridViewProps) {
  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return (
          <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/50 dark:text-amber-300 border-0 text-[9px] sm:text-[10px]">
            <Clock className="h-2 w-2 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
            Pendiente
          </Badge>
        );
      case "completado":
        return (
          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 border-0 text-[9px] sm:text-[10px]">
            <CheckCircle2 className="h-2 w-2 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
            Completado
          </Badge>
        );
      case "cancelado":
        return (
          <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-200 dark:bg-rose-950/50 dark:text-rose-400 border-0 text-[9px] sm:text-[10px]">
            <XCircle className="h-2 w-2 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
            Cancelado
          </Badge>
        );
      default:
        return <Badge variant="outline">{estado}</Badge>;
    }
  };

  const now = new Date();
  const isToday = selectedDate === now.toISOString().split("T")[0];

  const { turnosToShow, groupedByMonth } = useMemo(() => {
    if (gridMode === "date") {
      const filtered = turnos.filter((t) => (t.turno?.fecha ?? t.fecha ?? "") === selectedDate);
      const sorted = [...filtered].sort((a, b) => a.turno.hora.localeCompare(b.turno.hora));
      return { turnosToShow: sorted, groupedByMonth: null as Map<string, Turno[]> | null };
    }
    const byMonth = new Map<string, Turno[]>();
    const getFecha = (t: Turno) => t.turno?.fecha ?? t.fecha ?? "";
    turnos.forEach((t) => {
      const f = getFecha(t);
      if (!f) return;
      const [y, m] = f.split("-");
      const key = `${y}-${m}`;
      if (!byMonth.has(key)) byMonth.set(key, []);
      byMonth.get(key)!.push(t);
    });
    byMonth.forEach((arr) => arr.sort((a, b) => {
      const fa = getFecha(a);
      const fb = getFecha(b);
      if (fa !== fb) return fb.localeCompare(fa);
      return (b.turno?.hora ?? "").localeCompare(a.turno?.hora ?? "");
    }));
    const keys = Array.from(byMonth.keys()).sort((a, b) => b.localeCompare(a));
    const grouped = new Map<string, Turno[]>();
    keys.forEach((k) => grouped.set(k, byMonth.get(k)!));
    return { turnosToShow: [], groupedByMonth: grouped };
  }, [turnos, selectedDate, gridMode]);

  const empty = gridMode === "date" ? turnosToShow.length === 0 : (groupedByMonth?.size ?? 0) === 0;

  if (empty) {
    return (
      <div className="space-y-3">
        {onGridModeChange && (
          <div className="flex flex-wrap items-center gap-2">
            <Tabs value={gridMode} onValueChange={(v) => onGridModeChange(v as "date" | "full")}>
              <TabsList className="h-9 bg-slate-200/80 dark:bg-slate-800/80">
                <TabsTrigger value="date" className="text-xs data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
                  Vista por Fecha
                </TabsTrigger>
                <TabsTrigger value="full" className="text-xs data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
                  Historial Completo
                </TabsTrigger>
              </TabsList>
            </Tabs>
            {onToggleView && (
              <Button variant="outline" size="sm" className="h-9" onClick={onToggleView}>
                <LayoutGrid className="h-4 w-4 mr-1" />
                Timeline
              </Button>
            )}
          </div>
        )}
        <div className="flex flex-col items-center justify-center py-12 sm:py-16 lg:py-20">
          <div className="p-4 sm:p-5 lg:p-6 rounded-full bg-slate-100 dark:bg-slate-800 mb-4 sm:mb-6">
            <Clock className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-slate-400 dark:text-slate-600" />
          </div>
          <h3 className="text-base sm:text-lg lg:text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">
            {gridMode === "date" ? "No hay turnos agendados" : "No hay turnos registrados"}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-500">
            {gridMode === "date"
              ? "No se encontraron turnos para esta fecha"
              : "Aún no hay turnos en el historial."}
          </p>
        </div>
      </div>
    );
  }

  const renderCard = (turno: Turno) => {
    const turnoHour = Number.parseInt((turno.turno?.hora ?? "0").split(":")[0], 10);
    const fechaStr = turno.turno?.fecha ?? turno.fecha ?? "";
    const cardIsToday = fechaStr === now.toISOString().split("T")[0];
    const isUrgent =
      turno.estado === "pendiente" &&
      cardIsToday &&
      turnoHour <= now.getHours() + 1;
    const MascotaIcon = getMascotaIcon(turno.mascota?.tipo ?? "");

    return (
      <div
        key={turno.id}
        className={`group relative overflow-hidden rounded-lg sm:rounded-xl lg:rounded-2xl border sm:border-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
          turno.estado === "completado"
            ? "bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700"
            : turno.estado === "cancelado"
            ? "bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-700 opacity-60"
            : isUrgent
            ? "bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-700 shadow-lg shadow-rose-500/20"
            : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
        }`}
      >
        <div
          className={`absolute left-0 top-0 right-0 h-1 sm:h-1.5 ${
            turno.estado === "completado"
              ? "bg-emerald-500"
              : turno.estado === "cancelado"
              ? "bg-slate-400"
              : isUrgent
              ? "bg-rose-500"
              : "bg-slate-700 dark:bg-slate-600"
          }`}
        />
        <div className="p-3 sm:p-4 lg:p-5 pt-4 sm:pt-5 lg:pt-6">
          <div className="flex items-start justify-between gap-2 mb-3 sm:mb-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-sm sm:text-base lg:text-lg font-black text-slate-900 dark:text-white truncate mb-1">
                {turno.cliente.nombre}
              </h3>
              <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-slate-600 dark:text-slate-400">
                <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {fechaStr ? new Date(fechaStr + "T00:00:00").toLocaleDateString("es-AR", { day: "2-digit", month: "short" }) : "—"} · {turno.turno?.hora ?? "—"}
                </span>
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
          <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
            <div className="flex items-center gap-2 p-2 sm:p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
              <MascotaIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-600 dark:text-slate-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] sm:text-xs font-semibold text-slate-900 dark:text-white truncate">
                  {turno.mascota.nombre}
                </p>
                <p className="text-[9px] sm:text-[10px] text-slate-600 dark:text-slate-400">
                  {turno.mascota.tipo}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 sm:p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
              <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-600 dark:text-slate-400 flex-shrink-0" />
              <p className="text-[10px] sm:text-xs font-semibold text-slate-900 dark:text-white truncate">
                {turno.cliente.telefono}
              </p>
            </div>
            <div className="flex items-start gap-2 p-2 sm:p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
              <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-600 dark:text-slate-400 flex-shrink-0 mt-0.5" />
              <p className="text-[9px] sm:text-[10px] font-medium text-slate-700 dark:text-slate-300 line-clamp-2">
                {turno.cliente.domicilio || "Dirección no especificada"}
              </p>
            </div>
          </div>
          <Button
            onClick={() => onTurnoClick(turno)}
            className="w-full bg-slate-700 hover:bg-slate-800 dark:bg-slate-600 dark:hover:bg-slate-700 text-white font-semibold rounded-lg sm:rounded-xl h-7 sm:h-8 lg:h-9 text-[10px] sm:text-xs lg:text-sm shadow-lg"
          >
            Ver Detalles Completos
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        {onGridModeChange && (
          <Tabs value={gridMode} onValueChange={(v) => onGridModeChange(v as "date" | "full")}>
            <TabsList className="h-9 bg-slate-200/80 dark:bg-slate-800/80">
              <TabsTrigger value="date" className="text-xs data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
                Vista por Fecha
              </TabsTrigger>
              <TabsTrigger value="full" className="text-xs data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
                Historial Completo
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}
        {onToggleView && (
          <Button variant="outline" size="sm" className="h-9" onClick={onToggleView}>
            <LayoutGrid className="h-4 w-4 mr-1" />
            Timeline
          </Button>
        )}
      </div>

      {gridMode === "date" ? (
        <div className="grid gap-2 sm:gap-3 lg:gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {turnosToShow.map(renderCard)}
        </div>
      ) : (
        <div className="space-y-6">
          {groupedByMonth &&
            Array.from(groupedByMonth.entries()).map(([key, list]) => {
              const [year, month] = key.split("-");
              const monthName = MONTH_NAMES[Number.parseInt(month, 10) - 1];
              return (
                <div key={key}>
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-200 dark:border-slate-700">
                    <Calendar className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                    <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      {monthName} {year}
                    </h3>
                  </div>
                  <div className="grid gap-2 sm:gap-3 lg:gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {list.map(renderCard)}
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
