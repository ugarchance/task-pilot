import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth } from '@/core/firebase/config';
import { AuthUser } from '../types';

export const authService = {
  // Email/Password ile kayıt
  registerWithEmail: async (email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user as AuthUser;
  },

  // Email/Password ile giriş
  loginWithEmail: async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user as AuthUser;
  },

  // Google ile giriş
  loginWithGoogle: async () => {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    return userCredential.user as AuthUser;
  },

  // Çıkış yapma
  signOut: async () => {
    await firebaseSignOut(auth);
  },

  // Şifre sıfırlama
  resetPassword: async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  },

  // Auth state değişikliklerini dinleme
  onAuthStateChanged: (callback: (user: AuthUser | null) => void) => {
    return onAuthStateChanged(auth, (user) => {
      callback(user as AuthUser | null);
    });
  },
}; 