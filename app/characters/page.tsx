'use client';

import { motion } from 'framer-motion';
import styles from './characters.module.css';

const characters = [
  {
    name: 'PIKO',
    emoji: '👾',
    role: 'Master of Chaos',
    fullBio: `PIKO is the heart and soul of ChoicelyRun. A mysterious creature who thrives on chaos and 
    unpredictability, PIKO turns every moment into an adventure. No one knows where PIKO came from, 
    but everyone knows when PIKO arrives — because nothing stays the same. With a mischievous grin 
    and an unstoppable energy, PIKO is the character that started it all.`,
    traits: ['Chaos Master', 'No Mercy', 'Unpredictable', 'Fearless', 'Creative Destroyer', 'Lightning Fast'],
    color: '#6B0FD4',
    isMain: true,
    stats: { episodes: '200+', fans: '1M+', catchphrase: '"Your fate is mine!"' },
  },
  {
    name: 'Nova',
    emoji: '🐰',
    role: 'The Law Keeper',
    fullBio: `Nova is a bunny girl who serves as the sole police force in PIKO's chaotic world. 
    Armed with determination and a strong sense of justice, Nova is always hot on PIKO's trail. 
    Despite being outsmarted time and time again, Nova never gives up. Her transformations and 
    power-ups make her a formidable opponent when she finally catches up.`,
    traits: ['Justice Seeker', 'Brave', 'Quick Thinker', 'Loyal', 'Shape Shifter', 'Relentless'],
    color: '#FF6B9D',
    isMain: false,
    stats: { episodes: '150+', fans: '800K+', catchphrase: '"Stop right there, PIKO!"' },
  },
  {
    name: 'Finn',
    emoji: '🦊',
    role: 'The Trickster',
    fullBio: `Finn is the wildcard of the ChoicelyRun universe. This sly fox plays by nobody's rules 
    but his own. Sometimes he helps PIKO escape from Nova, and sometimes he helps Nova catch PIKO. 
    His loyalties are a mystery, and that's exactly how he likes it. With his silver tongue and 
    incredible pranks, Finn keeps everyone guessing.`,
    traits: ['Cunning', 'Charming', 'Sneaky', 'Witty', 'Double Agent', 'Master of Disguise'],
    color: '#FFB347',
    isMain: false,
    stats: { episodes: '120+', fans: '600K+', catchphrase: '"Trust me... or don\'t!"' },
  },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

export default function CharactersPage() {
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
          {characters.map((char, index) => (
            <motion.div
              key={char.name}
              className={`${styles.charSection} ${index % 2 === 1 ? styles.reversed : ''}`}
              variants={itemVariants}
              style={{ '--char-color': char.color } as React.CSSProperties}
            >
              <div className={styles.charVisual}>
                <div className={styles.charGlow} />
                <div className={styles.charAvatar}>
                  <span>{char.emoji}</span>
                </div>
                {char.isMain && (
                  <div className={styles.mainRibbon}>⭐ Main Character</div>
                )}
              </div>

              <div className={styles.charContent}>
                <div className={styles.nameRow}>
                  <h2 className={styles.charName}>{char.name}</h2>
                  <span className={styles.charRole}>{char.role}</span>
                </div>
                <p className={styles.charBio}>{char.fullBio}</p>

                <div className={styles.statsRow}>
                  <div className={styles.stat}>
                    <span className={styles.statVal}>{char.stats.episodes}</span>
                    <span className={styles.statLbl}>Episodes</span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.statVal}>{char.stats.fans}</span>
                    <span className={styles.statLbl}>Fans</span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.statVal}>{char.stats.catchphrase}</span>
                    <span className={styles.statLbl}>Catchphrase</span>
                  </div>
                </div>

                <div className={styles.traits}>
                  {char.traits.map((trait) => (
                    <span key={trait} className={styles.trait}>{trait}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
