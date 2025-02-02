import { NextResponse } from 'next/server';
import { db } from '@/core/firebase/config';
import { doc, deleteDoc } from 'firebase/firestore';

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'Görev ID\'si gereklidir' },
        { status: 400 }
      );
    }

    await deleteDoc(doc(db, 'tasks', id));

    return NextResponse.json({
      message: 'Görev başarıyla silindi!'
    });
  } catch (error) {
    console.error('Görev silinirken hata oluştu:', error);
    return NextResponse.json(
      { error: 'Görev silinemedi' },
      { status: 500 }
    );
  }
} 