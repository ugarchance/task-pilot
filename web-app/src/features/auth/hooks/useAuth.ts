'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../services/authService';
import { setUser, setLoading, setError, signOut } from '../store/authSlice';
import { setAuthToken, removeAuthToken, refreshAuthToken } from '../utils/token';
import { toast } from 'sonner';
import { useAppSelector } from '@/shared/hooks/useAppSelector';
import { useAppDispatch } from '@/shared/hooks/useAppDispatch';
import { auth } from '@/core/firebase/config';
import { AuthUser } from '../types';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, loading, error } = useAppSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        // Email doğrulama kontrolü
        if (!authUser.emailVerified) {
          // Eğer email doğrulanmamışsa, kullanıcıyı doğrulama sayfasına yönlendir
          router.push('/auth/verify-email');
          // Kullanıcı state'ini güncelle ama token oluşturma
          dispatch(setUser(authUser));
          return;
        }

        // Email doğrulanmışsa token oluştur
        if (auth.currentUser) {
          await setAuthToken(auth.currentUser);
        }
      } else {
        removeAuthToken();
      }
      dispatch(setUser(authUser));
    });

    // Token yenileme işlemi (1 saatte bir)
    const tokenRefreshInterval = setInterval(() => {
      if (user?.emailVerified) { 
        refreshAuthToken();
      }
    }, 60 * 60 * 1000);

    return () => {
      unsubscribe();
      clearInterval(tokenRefreshInterval);
    };
  }, [dispatch, router]);

  const login = async (email: string, password: string) => {
    try {
      dispatch(setLoading(true));
      const authUser = await authService.loginWithEmail(email, password);

      if (authUser) {
        // Email doğrulama kontrolü
        if (!authUser.emailVerified) {
          toast.error('Email adresiniz doğrulanmamış. Lütfen email kutunuzu kontrol edin.');
          router.push('/auth/verify-email');
          return null;
        }

        if (auth.currentUser) {
          await setAuthToken(auth.currentUser); 
        }
        dispatch(setUser(authUser));
        toast.success('Giriş başarılı!');
        router.push('/dashboard');
      }
      return authUser;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Giriş yapılırken bir hata oluştu';
      dispatch(setError(errorMessage));
      toast.error(errorMessage);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const loginWithGoogle = async () => {
    try {
      dispatch(setLoading(true));
      const authUser = await authService.loginWithGoogle();
      
      if (authUser) {
        // Email doğrulama kontrolü
        if (!authUser.emailVerified) {
          toast.error('Email adresiniz doğrulanmamış. Lütfen email kutunuzu kontrol edin.');
          router.push('/auth/verify-email');
          return null;
        }

        if (auth.currentUser) {
          await setAuthToken(auth.currentUser);
        }
        dispatch(setUser(authUser));
        toast.success('Giriş başarılı!');
        router.push('/dashboard');
      }
      return authUser;
    } catch (error) {
      dispatch(setError((error as Error).message));
      toast.error('Giriş yapılırken bir hata oluştu');
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const register = async (email: string, password: string) => {
    try {
      dispatch(setLoading(true));
      const authUser = await authService.registerWithEmail(email, password);
      if (auth.currentUser) {
          await setAuthToken(auth.currentUser); 
        }
      dispatch(setUser(authUser));
      toast.success('Kayıt başarılı! Lütfen email adresinizi doğrulayın.');
      router.push('/auth/verify-email');
      return authUser;
    } catch (error) {
      dispatch(setError((error as Error).message));
      toast.error('Kayıt olurken bir hata oluştu');
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const logout = async () => {
    try {
      await authService.signOut();
      removeAuthToken();
      dispatch(signOut());
      toast.success('Çıkış yapıldı');
      router.push('/');
    } catch (error) {
      dispatch(setError((error as Error).message));
      toast.error('Çıkış yapılırken bir hata oluştu');
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      dispatch(setLoading(true));
      await authService.resetPassword(email);
      dispatch(setLoading(false));
      toast.success('Şifre sıfırlama bağlantısı email adresinize gönderildi');
    } catch (error) {
      dispatch(setError((error as Error).message));
      toast.error('Şifre sıfırlama işlemi başarısız oldu');
      throw error;
    }
  };

  const sendVerificationEmail = async () => {
    try {
      await authService.sendVerificationEmail();
      toast.success('Doğrulama emaili gönderildi');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Email gönderimi başarısız';
      toast.error(errorMessage);
      throw error;
    }
  };

  const checkEmailVerification = async () => {
    try {
      await authService.reloadUser();
      const isVerified = authService.isEmailVerified();
      if (isVerified) {
        toast.success('Email doğrulandı!');
        router.push('/dashboard');
      }
      return isVerified;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Doğrulama kontrolü başarısız';
      toast.error(errorMessage);
      throw error;
    }
  };

  return {
    user,
    loading,
    error,
    login,
    loginWithGoogle,
    register,
    logout,
    resetPassword,
    sendVerificationEmail,
    checkEmailVerification,
  };
};