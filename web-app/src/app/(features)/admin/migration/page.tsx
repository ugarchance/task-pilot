'use client';

import { MigrationButton } from '@/features/admin/components/MigrationButton';

export default function MigrationPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">Veri Taşıma İşlemleri</h1>
            
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h2 className="text-lg font-medium text-blue-900 mb-2">Görev Taşıma</h2>
                <p className="text-sm text-blue-700 mb-4">
                  Bu işlem, mevcut görevleri kullanıcı bazlı yapıya taşıyacaktır. 
                  İşlem geri alınamaz, lütfen dikkatli kullanın.
                </p>
                <MigrationButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 