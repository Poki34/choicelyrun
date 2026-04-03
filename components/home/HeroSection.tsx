'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Play, Users, Eye, Video } from 'lucide-react';
import styles from './HeroSection.module.css';

interface HeroProps {
  stats?: {
    subscriberCount: string;
    viewCount: string;
    videoCount: string;
  } | null;
}

function formatStat(value: string): string {
  const num = parseInt(value);
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return value;
}

export default function HeroSection({ stats }: HeroProps) {
  return (
    <section className={styles.hero}>
      <div className={styles.bgOrbs}>
        <div className={styles.orb1} />
        <div className={styles.orb2} />
        <div className={styles.orb3} />
      </div>

      <div className={`container ${styles.heroInner}`}>
        <motion.div
          className={styles.heroContent}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <motion.div
            className={styles.badge}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <span className={styles.badgeDot} />
            Welcome to the Chaos
          </motion.div>

          <h1 className={styles.title}>
            Meet <span className={styles.highlight}>PIKO</span>
            <br />
            Master of <span className={styles.gradient}>Chaos</span>
          </h1>

          <p className={styles.subtitle}>
            Experience world-class animated adventures with PIKO and friends.
            Original characters, daily content, cinematic quality.
          </p>

          <div className={styles.heroCtas}>
            <a
              href="https://www.youtube.com/@ChoicelyRun?sub_confirmation=1"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-subscribe"
            >
              <Play size={18} /> Watch Now
            </a>
            <a href="#characters" className="btn btn-outline">
              Meet Characters
            </a>
          </div>
        </motion.div>

        <motion.div
          className={styles.heroVisual}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className={styles.pikoContainer}>
            <div className={styles.pikoGlow} />
            <div className={styles.pikoCharacter}>
              <Image src="/images/piko.png" alt="PIKO - Master of Chaos" width={320} height={320} className={styles.pikoImage} priority />
            </div>
            <div className={styles.floatingParticles}>
              <span>✨</span>
              <span>⚡</span>
              <span>🌀</span>
              <span>💜</span>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        className={`container ${styles.statsBar}`}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <div className={styles.statItem}>
          <Users size={22} className={styles.statIcon} />
          <div>
            <span className={styles.statValue}>{stats ? formatStat(stats.subscriberCount) : '---'}</span>
            <span className={styles.statLabel}>Subscribers</span>
          </div>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.statItem}>
          <Eye size={22} className={styles.statIcon} />
          <div>
            <span className={styles.statValue}>{stats ? formatStat(stats.viewCount) : '---'}</span>
            <span className={styles.statLabel}>Total Views</span>
          </div>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.statItem}>
          <Video size={22} className={styles.statIcon} />
          <div>
            <span className={styles.statValue}>{stats ? formatStat(stats.videoCount) : '---'}</span>
            <span className={styles.statLabel}>Videos</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
