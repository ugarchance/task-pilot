import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/core/firebase/config';
import { doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { updateTaskSchema } from '@/features/tasks/validation/taskSchema';
import { Task } from '@/features/tasks/types';

interface RouteParams {
  params: {
    taskId: string;
  };
}

// PATCH /tasks/api/[taskId] - Görevi güncelle
export async function PATCH(request: NextRequest, context: RouteParams) {
  try {
    // params'ı async olarak işle
    const { taskId } = await Promise.resolve(context.params);
    const data = await request.json();

    // Veri doğrulama
    const validationResult = updateTaskSchema.safeParse(data);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Geçersiz görev verisi', details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const taskData = validationResult.data;
    const taskRef = doc(db, 'tasks', taskId);

    // Görev var mı kontrol et
    const existingDoc = await getDoc(taskRef);
    if (!existingDoc.exists()) {
      return NextResponse.json(
        { error: 'Görev bulunamadı' },
        { status: 404 }
      );
    }
    
    // Görevi güncelle
    await updateDoc(taskRef, {
      ...taskData,
      updatedAt: new Date()
    });

    // Güncellenmiş görevi getir
    const taskDoc = await getDoc(taskRef);
    const updatedTaskData = taskDoc.data();

    if (!updatedTaskData) {
      return NextResponse.json(
        { error: 'Görev verisi alınamadı' },
        { status: 500 }
      );
    }

    // Task verisini döndür
    const responseData: Omit<Task, 'id'> & { id: string } = {
      id: taskDoc.id,
      title: updatedTaskData.title || '',
      description: updatedTaskData.description || '',
      status: updatedTaskData.status || 'PENDING',
      createdAt: updatedTaskData.createdAt?.toDate() || new Date(),
      updatedAt: updatedTaskData.updatedAt?.toDate() || new Date()
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Görev güncellenirken hata:', error);
    return NextResponse.json(
      { error: 'Görev güncellenemedi' },
      { status: 500 }
    );
  }
}

// DELETE /tasks/api/[taskId] - Görevi sil
export async function DELETE(_request: NextRequest, context: RouteParams) {
  try {
    // params'ı async olarak işle
    const { taskId } = await Promise.resolve(context.params);
    const taskRef = doc(db, 'tasks', taskId);

    // Silmeden önce görev var mı kontrol et
    const taskDoc = await getDoc(taskRef);
    if (!taskDoc.exists()) {
      return NextResponse.json(
        { error: 'Görev bulunamadı' },
        { status: 404 }
      );
    }

    const taskData = taskDoc.data();
    if (!taskData) {
      return NextResponse.json(
        { error: 'Görev verisi alınamadı' },
        { status: 500 }
      );
    }

    // Silmeden önce task verisini al
    const responseData: Omit<Task, 'id'> & { id: string } = {
      id: taskDoc.id,
      title: taskData.title || '',
      description: taskData.description || '',
      status: taskData.status || 'PENDING',
      createdAt: taskData.createdAt?.toDate() || new Date(),
      updatedAt: taskData.updatedAt?.toDate() || new Date()
    };

    // Görevi sil
    await deleteDoc(taskRef);
    
    // Silinen görevin verisini döndür
    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Görev silinirken hata:', error);
    return NextResponse.json(
      { error: 'Görev silinemedi' },
      { status: 500 }
    );
  }
} 