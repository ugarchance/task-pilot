'use client';

import { ProfileHeader } from '@/features/profile/components/ProfileHeader';
import { ProfileTabs } from '@/features/profile/components/ProfileTabs';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

function ProfileSkeleton() {
  return (
    <div className="flex flex-col h-full">
      <div className="h-32 bg-gray-800/10 animate-pulse" />
      <div className="flex-1 p-6 min-h-0">
        <div className="h-10 bg-gray-800/10 rounded-lg w-1/3 animate-pulse" />
        <div className="mt-6 space-y-4">
          <div className="h-12 bg-gray-800/10 rounded-lg animate-pulse" />
          <div className="h-12 bg-gray-800/10 rounded-lg animate-pulse" />
          <div className="h-12 bg-gray-800/10 rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gradient-to-b from-[#0A0F1C] to-[#121827]">
      <Suspense fallback={<ProfileSkeleton />}>
        <div className="relative">
          {/* Arkaplan deseni */}
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
          
          {/* Profil başlığı */}
          <div className="relative">
            <ProfileHeader />
          </div>
        </div>

        {/* Ana içerik */}
        <div className="flex-1 min-h-0 relative">
          <div className="absolute inset-x-0 -top-10 bottom-0 px-4 pb-8">
            <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl h-full overflow-hidden flex flex-col">
              <ProfileTabs />
            </div>
          </div>
        </div>
      </Suspense>
    </div>
  );
}
