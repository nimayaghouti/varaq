import type { Metadata } from 'next';
import { iranSansX } from './fonts';
import './globals.css';

import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { Toaster } from '@/components/ui/sonner';

import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: {
    template: '%s | کتابفروشی ورق',
    default: 'کتابفروشی آنلاین ورق',
  },
  description: 'کتابفروشی آنلاین ورق',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={cn('h-full', 'antialiased', iranSansX.variable, 'font-sans')}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="bottom-left" richColors theme="system" />
        </ThemeProvider>
      </body>
    </html>
  );
}
