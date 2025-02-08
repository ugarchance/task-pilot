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
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate().toISOString(),
      updatedAt: doc.data().updatedAt.toDate().toISOString()
    } as Task));
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
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate().toISOString(),
      updatedAt: doc.data().updatedAt.toDate().toISOString()
    } as Task));
  }

  async createTask(data: { title: string; description: string }): Promise<Task> {
    const userId = this.getUserId();
    const tasksRef = this.getTasksCollection(userId);
    
    const now = Timestamp.now();
    const newTask = {
      ...data,
      userId,
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
    data: { title: string; description: string; status: TaskStatus }
  ): Promise<Task> {
    const userId = this.getUserId();
    const taskRef = doc(db, `users/${userId}/tasks/${taskId}`);
    
    await updateDoc(taskRef, {
      ...data,
      updatedAt: Timestamp.now()
    });
    
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
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate().toISOString(),
      updatedAt: doc.data().updatedAt.toDate().toISOString()
    } as Task));
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
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate().toISOString(),
      updatedAt: doc.data().updatedAt.toDate().toISOString()
    } as Task));
  }
}

export const taskService = new TaskService(); 