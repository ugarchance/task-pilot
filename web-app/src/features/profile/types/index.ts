export interface Profile {
  id: string;
  userId: string;
  displayName: string;
  email: string;
  photoURL?: string;
  bio?: string;
  location?: string;
  company?: string;
  website?: string;
  socialLinks?: {
    github?: string;
    twitter?: string;
    linkedin?: string;
  };
  preferences?: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    theme: 'light' | 'dark' | 'system';
    language: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ProfileFormValues {
  displayName: string;
  bio?: string;
  location?: string;
  company?: string;
  website?: string;
  socialLinks?: {
    github?: string;
    twitter?: string;
    linkedin?: string;
  };
}

export interface ProfileUpdateRequest extends Partial<ProfileFormValues> {
  userId: string;
}

export interface ProfileResponse {
  success: boolean;
  data: Profile;
  message?: string;
}

export type ProfileTab = 'general' | 'security' | 'notifications' | 'integrations';

export interface ProfileState {
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
  activeTab: ProfileTab;
  isDirty: boolean;
}
