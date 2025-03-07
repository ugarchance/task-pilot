import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity 
} from 'react-native';
import { Card, Button, ActivityIndicator, Chip } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TasksStackParamList } from '../../navigation/types';
import { TASKS_ROUTES } from '../../navigation/routes';
import { useTasks } from '../../features/tasks/hooks/useTasks';
import { colors } from '../../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { Task } from '../../features/tasks/types/task';

type TasksCompletedScreenNavigationProp = StackNavigationProp<TasksStackParamList, 'TasksCompleted'>;

const TasksCompletedScreen = () => {
  const navigation = useNavigation<TasksCompletedScreenNavigationProp>();
  const { tasks, loading, fetchCompletedTasks } = useTasks();
  
  useEffect(() => {
    fetchCompletedTasks();
  }, [fetchCompletedTasks]);
  
  const renderItem = ({ item }: { item: Task }) => (
    <Card 
      style={styles.taskCard}
      onPress={() => navigation.navigate(TASKS_ROUTES.TASK_DETAILS, { taskId: item.id })}
    >
      <Card.Content>
        <View style={styles.taskHeader}>
          <Text style={styles.taskTitle}>{item.title}</Text>
          <Chip
            style={[styles.statusChip, { backgroundColor: '#4CAF50' }]}
            textStyle={{ color: 'white' }}
          >
            Tamamlandı
          </Chip>
        </View>
        
        <Text style={styles.taskDescription} numberOfLines={2}>
          {item.description}
        </Text>
        
        <View style={styles.taskFooter}>
          <View style={styles.taskMeta}>
            <Ionicons name="checkmark-circle" size={14} color="#4CAF50" />
            <Text style={styles.taskCompletedDate}>
              {format(new Date(item.updatedAt), 'dd MMM yyyy')} tarihinde tamamlandı
            </Text>
          </View>
          
          <Button
            mode="text"
            onPress={() => navigation.navigate(TASKS_ROUTES.TASK_DETAILS, { taskId: item.id })}
            style={styles.detailsButton}
            labelStyle={styles.detailsButtonLabel}
          >
            Detaylar
          </Button>
        </View>
      </Card.Content>
    </Card>
  );
  
  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="checkbox-outline" size={64} color="#DDDDDD" />
      <Text style={styles.emptyTitle}>Tamamlanan Görev Yok</Text>
      <Text style={styles.emptyText}>
        Henüz tamamlanmış görev bulunmuyor. Görevlerinizi tamamladıkça burada listelenecektir.
      </Text>
    </View>
  );
  
  return (
    <View style={styles.container}>
      {loading && tasks.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Görevler yükleniyor...</Text>
        </View>
      ) : (
        <FlatList
          data={tasks}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={renderEmptyList}
        />
      )}
    </View>
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
  listContainer: {
    padding: 16,
    paddingBottom: 16,
    flexGrow: 1,
  },
  taskCard: {
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  statusChip: {
    height: 24,
    alignSelf: 'flex-start',
  },
  taskDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  taskCompletedDate: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
    flex: 1,
  },
  detailsButton: {
    marginRight: -8,
  },
  detailsButtonLabel: {
    fontSize: 12,
    marginVertical: 0,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default TasksCompletedScreen;