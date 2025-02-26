import { DefaultTheme } from 'react-native-paper';

// Web tarafındaki renk paletini kullanıyoruz
export const colors = {
  primary: '#004e89',
  secondary: '#ff6b35',
  background: '#efefd0',
  accent: '#f7c59f',
  text: '#1a659e',
  success: '#4CAF50',
  warning: '#FFC107',
  danger: '#F44336',
};

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    accent: colors.accent,
    background: colors.background,
    text: colors.text,
    surface: '#ffffff',
    error: colors.danger,
  },
  dark: false,
};