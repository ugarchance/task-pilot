'use client';

import { useEffect } from 'react';
import { authService } from '../services/authService';
import { setUser, setLoading, setError, signOut } from '../store/authSlice';
import { setAuthToken, removeAuthToken, refreshAuthToken } from '../utils/token';
import { toast } from 'sonner';
import { useAppSelector } from '@/shared/hooks/useAppSelector';
import { useAppDispatch } from '@/shared/hooks/useAppDispatch';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, loading, error } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged(async (user) => {
      if (user) {
        await setAuthToken(user);
      } else {
        removeAuthToken();
      }
      dispatch(setUser(user));
    });

    // Token yenileme işlemi (1 saatte bir)
    const tokenRefreshInterval = setInterval(() => {
      if (user) {
        refreshAuthToken();
      }
    }, 60 * 60 * 1000);

    return () => {
      unsubscribe();
      clearInterval(tokenRefreshInterval);
    };
  }, [dispatch, user]);

  const login = async (email: string, password: string) => {
    try {
      dispatch(setLoading(true));
      const user = await authService.loginWithEmail(email, password);
      await setAuthToken(user);
      dispatch(setUser(user));
      toast.success('Giriş başarılı!');
    } catch (error) {
      dispatch(setError((error as Error).message));
      toast.error('Giriş yapılırken bir hata oluştu');
    }
  };

  const loginWithGoogle = async () => {
    try {
      dispatch(setLoading(true));
      const user = await authService.loginWithGoogle();
      await setAuthToken(user);
      dispatch(setUser(user));
      toast.success('Giriş başarılı!');
    } catch (error) {
      dispatch(setError((error as Error).message));
      toast.error('Giriş yapılırken bir hata oluştu');
    }
  };

  const register = async (email: string, password: string) => {
    try {
      dispatch(setLoading(true));
      const user = await authService.registerWithEmail(email, password);
      await setAuthToken(user);
      dispatch(setUser(user));
      toast.success('Kayıt başarılı!');
    } catch (error) {
      dispatch(setError((error as Error).message));
      toast.error('Kayıt olurken bir hata oluştu');
    }
  };

  const logout = async () => {
    try {
      await authService.signOut();
      removeAuthToken();
      dispatch(signOut());
      toast.success('Çıkış yapıldı');
    } catch (error) {
      dispatch(setError((error as Error).message));
      toast.error('Çıkış yapılırken bir hata oluştu');
    }
  };

  const resetPassword = async (email: string) => {
    try {
      dispatch(setLoading(true));
      await authService.resetPassword(email);
      dispatch(setLoading(false));
      toast.success('Şifre sıfırlama bağlantısı gönderildi');
    } catch (error) {
      dispatch(setError((error as Error).message));
      toast.error('Şifre sıfırlama işlemi başarısız oldu');
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
  };
}; 