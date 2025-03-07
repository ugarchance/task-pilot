import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Searchbar, FAB, Chip, Badge, Card, ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TasksStackParamList } from '../../navigation/types';
import { TASKS_ROUTES } from '../../navigation/routes';
import { useTasks } from '../../features/tasks/hooks/useTasks';
import { colors } from '../../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Task } from '../../features/tasks/types/task';

type TasksListScreenNavigationProp = StackNavigationProp<TasksStackParamList, 'TasksList'>;

// Status renklerini tanımlayalım
const STATUS_COLORS = {
  PENDING: '#FFC107',
  IN_PROGRESS: '#2196F3',
  COMPLETED: '#4CAF50',
  CANCELLED: '#F44336',
};

const STATUS_LABELS = {
  PENDING: 'Beklemede',
  IN_PROGRESS: 'Devam Ediyor',
  COMPLETED: 'Tamamlandı',
  CANCELLED: 'İptal Edildi',
};

const TasksListScreen = () => {
  const navigation = useNavigation<TasksListScreenNavigationProp>();
  const { tasks, loading, fetchTasks } = useTasks();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Filtreleme fonksiyonu
  const filteredTasks = tasks.filter(task => {
    // Arama sorgusu filtresi
    const matchesSearch = 
      searchQuery === '' || 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Durum filtresi
    const matchesStatus = 
      statusFilter === null || 
      task.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Durum filtreleme çipleri
  const renderFilterChips = () => (
    <View style={styles.chipContainer}>
      <Chip
        selected={statusFilter === null}
        onPress={() => setStatusFilter(null)}
        style={styles.chip}
        textStyle={{ color: statusFilter === null ? 'white' : 'gray' }}
      >
        Tümü
      </Chip>
      <Chip
        selected={statusFilter === 'PENDING'}
        onPress={() => setStatusFilter('PENDING')}
        style={[
          styles.chip,
          statusFilter === 'PENDING' && { backgroundColor: 'rgba(255, 193, 7, 0.2)' }
        ]}
        textStyle={{ color: statusFilter === 'PENDING' ? STATUS_COLORS.PENDING : 'gray' }}
      >
        Beklemede
      </Chip>
      <Chip
        selected={statusFilter === 'IN_PROGRESS'}
        onPress={() => setStatusFilter('IN_PROGRESS')}
        style={[
          styles.chip,
          statusFilter === 'IN_PROGRESS' && { backgroundColor: 'rgba(33, 150, 243, 0.2)' }
        ]}
        textStyle={{ color: statusFilter === 'IN_PROGRESS' ? STATUS_COLORS.IN_PROGRESS : 'gray' }}
      >
        Devam Ediyor
      </Chip>
      <Chip
        selected={statusFilter === 'COMPLETED'}
        onPress={() => setStatusFilter('COMPLETED')}
        style={[
          styles.chip,
          statusFilter === 'COMPLETED' && { backgroundColor: 'rgba(76, 175, 80, 0.2)' }
        ]}
        textStyle={{ color: statusFilter === 'COMPLETED' ? STATUS_COLORS.COMPLETED : 'gray' }}
      >
        Tamamlandı
      </Chip>
    </View>
  );

  // Görev içerik kartı
  const renderTaskItem = ({ item }: { item: Task }) => (
    <Card 
      style={styles.taskCard}
      onPress={() => navigation.navigate(TASKS_ROUTES.TASK_DETAILS, { taskId: item.id })}
    >
      <Card.Content>
        <View style={styles.taskHeader}>
          <View style={styles.taskTitleContainer}>
            <Text style={styles.taskTitle}>{item.title}</Text>
            <Badge 
              style={[
                styles.statusBadge, 
                { backgroundColor: STATUS_COLORS[item.status] }
              ]}
            >
              {STATUS_LABELS[item.status]}
            </Badge>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate(TASKS_ROUTES.EDIT_TASK, { taskId: item.id })}
          >
            <Ionicons name="create-outline" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.taskDescription} numberOfLines={2}>
          {item.description}
        </Text>
        
        {item.tags && item.tags.length > 0 && (
          <View style={styles.tagContainer}>
            {item.tags.map(tag => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
        
        <View style={styles.taskFooter}>
          <View style={styles.taskMetaInfo}>
            <Ionicons name="time-outline" size={14} color="#666" />
            <Text style={styles.taskDate}>
              {formatDistanceToNow(new Date(item.createdAt), { 
                addSuffix: true,
                locale: tr
              })}
            </Text>
          </View>
          {item.subTasks && item.subTasks.length > 0 && (
            <View style={styles.taskMetaInfo}>
              <Ionicons name="list-outline" size={14} color="#666" />
              <Text style={styles.taskDate}>
                {item.subTasks.length} Alt görev
              </Text>
            </View>
          )}
        </View>
      </Card.Content>
    </Card>
  );

  // Boş liste durumu
  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="clipboard-outline" size={64} color="#CCCCCC" />
      <Text style={styles.emptyTitle}>Görev Bulunamadı</Text>
      <Text style={styles.emptyText}>
        {searchQuery || statusFilter
          ? 'Arama kriterlerinize uygun görev bulunamadı.'
          : 'Henüz görev eklenmemiş. Yeni görev eklemek için + butonuna tıklayın.'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Görevlerde ara..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          iconColor={colors.primary}
        />
      </View>
      
      {renderFilterChips()}
      
      {loading && tasks.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Görevler yükleniyor...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredTasks}
          keyExtractor={item => item.id}
          renderItem={renderTaskItem}
          ListEmptyComponent={renderEmptyList}
          contentContainerStyle={styles.listContainer}
        />
      )}
      
      <FAB
        style={styles.fab}
        icon="plus"
        color="white"
        onPress={() => navigation.navigate(TASKS_ROUTES.CREATE_TASK)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  searchBar: {
    elevation: 0,
    backgroundColor: '#F5F5F5',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80,
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
  taskTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
    flex: 1,
  },
  statusBadge: {
    alignSelf: 'flex-start',
  },
  taskDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tag: {
    backgroundColor: '#EEEEEE',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 6,
    marginBottom: 6,
  },
  tagText: {
    fontSize: 12,
    color: '#666666',
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  taskMetaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskDate: {
    fontSize: 12,
    color: '#666666',
    marginLeft: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: '#666666',
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
    color: '#666666',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
  },
});

export default TasksListScreen;