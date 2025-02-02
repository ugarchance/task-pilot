import { View } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { Link } from 'expo-router';
import { styles } from '../src/utils/styles';

export default function Home() {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Task Pilot</Text>
      <Text variant="bodyLarge" style={styles.subtitle}>
        Görevlerinizi yönetin, zamanınızı planlayın
      </Text>
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={() => {}}
          style={styles.button}
        >
          Giriş Yap
        </Button>
        <Button
          mode="outlined"
          onPress={() => {}}
          style={styles.button}
        >
          Kayıt Ol
        </Button>
      </View>
    </View>
  );
} 