'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { SiteSettingsProvider } from '@/lib/SiteSettingsContext';

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');
  const isLogin = pathname?.startsWith('/gizli-admin-login');

  if (isAdmin || isLogin) {
    return <>{children}</>;
  }

  return (
    <SiteSettingsProvider>
      <Header />
      <main style={{ paddingTop: 'var(--header-height)' }}>
        {children}
      </main>
      <Footer />
    </SiteSettingsProvider>
  );
}
