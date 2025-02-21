'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/shared/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/shared/components/ui/avatar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { useProfile } from '../hooks/useProfile';
import { ProfileFormValues, profileSchema } from '../validation/profileSchema';
import { motion } from 'framer-motion';
import { FiUser, FiBriefcase, FiMapPin, FiGlobe, FiGithub, FiTwitter, FiLinkedin, FiCamera } from 'react-icons/fi';
import { useEffect } from 'react';

const formAnimation = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      staggerChildren: 0.1,
    },
  },
};

const itemAnimation = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 },
};

interface IconWrapperProps {
  icon: React.ReactNode;
}

const IconWrapper = ({ icon }: IconWrapperProps) => (
  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-hover:text-blue-400">
    {icon}
  </div>
);

export function ProfileForm() {
  const { profile, updateProfile, updatePhoto, isLoading, setDirty, isDirty } = useProfile();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: profile?.displayName || '',
      bio: profile?.bio || '',
      location: profile?.location || '',
      company: profile?.company || '',
      website: profile?.website || '',
      socialLinks: {
        github: profile?.socialLinks?.github || '',
        twitter: profile?.socialLinks?.twitter || '',
        linkedin: profile?.socialLinks?.linkedin || '',
      },
    },
    mode: 'onChange',
  });

  const formState = form.formState;

  useEffect(() => {
    if (formState.isDirty !== isDirty) {
      setDirty(formState.isDirty);
    }
  }, [formState.isDirty, isDirty, setDirty]);

  const onSubmit = async (values: ProfileFormValues) => {
    await updateProfile(values);
  };

  const handlePhotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await updatePhoto(file);
    }
  };

  return (
    <motion.div
      className="flex flex-col bg-white/[0.02] rounded-lg border border-white/10"
      initial="hidden"
      animate="show"
      variants={formAnimation}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
          {/* Profil Fotoğrafı ve İsim */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-400 relative shrink-0 rounded-t-lg">
            <div className="absolute inset-0 bg-grid-white/10 rounded-t-lg" />
            <div className="relative px-3 py-2.5 flex items-center gap-3">
              <div className="relative group">
                <Avatar className="h-10 w-10 border-2 border-white shadow-lg">
                  <AvatarImage src={profile?.photoURL} />
                  <AvatarFallback className="bg-blue-500 text-xs text-white">
                    {profile?.displayName?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <label
                  htmlFor="photo-upload"
                  className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <FiCamera className="w-3.5 h-3.5 text-white" />
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

              <div>
                <h1 className="text-sm font-semibold text-white">
                  {profile?.displayName}
                </h1>
                <p className="text-blue-100 text-xs">
                  {profile?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Form İçeriği */}
          <div className="p-3 sm:p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <motion.div variants={itemAnimation}>
                <FormField
                  control={form.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200 text-sm">İsim</FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <IconWrapper icon={<FiUser className="w-4 h-4" />} />
                          <Input
                            placeholder="İsminizi girin"
                            className="pl-9 h-9 bg-white/5 border-white/10 text-white placeholder:text-gray-400 transition-all group-hover:border-blue-400/50"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div variants={itemAnimation}>
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200 text-sm">Şirket</FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <IconWrapper icon={<FiBriefcase className="w-4 h-4" />} />
                          <Input
                            placeholder="Çalıştığınız şirket"
                            className="pl-9 h-9 bg-white/5 border-white/10 text-white placeholder:text-gray-400 transition-all group-hover:border-blue-400/50"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </motion.div>
            </div>

            <motion.div variants={itemAnimation}>
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-200 text-sm">Biyografi</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Kendinizden bahsedin"
                        className="resize-none bg-white/5 border-white/10 text-white placeholder:text-gray-400 transition-all hover:border-blue-400/50 min-h-[60px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <motion.div variants={itemAnimation}>
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200 text-sm">Konum</FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <IconWrapper icon={<FiMapPin className="w-4 h-4" />} />
                          <Input
                            placeholder="Bulunduğunuz şehir"
                            className="pl-9 h-9 bg-white/5 border-white/10 text-white placeholder:text-gray-400 transition-all group-hover:border-blue-400/50"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div variants={itemAnimation}>
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200 text-sm">Website</FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <IconWrapper icon={<FiGlobe className="w-4 h-4" />} />
                          <Input
                            placeholder="https://example.com"
                            className="pl-9 h-9 bg-white/5 border-white/10 text-white placeholder:text-gray-400 transition-all group-hover:border-blue-400/50"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </motion.div>
            </div>

            <motion.div variants={itemAnimation} className="space-y-3">
              <h3 className="text-sm font-medium text-gray-200">Sosyal Medya</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="socialLinks.github"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative group">
                          <IconWrapper icon={<FiGithub className="w-4 h-4" />} />
                          <Input
                            placeholder="GitHub profil linki"
                            className="pl-9 h-9 bg-white/5 border-white/10 text-white placeholder:text-gray-400 transition-all group-hover:border-blue-400/50"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="socialLinks.twitter"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative group">
                          <IconWrapper icon={<FiTwitter className="w-4 h-4" />} />
                          <Input
                            placeholder="Twitter profil linki"
                            className="pl-9 h-9 bg-white/5 border-white/10 text-white placeholder:text-gray-400 transition-all group-hover:border-blue-400/50"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="socialLinks.linkedin"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative group">
                          <IconWrapper icon={<FiLinkedin className="w-4 h-4" />} />
                          <Input
                            placeholder="LinkedIn profil linki"
                            className="pl-9 h-9 bg-white/5 border-white/10 text-white placeholder:text-gray-400 transition-all group-hover:border-blue-400/50"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
            </motion.div>
          </div>

          {/* Kaydet Butonu */}
          <div className="mt-4">
            <motion.div 
              variants={itemAnimation} 
              className="p-3 bg-white/[0.03] border-t border-white/10 flex items-center justify-between gap-3 rounded-b-lg"
            >
              <p className="text-xs text-gray-400 truncate">
                {isDirty ? 'Kaydedilmemiş değişiklikler var' : 'Tüm değişiklikler kaydedildi'}
              </p>
              <Button
                type="submit"
                disabled={isLoading || !isDirty}
                className="bg-blue-500 hover:bg-blue-600 text-white min-w-[90px] h-7 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  initial={false}
                  animate={{ opacity: isLoading ? 1 : 0 }}
                />
                <span className="relative text-xs">
                  {isLoading ? 'Kaydediliyor...' : 'Kaydet'}
                </span>
              </Button>
            </motion.div>
          </div>
        </form>
      </Form>
    </motion.div>
  );
}
