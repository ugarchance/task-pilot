'use client';

import { useAuthRedirect } from '../hooks/useAuthRedirect';
import { useState, useEffect } from 'react';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { loading } = useAuthRedirect();

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    );
  }

  return children;
} 