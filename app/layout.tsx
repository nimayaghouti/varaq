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
      className={`${iranSansX.variable} font-sans h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
