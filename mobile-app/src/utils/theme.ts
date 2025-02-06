import { MD3LightTheme as DefaultTheme, MD3Theme } from 'react-native-paper';

export const theme: MD3Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#004e89',
    secondary: '#ff6b35',
    background: '#efefd0',
    surface: '#ffffff',
    error: '#ba1a1a',
    onPrimary: '#ffffff',
    onSecondary: '#ffffff',
    onBackground: '#1a1c1e',
    onSurface: '#1a1c1e',
    onError: '#ffffff',
  },
}; 