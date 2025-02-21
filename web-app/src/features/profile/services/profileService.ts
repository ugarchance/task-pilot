import { db } from '@/core/firebase/config';
import { getStorage } from 'firebase/storage';
import { Profile, ProfileUpdateRequest, ProfileResponse } from '../types';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { AppError } from '@/core/errors/AppError';

const storage = getStorage();

export const profileService = {
  async getProfile(userId: string): Promise<ProfileResponse> {
    try {
      const profileRef = doc(db, 'profiles', userId);
      const profileSnap = await getDoc(profileRef);

      if (!profileSnap.exists()) {
        throw new AppError('Profil bulunamadı', 'NOT_FOUND');
      }

      return {
        success: true,
        data: profileSnap.data() as Profile,
      };
    } catch (error) {
      throw new AppError('Profil bilgileri alınırken bir hata oluştu', 'INTERNAL_ERROR');
    }
  },

  async updateProfile(data: ProfileUpdateRequest): Promise<ProfileResponse> {
    try {
      const { userId, ...updateData } = data;
      const profileRef = doc(db, 'profiles', userId);
      
      const profileSnap = await getDoc(profileRef);
      
      if (!profileSnap.exists()) {
        const initialProfile: Profile = {
          id: userId,
          userId,
          email: '',
          displayName: updateData.displayName || '',
          preferences: {
            emailNotifications: true,
            pushNotifications: true,
            theme: 'system',
            language: 'tr',
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ...updateData,
        };
        
        await setDoc(profileRef, initialProfile);
        return {
          success: true,
          data: initialProfile,
          message: 'Profil başarıyla oluşturuldu',
        };
      }

      const currentData = profileSnap.data() as Profile;
      const updatedProfileData = {
        ...currentData,
        ...updateData,
        updatedAt: new Date().toISOString(),
      };

      await updateDoc(profileRef, updatedProfileData);

      return {
        success: true,
        data: updatedProfileData,
        message: 'Profil başarıyla güncellendi',
      };
    } catch (error) {
      console.error('Profil güncelleme hatası:', error);
      throw new AppError('Profil güncellenirken bir hata oluştu', 'INTERNAL_ERROR');
    }
  },

  async updateProfilePhoto(userId: string, file: File): Promise<ProfileResponse> {
    try {
      // Dosya adını ve uzantısını al
      const fileExtension = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExtension}`;
      
      // Storage referansını güncelle
      const photoRef = ref(storage, `profile-photos/${userId}/${fileName}`);
      await uploadBytes(photoRef, file);
      const photoURL = await getDownloadURL(photoRef);

      const profileRef = doc(db, 'profiles', userId);
      await updateDoc(profileRef, {
        photoURL,
        updatedAt: new Date().toISOString(),
      });

      const updatedProfile = await getDoc(profileRef);

      return {
        success: true,
        data: updatedProfile.data() as Profile,
        message: 'Profil fotoğrafı başarıyla güncellendi',
      };
    } catch (error) {
      console.error('Profil fotoğrafı güncelleme hatası:', error);
      throw new AppError('Profil fotoğrafı güncellenirken bir hata oluştu', 'INTERNAL_ERROR');
    }
  },

  async updatePreferences(userId: string, preferences: Profile['preferences']): Promise<ProfileResponse> {
    try {
      const profileRef = doc(db, 'profiles', userId);
      await updateDoc(profileRef, {
        preferences,
        updatedAt: new Date().toISOString(),
      });

      const updatedProfile = await getDoc(profileRef);

      return {
        success: true,
        data: updatedProfile.data() as Profile,
        message: 'Tercihler başarıyla güncellendi',
      };
    } catch (error) {
      throw new AppError('Tercihler güncellenirken bir hata oluştu', 'INTERNAL_ERROR');
    }
  },

  async createInitialProfile(userId: string, email: string, displayName: string): Promise<ProfileResponse> {
    try {
      const profileRef = doc(db, 'profiles', userId);
      const initialProfile: Profile = {
        id: userId,
        userId,
        email,
        displayName,
        preferences: {
          emailNotifications: true,
          pushNotifications: true,
          theme: 'system',
          language: 'tr',
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await setDoc(profileRef, initialProfile);

      return {
        success: true,
        data: initialProfile,
        message: 'Profil başarıyla oluşturuldu',
      };
    } catch (error) {
      throw new AppError('Profil oluşturulurken bir hata oluştu', 'INTERNAL_ERROR');
    }
  },
};
