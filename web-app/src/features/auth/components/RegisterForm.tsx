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
import { RegisterFormValues, registerSchema } from '../validation/authSchema';
import { toast } from 'sonner';
import { ControllerRenderProps } from 'react-hook-form';

export function RegisterForm() {
  const { register, loading } = useAuth();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      await register(values.email, values.password);
      toast.success('Kayıt başarılı!');
    } catch (error) {
      toast.error('Kayıt olurken bir hata oluştu');
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }: { field: ControllerRenderProps<RegisterFormValues, 'email'> }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="ornek@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }: { field: ControllerRenderProps<RegisterFormValues, 'password'> }) => (
              <FormItem>
                <FormLabel>Şifre</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="******" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }: { field: ControllerRenderProps<RegisterFormValues, 'confirmPassword'> }) => (
              <FormItem>
                <FormLabel>Şifre Tekrar</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="******" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Kayıt olunuyor...' : 'Kayıt Ol'}
          </Button>
        </form>
      </Form>
    </div>
  );
} 