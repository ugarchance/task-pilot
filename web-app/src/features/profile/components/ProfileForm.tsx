'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/shared/components/ui/button';
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
import { FiUser, FiBriefcase, FiMapPin, FiGlobe, FiGithub, FiTwitter, FiLinkedin } from 'react-icons/fi';

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
  const { profile, updateProfile, isLoading, setDirty } = useProfile();

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
  });

  const onSubmit = async (values: ProfileFormValues) => {
    await updateProfile(values);
  };

  return (
    <motion.div
      className="h-full w-full flex flex-col"
      initial="hidden"
      animate="show"
      variants={formAnimation}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} onChange={() => setDirty(true)} className="flex-1 flex flex-col">
          <div className="flex-1 overflow-auto px-6 pt-2 pb-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div variants={itemAnimation}>
                <FormField
                  control={form.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200">İsim</FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <IconWrapper icon={<FiUser className="w-4 h-4" />} />
                          <Input
                            placeholder="İsminizi girin"
                            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400 transition-all group-hover:border-blue-400/50"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
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
                      <FormLabel className="text-gray-200">Şirket</FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <IconWrapper icon={<FiBriefcase className="w-4 h-4" />} />
                          <Input
                            placeholder="Çalıştığınız şirket"
                            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400 transition-all group-hover:border-blue-400/50"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
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
                    <FormLabel className="text-gray-200">Biyografi</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Kendinizden bahsedin"
                        className="resize-none bg-white/5 border-white/10 text-white placeholder:text-gray-400 transition-all hover:border-blue-400/50 min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div variants={itemAnimation}>
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200">Konum</FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <IconWrapper icon={<FiMapPin className="w-4 h-4" />} />
                          <Input
                            placeholder="Bulunduğunuz şehir"
                            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400 transition-all group-hover:border-blue-400/50"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
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
                      <FormLabel className="text-gray-200">Website</FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <IconWrapper icon={<FiGlobe className="w-4 h-4" />} />
                          <Input
                            placeholder="https://example.com"
                            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400 transition-all group-hover:border-blue-400/50"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
            </div>

            <motion.div variants={itemAnimation} className="space-y-4">
              <h3 className="text-lg font-medium text-gray-200">Sosyal Medya</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400 transition-all group-hover:border-blue-400/50"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
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
                            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400 transition-all group-hover:border-blue-400/50"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
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
                            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400 transition-all group-hover:border-blue-400/50"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </motion.div>
          </div>

          <motion.div 
            variants={itemAnimation} 
            className="shrink-0 px-6 py-4 bg-white/5 border-t border-white/10 flex justify-end"
          >
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-blue-500 hover:bg-blue-600 text-white min-w-[150px] relative overflow-hidden group"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
                initial={false}
                animate={{ opacity: isLoading ? 1 : 0 }}
              />
              <span className="relative">
                {isLoading ? 'Kaydediliyor...' : 'Kaydet'}
              </span>
            </Button>
          </motion.div>
        </form>
      </Form>
    </motion.div>
  );
}
