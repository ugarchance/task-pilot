import { Stack, Slot } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import * as React from 'react';

export default function RootLayout() {
  return (
    <PaperProvider>
      <Slot />
    </PaperProvider>
  );
} 