import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, AuthUser } from '../types';

const initialState: AuthState = {
  user: null,
  loading: true,
  error: null,
};


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AuthUser | null>) => { // Burayı güncelleyin
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    signOut: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
    },
  },
});
export const { setUser, setLoading, setError, signOut } = authSlice.actions;
export default authSlice.reducer; 