import { db } from "./config"
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore"

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

// Turnos
export const createTurno = async (turnoData: Omit<Turno, "id">) => {
  const turnosRef = collection(db, "turnos")
  return await addDoc(turnosRef, {
    ...turnoData,
    turno: {
      ...turnoData.turno,
      timestamp: serverTimestamp(),
    },
  })
}

export const getTurnos = async () => {
  const turnosRef = collection(db, "turnos")
  const q = query(turnosRef, orderBy("turno.timestamp", "desc"))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Turno)
}

export const updateTurno = async (turnoId: string, data: Partial<Turno>) => {
  const turnoRef = doc(db, "turnos", turnoId)
  return await updateDoc(turnoRef, data)
}

export const deleteTurno = async (turnoId: string) => {
  const turnoRef = doc(db, "turnos", turnoId)
  return await deleteDoc(turnoRef)
}

// Clientes
export const createCliente = async (clienteData: Omit<Cliente, "id">) => {
  const clientesRef = collection(db, "clientes")
  return await addDoc(clientesRef, clienteData)
}

export const getClientes = async () => {
  const clientesRef = collection(db, "clientes")
  const snapshot = await getDocs(clientesRef)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Cliente)
}

export const getClienteByEmail = async (email: string) => {
  const clientesRef = collection(db, "clientes")
  const q = query(clientesRef, where("email", "==", email))
  const snapshot = await getDocs(q)
  if (snapshot.empty) return null
  return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Cliente
}

// Mascotas
export const createMascota = async (clienteId: string, mascotaData: Omit<Mascota, "id">) => {
  const mascotasRef = collection(db, `clientes/${clienteId}/mascotas`)
  return await addDoc(mascotasRef, mascotaData)
}

export const getMascotas = async (clienteId: string) => {
  const mascotasRef = collection(db, `clientes/${clienteId}/mascotas`)
  const snapshot = await getDocs(mascotasRef)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Mascota)
}

// Historias Clínicas
export const createHistoria = async (clienteId: string, mascotaId: string, historiaData: Omit<Historia, "id">) => {
  const historiasRef = collection(db, `clientes/${clienteId}/mascotas/${mascotaId}/historias`)
  return await addDoc(historiasRef, historiaData)
}

export const getHistorias = async (clienteId: string, mascotaId: string) => {
  const historiasRef = collection(db, `clientes/${clienteId}/mascotas/${mascotaId}/historias`)
  const q = query(historiasRef, orderBy("fechaAtencion", "desc"))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Historia)
}

export const updateHistoria = async (
  clienteId: string,
  mascotaId: string,
  historiaId: string,
  data: Partial<Historia>,
) => {
  const historiaRef = doc(db, `clientes/${clienteId}/mascotas/${mascotaId}/historias/${historiaId}`)
  return await updateDoc(historiaRef, data)
}

export const deleteHistoria = async (clienteId: string, mascotaId: string, historiaId: string) => {
  const historiaRef = doc(db, `clientes/${clienteId}/mascotas/${mascotaId}/historias/${historiaId}`)
  return await deleteDoc(historiaRef)
}
