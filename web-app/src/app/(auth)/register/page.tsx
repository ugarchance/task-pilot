'use client';

import Link from 'next/link';
import { RegisterForm } from '@/features/auth/components/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Hesap oluşturun
          </h1>
          <p className="text-sm text-muted-foreground">
            Email ve şifrenizi girerek kayıt olun
          </p>
        </div>
        <RegisterForm />
        <p className="px-8 text-center text-sm text-muted-foreground">
          Zaten hesabınız var mı?{' '}
          <Link
            href="/login"
            className="underline underline-offset-4 hover:text-primary"
          >
            Giriş yapın
          </Link>
        </p>
      </div>
    </div>
  );
} 