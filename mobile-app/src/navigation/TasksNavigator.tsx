import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TasksStackParamList } from './types';
import { TASKS_ROUTES } from './routes';

// Ekranları içe aktarıyoruz (henüz oluşturmadık)
import TasksListScreen from '../screens/tasks/TasksListScreen';
import TasksActiveScreen from '../screens/tasks/TasksActiveScreen';
import TasksCompletedScreen from '../screens/tasks/TasksCompletedScreen';
import TaskDetailsScreen from '../screens/tasks/TaskDetailsScreen';
import CreateTaskScreen from '../screens/tasks/CreateTaskScreen';
import EditTaskScreen from '../screens/tasks/EditTaskScreen';

const Stack = createStackNavigator<TasksStackParamList>();

const TasksNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerTintColor: '#004e89',
        cardStyle: { backgroundColor: '#f5f5f5' },
      }}
    >
      <Stack.Screen 
        name={TASKS_ROUTES.TASKS_LIST} 
        component={TasksListScreen} 
        options={{ title: 'Tüm Görevler' }}
      />
      <Stack.Screen 
        name={TASKS_ROUTES.TASKS_ACTIVE} 
        component={TasksActiveScreen} 
        options={{ title: 'Aktif Görevler' }}
      />
      <Stack.Screen 
        name={TASKS_ROUTES.TASKS_COMPLETED} 
        component={TasksCompletedScreen} 
        options={{ title: 'Tamamlanan Görevler' }}
      />
      <Stack.Screen 
        name={TASKS_ROUTES.TASK_DETAILS} 
        component={TaskDetailsScreen} 
        options={{ title: 'Görev Detayı' }}
      />
      <Stack.Screen 
        name={TASKS_ROUTES.CREATE_TASK} 
        component={CreateTaskScreen} 
        options={{ title: 'Yeni Görev' }}
      />
      <Stack.Screen 
        name={TASKS_ROUTES.EDIT_TASK} 
        component={EditTaskScreen} 
        options={{ title: 'Görevi Düzenle' }}
      />
    </Stack.Navigator>
  );
};

export default TasksNavigator;