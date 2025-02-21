import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/core/firebase/config';
import { collection, getDocs, addDoc, getDoc, doc, query, orderBy, updateDoc, where, deleteDoc } from 'firebase/firestore';
import { createTaskSchema } from '@/features/tasks/validation/taskSchema';
import { TASK_STATUSES, TaskStatus } from '@/features/tasks/types';
import { getAuth } from 'firebase-admin/auth';
import { initAdmin } from '@/core/firebase/admin';
import { Timestamp } from 'firebase/firestore';

// Firebase Admin'i initialize et
initAdmin();

// Kullanıcı kontrolü için yardımcı fonksiyon
async function getCurrentUser(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  
  if (!token) {
    throw new Error('Oturum açmanız gerekiyor');
  }

  try {
    const decodedToken = await getAuth().verifyIdToken(token);
    return { uid: decodedToken.uid };
  } catch (error) {
    throw new Error('Geçersiz oturum');
  }
}

// GET /tasks/api - Kullanıcının görevlerini getir
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    const tasksRef = collection(db, `users/${user.uid}/tasks`);
    const tasksQuery = query(tasksRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(tasksQuery);
    
    const tasks = snapshot.docs.map(docSnapshot => {
      const data = docSnapshot.data();
      const status = data.status;

      // Status değeri geçerli mi kontrol et
      const isValidStatus = TASK_STATUSES.includes(status as TaskStatus);
      
      // Geçerli değilse PENDING yap ve veritabanını güncelle
      if (!isValidStatus) {
        const taskRef = doc(db, `users/${user.uid}/tasks`, docSnapshot.id);
        updateDoc(taskRef, {
          status: 'PENDING',
          updatedAt: new Date().toISOString()
        }).catch(error => {
          console.error('Status düzeltilirken hata:', error);
        });
      }

      return {
        id: docSnapshot.id,
        title: data.title || '',
        description: data.description || '',
        prompt: data.prompt || '',
        status: isValidStatus ? status : 'PENDING',
        createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate().toISOString() || new Date().toISOString(),
        userId: user.uid
      };
    });
    
    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Görevler getirilirken hata:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Görevler getirilemedi' },
      { status: error instanceof Error && error.message.includes('Oturum') ? 401 : 500 }
    );
  }
}

// POST /tasks/api - Yeni görev ekle
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
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
    const tasksRef = collection(db, `users/${user.uid}/tasks`);
    
    const now = Timestamp.now();
    
    // Yeni görevi oluştur
    const docRef = await addDoc(tasksRef, {
      ...taskData,
      userId: user.uid,
      prompt: taskData.prompt || '',
      createdAt: now,
      updatedAt: now
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
      prompt: newTaskData.prompt || '',
      status: newTaskData.status || 'PENDING',
      createdAt: now,
      updatedAt: now,
      userId: user.uid
    });
  } catch (error) {
    console.error('Görev eklenirken hata:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Görev eklenemedi' },
      { status: error instanceof Error && error.message.includes('Oturum') ? 401 : 500 }
    );
  }
}

// PATCH /tasks/api - Görev güncelle
export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    const { taskId, status, title, description } = await request.json();

    if (!taskId) {
      return NextResponse.json(
        { error: 'Task ID gereklidir' },
        { status: 400 }
      );
    }

    const taskRef = doc(db, `users/${user.uid}/tasks`, taskId);
    const taskDoc = await getDoc(taskRef);

    if (!taskDoc.exists()) {
      return NextResponse.json(
        { error: 'Görev bulunamadı' },
        { status: 404 }
      );
    }

    // Görevin kullanıcıya ait olduğunu kontrol et
    const taskData = taskDoc.data();
    if (taskData.userId !== user.uid) {
      return NextResponse.json(
        { error: 'Bu görevi güncelleme yetkiniz yok' },
        { status: 403 }
      );
    }

    const updateData: any = { updatedAt: new Date().toISOString() };

    // Status güncellemesi
    if (status) {
      if (!TASK_STATUSES.includes(status as TaskStatus)) {
        return NextResponse.json(
          { error: 'Geçerli bir durum değeri gereklidir' },
          { status: 400 }
        );
      }
      updateData.status = status;
    }

    // Title ve description güncellemesi
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    
    await updateDoc(taskRef, updateData);

    return NextResponse.json({ 
      success: true,
      message: 'Görev güncellendi'
    });
  } catch (error) {
    console.error('Görev güncellenirken hata:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Görev güncellenemedi' },
      { status: error instanceof Error && error.message.includes('Oturum') ? 401 : 500 }
    );
  }
}

// DELETE /tasks/api/{taskId} - Görev sil
export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    const url = new URL(request.url);
    const taskId = url.pathname.split('/').pop();

    if (!taskId) {
      return NextResponse.json(
        { error: 'Task ID gereklidir' },
        { status: 400 }
      );
    }

    const taskRef = doc(db, `users/${user.uid}/tasks`, taskId);
    const taskDoc = await getDoc(taskRef);

    if (!taskDoc.exists()) {
      return NextResponse.json(
        { error: 'Görev bulunamadı' },
        { status: 404 }
      );
    }

    // Görevin kullanıcıya ait olduğunu kontrol et
    const taskData = taskDoc.data();
    if (taskData.userId !== user.uid) {
      return NextResponse.json(
        { error: 'Bu görevi silme yetkiniz yok' },
        { status: 403 }
      );
    }

    await deleteDoc(taskRef);

    return NextResponse.json({ 
      success: true,
      message: 'Görev silindi'
    });
  } catch (error) {
    console.error('Görev silinirken hata:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Görev silinemedi' },
      { status: error instanceof Error && error.message.includes('Oturum') ? 401 : 500 }
    );
  }
} 