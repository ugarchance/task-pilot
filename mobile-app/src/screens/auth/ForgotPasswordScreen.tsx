import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { colors } from '../../utils/theme';
import { Ionicons } from '@expo/vector-icons';

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const { resetPassword, loading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

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

  const handleResetPassword = async () => {
    if (validateEmail()) {
      const success = await resetPassword(email);
      if (success) {
        setIsSubmitted(true);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          
          <View style={styles.logoContainer}>
            <View style={styles.logoBackground}>
              <Ionicons name="key" size={36} color={colors.primary} />
            </View>
            <Text style={styles.logoText}>Şifre Sıfırlama</Text>
          </View>
          
          {isSubmitted ? (
            <View style={styles.successContainer}>
              <Ionicons name="checkmark-circle" size={60} color={colors.primary} />
              <Text style={styles.successTitle}>İşlem Başarılı</Text>
              <Text style={styles.successMessage}>
                Şifre sıfırlama bağlantısı {email} adresine gönderildi. 
                Lütfen email kutunuzu kontrol edin.
              </Text>
              <Button
                mode="contained"
                onPress={() => navigation.goBack()}
                style={styles.backToLoginButton}
              >
                Giriş Sayfasına Dön
              </Button>
            </View>
          ) : (
            <View style={styles.formContainer}>
              <Text style={styles.instruction}>
                Şifrenizi sıfırlamak için kayıtlı email adresinizi girin. 
                Size bir sıfırlama bağlantısı göndereceğiz.
              </Text>
              
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
              
              <Button
                mode="contained"
                onPress={handleResetPassword}
                loading={loading}
                disabled={loading}
                style={styles.resetButton}
                contentStyle={styles.buttonContent}
              >
                {loading ? 'Gönderiliyor...' : 'Sıfırlama Bağlantısı Gönder'}
              </Button>
            </View>
          )}
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
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 80,
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
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  instruction: {
    color: '#AAAAAA',
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
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
  resetButton: {
    marginTop: 16,
    backgroundColor: colors.primary,
  },
  buttonContent: {
    paddingVertical: 6,
  },
  successContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 16,
  },
  successMessage: {
    color: '#AAAAAA',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
    marginBottom: 24,
  },
  backToLoginButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
  },
});

export default ForgotPasswordScreen;