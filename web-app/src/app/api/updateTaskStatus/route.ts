import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase/config';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { TaskStatus } from '@/types/task';

const validStatuses: TaskStatus[] = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

export async function PATCH(request: Request) {
  try {
    const { taskId, status } = await request.json();

    if (!taskId) {
      return NextResponse.json(
        { error: 'Task ID gereklidir' },
        { status: 400 }
      );
    }

    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Geçerli bir durum değeri gereklidir' },
        { status: 400 }
      );
    }

    const taskRef = doc(db, 'tasks', taskId);
    const taskDoc = await getDoc(taskRef);

    if (!taskDoc.exists()) {
      return NextResponse.json(
        { error: 'Görev bulunamadı' },
        { status: 404 }
      );
    }
    
    await updateDoc(taskRef, {
      status,
      updatedAt: new Date()
    });

    return NextResponse.json({ 
      success: true,
      message: 'Görev durumu güncellendi'
    });
  } catch (error) {
    console.error('Görev durumu güncellenirken hata:', error);
    return NextResponse.json(
      { error: 'Görev durumu güncellenirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 