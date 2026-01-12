import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  CalendarIcon,
  Clock,
  User,
  Heart,
  MapPin,
  Mail,
  CreditCard,
  FileText,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface ModalConfirmacionProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  formData: {
    nombre: string;
    telefono: string;
    email: string;
    dni: string;
    domicilio: string;
    nombreMascota: string;
    tipoMascota: string;
    edadMascota: string;
    razaMascota: string;
    pesoMascota: string;
    servicio: string;
    motivo: string;
    fecha: string;
    hora: string;
  };
  selectedDate?: Date;
  loading: boolean;
}

export function ModalConfirmacion({
  open,
  onClose,
  onConfirm,
  formData,
  selectedDate,
  loading,
}: ModalConfirmacionProps) {
  const servicioNombres: Record<string, string> = {
    "consulta-general": "🩺 Consultas Generales",
    telemedicina: "💻 Telemedicina",
    vacunacion: "💉 Vacunación",
    urgencias: "🚨 Urgencias",
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <CalendarIcon className="h-6 w-6 text-primary" />
            Confirmar Turno
          </DialogTitle>
          <DialogDescription className="text-base">
            Revisa los datos antes de confirmar tu turno. Recibirás un email de
            confirmación.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Información del Cliente */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b">
              <User className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-lg">Información del Cliente</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Nombre completo</p>
                <p className="font-medium">{formData.nombre}</p>
              </div>
              <div>
                <p className="text-muted-foreground flex items-center gap-1">
                  <CreditCard className="h-3 w-3" /> DNI
                </p>
                <p className="font-medium">{formData.dni}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Teléfono</p>
                <p className="font-medium">{formData.telefono}</p>
              </div>
              <div>
                <p className="text-muted-foreground flex items-center gap-1">
                  <Mail className="h-3 w-3" /> Email
                </p>
                <p className="font-medium">{formData.email}</p>
              </div>
              <div className="col-span-2">
                <p className="text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> Domicilio
                </p>
                <p className="font-medium">{formData.domicilio}</p>
              </div>
            </div>
          </div>

          {/* Información de la Mascota */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b">
              <Heart className="h-5 w-5 text-primary fill-primary/20" />
              <h3 className="font-semibold text-lg">
                Información de la Mascota
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Nombre</p>
                <p className="font-medium">{formData.nombreMascota}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Tipo</p>
                <p className="font-medium capitalize">{formData.tipoMascota}</p>
              </div>
              {formData.razaMascota && (
                <div>
                  <p className="text-muted-foreground">Raza</p>
                  <p className="font-medium">{formData.razaMascota}</p>
                </div>
              )}
              {formData.edadMascota && (
                <div>
                  <p className="text-muted-foreground">Edad</p>
                  <p className="font-medium">{formData.edadMascota}</p>
                </div>
              )}
              {formData.pesoMascota && (
                <div>
                  <p className="text-muted-foreground">Peso</p>
                  <p className="font-medium">{formData.pesoMascota}</p>
                </div>
              )}
            </div>
          </div>

          {/* Servicio y Motivo */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b">
              <FileText className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-lg">Servicio</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-muted-foreground">Servicio requerido</p>
                <p className="font-medium">
                  {servicioNombres[formData.servicio]}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Motivo de la consulta</p>
                <p className="font-medium">{formData.motivo}</p>
              </div>
            </div>
          </div>

          {/* Fecha y Hora */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b">
              <Clock className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-lg">Fecha y Hora</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground flex items-center gap-1">
                  <CalendarIcon className="h-3 w-3" /> Fecha
                </p>
                <p className="font-medium">
                  {selectedDate
                    ? format(selectedDate, "PPP", { locale: es })
                    : formData.fecha}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Horario
                </p>
                <p className="font-medium">{formData.hora} hs</p>
              </div>
            </div>
          </div>

          {/* Aviso */}
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">📧 Importante:</strong>{" "}
              Recibirás un email de confirmación en{" "}
              <strong>{formData.email}</strong> con todos los detalles de tu
              turno.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="bg-gradient-to-r from-primary to-primary/90"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Confirmando...
              </span>
            ) : (
              "Confirmar Turno"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
