'use client'

import { SessionProvider } from 'next-auth/react'
import { useEffect } from 'react';

export default function  Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Force the dark mode class on the HTML element
    document.documentElement.classList.add('dark');
  }, []);
  return <SessionProvider>{children}</SessionProvider>
}