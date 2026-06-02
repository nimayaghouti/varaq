import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import { iranSansX } from './fonts';
import './globals.css';

export const metadata: Metadata = {
  title: 'Varaq',
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
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
