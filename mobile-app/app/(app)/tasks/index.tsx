import { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { TaskCard } from '@/components/tasks/TaskCard';
import { useTasks } from '@/hooks/tasks/useTasks';
import { Task } from '@/types';
import { commonStyles } from '../../../src/utils/styles';

export default function TaskListScreen() {
    const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const { loading, error, listTasks } = useTasks();

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const fetchedTasks = await listTasks();
      setTasks(fetchedTasks);
    } catch (err) {
      // Error state is handled by the hook
    }
  };

  const renderItem = ({ item }: { item: Task }) => (
    <TaskCard task={item} onPress={() => router.push(`/tasks/${item.id}`)} />
  );

  if (loading && tasks.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error && tasks.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, commonStyles.container]}>
      <FlatList
        data={tasks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshing={loading}
        onRefresh={loadTasks}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  list: {
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginHorizontal: 20,
  },
}); 