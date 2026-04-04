'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, ExternalLink, Eye, Calendar, ListVideo } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import styles from './videos.module.css';

type TabType = 'shorts' | 'playlists';

interface VideoItem {
  id: string;
  youtube_id: string;
  title: string;
  thumbnail_url: string;
  category: string;
  is_visible: boolean;
  view_count: number;
  created_at: string;
}

interface PlaylistItem {
  id: string;
  youtube_playlist_id: string;
  title: string;
  thumbnail_url: string;
  video_count: number;
}

const categories = [
  { value: 'all', label: 'All' },
  { value: 'shorts', label: 'Shorts' },
  { value: 'playlist', label: 'Playlist' },
  { value: 'special', label: 'Special' },
];

export default function VideosPage() {
  const [tab, setTab] = useState<TabType>('shorts');
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [playlists, setPlaylists] = useState<PlaylistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [videosRes, playlistsRes] = await Promise.all([
        supabase.from('videos').select('*').eq('is_visible', true).order('sort_order'),
        supabase.from('playlists').select('*').order('sort_order'),
      ]);
      setVideos(videosRes.data || []);
      setPlaylists(playlistsRes.data || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  const filteredVideos = videos.filter((v) => {
    const matchCategory = category === 'all' || v.category === category;
    const matchSearch = !search || v.title.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  function formatCount(count: number): string {
    if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
    if (count >= 1000) return (count / 1000).toFixed(1) + 'K';
    return count.toString();
  }

  return (
    <div className={styles.videosPage}>
      <div className="container">
        <motion.div
          className={styles.pageHeader}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1>Videos</h1>
          <p>Explore all ChoicelyRun content</p>
        </motion.div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${tab === 'shorts' ? styles.activeTab : ''}`}
            onClick={() => setTab('shorts')}
          >
            🎬 Shorts
          </button>
          <button
            className={`${styles.tab} ${tab === 'playlists' ? styles.activeTab : ''}`}
            onClick={() => setTab('playlists')}
          >
            📋 Playlists
          </button>
        </div>

        {tab === 'shorts' && (
          <>
            <div className={styles.filters}>
              <div className={styles.searchWrap}>
                <Search size={18} className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Search videos..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={styles.searchInput}
                />
              </div>
              <div className={styles.categoryBtns}>
                <Filter size={16} />
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    className={`${styles.catBtn} ${category === cat.value ? styles.activeCat : ''}`}
                    onClick={() => setCategory(cat.value)}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className={styles.loadingGrid}>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className={`glass-card ${styles.skeletonCard}`}>
                    <div className={styles.skeletonThumb} />
                    <div className={styles.skeletonText} />
                    <div className={styles.skeletonMeta} />
                  </div>
                ))}
              </div>
            ) : filteredVideos.length === 0 ? (
              <div className={styles.emptyState}>
                <p>🎬 No videos found. Check back soon!</p>
              </div>
            ) : (
              <motion.div
                className={styles.shortsGrid}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                {filteredVideos.map((video, i) => (
                  <motion.a
                    key={video.id}
                    href={`https://www.youtube.com/watch?v=${video.youtube_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`glass-card ${styles.videoCard}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <div className={styles.thumbWrap}>
                      {video.thumbnail_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={video.thumbnail_url} alt={video.title} className={styles.thumbImg} />
                      ) : (
                        <div className={styles.thumbPlaceholder}>▶</div>
                      )}
                      <div className={styles.playHover}>
                        <div className={styles.playCircle}>▶</div>
                      </div>
                    </div>
                    <div className={styles.videoInfo}>
                      <h3>{video.title}</h3>
                      <div className={styles.meta}>
                        <span><Eye size={13} /> {formatCount(video.view_count || 0)}</span>
                        <span><Calendar size={13} /> {new Date(video.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </motion.a>
                ))}
              </motion.div>
            )}
          </>
        )}

        {tab === 'playlists' && (
          loading ? (
            <div className={styles.loadingGrid}>
              {[...Array(4)].map((_, i) => (
                <div key={i} className={`glass-card ${styles.skeletonCard}`}>
                  <div className={styles.skeletonThumb} />
                  <div className={styles.skeletonText} />
                </div>
              ))}
            </div>
          ) : playlists.length === 0 ? (
            <div className={styles.emptyState}>
              <p>📋 No playlists yet. Check back soon!</p>
            </div>
          ) : (
            <motion.div
              className={styles.playlistGrid}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              {playlists.map((pl, i) => (
                <motion.a
                  key={pl.id}
                  href={`https://www.youtube.com/playlist?list=${pl.youtube_playlist_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`glass-card ${styles.playlistCard}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <div className={styles.plThumb}>
                    <ListVideo size={32} />
                  </div>
                  <div className={styles.plInfo}>
                    <h3>{pl.title}</h3>
                    <span>{pl.video_count} Videos</span>
                  </div>
                  <ExternalLink size={16} className={styles.plArrow} />
                </motion.a>
              ))}
            </motion.div>
          )
        )}
      </div>
    </div>
  );
}
