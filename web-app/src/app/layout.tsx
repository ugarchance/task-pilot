import './globals.css'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from "next/font/google";
import StoreProvider from './StoreProvider';
import { Toaster } from 'sonner';
import Header from '@/shared/components/layout/Header';
import Footer from '@/shared/components/layout/Footer';

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
