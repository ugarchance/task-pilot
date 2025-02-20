import { useCallback, useEffect } from 'react';
import { useAppDispatch } from '@/shared/hooks/useAppDispatch';
import { useAppSelector } from '@/shared/hooks/useAppSelector';
import {
  fetchProfile,
  updateProfile,
  updateProfilePhoto,
  updatePreferences,
  setActiveTab,
  setIsDirty,
  resetProfileState,
} from '../store/profileSlice';
import { Profile, ProfileTab, ProfileFormValues } from '../types';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { toast } from 'sonner';
import { RootState } from '@/shared/store';

export function useProfile() {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { profile, isLoading, error, activeTab, isDirty } = useAppSelector(
    (state: RootState) => state.profile
  );

  // Profil verilerini yükle
  const loadProfile = useCallback(async () => {
    if (!user?.uid) return;
    try {
      await dispatch(fetchProfile(user.uid)).unwrap();
    } catch (error) {
      toast.error('Profil bilgileri yüklenirken bir hata oluştu');
    }
  }, [dispatch, user?.uid]);

  // Profil bilgilerini güncelle
  const handleUpdateProfile = useCallback(
    async (data: ProfileFormValues) => {
      if (!user?.uid) return;
      try {
        await dispatch(
          updateProfile({
            userId: user.uid,
            ...data,
          })
        ).unwrap();
        toast.success('Profil başarıyla güncellendi');
      } catch (error) {
        toast.error('Profil güncellenirken bir hata oluştu');
      }
    },
    [dispatch, user?.uid]
  );

  // Profil fotoğrafını güncelle
  const handleUpdatePhoto = useCallback(
    async (file: File) => {
      if (!user?.uid) return;
      try {
        await dispatch(
          updateProfilePhoto({
            userId: user.uid,
            file,
          })
        ).unwrap();
        toast.success('Profil fotoğrafı başarıyla güncellendi');
      } catch (error) {
        toast.error('Profil fotoğrafı güncellenirken bir hata oluştu');
      }
    },
    [dispatch, user?.uid]
  );

  // Kullanıcı tercihlerini güncelle
  const handleUpdatePreferences = useCallback(
    async (preferences: Profile['preferences']) => {
      if (!user?.uid) return;
      try {
        await dispatch(
          updatePreferences({
            userId: user.uid,
            preferences,
          })
        ).unwrap();
        toast.success('Tercihler başarıyla güncellendi');
      } catch (error) {
        toast.error('Tercihler güncellenirken bir hata oluştu');
      }
    },
    [dispatch, user?.uid]
  );

  // Aktif sekmeyi değiştir
  const handleTabChange = useCallback(
    (tab: ProfileTab) => {
      dispatch(setActiveTab(tab));
    },
    [dispatch]
  );

  // Form değişiklik durumunu güncelle
  const handleDirtyChange = useCallback(
    (isDirty: boolean) => {
      dispatch(setIsDirty(isDirty));
    },
    [dispatch]
  );

  // Profil state'ini sıfırla
  const handleResetProfile = useCallback(() => {
    dispatch(resetProfileState());
  }, [dispatch]);

  // Kullanıcı değiştiğinde profil verilerini yükle
  useEffect(() => {
    if (user?.uid) {
      loadProfile();
    } else {
      handleResetProfile();
    }
  }, [user?.uid, loadProfile, handleResetProfile]);

  return {
    // State
    profile,
    isLoading,
    error,
    activeTab,
    isDirty,
    
    // Actions
    loadProfile,
    updateProfile: handleUpdateProfile,
    updatePhoto: handleUpdatePhoto,
    updatePreferences: handleUpdatePreferences,
    changeTab: handleTabChange,
    setDirty: handleDirtyChange,
    resetProfile: handleResetProfile,
  };
}
