import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { RootStackParamList } from './types';
import { ROOT_ROUTES } from './routes';
import AuthNavigator from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';
import { ActivityIndicator, View } from 'react-native';
import { auth } from '../core/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { RootState } from '../store';
import { colors } from '../utils/theme';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const [initializing, setInitializing] = useState(true);
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, () => {
      if (initializing) setInitializing(false);
    });

    return unsubscribe;
  }, []);

  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name={ROOT_ROUTES.MAIN} component={MainTabNavigator} />
        ) : (
          <Stack.Screen name={ROOT_ROUTES.AUTH} component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;