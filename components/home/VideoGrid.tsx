'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ExternalLink, Eye, Calendar } from 'lucide-react';
import styles from './VideoGrid.module.css';

interface Video {
  id: string;
  title: string;
  thumbnailUrl: string;
  viewCount?: string;
  publishedAt: string;
}

interface VideoGridProps {
  videos: Video[];
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatViews(count?: string): string {
  if (!count) return '';
  const num = parseInt(count);
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M views';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K views';
  return num + ' views';
}

// YouTube API returns HTML entities — decode them
function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#x27;/g, "'");
}

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function VideoGrid({ videos }: VideoGridProps) {
  // Video yoksa bölümü gösterme
  if (!videos || videos.length === 0) return null;

  return (
    <section className={`section ${styles.videosSection}`}>
      <div className="container">
        <div className="section-title">
          <h2>Featured Videos</h2>
          <p>Watch the latest adventures from ChoicelyRun</p>
        </div>

        <motion.div
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
        >
          {videos.map((video) => (
            <motion.a
              key={video.id}
              href={`https://www.youtube.com/watch?v=${video.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`glass-card ${styles.videoCard}`}
              variants={itemVariants}
            >
              <div className={styles.thumbnailWrap}>
                {video.thumbnailUrl ? (
                  <Image src={video.thumbnailUrl} alt={decodeHtmlEntities(video.title)} className={styles.thumbnail} width={480} height={270} />
                ) : (
                  <div className={styles.thumbnailPlaceholder}>
                    <span>▶</span>
                  </div>
                )}
                <div className={styles.playOverlay}>
                  <div className={styles.playBtn}>▶</div>
                </div>
              </div>
              <div className={styles.videoInfo}>
                <h3 className={styles.videoTitle}>{decodeHtmlEntities(video.title)}</h3>
                <div className={styles.videoMeta}>
                  {video.viewCount && (
                    <span className={styles.metaItem}>
                      <Eye size={14} /> {formatViews(video.viewCount)}
                    </span>
                  )}
                  <span className={styles.metaItem}>
                    <Calendar size={14} /> {formatDate(video.publishedAt)}
                  </span>
                </div>
              </div>
              <div className={styles.watchLink}>
                Watch on YouTube <ExternalLink size={14} />
              </div>
            </motion.a>
          ))}
        </motion.div>

        <div className={styles.viewAll}>
          <a
            href="https://www.youtube.com/@ChoicelyRun/videos"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
          >
            View All Videos <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
