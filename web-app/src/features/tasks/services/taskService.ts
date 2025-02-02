import { Task, TaskStatus } from '../types';

export class TaskService {
  async updateTaskStatus(taskId: string, status: TaskStatus): Promise<Task> {
    const response = await fetch(`/api/tasks/${taskId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error('Failed to update task status');
    }

    return response.json();
  }

  async updateTask(taskId: string, data: { title: string; description: string; status: TaskStatus }): Promise<Task> {
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update task');
    }

    return response.json();
  }

  async deleteTask(taskId: string): Promise<void> {
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete task');
    }
  }
}

export const taskService = new TaskService(); 