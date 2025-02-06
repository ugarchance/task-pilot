import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Task, TaskStatus } from '@/types';

interface TaskCardProps {
  task: Task;
  onPress: () => void;
}

const getStatusColor = (status: TaskStatus) => {
  switch (status) {
    case TaskStatus.COMPLETED:
      return '#4CAF50';
    case TaskStatus.IN_PROGRESS:
      return '#2196F3';
    case TaskStatus.PENDING:
      return '#FFC107';
    default:
      return '#9E9E9E';
  }
};

const getStatusText = (status: TaskStatus) => {
  switch (status) {
    case TaskStatus.COMPLETED:
      return 'Tamamlandı';
    case TaskStatus.IN_PROGRESS:
      return 'Devam Ediyor';
    case TaskStatus.PENDING:
      return 'Bekliyor';
    default:
      return 'Bilinmiyor';
  }
};

export function TaskCard({ task, onPress }: TaskCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.title}>{task.title}</Text>
        <View
          style={[
            styles.statusChip,
            { backgroundColor: getStatusColor(task.status) },
          ]}
        >
          <Text style={styles.statusText}>{getStatusText(task.status)}</Text>
        </View>
      </View>
      <Text style={styles.description} numberOfLines={2}>
        {task.description}
      </Text>
      <Text style={styles.date}>
        {format(new Date(task.dueDate), 'd MMMM yyyy', { locale: tr })}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  statusChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
}); 