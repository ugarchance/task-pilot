import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase/config';
import { doc, updateDoc } from 'firebase/firestore';
import { TaskStatus } from '@/types/task';

export async function PATCH(request: Request) {
  try {
    const { taskId, status } = await request.json();

    if (!taskId || !status) {
      return NextResponse.json(
        { error: 'Task ID ve yeni durum gereklidir' },
        { status: 400 }
      );
    }

    const taskRef = doc(db, 'tasks', taskId);
    
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