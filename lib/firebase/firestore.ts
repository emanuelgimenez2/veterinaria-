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
}

export interface Mascota {
  id?: string
  nombre: string
  tipo: string
}

export interface Turno {
  id?: string
  clienteId: string
  cliente: {
    nombre: string
    telefono: string
    email: string
  }
  mascota: {
    nombre: string
    tipo: string
    motivo: string
  }
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
export async function createTurno(turnoData: Omit<Turno, "id">) {
  const turnosRef = collection(db, "turnos")
  return await addDoc(turnosRef, {
    ...turnoData,
    turno: {
      ...turnoData.turno,
      timestamp: serverTimestamp(),
    },
  })
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