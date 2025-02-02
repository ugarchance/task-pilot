import { ReactNode } from 'react';
import { Card } from '@/shared/components/ui/card';

interface TasksLayoutProps {
  children: ReactNode;
}

export default function TasksLayout({ children }: TasksLayoutProps) {
  return (
    <div className="h-screen overflow-hidden bg-[#efefd0]">
      {/* Üst Menü */}
      <header className="bg-[#004e89] text-white h-12 shadow-sm backdrop-blur-sm bg-opacity-95 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto h-full px-4 flex justify-between items-center">
          <h1 className="text-lg font-medium tracking-tight">Task Pilot</h1>
          <nav className="flex items-center space-x-8">
            <a href="/tasks" className="text-sm font-medium hover:text-[#f7c59f] transition-all duration-200 hover:scale-105">Görevler</a>
            <a href="/tasks/analytics" className="text-sm font-medium hover:text-[#f7c59f] transition-all duration-200 hover:scale-105">Analitik</a>
          </nav>
        </div>
      </header>

      {/* Sol Menü */}
      <div className="flex h-[calc(100vh-3rem)]">
        <aside className="w-56 bg-white shadow-lg">
          <nav className="p-3 space-y-1.5">
            <Card className="p-2.5 hover:bg-[#efefd0] cursor-pointer transition-colors">
              <a href="/tasks" className="flex items-center space-x-2 text-sm">
                <span className="material-icons text-[18px]">list</span>
                <span>Tüm Görevler</span>
              </a>
            </Card>
            <Card className="p-2.5 hover:bg-[#efefd0] cursor-pointer transition-colors">
              <a href="/tasks/active" className="flex items-center space-x-2 text-sm">
                <span className="material-icons text-[18px]">play_circle</span>
                <span>Aktif Görevler</span>
              </a>
            </Card>
            <Card className="p-2.5 hover:bg-[#efefd0] cursor-pointer transition-colors">
              <a href="/tasks/completed" className="flex items-center space-x-2 text-sm">
                <span className="material-icons text-[18px]">check_circle</span>
                <span>Tamamlanan Görevler</span>
              </a>
            </Card>
          </nav>
        </aside>

        {/* Ana İçerik */}
        <main className="flex-1 p-4 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
} 