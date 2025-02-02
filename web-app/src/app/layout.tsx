import './globals.css'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from "next/font/google";

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

import ClientLayout from './ClientLayout';

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
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
