import { User as FirebaseUser } from 'firebase/auth';

export interface AuthUser extends FirebaseUser {
  // Firebase User'a eklemek istediğiniz özel alanları buraya ekleyebilirsiniz
}

export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
} 