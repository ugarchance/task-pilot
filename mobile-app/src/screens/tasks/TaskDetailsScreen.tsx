import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert 
} from 'react-native';
import { 
  Card, 
  Button, 
  Chip, 
  Divider, 
  List, 
  Checkbox,
  ActivityIndicator 
} from 'react-native-paper';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { TasksStackParamList } from '../../navigation/types';
import { TASKS_ROUTES } from '../../navigation/routes';
import { useTasks } from '../../features/tasks/hooks/useTasks';
import { Task, TaskStatus } from '../../features/tasks/types/task';
import { colors } from '../../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { StackNavigationProp } from '@react-navigation/stack';

type TaskDetailsRouteProp = RouteProp<TasksStackParamList, 'TaskDetails'>;
type TasksNavigationProp = StackNavigationProp<TasksStackParamList>;

const STATUS_COLORS = {
  PENDING: '#FFC107',
  IN_PROGRESS: '#2196F3',
  COMPLETED: '#4CAF50',
  CANCELLED: '#F44336',
} as const;

const STATUS_LABELS = {
  PENDING: 'Beklemede',
  IN_PROGRESS: 'Devam Ediyor',
  COMPLETED: 'Tamamlandı',
  CANCELLED: 'İptal Edildi',
} as const;

