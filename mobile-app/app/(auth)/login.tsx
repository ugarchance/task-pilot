import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { useAuth } from '../../src/hooks/auth/useAuth';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import { useRouter } from 'expo-router';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
  withSpring,
  useAnimatedStyle,
  withSequence,
  useSharedValue,
} from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function Login() {
  const { login, signup, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const shakeAnimation = useSharedValue(0);
  const formPosition = useSharedValue(0);

  const handleAuth = async () => {
    try {
      setLoading(true);
      if (isLogin) {
        await login(email, password);
        router.replace('/(app)');
      } else {
        await signup(email, password);
        router.replace('/(app)');
      }
    } catch (error) {
      shakeAnimation.value = withSequence(
        withSpring(10),
        withSpring(-10),
        withSpring(0)
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await loginWithGoogle();
      router.replace('/(app)');
    } catch (error) {
      shakeAnimation.value = withSequence(
        withSpring(10),
        withSpring(-10),
        withSpring(0)
      );
    } finally {
      setLoading(false);
    }
  };

  const formAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: shakeAnimation.value },
      { translateY: formPosition.value }
    ],
  }));

  const switchForm = () => {
    formPosition.value = withSequence(
      withSpring(10),
      withSpring(0)
    );
    setIsLogin(!isLogin);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar style="light" />
      <LinearGradient
        colors={['#1a1c1e', '#111827']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            {loading ? (
              <Animated.View
                entering={FadeIn}
                exiting={FadeOut}
                style={styles.loadingContainer}
              >
                <LottieView
                  source={require('../../assets/loading.json')}
                  autoPlay
                  loop
                  style={styles.lottie}
                />
              </Animated.View>
            ) : (
              <Animated.View
                entering={SlideInDown}
                exiting={SlideOutDown}
                style={[styles.formContainer, formAnimatedStyle]}
              >
                <View style={styles.glassContainer}>
                  <View style={styles.logoContainer}>
                    <View style={styles.iconContainer}>
                      <MaterialCommunityIcons name="cube-outline" size={40} color="#fff" />
                    </View>
                    <Text style={styles.logoText}>Task Pilot</Text>
                    <Text style={styles.subtitle}>Görevlerinizi yönetmek artık çok daha kolay</Text>
                  </View>

                  <View style={styles.inputContainer}>
                    <View style={styles.inputWrapper}>
                      <MaterialCommunityIcons name="email-outline" size={24} color="rgba(255,255,255,0.7)" style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor="rgba(255,255,255,0.7)"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                      />
                    </View>
                    <View style={styles.inputWrapper}>
                      <MaterialCommunityIcons name="lock-outline" size={24} color="rgba(255,255,255,0.7)" style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder="Şifre"
                        placeholderTextColor="rgba(255,255,255,0.7)"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                      />
                    </View>
                  </View>

                  <AnimatedTouchable
                    style={styles.button}
                    onPress={handleAuth}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={['#1a73e8', '#1557b0']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.buttonGradient}
                    >
                      <Text style={styles.buttonText}>
                        {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
                      </Text>
                    </LinearGradient>
                  </AnimatedTouchable>

                  <View style={styles.dividerContainer}>
                    <View style={styles.divider} />
                    <Text style={styles.dividerText}>VEYA</Text>
                    <View style={styles.divider} />
                  </View>

                  <TouchableOpacity
                    style={styles.googleButton}
                    onPress={handleGoogleLogin}
                    activeOpacity={0.8}
                  >
                    <MaterialCommunityIcons name="google" size={24} color="#DB4437" style={styles.googleIcon} />
                    <Text style={styles.googleButtonText}>
                      Google ile Devam Et
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={switchForm}
                    style={styles.switchButton}
                  >
                    <Text style={styles.switchText}>
                      {isLogin
                        ? "Hesabınız yok mu? Kayıt Olun"
                        : 'Zaten hesabınız var mı? Giriş Yapın'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            )}
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    padding: 20,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
  },
  glassContainer: {
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 24,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 56,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  inputIcon: {
    marginLeft: 16,
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: '100%',
    color: '#fff',
    fontSize: 16,
    paddingRight: 16,
  },
  button: {
    width: '100%',
    height: 56,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#1a73e8',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  buttonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  switchButton: {
    marginTop: 8,
    padding: 8,
  },
  switchText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  lottie: {
    width: 150,
    height: 150,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  dividerText: {
    color: 'rgba(255,255,255,0.5)',
    marginHorizontal: 16,
    fontSize: 12,
    fontWeight: '500',
  },
  googleButton: {
    width: '100%',
    height: 56,
    backgroundColor: '#fff',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  googleIcon: {
    marginRight: 12,
  },
  googleButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
}); 