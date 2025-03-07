import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/types';
import { AUTH_ROUTES } from '../../navigation/routes';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { colors } from '../../utils/theme';
import { Ionicons } from '@expo/vector-icons';

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, typeof AUTH_ROUTES.LOGIN>;

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { login, loading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = () => {
    if (!email.trim()) {
      setEmailError('Email adresi gereklidir');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Geçerli bir email adresi giriniz');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = () => {
    if (!password.trim()) {
      setPasswordError('Şifre gereklidir');
      return false;
    }
    if (password.length < 6) {
      setPasswordError('Şifre en az 6 karakter olmalıdır');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleLogin = async () => {
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    
    if (isEmailValid && isPasswordValid) {
      await login(email, password);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <View style={styles.logoBackground}>
              <Ionicons name="list" size={36} color={colors.primary} />
            </View>
            <Text style={styles.logoText}>Task Pilot</Text>
          </View>
          
          <Text style={styles.title}>Hoş Geldiniz</Text>
          <Text style={styles.subtitle}>Görevlerinizi yönetmek artık çok daha kolay</Text>
          
          <View style={styles.formContainer}>
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              onBlur={validateEmail}
              error={!!emailError}
              keyboardType="email-address"
              autoCapitalize="none"
              left={<TextInput.Icon icon="email" />}
              style={styles.input}
            />
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
            
            <TextInput
              label="Şifre"
              value={password}
              onChangeText={setPassword}
              onBlur={validatePassword}
              error={!!passwordError}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              left={<TextInput.Icon icon="lock" />}
              right={
                <TextInput.Icon
                  icon={showPassword ? "eye-off" : "eye"}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
              style={styles.input}
            />
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
            
            <Button
              mode="contained"
              onPress={handleLogin}
              loading={loading}
              disabled={loading}
              style={styles.loginButton}
              contentStyle={styles.buttonContent}
            >
              {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
            </Button>
            
            <TouchableOpacity 
              onPress={() => navigation.navigate(AUTH_ROUTES.FORGOT_PASSWORD)}
              style={styles.forgotPasswordButton}
            >
              <Text style={styles.forgotPasswordText}>Şifremi Unuttum</Text>
            </TouchableOpacity>
            
            <View style={styles.orContainer}>
              <View style={styles.divider} />
              <Text style={styles.orText}>VEYA</Text>
              <View style={styles.divider} />
            </View>
          </View>
          
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Hesabınız yok mu?</Text>
            <TouchableOpacity onPress={() => navigation.navigate(AUTH_ROUTES.REGISTER)}>
              <Text style={styles.registerButton}>Şimdi Kaydolun</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#0A0F1C',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  logoBackground: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#AAAAAA',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 40,
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  input: {
    marginBottom: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 12,
    marginBottom: 8,
    marginTop: -4,
  },
  loginButton: {
    marginTop: 16,
    backgroundColor: colors.primary,
  },
  buttonContent: {
    paddingVertical: 6,
  },
  forgotPasswordButton: {
    alignSelf: 'center',
    marginTop: 16,
  },
  forgotPasswordText: {
    color: '#AAAAAA',
    fontSize: 14,
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  orText: {
    marginHorizontal: 10,
    color: '#AAAAAA',
    fontSize: 12,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  registerText: {
    color: '#AAAAAA',
    fontSize: 14,
    marginRight: 4,
  },
  registerButton: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default LoginScreen;