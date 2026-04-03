'use client';

import { motion } from 'framer-motion';
import { ExternalLink, ListVideo } from 'lucide-react';
import styles from './PlaylistsSection.module.css';

interface Playlist {
  id: string;
  title: string;
  thumbnailUrl: string;
  videoCount: number;
}

interface PlaylistsSectionProps {
  playlists: Playlist[];
}

const placeholderPlaylists: Playlist[] = [
  { id: '1', title: 'PIKO Chaos Collection 😈🔥', thumbnailUrl: '', videoCount: 45 },
  { id: '2', title: 'Nova & Finn Adventures 🐰🦊', thumbnailUrl: '', videoCount: 32 },
  { id: '3', title: 'Special Episodes ✨💎', thumbnailUrl: '', videoCount: 18 },
  { id: '4', title: 'Best of ChoicelyRun 🏆', thumbnailUrl: '', videoCount: 67 },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
};

export default function PlaylistsSection({ playlists }: PlaylistsSectionProps) {
  const displayPlaylists = playlists.length > 0 ? playlists : placeholderPlaylists;

  return (
    <section className={`section ${styles.playlists}`}>
      <div className="container">
        <div className="section-title">
          <h2>Featured Playlists</h2>
          <p>Curated collections of our most popular content</p>
        </div>

        <motion.div
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
        >
          {displayPlaylists.map((pl) => (
            <motion.a
              key={pl.id}
              href={`https://www.youtube.com/playlist?list=${pl.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`glass-card ${styles.card}`}
              variants={itemVariants}
            >
              <div className={styles.thumbnailWrap}>
                {pl.thumbnailUrl ? (
                  <img src={pl.thumbnailUrl} alt={pl.title} className={styles.thumbnail} />
                ) : (
                  <div className={styles.thumbnailPlaceholder}>
                    <ListVideo size={36} />
                  </div>
                )}
                <div className={styles.playOverlay}>
                  <span className={styles.playIcon}>▶</span>
                </div>
                <div className={styles.videoCountBadge}>{pl.videoCount} Videos</div>
              </div>
              <div className={styles.cardBody}>
                <h3 className={styles.title}>{pl.title}</h3>
                <span className={styles.watchAll}>
                  View Playlist <ExternalLink size={14} />
                </span>
              </div>
            </motion.a>
          ))}
        </motion.div>

        <div className={styles.viewAll}>
          <a
            href="https://www.youtube.com/@ChoicelyRun/playlists"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
          >
            📋 View All Playlists <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
