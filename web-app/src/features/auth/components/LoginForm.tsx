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
import { useAuth } from '../hooks/useAuth';
import { LoginFormValues, loginSchema } from '../validation/authSchema';
import { FcGoogle } from 'react-icons/fc';
import { HiOutlineMail } from 'react-icons/hi';
import { RiLockPasswordLine } from 'react-icons/ri';
import { motion } from 'framer-motion';

export function LoginForm() {
  const { login, loginWithGoogle, loading } = useAuth();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await login(values.email, values.password);
    } catch (error) {
      // Error toast zaten useAuth içinde gösteriliyor
    }
  };

  return (
    <div className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Email</FormLabel>
                <FormControl>
                  <div className="group relative">
                    <HiOutlineMail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-blue-500" />
                    <Input
                      placeholder="ornek@email.com"
                      className="border-white/10 bg-white/5 pl-10 text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:bg-white/10 focus:ring-2 focus:ring-blue-500/20"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Şifre</FormLabel>
                <FormControl>
                  <div className="group relative">
                    <RiLockPasswordLine className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-blue-500" />
                    <Input
                      type="password"
                      placeholder="••••••"
                      className="border-white/10 bg-white/5 pl-10 text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:bg-white/10 focus:ring-2 focus:ring-blue-500/20"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
          <div className="space-y-4 pt-2">
            <motion.div
              whileTap={{ scale: 0.98 }}
            >
              <Button
                type="submit"
                disabled={loading}
                className="relative w-full overflow-hidden bg-blue-500 text-white transition-all hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/30"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  </div>
                ) : (
                  'Giriş Yap'
                )}
                <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/10 to-transparent [mask-image:linear-gradient(to_r,transparent,white,transparent)] [mask-size:200%_100%] animate-shimmer" />
              </Button>
            </motion.div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#0A0F1C] px-2 text-gray-500">Veya</span>
              </div>
            </div>
            <motion.div
              whileTap={{ scale: 0.98 }}
            >
              <Button
                type="button"
                variant="outline"
                onClick={() => loginWithGoogle()}
                disabled={loading}
                className="relative w-full overflow-hidden border-white/10 bg-white/5 text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:shadow-lg"
              >
                <FcGoogle className="mr-2 h-5 w-5" />
                Google ile Devam Et
                <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/5 to-transparent [mask-image:linear-gradient(to_r,transparent,white,transparent)] [mask-size:200%_100%] animate-shimmer" />
              </Button>
            </motion.div>
          </div>
        </form>
      </Form>
    </div>
  );
} 