'use client';

import { Avatar, AvatarImage, AvatarFallback } from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import { useProfile } from '../hooks/useProfile';
import { FiCamera } from 'react-icons/fi';
import { motion } from 'framer-motion';

export function ProfileHeader() {
  const { profile, updatePhoto, isLoading } = useProfile();

  const handlePhotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await updatePhoto(file);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative h-32 bg-gradient-to-r from-blue-600 to-blue-400"
    >
      <div className="absolute inset-0 bg-grid-white/10" />
      
      <div className="relative h-full px-6 flex flex-col justify-end pb-14">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="absolute left-6 bottom-0 translate-y-1/2"
        >
          <div className="relative group">
            <Avatar className="h-20 w-20 border-4 border-white shadow-xl">
              <AvatarImage src={profile?.photoURL} />
              <AvatarFallback className="bg-blue-500 text-lg text-white">
                {profile?.displayName?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <label
              htmlFor="photo-upload"
              className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <FiCamera className="w-5 h-5 text-white" />
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
                disabled={isLoading}
              />
            </label>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="ml-28"
        >
          <h1 className="text-lg font-bold text-white">
            {profile?.displayName}
          </h1>
          <p className="text-blue-100 text-xs">
            {profile?.email}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
