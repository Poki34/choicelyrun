'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { YoutubeIcon, InstagramIcon, TikTokIcon } from '@/components/ui/SocialIcons';
import styles from './contact.module.css';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to send message');
      }

      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err: unknown) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  return (
    <div className={styles.page}>
      <div className="container">
        <motion.div
          className={styles.pageHeader}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1>Contact Us</h1>
          <p>Got a question? Want to collaborate? Reach out!</p>
        </motion.div>

        <div className={styles.contactGrid}>
          <motion.form
            className={styles.formCard}
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className={styles.formGroup}>
              <label htmlFor="contact-name">Name</label>
              <input
                id="contact-name"
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="contact-email">Email</label>
              <input
                id="contact-email"
                type="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="contact-subject">Subject</label>
              <input
                id="contact-subject"
                type="text"
                placeholder="What's this about?"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                required
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="contact-message">Message</label>
              <textarea
                id="contact-message"
                placeholder="Tell us more..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
                rows={5}
                className={styles.textarea}
              />
            </div>

            {status === 'success' && (
              <div className={styles.successMsg}>
                <CheckCircle size={18} /> Message sent successfully! We&apos;ll get back to you soon.
              </div>
            )}

            {status === 'error' && (
              <div className={styles.errorMsg}>
                <AlertCircle size={18} /> {errorMsg || 'Something went wrong. Please try again.'}
              </div>
            )}

            <button
              type="submit"
              className={`btn btn-primary ${styles.submitBtn}`}
              disabled={status === 'loading'}
            >
              {status === 'loading' ? (
                'Sending...'
              ) : (
                <>
                  <Send size={18} /> Send Message
                </>
              )}
            </button>
          </motion.form>

          <motion.div
            className={styles.infoSide}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className={`glass-card ${styles.infoCard}`}>
              <Mail size={24} className={styles.infoIcon} />
              <h3>Email Us</h3>
              <a href="mailto:support@choicelyrun.com">support@choicelyrun.com</a>
            </div>

            <div className={`glass-card ${styles.infoCard}`}>
              <h3>Follow Us</h3>
              <p>Reach out on any of our social channels</p>
              <div className={styles.socials}>
                <a href="https://www.youtube.com/@ChoicelyRun" target="_blank" rel="noopener noreferrer">
                  <YoutubeIcon size={22} /> YouTube
                </a>
                <a href="https://instagram.com/choicelyrun" target="_blank" rel="noopener noreferrer">
                  <InstagramIcon size={22} /> Instagram
                </a>
                <a href="https://www.tiktok.com/@choicelyrun" target="_blank" rel="noopener noreferrer">
                  <TikTokIcon size={22} /> TikTok
                </a>
              </div>
            </div>

            <div className={`glass-card ${styles.pikoCard}`}>
              <div className={styles.pikoEmoji}>👾</div>
              <p>Hi friend, welcome! Don&apos;t forget to subscribe!</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
