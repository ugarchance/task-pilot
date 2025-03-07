import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, Switch, RadioButton, Button, Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../utils/theme';
import { Ionicons } from '@expo/vector-icons';

const PreferencesScreen = () => {
  const navigation = useNavigation();
  
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('tr');
  
  const handleSavePreferences = () => {
    // Burada tercih ayarlarını kaydedeceğiz
    navigation.goBack();
  };
  
  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Ionicons name="notifications-outline" size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>Bildirim Ayarları</Text>
          </View>
          
          <Divider style={styles.divider} />
          
          <View style={styles.preferenceItem}>
            <View>
              <Text style={styles.preferenceTitle}>Email Bildirimleri</Text>
              <Text style={styles.preferenceDescription}>
                Önemli güncellemeler için email bildirimleri al
              </Text>
            </View>
            <Switch
              value={emailNotifications}
              onValueChange={setEmailNotifications}
              color={colors.primary}
            />
          </View>
          
          <View style={styles.preferenceItem}>
            <View>
              <Text style={styles.preferenceTitle}>Push Bildirimleri</Text>
              <Text style={styles.preferenceDescription}>
                Görevleriniz hakkında anlık bildirimler al
              </Text>
            </View>
            <Switch
              value={pushNotifications}
              onValueChange={setPushNotifications}
              color={colors.primary}
            />
          </View>
        </Card.Content>
      </Card>
      
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Ionicons name="contrast-outline" size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>Görünüm</Text>
          </View>
          
          <Divider style={styles.divider} />
          
          <View style={styles.radioGroup}>
            <Text style={styles.preferenceTitle}>Tema</Text>
            
            <RadioButton.Group onValueChange={value => setTheme(value)} value={theme}>
              <View style={styles.radioItem}>
                <RadioButton value="light" color={colors.primary} />
                <Text style={styles.radioLabel}>Açık Tema</Text>
              </View>
              
              <View style={styles.radioItem}>
                <RadioButton value="dark" color={colors.primary} />
                <Text style={styles.radioLabel}>Koyu Tema</Text>
              </View>
              
              <View style={styles.radioItem}>
                <RadioButton value="system" color={colors.primary} />
                <Text style={styles.radioLabel}>Sistem Teması</Text>
              </View>
            </RadioButton.Group>
          </View>
        </Card.Content>
      </Card>
      
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Ionicons name="globe-outline" size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>Dil ve Bölge</Text>
          </View>
          
          <Divider style={styles.divider} />
          
          <View style={styles.radioGroup}>
            <Text style={styles.preferenceTitle}>Dil</Text>
            
            <RadioButton.Group onValueChange={value => setLanguage(value)} value={language}>
              <View style={styles.radioItem}>
                <RadioButton value="tr" color={colors.primary} />
                <Text style={styles.radioLabel}>Türkçe</Text>
              </View>
              
              <View style={styles.radioItem}>
                <RadioButton value="en" color={colors.primary} />
                <Text style={styles.radioLabel}>English</Text>
              </View>
            </RadioButton.Group>
          </View>
        </Card.Content>
      </Card>
      
      <Button
        mode="contained"
        onPress={handleSavePreferences}
        style={styles.saveButton}
        contentStyle={styles.buttonContent}
      >
        Kaydet
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  card: {
    margin: 16,
    marginBottom: 8,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  divider: {
    marginBottom: 16,
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  preferenceTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  preferenceDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  radioGroup: {
    marginBottom: 8,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  radioLabel: {
    fontSize: 14,
    marginLeft: 8,
  },
  saveButton: {
    margin: 16,
    backgroundColor: colors.primary,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});

export default PreferencesScreen;