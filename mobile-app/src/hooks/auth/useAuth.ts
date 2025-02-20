import { useState, useEffect } from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

// Google Sign-In yapılandırması
GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID,
  offlineAccess: true,
});

export const useAuth = () => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = async (email: string, password: string) => {
    try {
      setError(null);
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      return userCredential.user;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      return userCredential.user;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const loginWithGoogle = async () => {
    try {
      setError(null);
      // Google Sign-In akışını başlat
      await GoogleSignin.hasPlayServices();
      const signInResult = await GoogleSignin.signIn();
      
      // ID token'ı al
      const tokens = await GoogleSignin.getTokens();
      if (!tokens.idToken) {
        throw new Error('Google Sign-In başarısız oldu: ID token alınamadı');
      }
      
      // Google kimlik bilgilerini oluştur
      const credential = auth.GoogleAuthProvider.credential(tokens.idToken);
      
      // Firebase ile giriş yap
      const userCredential = await auth().signInWithCredential(credential);
      return userCredential.user;
    } catch (err: any) {
      if (err.code === statusCodes.SIGN_IN_CANCELLED) {
        setError('Google girişi iptal edildi');
      } else if (err.code === statusCodes.IN_PROGRESS) {
        setError('Google girişi zaten devam ediyor');
      } else if (err.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        setError('Google Play Services yüklü değil');
      } else {
        setError(err.message);
      }
      throw err;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await auth().signOut();
      await GoogleSignin.signOut(); // Google oturumunu da kapat
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return {
    user,
    loading,
    error,
    signup,
    login,
    logout,
    loginWithGoogle
  };
}; 