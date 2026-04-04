'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import styles from './characters.module.css';

interface Character {
  id: string;
  name: string;
  slug: string;
  bio: string;
  image_url: string;
  is_main: boolean;
  is_visible: boolean;
  sort_order: number;
  traits: string[];
}

// Fallback data & colors per character
const charMeta: Record<string, { emoji: string; color: string; role: string; image: string; stats: { episodes: string; fans: string; catchphrase: string } }> = {
  piko: { emoji: '👾', color: '#6B0FD4', role: 'Master of Chaos', image: '/images/piko.png', stats: { episodes: '200+', fans: '1M+', catchphrase: '"Your fate is mine!"' } },
  nova: { emoji: '🐰', color: '#FF6B9D', role: 'The Law Keeper', image: '/images/nova.png', stats: { episodes: '150+', fans: '800K+', catchphrase: '"Stop right there, PIKO!"' } },
  finn: { emoji: '🦊', color: '#FFB347', role: 'The Trickster', image: '/images/finn.png', stats: { episodes: '120+', fans: '600K+', catchphrase: '"Trust me... or don\'t!"' } },
};

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

export default function CharactersPage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchChars() {
      const { data } = await supabase
        .from('characters')
        .select('*')
        .eq('is_visible', true)
        .order('sort_order');
      setCharacters(data || []);
      setLoading(false);
    }
    fetchChars();
  }, []);

  function getMeta(slug: string) {
    return charMeta[slug] || { emoji: '🎭', color: '#7B4FD4', role: 'Character', image: '', stats: { episodes: '—', fans: '—', catchphrase: '—' } };
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <div className="container">
          <div className={styles.pageHeader}>
            <h1>Characters</h1>
            <p>The stars of ChoicelyRun&apos;s animated universe</p>
          </div>
          <div className={styles.loadingState}>
            {[1, 2, 3].map(i => (
              <div key={i} className={styles.skeletonChar} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <motion.div
          className={styles.pageHeader}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1>Characters</h1>
          <p>The stars of ChoicelyRun&apos;s animated universe</p>
        </motion.div>

        <motion.div
          className={styles.characterList}
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {characters.map((char, index) => {
            const meta = getMeta(char.slug);
            const imgSrc = char.image_url || meta.image;

            return (
              <motion.div
                key={char.id}
                className={`${styles.charSection} ${index % 2 === 1 ? styles.reversed : ''}`}
                variants={itemVariants}
                style={{ '--char-color': meta.color } as React.CSSProperties}
              >
                <div className={styles.charVisual}>
                  <div className={styles.charGlow} />
                  <div className={styles.charAvatar}>
                    {imgSrc ? (
                      <Image src={imgSrc} alt={char.name} width={180} height={180} className={styles.charAvatarImage} />
                    ) : (
                      <span>{meta.emoji}</span>
                    )}
                  </div>
                  {char.is_main && (
                    <div className={styles.mainRibbon}>⭐ Main Character</div>
                  )}
                </div>

                <div className={styles.charContent}>
                  <div className={styles.nameRow}>
                    <h2 className={styles.charName}>{char.name}</h2>
                    <span className={styles.charRole}>{meta.role}</span>
                  </div>
                  <p className={styles.charBio}>{char.bio}</p>

                  <div className={styles.statsRow}>
                    <div className={styles.stat}>
                      <span className={styles.statVal}>{meta.stats.episodes}</span>
                      <span className={styles.statLbl}>Episodes</span>
                    </div>
                    <div className={styles.stat}>
                      <span className={styles.statVal}>{meta.stats.fans}</span>
                      <span className={styles.statLbl}>Fans</span>
                    </div>
                    <div className={styles.stat}>
                      <span className={styles.statVal}>{meta.stats.catchphrase}</span>
                      <span className={styles.statLbl}>Catchphrase</span>
                    </div>
                  </div>

                  <div className={styles.traits}>
                    {(char.traits || []).map((trait: string) => (
                      <span key={trait} className={styles.trait}>{trait}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
