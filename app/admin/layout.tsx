'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
  LayoutDashboard, Video, Users, ListVideo, FileText,
  Image, MessageSquare, Settings, LogOut, ChevronLeft
} from 'lucide-react';
import styles from './admin.module.css';

const adminLinks = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/videos', label: 'Videos', icon: Video },
  { href: '/admin/characters', label: 'Characters', icon: Users },
  { href: '/admin/playlists', label: 'Playlists', icon: ListVideo },
  { href: '/admin/content', label: 'Content', icon: FileText },
  { href: '/admin/media', label: 'Media', icon: Image },
  { href: '/admin/messages', label: 'Messages', icon: MessageSquare },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className={styles.adminLayout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTop}>
          <div className={styles.sidebarLogo}>
            <div className={styles.logoIcon}>P</div>
            <span>Admin</span>
          </div>
          <Link href="/" className={styles.backLink}>
            <ChevronLeft size={16} /> Back to Site
          </Link>
        </div>

        <nav className={styles.sidebarNav}>
          {adminLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.navItem} ${pathname === link.href ? styles.activeNav : ''}`}
            >
              <link.icon size={18} />
              {link.label}
            </Link>
          ))}
        </nav>

        <button onClick={handleLogout} className={styles.logoutBtn}>
          <LogOut size={18} /> Sign Out
        </button>
      </aside>

      <main className={styles.adminMain}>
        {children}
      </main>
    </div>
  );
}
