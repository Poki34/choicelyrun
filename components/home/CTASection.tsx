'use client';

import { motion } from 'framer-motion';
import { YoutubeIcon, InstagramIcon, TikTokIcon } from '@/components/ui/SocialIcons';
import styles from './CTASection.module.css';

const socials = [
  {
    name: 'YouTube',
    icon: YoutubeIcon,
    href: 'https://www.youtube.com/@ChoicelyRun?sub_confirmation=1',
    label: '📺 Subscribe on YouTube',
    color: '#FF0000',
    bg: 'rgba(255, 0, 0, 0.1)',
    border: 'rgba(255, 0, 0, 0.25)',
  },
  {
    name: 'Instagram',
    icon: InstagramIcon,
    href: 'https://instagram.com/choicelyrun',
    label: '📸 Follow on Instagram',
    color: '#E4405F',
    bg: 'rgba(228, 64, 95, 0.1)',
    border: 'rgba(228, 64, 95, 0.25)',
  },
  {
    name: 'TikTok',
    icon: TikTokIcon,
    href: 'https://www.tiktok.com/@choicelyrun',
    label: '🎵 Follow on TikTok',
    color: '#00f2ea',
    bg: 'rgba(0, 242, 234, 0.1)',
    border: 'rgba(0, 242, 234, 0.25)',
  },
];

export default function CTASection() {
  return (
    <section className={`section ${styles.cta}`}>
      <div className="container">
        <motion.div
          className={styles.ctaCard}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.ctaGlow} />
          <div className={styles.ctaContent}>
            <span className={styles.emoji}>🌑</span>
            <h2 className={styles.ctaTitle}>Join the ChoicelyRun Family</h2>
            <p className={styles.ctaDesc}>
              Subscribe now and never miss a chaotic moment! Follow us everywhere.
            </p>
            <div className={styles.buttons}>
              {socials.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialBtn}
                  style={{
                    '--social-color': s.color,
                    '--social-bg': s.bg,
                    '--social-border': s.border,
                  } as React.CSSProperties}
                >
                  <s.icon size={20} />
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
