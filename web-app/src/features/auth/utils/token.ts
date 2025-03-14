import { auth } from '@/core/firebase/config';
import { User } from 'firebase/auth'; 
import Cookies from 'js-cookie';

// Firebase Hosting'de cookie adı '__session' olmalı
const AUTH_TOKEN_KEY = '__session';

export const setAuthToken = async (user: User | null) => { 
  if (!user) {
    return;
  }

  const token = await user.getIdToken(); 
  Cookies.set(AUTH_TOKEN_KEY, token, {
    expires: 7,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
};

export const removeAuthToken = () => {
  Cookies.remove(AUTH_TOKEN_KEY, { path: '/' });
};

export const getAuthToken = () => {
  return Cookies.get(AUTH_TOKEN_KEY);
};

export const refreshAuthToken = async () => {
  const currentUser = auth.currentUser;
  if (currentUser) {
    await setAuthToken(currentUser); 
  }
};