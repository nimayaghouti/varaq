import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 md:px-8 py-12">
        {children}
      </main>
      <Footer />
    </div>
  );
}
