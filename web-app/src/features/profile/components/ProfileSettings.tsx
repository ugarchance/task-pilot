'use client';

import { useProfile } from '../hooks/useProfile';
import { Switch } from '@/shared/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Label } from '@/shared/components/ui/label';
import { motion } from 'framer-motion';
import { FiBell, FiMoon, FiGlobe } from 'react-icons/fi';

const containerAnimation = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemAnimation = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function ProfileSettings() {
  const { profile, updatePreferences, isLoading } = useProfile();

  const handlePreferenceChange = async (key: string, value: boolean | string) => {
    if (!profile?.preferences) return;

    await updatePreferences({
      ...profile.preferences,
      [key]: value,
    });
  };

  return (
    <motion.div
      className="h-full overflow-auto"
      variants={containerAnimation}
      initial="hidden"
      animate="show"
    >
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <motion.div variants={itemAnimation}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FiBell className="w-5 h-5 text-blue-500" />
                Bildirim Ayarları
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="email-notifications" className="flex items-center gap-2">
                  Email Bildirimleri
                  <span className="text-sm text-gray-500">
                    Önemli güncellemeler için email bildirimleri alın
                  </span>
                </Label>
                <Switch
                  id="email-notifications"
                  checked={profile?.preferences?.emailNotifications}
                  onCheckedChange={(checked) =>
                    handlePreferenceChange('emailNotifications', checked)
                  }
                  disabled={isLoading}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="push-notifications" className="flex items-center gap-2">
                  Push Bildirimleri
                  <span className="text-sm text-gray-500">
                    Anlık bildirimler alın
                  </span>
                </Label>
                <Switch
                  id="push-notifications"
                  checked={profile?.preferences?.pushNotifications}
                  onCheckedChange={(checked) =>
                    handlePreferenceChange('pushNotifications', checked)
                  }
                  disabled={isLoading}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemAnimation}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FiMoon className="w-5 h-5 text-blue-500" />
                Görünüm
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Label htmlFor="theme" className="flex items-center gap-2">
                  Tema
                  <span className="text-sm text-gray-500">
                    Tercih ettiğiniz temayı seçin
                  </span>
                </Label>
                <Select
                  value={profile?.preferences?.theme}
                  onValueChange={(value) => handlePreferenceChange('theme', value)}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Tema seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Açık</SelectItem>
                    <SelectItem value="dark">Koyu</SelectItem>
                    <SelectItem value="system">Sistem</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemAnimation}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FiGlobe className="w-5 h-5 text-blue-500" />
                Dil ve Bölge
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Label htmlFor="language" className="flex items-center gap-2">
                  Dil
                  <span className="text-sm text-gray-500">
                    Tercih ettiğiniz dili seçin
                  </span>
                </Label>
                <Select
                  value={profile?.preferences?.language}
                  onValueChange={(value) => handlePreferenceChange('language', value)}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Dil seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tr">Türkçe</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
