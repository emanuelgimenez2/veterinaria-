"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getHistorias } from "@/lib/firebase/firestore";
import type { Historia, Mascota, Turno } from "@/lib/firebase/firestore";
import { Calendar, Clock, FileText } from "lucide-react";

type TimelineItem =
  | { type: "historia"; data: Historia }
  | { type: "turno"; data: Turno };

function buildTimeline(historias: Historia[], turnosMascota: Turno[]): TimelineItem[] {
  const items: TimelineItem[] = [];
  historias.forEach((h) => items.push({ type: "historia", data: h }));
  turnosMascota.forEach((t) => items.push({ type: "turno", data: t }));
  items.sort((a, b) => {
    const dateA =
      a.type === "historia"
        ? new Date(a.data.fechaAtencion + "T12:00:00").getTime()
        : new Date((a.data.turno?.fecha ?? a.data.fecha ?? "") + "T12:00:00").getTime();
    const dateB =
      b.type === "historia"
        ? new Date(b.data.fechaAtencion + "T12:00:00").getTime()
        : new Date((b.data.turno?.fecha ?? b.data.fecha ?? "") + "T12:00:00").getTime();
    return dateB - dateA;
  });
  return items;
}

interface MiLibretaClienteProps {
  clienteId: string;
  mascotas: Mascota[];
  turnos: Turno[];
}

export function MiLibretaCliente({ clienteId, mascotas, turnos }: MiLibretaClienteProps) {
  const [selectedMascotaId, setSelectedMascotaId] = useState<string | null>(null);
  const [historias, setHistorias] = useState<Historia[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedMascotaId && mascotas.length > 0) {
      setSelectedMascotaId(mascotas[0].id ?? null);
    }
  }, [mascotas, selectedMascotaId]);

  useEffect(() => {
    const load = async () => {
      if (!clienteId || !selectedMascotaId) return;
      setLoading(true);
      try {
        const data = await getHistorias(clienteId, selectedMascotaId);
        setHistorias(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [clienteId, selectedMascotaId]);

  const timeline = useMemo(() => {
    const mascota = mascotas.find((m) => m.id === selectedMascotaId);
    if (!mascota) return [];
    const nombre = (mascota.nombre ?? "").trim().toLowerCase();
    const turnosMascota = turnos.filter((t) => {
      const tn = (t.mascota?.nombre ?? "").trim().toLowerCase();
      return t.mascotaId === mascota.id || tn === nombre;
    });
    return buildTimeline(historias, turnosMascota);
  }, [historias, mascotas, selectedMascotaId, turnos]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {mascotas.map((m) => (
          <Button
            key={m.id}
            variant={selectedMascotaId === m.id ? "default" : "outline"}
            size="sm"
            className="h-8 text-xs"
            onClick={() => setSelectedMascotaId(m.id ?? null)}
          >
            {m.nombre}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="text-sm text-slate-500">Cargando libreta...</div>
      ) : timeline.length === 0 ? (
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-6 text-center text-sm text-slate-500">
          Sin registros clínicos ni turnos para esta mascota.
        </div>
      ) : (
        <div className="space-y-3">
          {timeline.map((item) => {
            if (item.type === "historia") {
              const h = item.data;
              const fecha = h.fechaAtencion
                ? new Date(h.fechaAtencion + "T00:00:00").toLocaleDateString("es-AR", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "—";
              return (
                <Card key={h.id} className="border-slate-200 dark:border-slate-700">
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge className="bg-emerald-100 text-emerald-700 border-0">Consulta</Badge>
                      <div className="text-xs text-slate-500 flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {fecha}
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {h.motivo || "Consulta"}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {h.diagnostico || "—"}
                    </p>
                  </CardContent>
                </Card>
              );
            }
            const t = item.data;
            const fechaStr = t.turno?.fecha ?? t.fecha ?? "";
            const fecha = fechaStr
              ? new Date(fechaStr + "T00:00:00").toLocaleDateString("es-AR", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "—";
            return (
              <Card key={t.id} className="border-slate-200 dark:border-slate-700">
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge
                      className={
                        t.estado === "pendiente"
                          ? "bg-amber-100 text-amber-700 border-0"
                          : t.estado === "completado"
                          ? "bg-emerald-100 text-emerald-700 border-0"
                          : "bg-slate-200 text-slate-700 border-0"
                      }
                    >
                      {t.estado}
                    </Badge>
                    <div className="text-xs text-slate-500 flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5" />
                      {fecha}
                      <Clock className="h-3.5 w-3.5" />
                      {t.turno?.hora ?? "—"}
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {t.mascota?.motivo || "Turno"}
                  </p>
                  <div className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5" />
                    {t.servicio || "Consulta"}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
