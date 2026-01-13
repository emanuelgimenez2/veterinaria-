// Guardar como: components/admin/turnos-management.tsx

"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";

import { useTurnosManagement } from "@/hooks/turnos/useTurnosManagement";
import { CalendarView } from "./calendar-view";
import { TimelineView } from "./timeline-view";
import { GridView } from "./grid-view";
import { TurnoDetailsModal } from "./TurnoDetailsModal";
import { EditTurnoModal } from "./EditTurnoModal";
import { BlockDateModal } from "./BlockDateModal";
import { StatsCard } from "./StatsCard";
import { NextAppointmentCard } from "./NextAppointmentCard";

export default function TurnosManagement() {
  const {
    turnos,
    loading,
    selectedTurno,
    setSelectedTurno,
    mascotaDetails,
    setMascotaDetails,
    loadingMascota,
    blockedDates,
    selectedDate,
    setSelectedDate,
    fetchMascotaDetails,
    handleToggleBlockDate,
    handleToggleSingleDate,
    handleToggleDateRange,
    handleMarkCompleted,
    handleCancel,
    handleDelete,
    handleSaveEdit,
  } = useTurnosManagement();

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [blockDateDialogOpen, setBlockDateDialogOpen] = useState(false);
  const [editData, setEditData] = useState({ fecha: "", hora: "" });
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [singleDateBlock, setSingleDateBlock] = useState<string>("");
  const [dateRangeStart, setDateRangeStart] = useState<string>("");
  const [dateRangeEnd, setDateRangeEnd] = useState<string>("");
  const [viewMode, setViewMode] = useState<"timeline" | "grid">("timeline");

  const handleViewDetails = (turno: any) => {
    setSelectedTurno(turno);
    if (turno.mascotaId && turno.clienteId) {
      fetchMascotaDetails(turno.clienteId, turno.mascotaId);
    }
    setDetailsDialogOpen(true);
  };

  const handleEdit = (turno: any) => {
    setSelectedTurno(turno);
    setEditData({
      fecha: turno.turno.fecha,
      hora: turno.turno.hora,
    });
    setEditDialogOpen(true);
    setDetailsDialogOpen(false);
  };

  const closeDetailsModal = () => {
    setDetailsDialogOpen(false);
    setSelectedTurno(null);
    setMascotaDetails(null);
  };

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
                {new Date(selectedDate + "T00:00:00").toLocaleDateString("es-AR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-2 sm:gap-3 lg:gap-4 lg:grid-cols-12">
        <div className="lg:col-span-4 space-y-2 sm:space-y-3 lg:space-y-4">
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
                onOpenBlockDialog={() => setBlockDateDialogOpen(true)}
              />
            </CardContent>
          </Card>

          <NextAppointmentCard
            turnos={turnos}
            selectedDate={selectedDate}
            onViewDetails={handleViewDetails}
          />

          <StatsCard selectedDate={selectedDate} turnos={turnos} />
        </div>

        <div className="lg:col-span-8">
          {viewMode === "timeline" ? (
            <TimelineView
              selectedDate={selectedDate}
              turnos={turnos}
              onViewDetails={handleViewDetails}
              onToggleView={() => setViewMode("grid")}
            />
          ) : (
            <GridView
              selectedDate={selectedDate}
              turnos={turnos}
              onViewDetails={handleViewDetails}
              onToggleView={() => setViewMode("timeline")}
            />
          )}
        </div>
      </div>

      <TurnoDetailsModal
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        turno={selectedTurno}
        mascotaDetails={mascotaDetails}
        loadingMascota={loadingMascota}
        onMarkCompleted={(id) =>
          handleMarkCompleted(id, closeDetailsModal)
        }
        onCancel={(id) => handleCancel(id, closeDetailsModal)}
        onEdit={handleEdit}
        onDelete={(id) => handleDelete(id, closeDetailsModal)}
      />

      <EditTurnoModal
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        editData={editData}
        onEditDataChange={setEditData}
        onSave={() =>
          selectedTurno?.id &&
          handleSaveEdit(selectedTurno.id, editData, selectedTurno, () =>
            setEditDialogOpen(false)
          )
        }
      />

      <BlockDateModal
        open={blockDateDialogOpen}
        onOpenChange={setBlockDateDialogOpen}
        singleDateBlock={singleDateBlock}
        onSingleDateBlockChange={setSingleDateBlock}
        dateRangeStart={dateRangeStart}
        onDateRangeStartChange={setDateRangeStart}
        dateRangeEnd={dateRangeEnd}
        onDateRangeEndChange={setDateRangeEnd}
        onToggleSingleDate={(action) =>
          handleToggleSingleDate(singleDateBlock, action, () => {
            setBlockDateDialogOpen(false);
            setSingleDateBlock("");
          })
        }
        onToggleDateRange={(action) =>
          handleToggleDateRange(dateRangeStart, dateRangeEnd, action, () => {
            setBlockDateDialogOpen(false);
            setDateRangeStart("");
            setDateRangeEnd("");
          })
        }
      />

      <Toaster />
    </div>
  );
}