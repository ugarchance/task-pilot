import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  orderBy,
  Timestamp,
  getDoc
} from 'firebase/firestore';
import { db } from '@/core/firebase/config';
import { auth } from '@/core/firebase/config';
import { Task, TaskStatus } from '../types';

class TaskService {
  private getUserId(): string {
    const user = auth.currentUser;
    if (!user) throw new Error('Kullanıcı oturum açmamış');
    return user.uid;
  }

  private getTasksCollection(userId: string) {
    return collection(db, `users/${userId}/tasks`);
  }

  async getAllTasks(): Promise<Task[]> {
    const userId = this.getUserId();
    const tasksRef = this.getTasksCollection(userId);
    const q = query(tasksRef, orderBy('createdAt', 'desc'));
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        prompt: data.prompt || '',
        createdAt: data.createdAt.toDate().toISOString(),
        updatedAt: data.updatedAt.toDate().toISOString()
      } as Task;
    });
  }

  async getTasksByStatus(status: TaskStatus): Promise<Task[]> {
    const userId = this.getUserId();
    const tasksRef = this.getTasksCollection(userId);
    const q = query(
      tasksRef,
      where('status', '==', status),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        prompt: data.prompt || '',
        createdAt: data.createdAt.toDate().toISOString(),
        updatedAt: data.updatedAt.toDate().toISOString()
      } as Task;
    });
  }

  async createTask(data: { 
    title: string; 
    description: string; 
    prompt?: string;
    tags?: string[];
    subTasks?: { id: string; title: string; completed: boolean }[];
    progress?: { done: string[]; todo: string[] };
  }): Promise<Task> {
    const userId = this.getUserId();
    const tasksRef = this.getTasksCollection(userId);
    
    const now = Timestamp.now();
    const newTask = {
      ...data,
      userId,
      prompt: data.prompt || '',
      tags: data.tags || [],
      subTasks: data.subTasks || [],
      progress: data.progress || { done: [], todo: [] },
      status: 'PENDING' as TaskStatus,
      createdAt: now,
      updatedAt: now
    };
    
    const docRef = await addDoc(tasksRef, newTask);
    return {
      id: docRef.id,
      ...newTask,
      createdAt: now.toDate().toISOString(),
      updatedAt: now.toDate().toISOString()
    };
  }

  async updateTaskStatus(taskId: string, status: TaskStatus): Promise<Task> {
    const userId = this.getUserId();
    const taskRef = doc(db, `users/${userId}/tasks/${taskId}`);
    
    await updateDoc(taskRef, {
      status,
      updatedAt: Timestamp.now()
    });
    
    const updatedDoc = await getDoc(taskRef);
    const docData = updatedDoc.data();
    
    return {
      id: updatedDoc.id,
      ...docData,
      createdAt: docData?.createdAt.toDate().toISOString(),
      updatedAt: docData?.updatedAt.toDate().toISOString(),
      userId: userId
    } as Task;
  }

  async updateTask(
    taskId: string, 
    data: { 
      title: string; 
      description: string; 
      prompt?: string; 
      status: TaskStatus;
      tags?: string[];
      subTasks?: { id: string; title: string; completed: boolean }[];
      progress?: { done: string[]; todo: string[] };
    }
  ): Promise<Task> {
    const userId = this.getUserId();
    const taskRef = doc(db, `users/${userId}/tasks/${taskId}`);
    
    const updateData = {
      ...data,
      prompt: data.prompt || '',
      tags: data.tags || [],
      subTasks: data.subTasks || [],
      progress: data.progress || { done: [], todo: [] },
      updatedAt: Timestamp.now()
    };
    
    await updateDoc(taskRef, updateData);
    
    const updatedDoc = await getDoc(taskRef);
    const docData = updatedDoc.data();
    
    return { 
      id: updatedDoc.id,
      ...docData,
      createdAt: docData?.createdAt?.toDate().toISOString() ?? Timestamp.now().toDate().toISOString(),
      updatedAt: docData?.updatedAt?.toDate().toISOString() ?? Timestamp.now().toDate().toISOString(),
      userId: userId
    } as Task;
  }

  async deleteTask(taskId: string): Promise<void> {
    const userId = this.getUserId();
    const taskRef = doc(db, `users/${userId}/tasks/${taskId}`);
    await deleteDoc(taskRef);
  }

  async getActiveTasks(): Promise<Task[]> {
    const userId = this.getUserId();
    const tasksRef = this.getTasksCollection(userId);
    const q = query(
      tasksRef,
      where('status', 'in', ['PENDING', 'IN_PROGRESS']),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        prompt: data.prompt || '',
        createdAt: data.createdAt.toDate().toISOString(),
        updatedAt: data.updatedAt.toDate().toISOString()
      } as Task;
    });
  }

  async getCompletedTasks(): Promise<Task[]> {
    const userId = this.getUserId();
    const tasksRef = this.getTasksCollection(userId);
    const q = query(
      tasksRef,
      where('status', '==', 'COMPLETED'),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        prompt: data.prompt || '',
        createdAt: data.createdAt.toDate().toISOString(),
        updatedAt: data.updatedAt.toDate().toISOString()
      } as Task;
    });
  }

  async getTasksByTag(tag: string): Promise<Task[]> {
    const userId = this.getUserId();
    const tasksRef = this.getTasksCollection(userId);
    const q = query(
      tasksRef,
      where('tags', 'array-contains', tag),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        prompt: data.prompt || '',
        createdAt: data.createdAt.toDate().toISOString(),
        updatedAt: data.updatedAt.toDate().toISOString()
      } as Task;
    });
  }

  async getAllTags(): Promise<string[]> {
    const tasks = await this.getAllTasks();
    const tagsSet = new Set<string>();
    tasks.forEach(task => {
      task.tags.forEach(tag => tagsSet.add(tag));
    });
    return Array.from(tagsSet);
  }
}

export const taskService = new TaskService(); 