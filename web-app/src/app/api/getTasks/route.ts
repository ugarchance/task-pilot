import { NextResponse } from 'next/server';
import { db } from '@/core/firebase/config';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

export async function GET() {
  try {
    const tasksRef = collection(db, 'tasks');
    const q = query(tasksRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const tasks = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Görevler getirilirken hata oluştu:', error);
    return NextResponse.json(
      { error: 'Görevler getirilemedi' },
      { status: 500 }
    );
  }
} 