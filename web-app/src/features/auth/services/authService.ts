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
  fetchSignInMethodsForEmail
} from 'firebase/auth';
import { auth } from '@/core/firebase/config';

import { adaptFirebaseUserToAuthUser } from '../utils/firebaseUserAdapter';

export const authService = {
  // Email/Password ile kayıt
  registerWithEmail: async (email: string, password: string) => {
    // Önce kullanıcının zaten var olup olmadığını kontrol et
    try {
      const methods = await fetchSignInMethodsForEmail(auth, email);
      if (methods.length > 0) {
        throw new Error('Bu email adresi zaten kullanımda');
      }
    } catch (error: any) {
      if (error?.code !== 'auth/user-not-found') {
        throw error;
      }
    }

    // Kullanıcıyı oluştur
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Email doğrulama gönder
    await sendEmailVerification(userCredential.user);

    // Kullanıcıyı oturumdan çıkar (email doğrulanana kadar giriş yapamamalı)
    await auth.signOut();

    return adaptFirebaseUserToAuthUser(userCredential.user);
  },

  // Email/Password ile giriş
  loginWithEmail: async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Email doğrulama kontrolü
    if (!userCredential.user.emailVerified) {
      // Doğrulanmamış kullanıcıyı oturumdan çıkar
      await auth.signOut();
      throw new Error('Email adresiniz doğrulanmamış. Lütfen email kutunuzu kontrol edin.');
    }

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