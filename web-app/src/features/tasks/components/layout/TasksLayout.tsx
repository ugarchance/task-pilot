'use client';

import { ReactNode } from 'react';
import { Card } from '@/shared/components/ui/card';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface TasksLayoutProps {
  children: ReactNode;
}

export default function TasksLayout({ children }: TasksLayoutProps) {
  const pathname = usePathname();

  const menuItems = [
    { href: '/tasks', icon: 'list', label: 'Tüm Görevler' },
    { href: '/tasks/active', icon: 'play_circle', label: 'Aktif Görevler' },
    { href: '/tasks/completed', icon: 'check_circle', label: 'Tamamlanan Görevler' },
  ];

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      <aside className="w-56 bg-white shadow-lg">
        <nav className="p-3 space-y-1.5">
          {menuItems.map((item) => (
            <Card 
              key={item.href}
              className={`p-2.5 cursor-pointer transition-colors ${
                pathname === item.href 
                  ? 'bg-blue-50 border-blue-200' 
                  : 'hover:bg-[#efefd0]'
              }`}
            >
              <Link href={item.href} className="flex items-center space-x-2 text-sm">
                <span className={`material-icons text-[18px] ${
                  pathname === item.href ? 'text-blue-600' : ''
                }`}>
                  {item.icon}
                </span>
                <span className={pathname === item.href ? 'text-blue-600 font-medium' : ''}>
                  {item.label}
                </span>
              </Link>
            </Card>
          ))}
        </nav>
      </aside>

      <main className="flex-1 min-h-0">
        {children}
      </main>
    </div>
  );
} 