// src/features/auth/services/authService.js
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
//import { AuthUser } from '../types'; // Bunu artık kullanmıyoruz, adapterden alıcaz.
import { adaptFirebaseUserToAuthUser } from '../utils/firebaseUserAdapter'; // Adaptörü import edin.

export const authService = {
  // Email/Password ile kayıt
  registerWithEmail: async (email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return adaptFirebaseUserToAuthUser(userCredential.user); // Adaptörü kullan
  },

  // Email/Password ile giriş
  loginWithEmail: async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return adaptFirebaseUserToAuthUser(userCredential.user); // Adaptörü kullan
  },

  // Google ile giriş
  loginWithGoogle: async () => {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    return adaptFirebaseUserToAuthUser(userCredential.user); // Adaptörü kullan
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
  onAuthStateChanged: (callback: (user: ReturnType<typeof adaptFirebaseUserToAuthUser>) => void) => {
    return onAuthStateChanged(auth, (firebaseUser) => {
      console.log("onAuthStateChanged tetiklendi", firebaseUser); // GİRİŞ
      const authUser = adaptFirebaseUserToAuthUser(firebaseUser);
      console.log("adaptFirebaseUserToAuthUser sonucu:", authUser); // ADAPTÖR SONUCU
      callback(authUser);
      console.log("onAuthStateChanged callback çağrıldı"); // ÇIKIŞ
    });
  },
};