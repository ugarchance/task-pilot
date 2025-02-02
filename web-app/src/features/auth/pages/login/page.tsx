'use client';

import { useState } from 'react';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { RegisterForm } from '@/features/auth/components/RegisterForm';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0A0F1C]">
      {/* Modern arka plan efektleri */}
      <div className="absolute inset-0">
        <div className="absolute -left-32 top-0 h-[500px] w-[500px] rounded-full bg-blue-500/20 blur-[128px]" />
        <div className="absolute -right-32 bottom-0 h-[500px] w-[500px] rounded-full bg-purple-500/20 blur-[128px]" />
      </div>

      {/* Animasyonlu grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:48px_48px]">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1C] via-transparent to-[#0A0F1C]" />
      </div>

      {/* Uçuşan parçacıklar */}
      <div className="absolute inset-0" aria-hidden="true">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-px w-px bg-white"
            style={{
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
            }}
            animate={{
              scale: [1, 1.2, 0],
              opacity: [1, 0.5, 0],
            }}
            transition={{
              duration: Math.random() * 2 + 1,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      <div className="relative flex min-h-screen items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="w-full max-w-md"
        >
          {/* Logo ve Başlık */}
          <div className="mb-8">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex justify-center"
            >
              <div className="relative h-16 w-16">
                <div className="absolute inset-0 animate-pulse rounded-full bg-blue-500/20 blur-[20px]" />
                <div className="relative flex h-full items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
                  <svg
                    className="h-8 w-8 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
              </div>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-center text-2xl font-semibold text-white"
            >
              Task Pilot'a Hoş Geldiniz
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-2 text-center text-sm text-gray-400"
            >
              Görevlerinizi yönetmek artık çok daha kolay
            </motion.p>
          </div>

          {/* Form Container */}
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-lg">
            <AnimatePresence mode="wait">
              {isLogin ? (
                <motion.div
                  key="login"
                  initial={{ x: 300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -300, opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                >
                  <LoginForm />
                  <div className="border-t border-white/10 bg-white/5 p-6 text-center text-sm text-gray-400">
                    Hesabınız yok mu?{' '}
                    <button
                      onClick={() => setIsLogin(false)}
                      className="font-medium text-blue-400 transition-colors hover:text-blue-300"
                    >
                      Hemen Kayıt Olun
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="register"
                  initial={{ x: -300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 300, opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                >
                  <RegisterForm />
                  <div className="border-t border-white/10 bg-white/5 p-6 text-center text-sm text-gray-400">
                    Zaten hesabınız var mı?{' '}
                    <button
                      onClick={() => setIsLogin(true)}
                      className="font-medium text-blue-400 transition-colors hover:text-blue-300"
                    >
                      Giriş Yapın
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 