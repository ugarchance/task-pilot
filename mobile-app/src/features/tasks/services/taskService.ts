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
  import { db, auth } from '../../../core/firebase/config';
  import { Task, TaskStatus } from '../types/task';
  
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
          createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
          updatedAt: data.updatedAt?.toDate().toISOString() || new Date().toISOString(),
          tags: data.tags || [],
          subTasks: data.subTasks || [],
          progress: data.progress || { done: [], todo: [] }
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
          createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
          updatedAt: data.updatedAt?.toDate().toISOString() || new Date().toISOString(),
          tags: data.tags || [],
          subTasks: data.subTasks || [],
          progress: data.progress || { done: [], todo: [] }
        } as Task;
      });
    }
  
    async createTask(data: { 
      title: string; 
      description: string; 
      prompt?: string;
      status?: TaskStatus;
      tags?: string[];
      subTasks?: Task[];
      progress?: { done: string[]; todo: string[] };
    }): Promise<Task> {
      const userId = this.getUserId();
      const tasksRef = this.getTasksCollection(userId);
      
      const now = Timestamp.now();
      const newTask = {
        ...data,
        userId,
        prompt: data.prompt || '',
        status: data.status || 'PENDING',
        tags: data.tags || [],
        subTasks: data.subTasks || [],
        progress: data.progress || { done: [], todo: [] },
        createdAt: now,
        updatedAt: now
      };
      
      const docRef = await addDoc(tasksRef, newTask);
      return {
        id: docRef.id,
        ...newTask,
        createdAt: now.toDate().toISOString(),
        updatedAt: now.toDate().toISOString()
      } as Task;
    }
  
    async updateTaskStatus(taskId: string, status: TaskStatus): Promise<Task> {
      const userId = this.getUserId();
      const taskRef = doc(db, `users/${userId}/tasks/${taskId}`);
      
      const updatedAt = Timestamp.now();
      await updateDoc(taskRef, {
        status,
        updatedAt
      });
      
      const updatedDoc = await getDoc(taskRef);
      const docData = updatedDoc.data();
      
      return {
        id: updatedDoc.id,
        ...docData,
        createdAt: docData?.createdAt?.toDate().toISOString() || new Date().toISOString(),
        updatedAt: updatedAt.toDate().toISOString(),
        tags: docData?.tags || [],
        subTasks: docData?.subTasks || [],
        progress: docData?.progress || { done: [], todo: [] }
      } as Task;
    }
  
    async updateTask(
      taskId: string, 
      data: { 
        title?: string; 
        description?: string; 
        prompt?: string; 
        status?: TaskStatus;
        tags?: string[];
        subTasks?: Task[];
        progress?: { done: string[]; todo: string[] };
      }
    ): Promise<Task> {
      const userId = this.getUserId();
      const taskRef = doc(db, `users/${userId}/tasks/${taskId}`);
      
      const updatedAt = Timestamp.now();
      const updateData = {
        ...data,
        updatedAt
      };
      
      await updateDoc(taskRef, updateData);
      
      const updatedDoc = await getDoc(taskRef);
      const docData = updatedDoc.data();
      
      return { 
        id: updatedDoc.id,
        ...docData,
        createdAt: docData?.createdAt?.toDate().toISOString() || new Date().toISOString(),
        updatedAt: updatedAt.toDate().toISOString(),
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
          createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
          updatedAt: data.updatedAt?.toDate().toISOString() || new Date().toISOString(),
          tags: data.tags || [],
          subTasks: data.subTasks || [],
          progress: data.progress || { done: [], todo: [] }
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
          createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
          updatedAt: data.updatedAt?.toDate().toISOString() || new Date().toISOString(),
          tags: data.tags || [],
          subTasks: data.subTasks || [],
          progress: data.progress || { done: [], todo: [] }
        } as Task;
      });
    }
  }
  
  export const taskService = new TaskService();