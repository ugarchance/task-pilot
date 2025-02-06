'use client';

import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { migrateTasks } from '@/features/tasks/utils/migration';
import { toast } from 'sonner';

export function MigrationButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleMigration = async () => {
    try {
      setIsLoading(true);
      await migrateTasks();
      toast.success('Görevler başarıyla taşındı!');
    } catch (error) {
      toast.error('Görev taşıma işlemi başarısız oldu');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleMigration}
      disabled={isLoading}
      className="bg-blue-500 hover:bg-blue-600 text-white"
    >
      {isLoading ? 'Görevler Taşınıyor...' : 'Görevleri Taşı'}
    </Button>
  );
} 