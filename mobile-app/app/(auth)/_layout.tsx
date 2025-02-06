import { Stack } from 'expo-router';
import { theme } from '../../src/utils/theme';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: '#fff',
        headerBackTitle: 'Geri',
      }}
    />
  );
} 