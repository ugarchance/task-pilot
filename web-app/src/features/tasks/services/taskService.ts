import { Task, TaskStatus } from '../types';

export class TaskService {
  private readonly baseUrl = '/tasks/api';

  // Tüm görevleri getir
  async getAllTasks(): Promise<Task[]> {
    const response = await fetch(this.baseUrl);
    if (!response.ok) {
      throw new Error('Görevler getirilemedi');
    }
    return response.json();
  }

  // Aktif görevleri getir
  async getActiveTasks(): Promise<Task[]> {
    const tasks = await this.getAllTasks();
    return tasks.filter(task => task.status === 'IN_PROGRESS');
  }

  // Tamamlanmış görevleri getir
  async getCompletedTasks(): Promise<Task[]> {
    const tasks = await this.getAllTasks();
    return tasks.filter(task => task.status === 'COMPLETED');
  }

  // Yeni görev oluştur
  async createTask(data: { title: string; description: string }): Promise<Task> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        status: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    });

    if (!response.ok) {
      throw new Error('Görev oluşturulamadı');
    }

    return response.json();
  }

  // Görev durumunu güncelle
  async updateTaskStatus(taskId: string, status: TaskStatus): Promise<Task> {
    const response = await fetch(`${this.baseUrl}/${taskId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        status,
        updatedAt: new Date()
      }),
    });

    if (!response.ok) {
      throw new Error('Görev durumu güncellenemedi');
    }

    return response.json();
  }

  // Görevi güncelle
  async updateTask(taskId: string, data: { title: string; description: string; status: TaskStatus }): Promise<Task> {
    const response = await fetch(`${this.baseUrl}/${taskId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        updatedAt: new Date()
      }),
    });

    if (!response.ok) {
      throw new Error('Görev güncellenemedi');
    }

    return response.json();
  }

  // Görevi sil
  async deleteTask(taskId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${taskId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Görev silinemedi');
    }
  }
}

// Singleton instance
export const taskService = new TaskService(); 