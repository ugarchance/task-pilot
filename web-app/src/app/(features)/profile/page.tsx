'use client';

import { ProfileTabs } from '@/features/profile/components/ProfileTabs';
import { Metadata } from 'next';

function ProfileSkeleton() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 min-h-0">
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
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#0A0F1C] to-[#121827]">
      <div className="flex-1 flex flex-col">
        {/* Arkaplan deseni */}
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px] pointer-events-none -z-10" />
        
        {/* Ana içerik */}
        <div className="relative flex-1 flex flex-col p-4 sm:p-6 md:p-8">
          <div className="container mx-auto flex-1 flex flex-col max-w-5xl">
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-2xl rounded-lg p-4 sm:p-6 md:p-8 mb-8">
              <ProfileTabs />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
