import { db } from "./config"
import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore"

// ============ INTERFACES ============
export interface Cliente {
  id?: string
  nombre: string
  telefono: string
  email: string
  dni?: string
  domicilio?: string
}

export interface Mascota {
  id?: string
  nombre: string
  tipo: string
}

export interface Turno {
  id?: string
  clienteId: string
  mascotaId?: string
  cliente: {
    nombre: string
    telefono: string
    email: string
    dni?: string
    domicilio?: string
  }
  mascota: {
    nombre: string
    tipo: string
    motivo?: string
  }
  servicio?: string
  fecha?: string
  hora?: string
  turno: {
    fecha: string
    hora: string
    timestamp: any
  }
  estado: "pendiente" | "completado" | "cancelado"
}

export interface Historia {
  id?: string
  fechaAtencion: string
  diagnostico: string
  tratamiento: string
  observaciones: string
  archivos?: string[]
}

export interface HistoriaClinicaRegistro {
  consultas: any[]
  vacunas: any[]
  tratamientos: any[]
  alergias: any[]
  cirugias: any[]
  fechaCreacion: string
}

// ============ CLIENTES ============
export async function createCliente(data: Omit<Cliente, "id">) {
  const clientesRef = collection(db, "clientes")
  return await addDoc(clientesRef, data)
}

export async function getClientes() {
  const clientesRef = collection(db, "clientes")
  const snapshot = await getDocs(clientesRef)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Cliente)
}

export async function getClienteByEmail(email: string) {
  const clientesRef = collection(db, "clientes")
  const q = query(clientesRef, where("email", "==", email))
  const snapshot = await getDocs(q)
  if (snapshot.empty) return null
  const docSnap = snapshot.docs[0]
  return { id: docSnap.id, ...docSnap.data() } as Cliente
}

// ============ MASCOTAS ============
export async function createMascota(clienteId: string, data: Omit<Mascota, "id">) {
  const mascotasRef = collection(db, "clientes", clienteId, "mascotas")
  const mascotaRef = await addDoc(mascotasRef, data)
  
  // Crear historia clínica automáticamente (documento registro)
  await createHistoriaClinicaRegistro(clienteId, mascotaRef.id)
  
  return mascotaRef
}

export async function getMascotas(clienteId: string) {
  const mascotasRef = collection(db, "clientes", clienteId, "mascotas")
  const snapshot = await getDocs(mascotasRef)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Mascota)
}

// Alias para mantener compatibilidad
export const getMascotasByClienteId = getMascotas

// ============ HISTORIA CLÍNICA (DOCUMENTO REGISTRO) ============
export async function createHistoriaClinicaRegistro(clienteId: string, mascotaId: string) {
  const historiaRef = doc(
    db,
    "clientes",
    clienteId,
    "mascotas",
    mascotaId,
    "historiaClinica",
    "registro"
  )
  await setDoc(historiaRef, {
    consultas: [],
    vacunas: [],
    tratamientos: [],
    alergias: [],
    cirugias: [],
    fechaCreacion: new Date().toISOString(),
  })
  return historiaRef
}

export async function getHistoriaClinicaRegistro(clienteId: string, mascotaId: string) {
  const historiaRef = doc(
    db,
    "clientes",
    clienteId,
    "mascotas",
    mascotaId,
    "historiaClinica",
    "registro"
  )
  const snapshot = await getDoc(historiaRef)
  if (!snapshot.exists()) return null
  return { id: snapshot.id, ...snapshot.data() } as HistoriaClinicaRegistro
}

export async function updateHistoriaClinicaRegistro(
  clienteId: string,
  mascotaId: string,
  data: Partial<HistoriaClinicaRegistro>
) {
  const historiaRef = doc(
    db,
    "clientes",
    clienteId,
    "mascotas",
    mascotaId,
    "historiaClinica",
    "registro"
  )
  await setDoc(historiaRef, data, { merge: true })
}