const TaskDetailsScreen = () => {
  const route = useRoute<TaskDetailsRouteProp>();
  const navigation = useNavigation<TasksNavigationProp>();
  
  if (!route.params?.taskId) {
    navigation.goBack();
    return null;
  }
  
  const { taskId } = route.params;
  const { tasks, loading, updateTaskStatus, deleteTask } = useTasks();
  
  const [task, setTask] = useState<Task | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  
  useEffect(() => {
    const currentTask = tasks.find(t => t.id === taskId);
    if (currentTask) {
      setTask(currentTask);
    }
  }, [taskId, tasks]);
  
  const handleStatusChange = async (newStatus: TaskStatus) => {
    try {
      await updateTaskStatus(taskId, newStatus);
    } catch (error) {
      Alert.alert('Hata', 'Durum güncellenirken bir hata oluştu.');
    }
  };
  
  const handleDelete = async () => {
    if (confirmDelete) {
      try {
        await deleteTask(taskId);
        navigation.goBack();
      } catch (error) {
        Alert.alert('Hata', 'Görev silinirken bir hata oluştu.');
      }
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };
  
  if (loading || !task) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Görev yükleniyor...</Text>
      </View>
    );
  }
  
  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.headerContainer}>
            <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[task.status] }]}>
              <Text style={styles.statusText}>{STATUS_LABELS[task.status]}</Text>
            </View>
            
            <TouchableOpacity
              onPress={() => navigation.navigate(TASKS_ROUTES.EDIT_TASK, { taskId })}
              style={styles.editButton}
            >
              <Ionicons name="create-outline" size={20} color={colors.primary} />
              <Text style={styles.editButtonText}>Düzenle</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.title}>{task.title}</Text>
          
          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Ionicons name="calendar-outline" size={16} color="#666" />
              <Text style={styles.metaText}>
                {format(new Date(task.createdAt), 'dd MMM yyyy, HH:mm', { locale: tr })}
              </Text>
            </View>
            
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={16} color="#666" />
              <Text style={styles.metaText}>
                Son Güncel: {format(new Date(task.updatedAt), 'dd MMM yyyy, HH:mm', { locale: tr })}
              </Text>
            </View>
          </View>
          
          <Divider style={styles.divider} />
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Açıklama</Text>
            <Text style={styles.description}>{task.description}</Text>
          </View>
          
          {task.tags && task.tags.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Etiketler</Text>
              <View style={styles.tagsContainer}>
                {task.tags.map((tag: string) => (
                  <Chip key={tag} style={styles.tag}>{tag}</Chip>
                ))}
              </View>
            </View>
          )}
          
          {task.subTasks && task.subTasks.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Alt Görevler</Text>
              <View style={styles.subTasksContainer}>
                {task.subTasks.map((subTask: Task) => (
                  <View key={subTask.id} style={styles.subTaskItem}>
                    <Checkbox
                      status={subTask.status === 'COMPLETED' ? 'checked' : 'unchecked'}
                      disabled
                    />
                    <View style={styles.subTaskContent}>
                      <Text style={[
                        styles.subTaskTitle,
                        subTask.status === 'COMPLETED' && styles.completedText
                      ]}>
                        {subTask.title}
                      </Text>
                      {subTask.description && (
                        <Text style={styles.subTaskDescription}>{subTask.description}</Text>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}
          
          {task.prompt && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Görev Promptu</Text>
              <Card style={styles.promptCard}>
                <Card.Content>
                  <Text style={styles.promptText}>{task.prompt}</Text>
                </Card.Content>
              </Card>
            </View>
          )}
        </Card.Content>
      </Card>
      
      <View style={styles.actionsContainer}>
        <Text style={styles.sectionTitle}>Durum Değiştir</Text>
        
        <View style={styles.statusButtonsContainer}>
          <Button
            mode={task.status === 'PENDING' ? 'contained' : 'outlined'}
            onPress={() => handleStatusChange('PENDING')}
            style={[
              styles.statusButton,
              task.status === 'PENDING' && { backgroundColor: STATUS_COLORS.PENDING }
            ]}
            labelStyle={task.status === 'PENDING' ? { color: 'white' } : { color: STATUS_COLORS.PENDING }}
          >
            Beklemede
          </Button>
          
          <Button
            mode={task.status === 'IN_PROGRESS' ? 'contained' : 'outlined'}
            onPress={() => handleStatusChange('IN_PROGRESS')}
            style={[
              styles.statusButton,
              task.status === 'IN_PROGRESS' && { backgroundColor: STATUS_COLORS.IN_PROGRESS }
            ]}
            labelStyle={task.status === 'IN_PROGRESS' ? { color: 'white' } : { color: STATUS_COLORS.IN_PROGRESS }}
          >
            Devam Ediyor
          </Button>
          
          <Button
            mode={task.status === 'COMPLETED' ? 'contained' : 'outlined'}
            onPress={() => handleStatusChange('COMPLETED')}
            style={[
              styles.statusButton,
              task.status === 'COMPLETED' && { backgroundColor: STATUS_COLORS.COMPLETED }
            ]}
            labelStyle={task.status === 'COMPLETED' ? { color: 'white' } : { color: STATUS_COLORS.COMPLETED }}
          >
            Tamamlandı
          </Button>
          
          <Button
            mode={task.status === 'CANCELLED' ? 'contained' : 'outlined'}
            onPress={() => handleStatusChange('CANCELLED')}
            style={[
              styles.statusButton,
              task.status === 'CANCELLED' && { backgroundColor: STATUS_COLORS.CANCELLED }
            ]}
            labelStyle={task.status === 'CANCELLED' ? { color: 'white' } : { color: STATUS_COLORS.CANCELLED }}
          >
            İptal Edildi
          </Button>
        </View>
      </View>
      
      <Button
        mode="outlined"
        onPress={handleDelete}
        style={styles.deleteButton}
        contentStyle={styles.deleteButtonContent}
        icon={confirmDelete ? "alert" : "delete"}
      >
        {confirmDelete ? "Silmek için tekrar dokunun" : "Görevi Sil"}
      </Button>
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
  card: {
    margin: 16,
    elevation: 2,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButtonText: {
    color: colors.primary,
    marginLeft: 4,
    fontSize: 14,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  metaText: {
    color: '#666',
    fontSize: 12,
    marginLeft: 4,
  },
  divider: {
    marginBottom: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    margin: 4,
  },
  subTasksContainer: {
    borderWidth: 1,
    borderColor: '#EEE',
    borderRadius: 8,
  },
  subTaskItem: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  subTaskContent: {
    flex: 1,
    marginLeft: 8,
  },
  subTaskTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  subTaskDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  promptCard: {
    backgroundColor: '#F9F9F9',
  },
  promptText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#555',
  },
  actionsContainer: {
    margin: 16,
    marginTop: 0,
  },
  statusButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  statusButton: {
    margin: 4,
    flex: 1,
    minWidth: '45%',
  },
  deleteButton: {
    marginHorizontal: 16,
    marginBottom: 32,
    borderColor: '#FF6B6B',
  },
  deleteButtonContent: {
    paddingVertical: 8,
  },
});

export default TaskDetailsScreen;