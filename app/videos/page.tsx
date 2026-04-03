'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, ExternalLink, Eye, Calendar, ListVideo } from 'lucide-react';
import styles from './videos.module.css';

type TabType = 'shorts' | 'playlists';
type CategoryType = 'all' | 'piko-chaos' | 'nova-finn' | 'special';

const placeholderShorts = [
  { id: '1', title: 'PIKO vs The World! 🌍 Epic Chaos', viewCount: '2.5M', date: 'Mar 28, 2026', category: 'piko-chaos' },
  { id: '2', title: 'Nova Catches PIKO Red-Handed! 🐰👮', viewCount: '1.8M', date: 'Mar 25, 2026', category: 'nova-finn' },
  { id: '3', title: "Finn's Biggest Prank Yet! 🦊💥", viewCount: '3.2M', date: 'Mar 22, 2026', category: 'nova-finn' },
  { id: '4', title: 'PIKO Goes to School?! 📚😈', viewCount: '950K', date: 'Mar 20, 2026', category: 'piko-chaos' },
  { id: '5', title: 'The Chase Begins! PIKO on the Run 🏃‍♂️', viewCount: '4.1M', date: 'Mar 17, 2026', category: 'piko-chaos' },
  { id: '6', title: 'Nova & Finn Team Up! 💪✨', viewCount: '1.5M', date: 'Mar 15, 2026', category: 'nova-finn' },
  { id: '7', title: 'Special Episode: The Origin! 🌟', viewCount: '5.8M', date: 'Mar 10, 2026', category: 'special' },
  { id: '8', title: "PIKO's Kitchen Disaster 🍳🔥", viewCount: '2.1M', date: 'Mar 8, 2026', category: 'piko-chaos' },
  { id: '9', title: 'Finn Saves the Day! 🦊🦸‍♂️', viewCount: '1.3M', date: 'Mar 5, 2026', category: 'nova-finn' },
];

const placeholderPlaylists = [
  { id: '1', title: 'PIKO Chaos Collection 😈🔥', videoCount: 45 },
  { id: '2', title: 'Nova & Finn Adventures 🐰🦊', videoCount: 32 },
  { id: '3', title: 'Special Episodes ✨💎', videoCount: 18 },
  { id: '4', title: 'Best of ChoicelyRun 🏆', videoCount: 67 },
  { id: '5', title: "PIKO's Greatest Escapes 🏃‍♂️💨", videoCount: 24 },
  { id: '6', title: 'Fan Favorites ❤️', videoCount: 41 },
];

const categories = [
  { value: 'all', label: 'All' },
  { value: 'piko-chaos', label: 'PIKO Chaos' },
  { value: 'nova-finn', label: 'Nova & Finn' },
  { value: 'special', label: 'Special Episodes' },
];

export default function VideosPage() {
  const [tab, setTab] = useState<TabType>('shorts');
  const [category, setCategory] = useState<CategoryType>('all');
  const [search, setSearch] = useState('');

  const filteredShorts = placeholderShorts.filter((v) => {
    const matchCategory = category === 'all' || v.category === category;
    const matchSearch = !search || v.title.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

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
                    onClick={() => setCategory(cat.value as CategoryType)}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <motion.div
              className={styles.shortsGrid}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              {filteredShorts.map((video, i) => (
                <motion.a
                  key={video.id}
                  href={`https://www.youtube.com/watch?v=${video.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`glass-card ${styles.videoCard}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className={styles.thumbWrap}>
                    <div className={styles.thumbPlaceholder}>▶</div>
                    <div className={styles.playHover}>
                      <div className={styles.playCircle}>▶</div>
                    </div>
                  </div>
                  <div className={styles.videoInfo}>
                    <h3>{video.title}</h3>
                    <div className={styles.meta}>
                      <span><Eye size={13} /> {video.viewCount}</span>
                      <span><Calendar size={13} /> {video.date}</span>
                    </div>
                  </div>
                </motion.a>
              ))}
            </motion.div>
          </>
        )}

        {tab === 'playlists' && (
          <motion.div
            className={styles.playlistGrid}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {placeholderPlaylists.map((pl, i) => (
              <motion.a
                key={pl.id}
                href={`https://www.youtube.com/playlist?list=${pl.id}`}
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
                  <span>{pl.videoCount} Videos</span>
                </div>
                <ExternalLink size={16} className={styles.plArrow} />
              </motion.a>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
