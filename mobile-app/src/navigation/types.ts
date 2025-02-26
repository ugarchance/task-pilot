// Ana navigasyon türleri
export type RootStackParamList = {
    Auth: undefined;
    Main: undefined;
  };
  
  // Kimlik doğrulama navigasyon türleri
  export type AuthStackParamList = {
    Login: undefined;
    Register: undefined;
    ForgotPassword: undefined;
    VerifyEmail: undefined;
  };
  
  // Ana sekme navigasyon türleri
  export type MainTabParamList = {
    TasksTab: undefined;
    ProfileTab: undefined;
    SettingsTab: undefined;
  };
  
  // Görev navigasyon türleri
  export type TasksStackParamList = {
    TasksList: undefined;
    TasksActive: undefined;
    TasksCompleted: undefined;
    TaskDetails: { taskId: string };
    CreateTask: undefined;
    EditTask: { taskId: string };
  };
  
  // Profil navigasyon türleri
  export type ProfileStackParamList = {
    ProfileOverview: undefined;
    EditProfile: undefined;
    Preferences: undefined;
  };