import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // ... başlangıç durumu
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    // ... reducer'lar
  },
});

export const { actions, reducer } = profileSlice;
export default reducer; 