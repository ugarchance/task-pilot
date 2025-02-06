import { initializeApp, getApps, cert } from 'firebase-admin/app';

const firebaseAdminConfig = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

export function initAdmin() {
  if (getApps().length === 0) {
    initializeApp({
      credential: cert(firebaseAdminConfig),
    });
  }
} 