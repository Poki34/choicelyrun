'use client';

import { motion } from 'framer-motion';
import { Sparkles, Zap, Film, Award, Heart, TrendingUp } from 'lucide-react';
import styles from './FeaturesSection.module.css';

const features = [
  {
    icon: Sparkles,
    title: 'Original Characters',
    description: 'Meet PIKO, Nova, Finn and a cast of unforgettable characters brought to life with stunning animation.',
    color: '#7B4FD4',
  },
  {
    icon: Zap,
    title: 'Daily Chaos',
    description: 'New adventures uploaded regularly. Join the fans who start their day with a dose of PIKO chaos!',
    color: '#FF6B6B',
  },
  {
    icon: Film,
    title: 'Cinematic Quality',
    description: 'Professional-grade animation with captivating storylines that entertain audiences worldwide.',
    color: '#4ECDC4',
  },
  {
    icon: Award,
    title: 'Creative Excellence',
    description: 'Recognized for creative innovation in digital animation and entertainment content.',
    color: '#FFD93D',
  },
  {
    icon: Heart,
    title: 'Family-Friendly',
    description: 'Safe, positive content that brings everyone together. Entertainment that everyone loves.',
    color: '#FF6B9D',
  },
  {
    icon: TrendingUp,
    title: 'Trending Content',
    description: 'Join the millions who are watching, sharing, and loving our videos. Be part of the sensation!',
    color: '#6BCB77',
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function FeaturesSection() {
  return (
    <section className={`section ${styles.features}`}>
      <div className="container">
        <div className="section-title">
          <h2>Why ChoicelyRun?</h2>
          <p>Discover what makes our animated world truly special</p>
        </div>

        <motion.div
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              className={`glass-card ${styles.card}`}
              variants={itemVariants}
            >
              <div
                className={styles.iconWrap}
                style={{ '--feature-color': feature.color } as React.CSSProperties}
              >
                <feature.icon size={24} />
              </div>
              <h3 className={styles.cardTitle}>{feature.title}</h3>
              <p className={styles.cardDesc}>{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
