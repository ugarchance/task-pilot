import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase/config';
import { doc, updateDoc } from 'firebase/firestore';
import { TaskStatus } from '@/types/task';

export async function PATCH(request: Request) {
  try {
    const { taskId, title, description, status } = await request.json();

    if (!taskId || !title || !description || !status) {
      return NextResponse.json(
        { error: 'Tüm alanlar gereklidir' },
        { status: 400 }
      );
    }

    const taskRef = doc(db, 'tasks', taskId);
    
    await updateDoc(taskRef, {
      title,
      description,
      status,
      updatedAt: new Date()
    });

    return NextResponse.json({ 
      success: true,
      message: 'Görev başarıyla güncellendi'
    });
  } catch (error) {
    console.error('Görev güncellenirken hata:', error);
    return NextResponse.json(
      { error: 'Görev güncellenirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 