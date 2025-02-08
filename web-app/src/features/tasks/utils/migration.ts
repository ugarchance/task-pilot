import { 
  collection, 
  getDocs, 
  addDoc, 
  deleteDoc,
  doc,
  Timestamp,
  query,
  orderBy
} from 'firebase/firestore';
import { db, auth } from '@/core/firebase/config';
import { Task } from '../types';

export async function migrateTasks() {
  try {
    // Kullanıcı kontrolü
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Kullanıcı oturum açmamış');
    }

    // Eski koleksiyondan tüm görevleri al
    const oldTasksRef = collection(db, 'tasks');
    const q = query(oldTasksRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    // Yeni koleksiyon referansı
    const newTasksRef = collection(db, `users/${user.uid}/tasks`);

    // Her görevi yeni koleksiyona taşı
    for (const doc of snapshot.docs) {
      const taskData = doc.data();
      
      // Yeni görevi oluştur
      await addDoc(newTasksRef, {
        ...taskData,
        userId: user.uid,
        createdAt: taskData.createdAt || Timestamp.now(),
        updatedAt: Timestamp.now()
      });

      // Eski görevi sil
      await deleteDoc(doc.ref);
    }

    console.log(`${snapshot.docs.length} görev başarıyla taşındı.`);
    return true;
  } catch (error) {
    console.error('Görev taşıma işlemi başarısız:', error);
    throw error;
  }
} 