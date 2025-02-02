import './globals.css'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from "next/font/google";
import StoreProvider from './StoreProvider';
import { Toaster } from 'sonner';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Task Pilot',
  description: 'Görev Yönetim Sistemi',
  themeColor: '#004e89',
};

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 h-12">
      <div className="container mx-auto px-3 h-full">
        <nav className="flex items-center justify-between h-full">
          <div className="text-base font-bold text-blue-600">Task Pilot</div>
          <div className="flex items-center space-x-3">
            <a href="/tasks" className="text-sm text-gray-600 hover:text-blue-600">Görevler</a>
            <a href="/analytics" className="text-sm text-gray-600 hover:text-blue-600">Analitik</a>
          </div>
        </nav>
      </div>
    </header>
  );
};

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-3 py-2">
        <div className="text-center text-gray-600 text-xs">
          © 2024 Task Pilot. Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  );
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" className="h-full">
      <head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col h-full overflow-hidden`}>
        <StoreProvider>
          <Header />
          <main className="flex-1 min-h-0">
            {children}
          </main>
          <Footer />
        </StoreProvider>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
