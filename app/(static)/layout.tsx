import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { StaticLayoutBackground } from '@/components/layout/StaticLayoutBackground';

export default function StaticLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-clip">
      <StaticLayoutBackground />
      <Header />
      <main className="flex-1 container mx-auto px-4 md:px-8 py-12 relative z-10">
        {children}
      </main>
      <Footer />
    </div>
  );
}
