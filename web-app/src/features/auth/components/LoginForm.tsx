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
import { toast } from 'sonner';
import { ControllerRenderProps } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FiMail, FiLock } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { IconType } from 'react-icons';

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

const IconWrapper = ({ Icon }: { Icon: IconType }) => (
  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-hover:text-blue-400">
    <Icon size={18} />
  </div>
);

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
      toast.success('Giriş başarılı!');
    } catch (error) {
      toast.error('Giriş yapılırken bir hata oluştu');
    }
  };

  return (
    <motion.div
      className="space-y-6 p-6"
      initial="hidden"
      animate="show"
      variants={formAnimation}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <motion.div variants={itemAnimation}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }: { field: ControllerRenderProps<LoginFormValues, 'email'> }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Email</FormLabel>
                  <FormControl>
                    <div className="relative group">
                      <IconWrapper Icon={FiMail} />
                      <Input
                        placeholder="ornek@email.com"
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
              name="password"
              render={({ field }: { field: ControllerRenderProps<LoginFormValues, 'password'> }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Şifre</FormLabel>
                  <FormControl>
                    <div className="relative group">
                      <IconWrapper Icon={FiLock} />
                      <Input
                        type="password"
                        placeholder="******"
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

          <motion.div
            variants={itemAnimation}
            className="pt-2 space-y-4"
          >
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200 relative overflow-hidden group"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
                initial={false}
                animate={{ opacity: loading ? 1 : 0 }}
              />
              <span className="relative">
                {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
              </span>
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-[#0A0F1C] px-2 text-gray-500 uppercase">veya</span>
              </div>
            </div>

            <motion.div variants={itemAnimation}>
              <Button
                type="button"
                onClick={() => loginWithGoogle()}
                disabled={loading}
                className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all duration-200 relative overflow-hidden group"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
                  initial={false}
                  animate={{ opacity: loading ? 1 : 0 }}
                />
                <span className="relative flex items-center justify-center">
                  <FcGoogle className="mr-2 h-5 w-5"  />
                  Google ile Devam Et
                </span>
              </Button>
            </motion.div>
          </motion.div>
        </form>
      </Form>
    </motion.div>
  );
} 