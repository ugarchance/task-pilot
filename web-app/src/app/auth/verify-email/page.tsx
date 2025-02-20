'use client';

import { useAuth } from '@/features/auth/hooks/useAuth';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Loader2 } from 'lucide-react';

export default function VerifyEmailPage() {
  const { user, sendVerificationEmail, checkEmailVerification } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      setShouldRedirect('/login');
    } else if (user.emailVerified) {
      setShouldRedirect('/dashboard');
    }
  }, [user]);

  useEffect(() => {
    if (shouldRedirect) {
      router.push(shouldRedirect);
    }
  }, [shouldRedirect, router]);

  const handleSendVerification = async () => {
    setIsLoading(true);
    try {
      await sendVerificationEmail();
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckVerification = async () => {
    setIsLoading(true);
    try {
      await checkEmailVerification();
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || shouldRedirect) {
    return null;
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
      <Card className="w-[380px] border-none shadow-none bg-white">
        <CardHeader className="text-center space-y-6">
          <div className="mx-auto w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl font-medium mb-2">
              Email Doğrulama
            </CardTitle>
            <CardDescription className="text-sm text-zinc-500">
              <span className="text-blue-600 font-medium">{user.email}</span> adresine gönderilen bağlantıya tıklayarak hesabınızı doğrulayın.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-3 pt-4">
          <Button
            onClick={handleSendVerification}
            variant="outline"
            className="w-full h-10"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              'Doğrulama Emailini Tekrar Gönder'
            )}
          </Button>

          <Button
            onClick={handleCheckVerification}
            className="w-full h-10 bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              'Doğrulamayı Kontrol Et'
            )}
          </Button>

          <p className="text-xs text-zinc-400 text-center pt-2">
            Email gelmediyse spam klasörünü kontrol edin
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 