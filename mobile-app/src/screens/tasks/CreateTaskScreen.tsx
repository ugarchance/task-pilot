import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  Alert
} from 'react-native';
import { 
  TextInput, 
  Button, 
  Chip, 
  SegmentedButtons,
  Divider,
  IconButton
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useTasks } from '../../features/tasks/hooks/useTasks';
import { colors } from '../../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { TaskStatus } from '../../features/tasks/types/task';

const CreateTaskScreen = () => {
  const navigation = useNavigation();
  const { createTask, loading } = useTasks();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [prompt, setPrompt] = useState('');
  const [status, setStatus] = useState('PENDING');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  
  const [titleError, setTitleError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  
  const validateTitle = () => {
    if (!title.trim()) {
      setTitleError('Başlık gereklidir');
      return false;
    }
    setTitleError('');
    return true;
  };
  
  const validateDescription = () => {
    if (!description.trim()) {
      setDescriptionError('Açıklama gereklidir');
      return false;
    }
    setDescriptionError('');
    return true;
  };
  
  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };
  
  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };
  
  const handleSubmit = async () => {
    const isValidTitle = validateTitle();
    const isValidDescription = validateDescription();
    
    if (isValidTitle && isValidDescription) {
      try {
        await createTask({ 
          title, 
          description, 
          prompt,
          status: status as TaskStatus,
          tags,
          subTasks: [],
          progress: { done: [], todo: [] }
        });
        Alert.alert('Başarılı', 'Görev başarıyla oluşturuldu.');
        navigation.goBack();
      } catch (error) {
        Alert.alert('Hata', 'Görev oluşturulurken bir hata oluştu.');
      }
    }
  };
  
  const renderTagInput = () => (
    <View style={styles.tagInputContainer}>
      <TextInput
        label="Etiket Ekle"
        value={newTag}
        onChangeText={setNewTag}
        style={styles.tagInput}
        right={
          <TextInput.Icon 
            icon="plus"
            onPress={handleAddTag}
          />
        }
        onSubmitEditing={handleAddTag}
      />
    </View>
  );
  
  const renderTags = () => (
    <View style={styles.tagsContainer}>
      {tags.map(tag => (
        <Chip 
          key={tag}
          style={styles.tag}
          onClose={() => handleRemoveTag(tag)}
        >
          {tag}
        </Chip>
      ))}
      {tags.length === 0 && (
        <Text style={styles.noTagsText}>Henüz etiket eklenmemiş</Text>
      )}
    </View>
  );
  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <TextInput
            label="Görev Başlığı *"
            value={title}
            onChangeText={setTitle}
            onBlur={validateTitle}
            error={!!titleError}
            style={styles.input}
          />
          {titleError ? <Text style={styles.errorText}>{titleError}</Text> : null}
          
          <TextInput
            label="Görev Açıklaması *"
            value={description}
            onChangeText={setDescription}
            onBlur={validateDescription}
            error={!!descriptionError}
            multiline
            numberOfLines={4}
            style={[styles.input, styles.textArea]}
          />
          {descriptionError ? <Text style={styles.errorText}>{descriptionError}</Text> : null}
          
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Durum</Text>
            <SegmentedButtons
              value={status}
              onValueChange={setStatus}
              buttons={[
                {
                  value: 'PENDING',
                  label: 'Beklemede',
                },
                {
                  value: 'IN_PROGRESS',
                  label: 'Devam Ediyor',
                },
                {
                  value: 'COMPLETED',
                  label: 'Tamamlandı',
                },
              ]}
              style={styles.segmentedButtons}
            />
          </View>
          
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Etiketler</Text>
            {renderTagInput()}
            {renderTags()}
          </View>
          
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Görev Promptu (İsteğe Bağlı)</Text>
            <TextInput
              value={prompt}
              onChangeText={setPrompt}
              multiline
              numberOfLines={6}
              placeholder="Görevle ilgili ayrıntılı bilgileri buraya girebilirsiniz..."
              style={[styles.input, styles.textArea]}
            />
          </View>
          
          <View style={styles.buttonContainer}>
            <Button
              mode="outlined"
              onPress={() => navigation.goBack()}
              style={styles.button}
              contentStyle={styles.buttonContent}
            >
              İptal
            </Button>
            <Button
              mode="contained"
              onPress={handleSubmit}
              loading={loading}
              disabled={loading}
              style={[styles.button, styles.primaryButton]}
              contentStyle={styles.buttonContent}
            >
              {loading ? 'Kaydediliyor...' : 'Kaydet'}
            </Button>
          </View>
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
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    elevation: 2,
  },
  input: {
    marginBottom: 12,
    backgroundColor: 'white',
  },
  textArea: {
    minHeight: 100,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 12,
    marginTop: -8,
    marginBottom: 12,
  },
  sectionContainer: {
    marginTop: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  segmentedButtons: {
    marginBottom: 8,
  },
  tagInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tagInput: {
    flex: 1,
    backgroundColor: 'white',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tag: {
    margin: 4,
  },
  noTagsText: {
    color: '#999',
    fontStyle: 'italic',
    margin: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});

export default CreateTaskScreen;