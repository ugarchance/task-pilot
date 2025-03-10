import { initializeApp } from 'firebase/app';
import { initializeAuth } from 'firebase/auth';
import * as firebaseAuth from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Web tarafından alınan aynı Firebase yapılandırması
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Config değerlerini kontrol et
console.log('Firebase Config:', {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY?.slice(0, 5) + '...',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
});

// Firebase başlatma
const app = initializeApp(firebaseConfig);

// Auth servisi - AsyncStorage ile kalıcı oturum yönetimi
const reactNativePersistence = (firebaseAuth as any).getReactNativePersistence;
export const auth = initializeAuth(app, {
  persistence: reactNativePersistence(AsyncStorage)
});

// Diğer servisler
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;