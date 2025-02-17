// src/features/auth/services/authService.js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  sendEmailVerification,
  User,
} from 'firebase/auth';
import { auth } from '@/core/firebase/config';
//import { AuthUser } from '../types'; // Bunu artık kullanmıyoruz, adapterden alıcaz.
import { adaptFirebaseUserToAuthUser } from '../utils/firebaseUserAdapter'; // Adaptörü import edin.

export const authService = {
  // Email/Password ile kayıt
  registerWithEmail: async (email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Kayıt sonrası doğrulama emaili gönder
    await sendEmailVerification(userCredential.user);
    return adaptFirebaseUserToAuthUser(userCredential.user);
  },

  // Email/Password ile giriş
  loginWithEmail: async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return adaptFirebaseUserToAuthUser(userCredential.user);
  },

  // Google ile giriş
  loginWithGoogle: async () => {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    return adaptFirebaseUserToAuthUser(userCredential.user);
  },

  // Çıkış yapma
  signOut: async () => {
    await firebaseSignOut(auth);
  },

  // Şifre sıfırlama
  resetPassword: async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  },

  // Email doğrulama maili gönderme
  sendVerificationEmail: async () => {
    const user = auth.currentUser;
    if (user) {
      await sendEmailVerification(user);
    } else {
      throw new Error('No user is currently signed in');
    }
  },

  // Email doğrulama durumunu kontrol etme
  isEmailVerified: () => {
    const user = auth.currentUser;
    return user?.emailVerified ?? false;
  },

  // Kullanıcı durumunu yenileme
  reloadUser: async () => {
    const user = auth.currentUser;
    if (user) {
      await user.reload();
      return adaptFirebaseUserToAuthUser(user);
    }
    return null;
  },

  // Auth state değişikliklerini dinleme
  onAuthStateChanged: (callback: (user: ReturnType<typeof adaptFirebaseUserToAuthUser>) => void) => {
    return onAuthStateChanged(auth, (firebaseUser) => {
      const authUser = adaptFirebaseUserToAuthUser(firebaseUser);
      callback(authUser);
    });
  },
};