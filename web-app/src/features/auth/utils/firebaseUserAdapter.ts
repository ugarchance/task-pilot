// src/features/auth/utils/firebaseUserAdapter.js
import { User } from 'firebase/auth';
import { AuthUser } from '../types';

export const adaptFirebaseUserToAuthUser = (firebaseUser: User | null): AuthUser | null => {
  if (!firebaseUser) {
    return null;
  }

  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    emailVerified: firebaseUser.emailVerified,
    displayName: firebaseUser.displayName,
    photoURL: firebaseUser.photoURL,
    phoneNumber: firebaseUser.phoneNumber,
    disabled: false,
    isAnonymous: firebaseUser.isAnonymous,
    metadata: {
      creationTime: firebaseUser.metadata.creationTime,
      lastSignInTime: firebaseUser.metadata.lastSignInTime
    },
    providerData: firebaseUser.providerData.map((provider) => ({
      providerId: provider.providerId,
      uid: provider.uid,
      displayName: provider.displayName,
      email: provider.email,
      phoneNumber: provider.phoneNumber,
      photoURL: provider.photoURL
    })),
    role: (firebaseUser as any)?.customClaims?.role || null,
    customClaims: (firebaseUser as any)?.customClaims,
    createdAt: firebaseUser.metadata.creationTime ? new Date(firebaseUser.metadata.creationTime).getTime() : null,
    updatedAt: firebaseUser.metadata.lastSignInTime ? new Date(firebaseUser.metadata.lastSignInTime).getTime() : null,
    profilePicture: null,
  };
};