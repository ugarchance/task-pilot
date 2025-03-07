import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ProfileStackParamList } from './types';
import { PROFILE_ROUTES } from './routes';

// Ekranları içe aktarıyoruz (henüz oluşturmadık)
import ProfileOverviewScreen from '../screens/profile/ProfileOverviewScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import PreferencesScreen from '../screens/profile/PreferencesScreen';

const Stack = createStackNavigator<ProfileStackParamList>();

const ProfileNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerTintColor: '#004e89',
        cardStyle: { backgroundColor: '#f5f5f5' },
      }}
    >
      <Stack.Screen 
        name="PROFILE_OVERVIEW" 
        component={ProfileOverviewScreen} 
        options={{ title: 'Profil' }}
      />
      <Stack.Screen 
        name="EDIT_PROFILE" 
        component={EditProfileScreen} 
        options={{ title: 'Profili Düzenle' }}
      />
      <Stack.Screen 
        name="PREFERENCES" 
        component={PreferencesScreen} 
        options={{ title: 'Tercihler' }}
      />
    </Stack.Navigator>
  );
};

export default ProfileNavigator;