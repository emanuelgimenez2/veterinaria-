import { auth } from "./config"
import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth"

/**
 * Login con Google
 * - Desktop: Popup
 * - Mobile: Redirect (requerido por Firebase)
 */
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider()

  if (typeof window !== "undefined" && window.innerWidth < 768) {
    // 📱 MOBILE
    await signInWithRedirect(auth, provider)
    return null
  } else {
    // 💻 DESKTOP
    return await signInWithPopup(auth, provider)
  }
}

/**
 * Maneja el resultado cuando se vuelve del redirect (MOBILE)
 * Llamar una sola vez al iniciar la app
 */
export const handleRedirectResult = async (): Promise<User | null> => {
  try {
    const result = await getRedirectResult(auth)
    return result?.user ?? null
  } catch (error) {
    console.error("Error en Google Redirect:", error)
    return null
  }
}

/**
 * Logout
 */
export const signOut = async () => {
  return await firebaseSignOut(auth)
}

/**
 * Devuelve el usuario actual
 */
export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe()
      resolve(user)
    })
  })
}

// Re-export por si lo usás en otros lados
export { onAuthStateChanged }
