import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/hooks/auth/useAuth';
import { theme } from '../../src/utils/theme';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login, error } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) return;
    
    try {
      setLoading(true);
      await login(email, password);
      router.replace('/(app)');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Giriş Yap</Text>
      
      {error && (
        <Text style={styles.error}>{error}</Text>
      )}

      <TextInput
        label="E-posta"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />

      <TextInput
        label="Şifre"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <Button
        mode="contained"
        onPress={handleLogin}
        loading={loading}
        style={styles.button}
      >
        Giriş Yap
      </Button>

      <Button
        mode="text"
        onPress={() => router.push('/signup')}
        style={styles.button}
      >
        Hesabın yok mu? Kayıt ol
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: theme.colors.background,
  },
  title: {
    textAlign: 'center',
    marginBottom: 30,
    color: theme.colors.primary,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
  },
  error: {
    color: theme.colors.error,
    textAlign: 'center',
    marginBottom: 15,
  },
}); 