// Aliases para mantener compatibilidad con nombres anteriores
export const createHistoriaClinica = createHistoriaClinicaRegistro
export const getHistoriaClinica = getHistoriaClinicaRegistro
export const updateHistoriaClinica = updateHistoriaClinicaRegistro

// ============ HISTORIAS CLÍNICAS (COLECCIÓN DE REGISTROS) ============
export async function createHistoria(
  clienteId: string,
  mascotaId: string,
  historiaData: Omit<Historia, "id">
) {
  const historiasRef = collection(
    db,
    "clientes",
    clienteId,
    "mascotas",
    mascotaId,
    "historias"
  )
  return await addDoc(historiasRef, historiaData)
}

export async function getHistorias(clienteId: string, mascotaId: string) {
  const historiasRef = collection(
    db,
    "clientes",
    clienteId,
    "mascotas",
    mascotaId,
    "historias"
  )
  const q = query(historiasRef, orderBy("fechaAtencion", "desc"))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Historia)
}

export async function updateHistoria(
  clienteId: string,
  mascotaId: string,
  historiaId: string,
  data: Partial<Historia>
) {
  const historiaRef = doc(
    db,
    "clientes",
    clienteId,
    "mascotas",
    mascotaId,
    "historias",
    historiaId
  )
  return await updateDoc(historiaRef, data)
}

export async function deleteHistoria(
  clienteId: string,
  mascotaId: string,
  historiaId: string
) {
  const historiaRef = doc(
    db,
    "clientes",
    clienteId,
    "mascotas",
    mascotaId,
    "historias",
    historiaId
  )
  return await deleteDoc(historiaRef)
}

// ============ TURNOS ============
export async function createTurno(turnoData: Partial<Turno>) {
  const turnosRef = collection(db, "turnos")
  
  // Asegurarnos de que la estructura sea correcta
  const turnoCompleto = {
    clienteId: turnoData.clienteId || "",
    mascotaId: turnoData.mascotaId || "",
    cliente: {
      nombre: turnoData.cliente?.nombre || "",
      telefono: turnoData.cliente?.telefono || "",
      email: turnoData.cliente?.email || "",
      dni: turnoData.cliente?.dni || "",
      domicilio: turnoData.cliente?.domicilio || "",
    },
    mascota: {
      nombre: turnoData.mascota?.nombre || "",
      tipo: turnoData.mascota?.tipo || "",
      motivo: turnoData.mascota?.motivo || "",
    },
    servicio: turnoData.servicio || "",
    fecha: turnoData.fecha || turnoData.turno?.fecha || "",
    hora: turnoData.hora || turnoData.turno?.hora || "",
    turno: {
      fecha: turnoData.fecha || turnoData.turno?.fecha || "",
      hora: turnoData.hora || turnoData.turno?.hora || "",
      timestamp: serverTimestamp(),
    },
    estado: turnoData.estado || "pendiente",
  }
  
  return await addDoc(turnosRef, turnoCompleto)
}

export async function getTurnos() {
  const turnosRef = collection(db, "turnos")
  const q = query(turnosRef, orderBy("turno.timestamp", "desc"))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Turno)
}

export async function updateTurno(turnoId: string, data: Partial<Turno>) {
  const turnoRef = doc(db, "turnos", turnoId)
  return await updateDoc(turnoRef, data)
}

export async function deleteTurno(turnoId: string) {
  const turnoRef = doc(db, "turnos", turnoId)
  return await deleteDoc(turnoRef)
}

// ============ DISPONIBILIDAD ============
export async function getDiasBloqueados() {
  const diasRef = collection(db, "diasBloqueados")
  const snapshot = await getDocs(diasRef)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

export async function bloquearDia(fecha: string, motivo?: string) {
  const diasRef = collection(db, "diasBloqueados")
  return await addDoc(diasRef, {
    fecha,
    motivo: motivo || "Día bloqueado",
    fechaCreacion: new Date().toISOString()
  })
}

export async function desbloquearDia(diaId: string) {
  const diaRef = doc(db, "diasBloqueados", diaId)
  return await deleteDoc(diaRef)
}