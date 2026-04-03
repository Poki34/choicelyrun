'use client';

import { useEffect, useState } from 'react';
import { Video, Eye, Users, MessageSquare, TrendingUp, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import styles from './dashboard.module.css';

interface DashboardStats {
  totalVideos: number;
  totalMessages: number;
  unreadMessages: number;
  totalCharacters: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalVideos: 0, totalMessages: 0, unreadMessages: 0, totalCharacters: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [videosRes, messagesRes, unreadRes, charsRes] = await Promise.all([
          supabase.from('videos').select('id', { count: 'exact', head: true }),
          supabase.from('contact_messages').select('id', { count: 'exact', head: true }),
          supabase.from('contact_messages').select('id', { count: 'exact', head: true }).eq('is_read', false),
          supabase.from('characters').select('id', { count: 'exact', head: true }),
        ]);

        setStats({
          totalVideos: videosRes.count || 0,
          totalMessages: messagesRes.count || 0,
          unreadMessages: unreadRes.count || 0,
          totalCharacters: charsRes.count || 0,
        });
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const statCards = [
    { label: 'Total Videos', value: stats.totalVideos, icon: Video, color: '#7B4FD4' },
    { label: 'Characters', value: stats.totalCharacters, icon: Users, color: '#FF6B9D' },
    { label: 'Messages', value: stats.totalMessages, icon: MessageSquare, color: '#4ECDC4' },
    { label: 'Unread', value: stats.unreadMessages, icon: Clock, color: '#FFD93D' },
  ];

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.title}>Dashboard</h1>
      <p className={styles.subtitle}>Welcome to ChoicelyRun Admin Panel</p>

      <div className={styles.statsGrid}>
        {statCards.map((card) => (
          <div
            key={card.label}
            className={styles.statCard}
            style={{ '--stat-color': card.color } as React.CSSProperties}
          >
            <div className={styles.statIcon}>
              <card.icon size={24} />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>
                {loading ? '—' : card.value}
              </span>
              <span className={styles.statLabel}>{card.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.quickActions}>
        <h2>Quick Actions</h2>
        <div className={styles.actionGrid}>
          <a href="/admin/videos" className={styles.actionCard}>
            <Video size={20} />
            <span>Manage Videos</span>
          </a>
          <a href="/admin/characters" className={styles.actionCard}>
            <Users size={20} />
            <span>Edit Characters</span>
          </a>
          <a href="/admin/messages" className={styles.actionCard}>
            <MessageSquare size={20} />
            <span>View Messages</span>
          </a>
          <a href="/admin/content" className={styles.actionCard}>
            <TrendingUp size={20} />
            <span>Update Content</span>
          </a>
        </div>
      </div>
    </div>
  );
}
