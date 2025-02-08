// src/features/auth/types/index.ts
import { User as FirebaseUser, UserMetadata } from 'firebase/auth';

export interface AuthUser {
  uid: string;
  email: string | null;
  emailVerified: boolean;
  displayName: string | null;
  photoURL: string | null;
  phoneNumber: string | null;
  isAnonymous: boolean;
  metadata: {
    creationTime?: string;
    lastSignInTime?: string;
  };
  providerData: Array<{
    providerId: string;
    uid: string;
    displayName: string | null;
    email: string | null;
    phoneNumber: string | null;
    photoURL: string | null;
  }>;
  role: 'admin' | 'moderator' | 'user' | null;
  customClaims?: Record<string, unknown>;
  createdAt: number | null;
  updatedAt: number | null;
  profilePicture?: string | null;
}

export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
}