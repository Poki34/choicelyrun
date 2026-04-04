'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import styles from './CharactersSection.module.css';

const characters = [
  {
    name: 'PIKO',
    emoji: '👾',
    image: '/images/piko.png',
    role: 'Master of Chaos',
    bio: 'The main character of ChoicelyRun. PIKO never plays by the rules. Every episode is a new adventure in chaos, mischief, and unpredictable fun.',
    traits: ['Chaos Master', 'No Mercy', 'Unpredictable', 'Fearless'],
    color: '#6B0FD4',
    isMain: true,
  },
  {
    name: 'Nova',
    emoji: '🐰',
    image: '/images/nova.png',
    role: 'The Law Keeper',
    bio: 'A bunny girl who serves as the police force of this chaotic world. Nova is always one step behind PIKO, trying to maintain order.',
    traits: ['Justice Seeker', 'Brave', 'Quick Thinker', 'Loyal'],
    color: '#FF6B9D',
    isMain: false,
  },
  {
    name: 'Finn',
    emoji: '🦊',
    image: '/images/finn.png',
    role: 'The Trickster',
    bio: 'A sly fox who sometimes helps PIKO, sometimes works against him. You never know whose side Finn is really on.',
    traits: ['Cunning', 'Charming', 'Sneaky', 'Witty'],
    color: '#FFB347',
    isMain: false,
  },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function CharactersSection() {
  return (
    <section id="characters" className={`section ${styles.characters}`}>
      <div className="container">
        <div className="section-title">
          <h2>Meet the Characters</h2>
          <p>The stars of ChoicelyRun&apos;s animated universe</p>
        </div>

        <motion.div
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
        >
          {characters.map((char) => (
            <motion.div
              key={char.name}
              className={`glass-card ${styles.card} ${char.isMain ? styles.mainCard : ''}`}
              variants={itemVariants}
              style={{ '--char-color': char.color } as React.CSSProperties}
            >
              {char.isMain && <div className={styles.mainBadge}>⭐ Main Character</div>}
              <div className={styles.avatarWrap}>
                <div className={styles.avatar}>
                  {char.image ? (
                    <Image src={char.image} alt={char.name} width={120} height={120} className={styles.avatarImage} />
                  ) : (
                    <span className={styles.avatarEmoji}>{char.emoji}</span>
                  )}
                </div>
                <div className={styles.avatarGlow} />
              </div>
              <h3 className={styles.name}>{char.name}</h3>
              <span className={styles.role}>{char.role}</span>
              <p className={styles.bio}>{char.bio}</p>
              <div className={styles.traits}>
                {char.traits.map((trait) => (
                  <span key={trait} className={styles.trait}>{trait}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
