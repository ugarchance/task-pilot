import { User } from 'firebase/auth';
import { AuthUser } from '../types';

export const adaptFirebaseUserToAuthUser = (firebaseUser: User | null): AuthUser | null => {
  if (!firebaseUser) return null;

  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    emailVerified: firebaseUser.emailVerified,
    displayName: firebaseUser.displayName,
    photoURL: firebaseUser.photoURL,
    phoneNumber: firebaseUser.phoneNumber,
    isAnonymous: firebaseUser.isAnonymous,
    metadata: {
      creationTime: firebaseUser.metadata.creationTime || undefined,
      lastSignInTime: firebaseUser.metadata.lastSignInTime || undefined
    },
    providerData: firebaseUser.providerData.map(provider => ({
      providerId: provider.providerId,
      uid: provider.uid,
      displayName: provider.displayName,
      email: provider.email,
      phoneNumber: provider.phoneNumber,
      photoURL: provider.photoURL
    })),
    role: (firebaseUser as any)?.customClaims?.role || null,
    customClaims: (firebaseUser as any)?.customClaims,
    createdAt: firebaseUser.metadata.creationTime ? 
      new Date(firebaseUser.metadata.creationTime).getTime() : null,
    updatedAt: firebaseUser.metadata.lastSignInTime ? 
      new Date(firebaseUser.metadata.lastSignInTime).getTime() : null,
    profilePicture: null
  };
};