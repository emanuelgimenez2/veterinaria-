// /components/turnos/MascotaSection.tsx
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Heart, PlusCircle, Edit3 } from "lucide-react";

interface MascotaSectionProps {
  formData: {
    mascotaExistenteId: string;
    nombreMascota: string;
    tipoMascota: string;
    edadMascota: string;
    razaMascota: string;
    pesoMascota: string;
  };
  handleChange: (field: string, value: string) => void;
  mascotas: any[];
  mostrarNuevaMascota: boolean;
  setMostrarNuevaMascota: (value: boolean) => void;
}

export function MascotaSection({
  formData,
  handleChange,
  mascotas,
  mostrarNuevaMascota,
  setMostrarNuevaMascota,
}: MascotaSectionProps) {
  const mascotaSeleccionada = mascotas.find(
    (m) => m.id === formData.mascotaExistenteId
  );
  const esMascotaExistente =
    formData.mascotaExistenteId && formData.mascotaExistenteId !== "nueva";

  return (
    <div
      className="space-y-5 animate-in fade-in slide-in-from-left-4 duration-700"
      style={{ animationDelay: "200ms" }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-primary/10">
          <Heart className="h-5 w-5 text-primary fill-current" />
        </div>
        <h3 className="text-xl font-bold">Información de la Mascota</h3>
      </div>

      {/* Selector de mascota existente */}
      {mascotas.length > 0 && (
        <div className="space-y-2">
          <Label htmlFor="mascotaExistente" className="text-sm font-semibold">
            Selecciona una mascota o registra una nueva
          </Label>
          <Select
            value={formData.mascotaExistenteId || "nueva"}
            onValueChange={(value) => handleChange("mascotaExistenteId", value)}
          >
            <SelectTrigger id="mascotaExistente" className="h-11 border-2">
              <SelectValue placeholder="Selecciona una mascota..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nueva">
                <div className="flex items-center gap-2">
                  <PlusCircle className="h-4 w-4" />
                  <span>Registrar nueva mascota</span>
                </div>
              </SelectItem>
              {mascotas.map((mascota) => (
                <SelectItem key={mascota.id} value={mascota.id}>
                  {mascota.nombre} - {mascota.tipo}{" "}
                  {mascota.raza && `(${mascota.raza})`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Mensaje si es mascota existente */}
      {esMascotaExistente && (
        <div className="p-4 rounded-lg bg-blue-500/10 border-2 border-blue-500/20 animate-in fade-in duration-300">
          <p className="text-sm font-semibold text-blue-700 dark:text-blue-400 flex items-center gap-2">
            <Edit3 className="h-4 w-4" />
            Puedes modificar los datos de tu mascota si lo deseas
          </p>
        </div>
      )}

      {/* Formulario de mascota (nueva o edición) */}
      {(mostrarNuevaMascota || esMascotaExistente) && (
        <>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="nombreMascota" className="text-sm font-semibold">
                Nombre de la Mascota *
              </Label>
              <Input
                id="nombreMascota"
                placeholder="Max"
                value={formData.nombreMascota}
                onChange={(e) => handleChange("nombreMascota", e.target.value)}
                required
                className="h-11 border-2 focus-visible:ring-primary/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tipoMascota" className="text-sm font-semibold">
                Tipo de Mascota *
              </Label>
              <Select
                value={formData.tipoMascota}
                onValueChange={(value) => handleChange("tipoMascota", value)}
                required
              >
                <SelectTrigger id="tipoMascota" className="h-11 border-2">
                  <SelectValue placeholder="Selecciona..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="perro">Perro</SelectItem>
                  <SelectItem value="gato">Gato</SelectItem>
                  <SelectItem value="conejo">Conejo</SelectItem>
                  <SelectItem value="ave">Ave</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="edadMascota" className="text-sm font-semibold">
                Edad
              </Label>
              <Input
                id="edadMascota"
                placeholder="2 años"
                value={formData.edadMascota}
                onChange={(e) => handleChange("edadMascota", e.target.value)}
                className="h-11 border-2 focus-visible:ring-primary/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="razaMascota" className="text-sm font-semibold">
                Raza
              </Label>
              <Input
                id="razaMascota"
                placeholder="Golden Retriever"
                value={formData.razaMascota}
                onChange={(e) => handleChange("razaMascota", e.target.value)}
                className="h-11 border-2 focus-visible:ring-primary/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pesoMascota" className="text-sm font-semibold">
                Peso
              </Label>
              <Input
                id="pesoMascota"
                placeholder="15 kg"
                value={formData.pesoMascota}
                onChange={(e) => handleChange("pesoMascota", e.target.value)}
                className="h-11 border-2 focus-visible:ring-primary/50"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
