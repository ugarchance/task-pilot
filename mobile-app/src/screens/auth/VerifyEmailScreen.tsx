import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/types';
import { AUTH_ROUTES } from '../../navigation/routes';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { colors } from '../../utils/theme';
import { Ionicons } from '@expo/vector-icons';

type VerifyEmailScreenNavigationProp = StackNavigationProp<
  AuthStackParamList, 
  typeof AUTH_ROUTES.VERIFY_EMAIL
>;

const VerifyEmailScreen = () => {
  const navigation = useNavigation<VerifyEmailScreenNavigationProp>();
  const { sendVerificationEmail, checkEmailVerification, user, loading } = useAuth();
  const [verifying, setVerifying] = useState(false);

  const handleSendVerificationEmail = async () => {
    await sendVerificationEmail();
  };

  const handleCheckVerification = async () => {
    setVerifying(true);
    const isVerified = await checkEmailVerification();
    if (isVerified) {
      navigation.navigate(AUTH_ROUTES.LOGIN);
    }
    setVerifying(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <View style={styles.logoBackground}>
            <Ionicons name="mail" size={36} color={colors.primary} />
          </View>
          <Text style={styles.logoText}>Email Doğrulama</Text>
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Doğrulama Gerekiyor</Text>
          <Text style={styles.infoText}>
            {user?.email || 'Email adresinize'} gönderilen doğrulama
            bağlantısına tıklayarak hesabınızı etkinleştirin.
          </Text>
          
          <View style={styles.noticeContainer}>
            <Ionicons name="information-circle" size={20} color="#FFC107" />
            <Text style={styles.noticeText}>
              Email gelmedi mi? Spam klasörünüzü kontrol edin veya
              yeni bir doğrulama emaili gönderin.
            </Text>
          </View>
          
          <Button
            mode="contained"
            onPress={handleSendVerificationEmail}
            loading={loading}
            disabled={loading}
            style={styles.sendButton}
            contentStyle={styles.buttonContent}
          >
            {loading ? 'Gönderiliyor...' : 'Yeni Doğrulama Emaili Gönder'}
          </Button>
          
          <Button
            mode="outlined"
            onPress={handleCheckVerification}
            loading={verifying}
            disabled={verifying}
            style={styles.checkButton}
            contentStyle={styles.buttonContent}
          >
            {verifying ? 'Kontrol Ediliyor...' : 'Doğrulama Durumunu Kontrol Et'}
          </Button>
        </View>
        
        <View style={styles.backContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate(AUTH_ROUTES.LOGIN)}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={20} color="white" />
            <Text style={styles.backText}>Giriş Sayfasına Dön</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
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
  infoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 16,
  },
  infoText: {
    color: '#AAAAAA',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  noticeContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  noticeText: {
    color: '#CCCCCC',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  sendButton: {
    marginBottom: 12,
    backgroundColor: colors.primary,
  },
  checkButton: {
    borderColor: colors.primary,
  },
  buttonContent: {
    paddingVertical: 6,
  },
  backContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 14,
  },
});

export default VerifyEmailScreen;