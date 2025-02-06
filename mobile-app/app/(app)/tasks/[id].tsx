import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Button, SegmentedButtons } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { useTasks } from '@/hooks/tasks/useTasks';
import { Task, TaskStatus } from '@/types';

export default function TaskDetailScreen() {
    const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [task, setTask] = useState<Task | null>(null);
  const { loading, error, updateTaskStatus, deleteTask, listTasks } = useTasks();

  useEffect(() => {
    loadTask();
  }, [id]);

  const loadTask = async () => {
    try {
      const tasks = await listTasks();
      const foundTask = tasks.find((t) => t.id === id);
      if (foundTask) {
        setTask(foundTask);
      } else {
        Alert.alert('Hata', 'Görev bulunamadı');
        router.back();
      }
    } catch (err) {
      // Error state is handled by the hook
    }
  };

  const handleStatusChange = async (newStatus: TaskStatus) => {
    if (!task) return;

    try {
      await updateTaskStatus(task.id, newStatus);
      setTask({ ...task, status: newStatus });
    } catch (err) {
      // Error state is handled by the hook
    }
  };

  const handleDelete = async () => {
    if (!task) return;

    Alert.alert(
      'Görevi Sil',
      'Bu görevi silmek istediğinizden emin misiniz?',
      [
        {
          text: 'İptal',
          style: 'cancel',
        },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTask(task.id);
              router.back();
            } catch (err) {
              // Error state is handled by the hook
            }
          },
        },
      ]
    );
  };

  if (!task) {
    return (
      <View style={styles.centered}>
        <Text>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          {task.title}
        </Text>

        <Text variant="bodyLarge" style={styles.description}>
          {task.description}
        </Text>

        <Text variant="bodyMedium" style={styles.date}>
          Bitiş Tarihi: {format(new Date(task.dueDate), 'd MMMM yyyy', { locale: tr })}
        </Text>

        <SegmentedButtons
          value={task.status}
          onValueChange={(value) => handleStatusChange(value as TaskStatus)}
          buttons={[
            {
              value: TaskStatus.PENDING,
              label: 'Bekliyor',
            },
            {
              value: TaskStatus.IN_PROGRESS,
              label: 'Devam Ediyor',
            },
            {
              value: TaskStatus.COMPLETED,
              label: 'Tamamlandı',
            },
          ]}
          style={styles.statusButtons}
        />

        {error && <Text style={styles.error}>{error}</Text>}

        <Button
          mode="contained-tonal"
          onPress={handleDelete}
          loading={loading}
          style={styles.deleteButton}
          textColor="red"
        >
          Görevi Sil
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginBottom: 16,
  },
  description: {
    marginBottom: 16,
  },
  date: {
    marginBottom: 24,
    color: '#666',
  },
  statusButtons: {
    marginBottom: 24,
  },
  deleteButton: {
    marginTop: 8,
  },
  error: {
    color: 'red',
    marginBottom: 16,
    textAlign: 'center',
  },
}); 