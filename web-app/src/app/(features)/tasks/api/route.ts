import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/core/firebase/config';
import { collection, getDocs, addDoc, getDoc, doc, query, orderBy, updateDoc } from 'firebase/firestore';
import { createTaskSchema } from '@/features/tasks/validation/taskSchema';
import { TASK_STATUSES, TaskStatus } from '@/features/tasks/types';

// GET /tasks/api - Tüm görevleri getir
export async function GET() {
  try {
    const tasksRef = collection(db, 'tasks');
    const tasksQuery = query(tasksRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(tasksQuery);
    
    const tasks = snapshot.docs.map(docSnapshot => {
      const data = docSnapshot.data();
      const status = data.status;

      // Status değeri geçerli mi kontrol et
      const isValidStatus = TASK_STATUSES.includes(status as TaskStatus);
      
      // Geçerli değilse PENDING yap ve veritabanını güncelle
      if (!isValidStatus) {
        const taskRef = doc(db, 'tasks', docSnapshot.id);
        updateDoc(taskRef, {
          status: 'PENDING',
          updatedAt: new Date()
        }).catch(error => {
          console.error('Status düzeltilirken hata:', error);
        });
      }

      return {
        id: docSnapshot.id,
        title: data.title || '',
        description: data.description || '',
        status: isValidStatus ? status : 'PENDING',
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date()
      };
    });
    
    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Görevler getirilirken hata:', error);
    return NextResponse.json(
      { error: 'Görevler getirilemedi' },
      { status: 500 }
    );
  }
}

// POST /tasks/api - Yeni görev ekle
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Veri doğrulama
    const validationResult = createTaskSchema.safeParse(data);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Geçersiz görev verisi', details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const taskData = validationResult.data;
    const tasksRef = collection(db, 'tasks');
    
    // Yeni görevi oluştur
    const docRef = await addDoc(tasksRef, {
      ...taskData,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Oluşturulan görevi getir
    const taskDoc = await getDoc(docRef);
    if (!taskDoc.exists()) {
      return NextResponse.json(
        { error: 'Görev oluşturulamadı' },
        { status: 500 }
      );
    }

    const newTaskData = taskDoc.data();
    // Task verisini döndür
    return NextResponse.json({
      id: taskDoc.id,
      title: newTaskData.title || '',
      description: newTaskData.description || '',
      status: newTaskData.status || 'PENDING',
      createdAt: newTaskData.createdAt?.toDate() || new Date(),
      updatedAt: newTaskData.updatedAt?.toDate() || new Date()
    });
  } catch (error) {
    console.error('Görev eklenirken hata:', error);
    return NextResponse.json(
      { error: 'Görev eklenemedi' },
      { status: 500 }
    );
  }
} 