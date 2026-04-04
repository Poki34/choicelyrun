'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <div className={styles.page}>
      <motion.div
        className={styles.content}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.pikoEmoji}>👾</div>
        <h1 className={styles.errorCode}>404</h1>
        <h2 className={styles.title}>PIKO Ate This Page!</h2>
        <p className={styles.subtitle}>
          Looks like PIKO caused some chaos here. The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className={styles.actions}>
          <Link href="/" className="btn btn-primary">
            Go Home
          </Link>
          <Link href="/videos" className="btn btn-outline">
            Watch Videos
          </Link>
        </div>
      </motion.div>

      <div className={styles.bgOrbs}>
        <div className={styles.orb1} />
        <div className={styles.orb2} />
      </div>
    </div>
  );
}
