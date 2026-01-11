import { auth } from "./config"
import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth"

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider()
  return await signInWithPopup(auth, provider)
}

export const signOut = async () => {
  return await firebaseSignOut(auth)
}

export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe()
      resolve(user)
    })
  })
}

export { onAuthStateChanged }
