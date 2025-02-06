import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Avatar, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/auth/useAuth';

export default function ProfileScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/');
    } catch (error) {
      console.error('Çıkış yapılırken hata oluştu:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Avatar.Text
        size={80}
        label={user?.email?.[0].toUpperCase() || 'U'}
        style={styles.avatar}
      />
      <Text variant="headlineSmall" style={styles.email}>
        {user?.email}
      </Text>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text variant="headlineMedium" style={{ color: theme.colors.primary }}>
            0
          </Text>
          <Text variant="bodyMedium">Tamamlanan</Text>
        </View>
        <View style={styles.statItem}>
          <Text variant="headlineMedium" style={{ color: theme.colors.primary }}>
            0
          </Text>
          <Text variant="bodyMedium">Devam Eden</Text>
        </View>
        <View style={styles.statItem}>
          <Text variant="headlineMedium" style={{ color: theme.colors.primary }}>
            0
          </Text>
          <Text variant="bodyMedium">Bekleyen</Text>
        </View>
      </View>

      <Button
        mode="contained"
        onPress={handleLogout}
        style={styles.logoutButton}
      >
        Çıkış Yap
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  avatar: {
    marginBottom: 16,
  },
  email: {
    marginBottom: 32,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 40,
  },
  statItem: {
    alignItems: 'center',
  },
  logoutButton: {
    width: '100%',
  },
}); 