// Auth rotaları
export const AUTH_ROUTES = {
  LOGIN: 'LOGIN',
  REGISTER: 'REGISTER',
  FORGOT_PASSWORD: 'FORGOT_PASSWORD',
  VERIFY_EMAIL: 'VERIFY_EMAIL',
} as const;

// Ana sekme rotaları
export const MAIN_TAB_ROUTES = {
  TASKS_TAB: 'TasksTab',
  PROFILE_TAB: 'ProfileTab',
  SETTINGS_TAB: 'SettingsTab', 
} as const;

// Görev rotaları
export const TASKS_ROUTES = {
  TASKS_LIST: 'TasksList',
  TASKS_ACTIVE: 'TasksActive',
  TASKS_COMPLETED: 'TasksCompleted',
  TASK_DETAILS: 'TaskDetails',
  CREATE_TASK: 'CreateTask',
  EDIT_TASK: 'EditTask',
} as const;

// Profil rotaları
export const PROFILE_ROUTES = {
  PROFILE_OVERVIEW: 'PROFILE_OVERVIEW',
  EDIT_PROFILE: 'EDIT_PROFILE',
  PREFERENCES: 'PREFERENCES',
} as const;

// Root rotaları
export const ROOT_ROUTES = {
  AUTH: 'Auth',
  MAIN: 'Main',
} as const;