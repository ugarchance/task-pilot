import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthStackParamList } from './types';
import { AUTH_ROUTES } from './routes'; // AUTH_ROUTES ekledik

// Ekranları dinamik olarak içe aktaralım
const LoginScreen = React.lazy(() => import('../screens/auth/LoginScreen'));
const RegisterScreen = React.lazy(() => import('../screens/auth/RegisterScreen'));
const ForgotPasswordScreen = React.lazy(() => import('../screens/auth/ForgotPasswordScreen'));
const VerifyEmailScreen = React.lazy(() => import('../screens/auth/VerifyEmailScreen'));

const Stack = createStackNavigator<AuthStackParamList>();

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#FFFFFF' },
      }}
    >
      <Stack.Screen name={AUTH_ROUTES.LOGIN} component={LoginScreen} />
      <Stack.Screen name={AUTH_ROUTES.REGISTER} component={RegisterScreen} />
      <Stack.Screen name={AUTH_ROUTES.FORGOT_PASSWORD} component={ForgotPasswordScreen} />
      <Stack.Screen name={AUTH_ROUTES.VERIFY_EMAIL} component={VerifyEmailScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;