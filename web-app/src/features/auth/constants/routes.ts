export const AUTH_ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
} as const;

export const PROTECTED_ROUTES = {
  TASKS: '/tasks',
  PROFILE: '/profile',
  SETTINGS: '/settings',
} as const;

export const PUBLIC_ROUTES = [
  AUTH_ROUTES.LOGIN,
  AUTH_ROUTES.REGISTER,
  AUTH_ROUTES.FORGOT_PASSWORD,
] as const; 