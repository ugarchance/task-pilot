import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Profile, ProfileState, ProfileUpdateRequest, ProfileTab } from '../types';
import { profileService } from '../services/profileService';

const initialState: ProfileState = {
  profile: null,
  isLoading: false,
  error: null,
  activeTab: 'general',
  isDirty: false,
};

export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (userId: string) => {
    const response = await profileService.getProfile(userId);
    return response.data;
  }
);

export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (data: ProfileUpdateRequest) => {
    const response = await profileService.updateProfile(data);
    return response.data;
  }
);

export const updateProfilePhoto = createAsyncThunk(
  'profile/updateProfilePhoto',
  async ({ userId, file }: { userId: string; file: File }) => {
    const response = await profileService.updateProfilePhoto(userId, file);
    return response.data;
  }
);

export const updatePreferences = createAsyncThunk(
  'profile/updatePreferences',
  async ({ userId, preferences }: { userId: string; preferences: Profile['preferences'] }) => {
    const response = await profileService.updatePreferences(userId, preferences);
    return response.data;
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<ProfileTab>) => {
      state.activeTab = action.payload;
    },
    setIsDirty: (state, action: PayloadAction<boolean>) => {
      state.isDirty = action.payload;
    },
    resetProfileState: (state) => {
      state.profile = null;
      state.isLoading = false;
      state.error = null;
      state.activeTab = 'general';
      state.isDirty = false;
    },
  },
  extraReducers: (builder) => {
    // Fetch Profile
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Profil bilgileri alınamadı';
      });

    // Update Profile
    builder
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
        state.isDirty = false;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Profil güncellenemedi';
      });

    // Update Profile Photo
    builder
      .addCase(updateProfilePhoto.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfilePhoto.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(updateProfilePhoto.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Profil fotoğrafı güncellenemedi';
      });

    // Update Preferences
    builder
      .addCase(updatePreferences.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePreferences.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
        state.isDirty = false;
      })
      .addCase(updatePreferences.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Tercihler güncellenemedi';
      });
  },
});

export const { setActiveTab, setIsDirty, resetProfileState } = profileSlice.actions;
export default profileSlice.reducer;
