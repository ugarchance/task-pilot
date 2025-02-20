import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profil - Task Pilot',
  description: 'Task Pilot profil sayfası',
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
