import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { Card, Button, Divider, Switch, List } from 'react-native-paper';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { colors } from '../../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';

const SettingsScreen = () => {
  const { signOut } = useAuth();
  
  const handleSignOut = async () => {
    Alert.alert(
      'Çıkış Yap',
      'Hesabınızdan çıkış yapmak istediğinize emin misiniz?',
      [
        {
          text: 'İptal',
          style: 'cancel',
        },
        {
          text: 'Çıkış Yap',
          style: 'destructive',
          onPress: async () => {
            await signOut();
          },
        },
      ]
    );
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ayarlar</Text>
        <Text style={styles.headerSubtitle}>Uygulama ayarlarınızı yönetin</Text>
      </View>
      
      <List.Section>
        <List.Subheader>Genel</List.Subheader>
        
        <Card style={styles.card}>
          <List.Item
            title="Profil"
            description="Hesap bilgilerinizi yönetin"
            left={props => <List.Icon {...props} icon="account" color={colors.primary} />}
            right={props => <Ionicons name="chevron-forward" size={20} color="#CCC" />}
          />
          
          <Divider />
          
          <List.Item
            title="Bildirimler"
            description="Bildirim tercihlerinizi ayarlayın"
            left={props => <List.Icon {...props} icon="bell" color={colors.primary} />}
            right={props => <Ionicons name="chevron-forward" size={20} color="#CCC" />}
          />
          
          <Divider />
          
          <List.Item
            title="Görünüm"
            description="Tema ve görsel tercihlerinizi ayarlayın"
            left={props => <List.Icon {...props} icon="palette" color={colors.primary} />}
            right={props => <Ionicons name="chevron-forward" size={20} color="#CCC" />}
          />
          
          <Divider />
          
          <List.Item
            title="Dil"
            description="Uygulama dilini değiştirin"
            left={props => <List.Icon {...props} icon="translate" color={colors.primary} />}
            right={props => <Text style={styles.valueText}>Türkçe</Text>}
          />
        </Card>
      </List.Section>
      
      <List.Section>
        <List.Subheader>Veri ve Gizlilik</List.Subheader>
        
        <Card style={styles.card}>
          <List.Item
            title="Veri Yedekleme"
            description="Verilerinizi yedekleyin ve geri yükleyin"
            left={props => <List.Icon {...props} icon="backup-restore" color={colors.primary} />}
            right={props => <Ionicons name="chevron-forward" size={20} color="#CCC" />}
          />
          
          <Divider />
          
          <List.Item
            title="Gizlilik Ayarları"
            description="Gizlilik tercihlerinizi yönetin"
            left={props => <List.Icon {...props} icon="shield-account" color={colors.primary} />}
            right={props => <Ionicons name="chevron-forward" size={20} color="#CCC" />}
          />
          
          <Divider />
          
          <List.Item
            title="Çerezler"
            description="Çerez kullanım tercihlerinizi ayarlayın"
            left={props => <List.Icon {...props} icon="cookie" color={colors.primary} />}
            right={props => <Switch color={colors.primary} value={true} />}
          />
        </Card>
      </List.Section>
      
      <List.Section>
        <List.Subheader>Uygulama Hakkında</List.Subheader>
        
        <Card style={styles.card}>
          <List.Item
            title="Sürüm"
            description="Uygulama sürüm numarası"
            left={props => <List.Icon {...props} icon="information" color={colors.primary} />}
            right={props => <Text style={styles.valueText}>{Constants.expoConfig?.version || '1.0.0'}</Text>}
          />
          
          <Divider />
          
          <List.Item
            title="Lisans"
            description="Lisans bilgileri"
            left={props => <List.Icon {...props} icon="license" color={colors.primary} />}
            right={props => <Ionicons name="chevron-forward" size={20} color="#CCC" />}
          />
          
          <Divider />
          
          <List.Item
            title="Geri Bildirim"
            description="Görüş ve önerilerinizi paylaşın"
            left={props => <List.Icon {...props} icon="comment" color={colors.primary} />}
            right={props => <Ionicons name="chevron-forward" size={20} color="#CCC" />}
            onPress={() => Linking.openURL('mailto:info@taskpilot.com')}
          />
        </Card>
      </List.Section>
      
      <Button
        mode="outlined"
        icon="logout"
        onPress={handleSignOut}
        style={styles.signOutButton}
        contentStyle={styles.buttonContent}
        color="#FF6B6B"
      >
        Çıkış Yap
      </Button>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>Task Pilot © 2025</Text>
        <Text style={styles.footerText}>Tüm hakları saklıdır.</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 16,
    paddingTop: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 8,
    elevation: 2,
  },
  valueText: {
    fontSize: 14,
    color: '#666',
  },
  signOutButton: {
    margin: 16,
    borderColor: '#FF6B6B',
  },
  buttonContent: {
    paddingVertical: 8,
  },
  footer: {
    padding: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
  },
});

export default SettingsScreen;