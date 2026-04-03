'use client';

import { motion } from 'framer-motion';
import { Globe, Users, Video, Eye } from 'lucide-react';
import { YoutubeIcon, InstagramIcon, TikTokIcon } from '@/components/ui/SocialIcons';
import styles from './about.module.css';

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <div className="container">
        <motion.div
          className={styles.pageHeader}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1>About ChoicelyRun</h1>
          <p>The story behind the chaos</p>
        </motion.div>

        {/* Hero Story */}
        <motion.div
          className={styles.storyCard}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className={styles.storyVisual}>
            <div className={styles.storyAvatar}>
              <span>👾</span>
            </div>
            <div className={styles.storyGlow} />
          </div>
          <div className={styles.storyContent}>
            <h2>The PIKO Story</h2>
            <p>
              ChoicelyRun started with a simple idea: what if every choice led to chaos? 
              Our main character PIKO — a fearless, unpredictable creature — was born from 
              this concept. Every episode presents new choices, new adventures, and new 
              mayhem.
            </p>
            <p>
              What began as short animated clips has grown into a universe of characters, 
              stories, and millions of fans worldwide. From PIKO&apos;s chaotic escapades to 
              Nova&apos;s relentless pursuit of justice and Finn&apos;s cunning tricks, 
              every video is a new chapter in this ever-expanding world.
            </p>
          </div>
        </motion.div>

        {/* Channel Description in Multiple Languages */}
        <motion.div
          className={styles.langSection}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2>🌍 About Us — In Every Language</h2>
          <p className={styles.langSubtitle}>Our community speaks many languages</p>
          <div className={styles.langGrid}>
            {[
              { flag: '🇬🇧', lang: 'English', text: 'Welcome to ChoicelyRun! Where every choice leads to chaos. Join PIKO on daily animated adventures!' },
              { flag: '🇹🇷', lang: 'Türkçe', text: 'ChoicelyRun\'a hoş geldiniz! Her seçim kaosa götürür. PIKO ile günlük animasyon maceraları!' },
              { flag: '🇩🇪', lang: 'Deutsch', text: 'Willkommen bei ChoicelyRun! Wo jede Wahl zum Chaos führt. Tägliche Animationsabenteuer!' },
              { flag: '🇫🇷', lang: 'Français', text: 'Bienvenue sur ChoicelyRun! Où chaque choix mène au chaos. Aventures animées quotidiennes!' },
              { flag: '🇪🇸', lang: 'Español', text: '¡Bienvenido a ChoicelyRun! Donde cada elección conduce al caos. ¡Aventuras animadas diarias!' },
              { flag: '🇯🇵', lang: '日本語', text: 'ChoicelyRunへようこそ！すべての選択が混沌へ。毎日のアニメーション冒険！' },
              { flag: '🇰🇷', lang: '한국어', text: 'ChoicelyRun에 오신 것을 환영합니다! 매일 새로운 애니메이션 모험!' },
              { flag: '🇧🇷', lang: 'Português', text: 'Bem-vindo ao ChoicelyRun! Onde cada escolha leva ao caos. Aventuras animadas diárias!' },
              { flag: '🇷🇺', lang: 'Русский', text: 'Добро пожаловать в ChoicelyRun! Где каждый выбор ведёт к хаосу!' },
              { flag: '🇸🇦', lang: 'العربية', text: '!مرحبًا بكم في ChoicelyRun! حيث كل خيار يقود إلى الفوضى' },
              { flag: '🇮🇹', lang: 'Italiano', text: 'Benvenuto su ChoicelyRun! Dove ogni scelta porta al caos. Avventure animate ogni giorno!' },
              { flag: '🇮🇳', lang: 'हिन्दी', text: 'ChoicelyRun में आपका स्वागत है! जहाँ हर चुनाव अराजकता की ओर ले जाता है!' },
              { flag: '🇨🇳', lang: '中文', text: '欢迎来到ChoicelyRun！每一个选择都通向混乱。每日动画冒险！' },
              { flag: '🇳🇱', lang: 'Nederlands', text: 'Welkom bij ChoicelyRun! Waar elke keuze tot chaos leidt. Dagelijkse geanimeerde avonturen!' },
            ].map((item) => (
              <div key={item.lang} className={`glass-card ${styles.langCard}`}>
                <div className={styles.langHeader}>
                  <span className={styles.flag}>{item.flag}</span>
                  <span className={styles.langName}>{item.lang}</span>
                </div>
                <p className={styles.langText}>{item.text}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Social Links */}
        <motion.div
          className={styles.socialSection}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2>Find Us Everywhere</h2>
          <div className={styles.socialGrid}>
            <a href="https://www.youtube.com/@ChoicelyRun" target="_blank" rel="noopener noreferrer" className={styles.socialCard} style={{ '--s-color': '#FF0000' } as React.CSSProperties}>
              <YoutubeIcon size={32} />
              <span>YouTube</span>
              <span className={styles.socialHandle}>@ChoicelyRun</span>
            </a>
            <a href="https://instagram.com/choicelyrun" target="_blank" rel="noopener noreferrer" className={styles.socialCard} style={{ '--s-color': '#E4405F' } as React.CSSProperties}>
              <InstagramIcon size={32} />
              <span>Instagram</span>
              <span className={styles.socialHandle}>@choicelyrun</span>
            </a>
            <a href="https://www.tiktok.com/@choicelyrun" target="_blank" rel="noopener noreferrer" className={styles.socialCard} style={{ '--s-color': '#00f2ea' } as React.CSSProperties}>
              <TikTokIcon size={32} />
              <span>TikTok</span>
              <span className={styles.socialHandle}>@choicelyrun</span>
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
