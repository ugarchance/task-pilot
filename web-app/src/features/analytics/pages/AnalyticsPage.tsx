'use client';

import { useState, useEffect } from 'react';
import { Task, TaskStatus } from '@/features/tasks/types';

interface TaskAnalytics {
  total: number;
  byStatus: Record<TaskStatus, number>;
  completionRate: number;
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<TaskAnalytics>({
    total: 0,
    byStatus: {
      'PENDING': 0,
      'IN_PROGRESS': 0,
      'COMPLETED': 0,
      'CANCELLED': 0
    },
    completionRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/tasks');
      if (!response.ok) {
        throw new Error('Görev verileri getirilemedi');
      }
      
      const tasks: Task[] = await response.json();
      
      // Analitik hesaplamaları
      const total = tasks.length;
      const byStatus = tasks.reduce((acc, task) => {
        acc[task.status] = (acc[task.status] || 0) + 1;
        return acc;
      }, {
        'PENDING': 0,
        'IN_PROGRESS': 0,
        'COMPLETED': 0,
        'CANCELLED': 0
      } as Record<TaskStatus, number>);
      
      const completedTasks = byStatus['COMPLETED'] || 0;
      const completionRate = total > 0 ? (completedTasks / total) * 100 : 0;

      setAnalytics({
        total,
        byStatus,
        completionRate
      });
    } catch (err) {
      setError('Analitik veriler yüklenirken bir hata oluştu');
      console.error('Analitik veriler yüklenirken hata:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-600">Yükleniyor...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Görev Analitikleri</h1>
        <p className="text-gray-600">Görevlerinizin genel durumu ve istatistikleri</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Toplam Görev Kartı */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Toplam Görev</h3>
          <p className="text-3xl font-bold text-blue-600">{analytics.total}</p>
        </div>

        {/* Tamamlanma Oranı Kartı */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Tamamlanma Oranı</h3>
          <p className="text-3xl font-bold text-green-600">
            {analytics.completionRate.toFixed(1)}%
          </p>
        </div>

        {/* Aktif Görevler Kartı */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aktif Görevler</h3>
          <p className="text-3xl font-bold text-yellow-600">
            {analytics.byStatus['IN_PROGRESS']}
          </p>
        </div>

        {/* Bekleyen Görevler Kartı */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Bekleyen Görevler</h3>
          <p className="text-3xl font-bold text-gray-600">
            {analytics.byStatus['PENDING']}
          </p>
        </div>
      </div>

      {/* Detaylı İstatistikler */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Durum Dağılımı</h2>
        <div className="space-y-4">
          {Object.entries(analytics.byStatus).map(([status, count]) => (
            <div key={status} className="flex items-center">
              <div className="w-32 text-gray-600">{status}</div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getStatusColor(status as TaskStatus)}`}
                    style={{
                      width: `${(count / analytics.total) * 100}%`
                    }}
                  />
                </div>
              </div>
              <div className="w-16 text-right text-gray-600">{count}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function getStatusColor(status: TaskStatus): string {
  switch (status) {
    case 'PENDING':
      return 'bg-gray-500';
    case 'IN_PROGRESS':
      return 'bg-yellow-500';
    case 'COMPLETED':
      return 'bg-green-500';
    case 'CANCELLED':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
} 