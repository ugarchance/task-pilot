import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithCredential,
  sendPasswordResetEmail,
  sendEmailVerification,
  fetchSignInMethodsForEmail,
  User,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../../../core/firebase/config';  
import { adaptFirebaseUserToAuthUser } from '../utils/firebaseUserAdapter';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

// Google Sign-In yapılandırması
GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_FIREBASE_WEB_CLIENT_ID, // Firebase console'dan alınacak
  offlineAccess: true,
});

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
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    
    // Email doğrulama gönder
    await sendEmailVerification(userCredential.user);

    // Kullanıcıyı oturumdan çıkar (email doğrulanana kadar giriş yapamamalı)
    await auth.signOut();

    return adaptFirebaseUserToAuthUser(userCredential.user);
  },

  // Email/Password ile giriş
  loginWithEmail: async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth, 
        email, 
        password
      );
      
      // Email doğrulama kontrolü
      if (!userCredential.user.emailVerified) {
        // Doğrulanmamış kullanıcıyı oturumdan çıkar
        await auth.signOut();
        throw new Error('Email adresiniz doğrulanmamış. Lütfen email kutunuzu kontrol edin.');
      }

      return adaptFirebaseUserToAuthUser(userCredential.user);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Google ile giriş (Mobil için)
  loginWithGoogle: async () => {
    try {
      // Google Sign-In akışını başlat
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signIn();
      
      // Google kimlik bilgilerini al
      const { accessToken, idToken } = await GoogleSignin.getTokens();
      
      if (!idToken) {
        throw new Error('Google Sign-In başarısız: ID token alınamadı');
      }

      // Firebase kimlik bilgisini oluştur
      const credential = GoogleAuthProvider.credential(idToken, accessToken);

      // Firebase ile giriş yap
      const userCredential = await signInWithCredential(auth, credential);
      return adaptFirebaseUserToAuthUser(userCredential.user);
    } catch (error: unknown) {
      console.error('Google Sign-In error:', error);
      
      if (error instanceof Error) {
        if ((error as any).code === statusCodes.SIGN_IN_CANCELLED) {
          throw new Error('Giriş işlemi kullanıcı tarafından iptal edildi');
        } else if ((error as any).code === statusCodes.IN_PROGRESS) {
          throw new Error('Giriş işlemi halen devam ediyor');
        } else if ((error as any).code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          throw new Error('Play Services kullanılamıyor');
        }
        throw error;
      }
      throw new Error('Google Sign-In sırasında beklenmeyen bir hata oluştu');
    }
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

  // Profil güncelleme
  updateUserProfile: async (displayName: string, photoURL?: string) => {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('No user is currently signed in');
    }
    
    await updateProfile(user, {
      displayName,
      photoURL: photoURL || user.photoURL,
    });
    
    return adaptFirebaseUserToAuthUser(user);
  },
};
