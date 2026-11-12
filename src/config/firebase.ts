import { initializeApp, getApps } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import type { Auth } from 'firebase/auth'

export const isFirebaseConfigured = Boolean(
  import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_AUTH_DOMAIN
)

let authInstance: Auth | null = null
let googleProviderInstance: GoogleAuthProvider | null = null

if (isFirebaseConfigured) {
  try {
    const firebaseConfig = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'miniproyecto2-pi1',
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
      appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
    }
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
    authInstance = getAuth(app)
    googleProviderInstance = new GoogleAuthProvider()
    googleProviderInstance.setCustomParameters({ prompt: 'select_account' })
  } catch (error) {
    console.warn('[Firebase] No se pudo inicializar Firebase Client:', error)
  }
}

export const auth = authInstance as Auth
export const googleProvider = googleProviderInstance as GoogleAuthProvider

