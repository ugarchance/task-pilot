import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  Alert
} from 'react-native';
import { TextInput, Button, ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { colors } from '../../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const { user, loading } = useAuth();
  
  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  
  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
      setPhotoURL(user.photoURL || '');
    }
  }, [user]);
  
  const handleImagePicker = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert(
          'İzin Gerekli',
          'Galeriye erişim izni gerekiyor',
          [{ text: 'Tamam' }]
        );
        return;
      }
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });
      
      if (!result.canceled) {
        setUploadingImage(true);
        // Burada fotoğrafı Firebase Storage'a yükleyip URL'ini alacağız
        // Şimdilik sadece local olarak gösteriyoruz
        setPhotoURL(result.assets[0].uri);
        setUploadingImage(false);
      }
    } catch (error) {
      setUploadingImage(false);
      Alert.alert('Hata', 'Fotoğraf seçilirken bir hata oluştu');
    }
  };
  
  const handleUpdate = async () => {
    Alert.alert('Bilgi', 'Güncelleme özelliği henüz eklenmedi.');
    // Burada profil güncelleme işlemini yapacağız
  };
  
  if (loading && !user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      </View>
    );
  }
  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.profileImageContainer}>
          {uploadingImage ? (
            <View style={styles.profileImagePlaceholder}>
              <ActivityIndicator color={colors.primary} />
            </View>
          ) : photoURL ? (
            <Image source={{ uri: photoURL }} style={styles.profileImage} />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <Text style={styles.profileInitial}>
                {displayName ? displayName.charAt(0).toUpperCase() : (user?.email ? user.email.charAt(0).toUpperCase() : '?')}
              </Text>
            </View>
          )}
          
          <TouchableOpacity 
            style={styles.editImageButton}
            onPress={handleImagePicker}
            disabled={uploadingImage}
          >
            <Ionicons name="camera" size={20} color="white" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.formContainer}>
          <TextInput
            label="İsim"
            value={displayName}
            onChangeText={setDisplayName}
            style={styles.input}
          />
          
          <TextInput
            label="Email"
            value={user?.email || ''}
            disabled
            style={styles.input}
          />
          
          <Button
            mode="contained"
            onPress={handleUpdate}
            loading={loading}
            disabled={loading}
            style={styles.updateButton}
            contentStyle={styles.buttonContent}
          >
            {loading ? 'Güncelleniyor...' : 'Güncelle'}
          </Button>
          
          <Button
            mode="outlined"
            onPress={() => navigation.goBack()}
            style={styles.cancelButton}
            contentStyle={styles.buttonContent}
          >
            İptal
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginVertical: 24,
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: 'white',
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#DDDDDD',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  profileInitial: {
    fontSize: 48,
    color: '#999999',
    fontWeight: 'bold',
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: '35%',
    backgroundColor: colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    elevation: 2,
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'white',
  },
  updateButton: {
    marginTop: 16,
    backgroundColor: colors.primary,
  },
  cancelButton: {
    marginTop: 12,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});

export default EditProfileScreen;