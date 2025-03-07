import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity,
  Alert
} from 'react-native';
import { Card, Button, Divider, ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ProfileStackParamList } from '../../navigation/types';
import { PROFILE_ROUTES } from '../../navigation/routes';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { colors } from '../../utils/theme';
import { Ionicons } from '@expo/vector-icons';

type ProfileOverviewScreenNavigationProp = StackNavigationProp<ProfileStackParamList, 'ProfileOverview'>;

const ProfileOverviewScreen = () => {
  const navigation = useNavigation<ProfileOverviewScreenNavigationProp>();
  const { user, loading, signOut } = useAuth();
  
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
  
  if (loading || !user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Profil yükleniyor...</Text>
      </View>
    );
  }
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          {user.photoURL ? (
            <Image source={{ uri: user.photoURL }} style={styles.profileImage} />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <Text style={styles.profileInitial}>
                {user.displayName ? user.displayName.charAt(0).toUpperCase() : (user.email ? user.email.charAt(0).toUpperCase() : '?')}
              </Text>
            </View>
          )}
          
          <TouchableOpacity 
            style={styles.editImageButton}
            onPress={() => navigation.navigate(PROFILE_ROUTES.EDIT_PROFILE)}
          >
            <Ionicons name="camera" size={16} color="white" />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.userName}>
          {user.displayName || 'İsimsiz Kullanıcı'}
        </Text>
        <Text style={styles.userEmail}>{user.email}</Text>
        
        <Button
          mode="contained"
          icon="account-edit"
          onPress={() => navigation.navigate(PROFILE_ROUTES.EDIT_PROFILE)}
          style={styles.editProfileButton}
        >
          Profili Düzenle
        </Button>
      </View>
      
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Ionicons name="person" size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>Profil Bilgileri</Text>
          </View>
          
          <Divider style={styles.divider} />
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{user.email}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Email Doğrulaması:</Text>
            <View style={styles.verificationContainer}>
              {user.emailVerified ? (
                <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
              ) : (
                <Ionicons name="close-circle" size={16} color="#FF6B6B" />
              )}
              <Text style={[
                styles.verificationText,
                user.emailVerified ? styles.verifiedText : styles.unverifiedText
              ]}>
                {user.emailVerified ? 'Doğrulandı' : 'Doğrulanmadı'}
              </Text>
            </View>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Hesap Oluşturma:</Text>
            <Text style={styles.infoValue}>
              {user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'Bilinmiyor'}
            </Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Son Giriş:</Text>
            <Text style={styles.infoValue}>
              {user.metadata.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleDateString() : 'Bilinmiyor'}
            </Text>
          </View>
        </Card.Content>
      </Card>
      
      <View style={styles.menuCard}>
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate(PROFILE_ROUTES.PREFERENCES)}
        >
          <View style={styles.menuIconContainer}>
            <Ionicons name="settings-outline" size={20} color={colors.primary} />
          </View>
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuTitle}>Tercihler</Text>
            <Text style={styles.menuDescription}>Uygulama tercihlerini değiştirin</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#CCC" />
        </TouchableOpacity>
        
        <Divider />
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={handleSignOut}
        >
          <View style={styles.menuIconContainer}>
            <Ionicons name="log-out-outline" size={20} color="#FF6B6B" />
          </View>
          <View style={styles.menuTextContainer}>
            <Text style={[styles.menuTitle, { color: '#FF6B6B' }]}>Çıkış Yap</Text>
            <Text style={styles.menuDescription}>Hesabınızdan güvenli çıkış yapın</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#CCC" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: '#666',
  },
  header: {
    backgroundColor: colors.primary,
    padding: 24,
    alignItems: 'center',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'white',
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  profileInitial: {
    fontSize: 40,
    color: 'white',
    fontWeight: 'bold',
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 16,
  },
  editProfileButton: {
    backgroundColor: 'white',
  },
  card: {
    margin: 16,
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
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  verificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verificationText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  verifiedText: {
    color: '#4CAF50',
  },
  unverifiedText: {
    color: '#FF6B6B',
  },
  menuCard: {
    backgroundColor: 'white',
    margin: 16,
    marginTop: 0,
    borderRadius: 8,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    marginRight: 12,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  menuDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
});

export default ProfileOverviewScreen;