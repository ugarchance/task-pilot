import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/hooks/auth/useAuth';
import { theme } from '../../src/utils/theme';

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const router = useRouter();
  const { signup, error } = useAuth();

  const handleSignup = async () => {
    setValidationError(null);
    
    if (!email || !password || !confirmPassword) {
      setValidationError('Tüm alanları doldurun');
      return;
    }

    if (password !== confirmPassword) {
      setValidationError('Şifreler eşleşmiyor');
      return;
    }

    if (password.length < 6) {
      setValidationError('Şifre en az 6 karakter olmalı');
      return;
    }
    
    try {
      setLoading(true);
      await signup(email, password);
      router.replace('/(app)');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Kayıt Ol</Text>
      
      {(error || validationError) && (
        <Text style={styles.error}>{validationError || error}</Text>
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

      <TextInput
        label="Şifre Tekrar"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={styles.input}
      />

      <Button
        mode="contained"
        onPress={handleSignup}
        loading={loading}
        style={styles.button}
      >
        Kayıt Ol
      </Button>

      <Button
        mode="text"
        onPress={() => router.push('/login')}
        style={styles.button}
      >
        Zaten hesabın var mı? Giriş yap
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