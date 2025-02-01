import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import { TaskStatus } from '@/types/task';

export async function POST(request: Request) {
  try {
    const { title, description, status = 'PENDING' } = await request.json();
    
    if (!title || !description) {
      return NextResponse.json(
        { error: 'Başlık ve açıklama gereklidir' },
        { status: 400 }
      );
    }

    const docRef = await addDoc(collection(db, 'tasks'), {
      title,
      description,
      status,
      createdAt: new Date(),
    });

    return NextResponse.json({
      id: docRef.id,
      message: 'Görev başarıyla eklendi!'
    });
  } catch (error) {
    console.error('Görev eklenirken hata oluştu:', error);
    return NextResponse.json(
      { error: 'Görev eklenemedi' },
      { status: 500 }
    );
  }
} 