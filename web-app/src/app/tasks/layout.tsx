import { ReactNode } from 'react';
import { Card } from "@/components/ui/card";

interface TasksLayoutProps {
  children: ReactNode;
}

export default function TasksLayout({ children }: TasksLayoutProps) {
  return (
    <div className="min-h-screen bg-[#efefd0]">
      {/* Üst Menü */}
      <header className="bg-[#004e89] text-white p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Task Pilot</h1>
          <nav className="space-x-4">
            <a href="/tasks" className="hover:text-[#f7c59f]">Görevler</a>
            <a href="/tasks/analytics" className="hover:text-[#f7c59f]">Analitik</a>
          </nav>
        </div>
      </header>

      {/* Sol Menü */}
      <div className="flex">
        <aside className="w-64 bg-white h-[calc(100vh-64px)] shadow-lg">
          <nav className="p-4 space-y-2">
            <Card className="p-3 hover:bg-[#efefd0] cursor-pointer">
              <a href="/tasks" className="flex items-center space-x-2">
                <span className="material-icons">list</span>
                <span>Tüm Görevler</span>
              </a>
            </Card>
            <Card className="p-3 hover:bg-[#efefd0] cursor-pointer">
              <a href="/tasks/active" className="flex items-center space-x-2">
                <span className="material-icons">play_circle</span>
                <span>Aktif Görevler</span>
              </a>
            </Card>
            <Card className="p-3 hover:bg-[#efefd0] cursor-pointer">
              <a href="/tasks/completed" className="flex items-center space-x-2">
                <span className="material-icons">check_circle</span>
                <span>Tamamlanan Görevler</span>
              </a>
            </Card>
          </nav>
        </aside>

        {/* Ana İçerik */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
} 