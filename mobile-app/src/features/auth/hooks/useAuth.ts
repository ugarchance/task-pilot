import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, setLoading, setError, signOut as signOutAction } from '../store/authSlice';
import { authService } from '../services/authService';
import { auth } from '../../../core/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { RootState } from '../../../store';
import { Alert } from 'react-native';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      try {
        if (firebaseUser) {
          if (!firebaseUser.emailVerified) {
            // Email doğrulanmamış
            dispatch(setUser(null));
            return;
          }
          
          // Firebase user'ı bizim AuthUser formatına dönüştür
          const authUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            emailVerified: firebaseUser.emailVerified,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            phoneNumber: firebaseUser.phoneNumber,
            isAnonymous: firebaseUser.isAnonymous,
            metadata: {
              creationTime: firebaseUser.metadata.creationTime,
              lastSignInTime: firebaseUser.metadata.lastSignInTime,
            },
            providerData: firebaseUser.providerData.map(provider => ({
              providerId: provider.providerId,
              uid: provider.uid,
              displayName: provider.displayName,
              email: provider.email,
              phoneNumber: provider.phoneNumber,
              photoURL: provider.photoURL,
            })),
            role: null,
            customClaims: {},
            createdAt: firebaseUser.metadata.creationTime ? 
              new Date(firebaseUser.metadata.creationTime).getTime() : null,
            updatedAt: firebaseUser.metadata.lastSignInTime ? 
              new Date(firebaseUser.metadata.lastSignInTime).getTime() : null,
          };
          
          dispatch(setUser(authUser));
        } else {
          dispatch(setUser(null));
        }
      } catch (err) {
        console.error('Auth state change error:', err);
        dispatch(setUser(null));
      }
    });
    
    return unsubscribe;
  }, [dispatch]);

  const login = async (email: string, password: string) => {
    try {
      dispatch(setLoading(true));
      await authService.loginWithEmail(email, password);
      // onAuthStateChanged will handle the rest
      return true;
    } catch (err: any) {
      dispatch(setError(err.message));
      Alert.alert('Giriş Hatası', err.message);
      return false;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      dispatch(setLoading(true));
      await authService.registerWithEmail(email, password);
      Alert.alert(
        'Kayıt Başarılı',
        'Lütfen email adresinize gönderilen doğrulama bağlantısına tıklayın.'
      );
      return true;
    } catch (err: any) {
      dispatch(setError(err.message));
      Alert.alert('Kayıt Hatası', err.message);
      return false;
    }
  };

  const signOut = async () => {
    try {
      await authService.signOut();
      dispatch(signOutAction());
      return true;
    } catch (err: any) {
      dispatch(setError(err.message));
      Alert.alert('Çıkış Hatası', err.message);
      return false;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      dispatch(setLoading(true));
      await authService.resetPassword(email);
      Alert.alert(
        'Şifre Sıfırlama',
        'Şifre sıfırlama bağlantısı email adresinize gönderildi.'
      );
      dispatch(setLoading(false));
      return true;
    } catch (err: any) {
      dispatch(setError(err.message));
      Alert.alert('Şifre Sıfırlama Hatası', err.message);
      return false;
    }
  };

  const sendVerificationEmail = async () => {
    try {
      await authService.sendVerificationEmail();
      Alert.alert(
        'Email Doğrulama',
        'Doğrulama emaili gönderildi. Lütfen email kutunuzu kontrol edin.'
      );
      return true;
    } catch (err: any) {
      Alert.alert('Email Gönderme Hatası', err.message);
      return false;
    }
  };

  const checkEmailVerification = async () => {
    try {
      await authService.reloadUser();
      const isVerified = authService.isEmailVerified();
      if (isVerified) {
        Alert.alert('Email Doğrulandı', 'Email adresiniz başarıyla doğrulandı.');
      }
      return isVerified;
    } catch (err) {
      return false;
    }
  };

  return {
    user,
    loading,
    error,
    login,
    register,
    signOut,
    resetPassword,
    sendVerificationEmail,
    checkEmailVerification,
  };
};