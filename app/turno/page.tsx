// /app/turno/page.tsx
"use client";

import { TurnoForm } from "@/components/turnos/TurnoForm";
import { Toaster } from "@/components/ui/toaster";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TurnoPage() {
  return (
    <main className="relative min-h-screen bg-gradient-to-b from-muted/30 via-muted/50 to-muted/30 py-8 md:py-16 overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="container max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
        <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 backdrop-blur p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100">
              Soy cliente
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Accedé con tu DNI para ver, agendar o cancelar turnos.
            </p>
          </div>
          <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
            <Link href="/mis-turnos">Ingresar con DNI</Link>
          </Button>
        </section>
        <TurnoForm />
      </div>

      <Toaster />
    </main>
  );
}
