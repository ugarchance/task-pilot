// src/features/auth/types/index.ts
import { User as FirebaseUser, UserMetadata } from 'firebase/auth';

export interface AuthUser extends FirebaseUser {
  role: 'admin' | 'moderator' | 'user' | null; 
  profilePicture?: string | null;
  customClaims?: { [key: string]: any };
  createdAt?: number | null;  
  updatedAt?: number | null;
}

export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
}