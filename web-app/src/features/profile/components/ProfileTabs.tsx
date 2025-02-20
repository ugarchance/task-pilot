'use client';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/components/ui/tabs';
import { useProfile } from '../hooks/useProfile';
import { ProfileForm } from './ProfileForm';
import { ProfileSettings } from './ProfileSettings';
import { motion } from 'framer-motion';
import { FiUser, FiSettings } from 'react-icons/fi';

export function ProfileTabs() {
  const { activeTab, changeTab, isDirty } = useProfile();

  const handleTabChange = (value: string) => {
    if (isDirty) {
      const confirm = window.confirm('Kaydedilmemiş değişiklikler var. Devam etmek istiyor musunuz?');
      if (!confirm) return;
    }
    changeTab(value as 'general' | 'security' | 'notifications' | 'integrations');
  };

  return (
    <Tabs
      defaultValue={activeTab}
      onValueChange={handleTabChange}
      className="flex flex-col h-full"
    >
      <div className="flex justify-center border-b border-white/10">
        <TabsList className="bg-transparent border-0 relative py-1">
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10" />
          <TabsTrigger
            value="general"
            className="relative data-[state=active]:bg-transparent data-[state=active]:text-white text-gray-400 px-8"
          >
            <div className="flex items-center gap-2">
              <FiUser className="w-4 h-4" />
              <span>Genel Bilgiler</span>
            </div>
            {/* Aktif sekme göstergesi */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
              initial={false}
              animate={{
                opacity: activeTab === 'general' ? 1 : 0,
                scale: activeTab === 'general' ? 1 : 0.3,
              }}
              transition={{ duration: 0.2 }}
            />
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="relative data-[state=active]:bg-transparent data-[state=active]:text-white text-gray-400 px-8"
          >
            <div className="flex items-center gap-2">
              <FiSettings className="w-4 h-4" />
              <span>Tercihler</span>
            </div>
            {/* Aktif sekme göstergesi */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
              initial={false}
              animate={{
                opacity: activeTab === 'notifications' ? 1 : 0,
                scale: activeTab === 'notifications' ? 1 : 0.3,
              }}
              transition={{ duration: 0.2 }}
            />
          </TabsTrigger>
        </TabsList>
      </div>

      <div className="flex-1 min-h-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="h-full"
        >
          <TabsContent value="general" className="m-0 h-full">
            <ProfileForm />
          </TabsContent>

          <TabsContent value="notifications" className="m-0 h-full">
            <ProfileSettings />
          </TabsContent>
        </motion.div>
      </div>
    </Tabs>
  );
} 