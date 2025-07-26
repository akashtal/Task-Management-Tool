// src/app/layout.tsx
import './globals.css';
import type { ReactNode } from 'react';
import SessionWrapper from '@/components/SessionWrapper';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@/components/ThemeProvider';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionWrapper>
            {children}
            <Toaster position="top-right" />
          </SessionWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
