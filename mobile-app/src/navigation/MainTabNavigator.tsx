import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from './types';
import { MAIN_TAB_ROUTES } from './routes';
import TasksNavigator from './TasksNavigator';
import ProfileNavigator from './ProfileNavigator';
import SettingsScreen from '../screens/settings/SettingsScreen';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../utils/theme';

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          borderTopColor: '#E0E0E0',
          backgroundColor: '#FFFFFF',
        },
      }}
    >
      <Tab.Screen
        name={MAIN_TAB_ROUTES.TASKS_TAB}
        component={TasksNavigator}
        options={{
          tabBarLabel: 'Görevler',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name={MAIN_TAB_ROUTES.PROFILE_TAB}
        component={ProfileNavigator}
        options={{
          tabBarLabel: 'Profil',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name={MAIN_TAB_ROUTES.SETTINGS_TAB}
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Ayarlar',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;