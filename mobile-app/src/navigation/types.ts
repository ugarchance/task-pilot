import { 
  ROOT_ROUTES,
  AUTH_ROUTES,
  MAIN_TAB_ROUTES,
  TASKS_ROUTES,
  PROFILE_ROUTES 
} from './routes';

// Root Stack Param List
export type RootStackParamList = {
  [ROOT_ROUTES.AUTH]: undefined;
  [ROOT_ROUTES.MAIN]: undefined;
};

// Auth Stack Param List
export type AuthStackParamList = {
  [AUTH_ROUTES.LOGIN]: undefined;
  [AUTH_ROUTES.REGISTER]: undefined;
  [AUTH_ROUTES.FORGOT_PASSWORD]: undefined;
  [AUTH_ROUTES.VERIFY_EMAIL]: undefined;
};

// Main Tab Param List
export type MainTabParamList = {
  [MAIN_TAB_ROUTES.TASKS_TAB]: undefined;
  [MAIN_TAB_ROUTES.PROFILE_TAB]: undefined;
  [MAIN_TAB_ROUTES.SETTINGS_TAB]: undefined; // DÜZELTİLDİ: SETTINGS_TUB -> SETTINGS_TAB
};

// Tasks Stack Param List
export type TasksStackParamList = {
  [TASKS_ROUTES.TASKS_LIST]: undefined;
  [TASKS_ROUTES.TASKS_ACTIVE]: undefined;
  [TASKS_ROUTES.TASKS_COMPLETED]: undefined;
  [TASKS_ROUTES.TASK_DETAILS]: { taskId: string };
  [TASKS_ROUTES.CREATE_TASK]: undefined;
  [TASKS_ROUTES.EDIT_TASK]: { taskId: string };
};

// Profile Stack Param List
export type ProfileStackParamList = {
  [PROFILE_ROUTES.PROFILE_OVERVIEW]: undefined;
  [PROFILE_ROUTES.EDIT_PROFILE]: undefined;
  [PROFILE_ROUTES.PREFERENCES]: undefined;
};