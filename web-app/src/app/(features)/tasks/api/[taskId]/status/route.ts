import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/core/firebase/config';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { updateTaskStatusSchema } from '@/features/tasks/validation/taskSchema';
import { Task, TASK_STATUSES, TaskStatus } from '@/features/tasks/types';

interface RouteParams {
  params: {
    taskId: string;
  };
}

// PATCH /tasks/api/[taskId]/status - Görev durumunu güncelle
export async function PATCH(request: NextRequest, context: RouteParams) {
  try {
    // params'ı async olarak işle
    const { taskId } = await Promise.resolve(context.params);
    const data = await request.json();

    // Veri doğrulama
    const validationResult = updateTaskStatusSchema.safeParse(data);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Geçersiz durum değeri', details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const { status } = validationResult.data;

    // Status değeri geçerli mi kontrol et
    if (!TASK_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: 'Geçersiz durum değeri' },
        { status: 400 }
      );
    }

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
      status,
      updatedAt: new Date()
    });

    // Güncellenmiş görevi getir
    const taskDoc = await getDoc(taskRef);
    const taskData = taskDoc.data();

    if (!taskData) {
      return NextResponse.json(
        { error: 'Görev verisi alınamadı' },
        { status: 500 }
      );
    }

    // Status değerini kontrol et
    const currentStatus = TASK_STATUSES.includes(taskData.status as TaskStatus) 
      ? taskData.status 
      : 'PENDING';
    
    // Task verisini döndür
    const responseData: Omit<Task, 'id'> & { id: string } = {
      id: taskDoc.id,
      userId: taskData.userId || '',
      title: taskData.title || '',
      description: taskData.description || '',
      prompt: taskData.prompt || '',
      status: currentStatus,
      createdAt: taskData.createdAt?.toDate() || new Date(),
      updatedAt: taskData.updatedAt?.toDate() || new Date(),
      tags: taskData.tags || [],
      subTasks: taskData.subTasks || [],
      progress: taskData.progress || { done: [], todo: [] },
      parentTaskId: taskData.parentTaskId,
      isSubTask: taskData.isSubTask || false
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Görev durumu güncellenirken hata:', error);
    return NextResponse.json(
      { error: 'Görev durumu güncellenemedi' },
      { status: 500 }
    );
  }
} 