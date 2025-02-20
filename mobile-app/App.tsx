import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { useAuth } from './src/hooks/auth/useAuth';
import { initializeApp } from 'firebase/app';



export default function App() {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {!user ? (
        <LoginScreen />
      ) : (
        <View style={styles.container}>
          {/* Burada mevcut task oluşturma ekranınız olmalı */}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
