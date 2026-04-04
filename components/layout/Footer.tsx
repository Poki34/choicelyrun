'use client';

import Link from 'next/link';
import { Mail, ExternalLink } from 'lucide-react';
import { YoutubeIcon, InstagramIcon, TikTokIcon } from '@/components/ui/SocialIcons';
import { useSiteSettings } from '@/lib/SiteSettingsContext';
import styles from './Footer.module.css';

const footerLinks = [
  { href: '/', label: 'Home' },
  { href: '/videos', label: 'Videos' },
  { href: '/characters', label: 'Characters' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Footer() {
  const settings = useSiteSettings();

  const socialLinks = [
    { href: settings.youtube_url, icon: YoutubeIcon, label: 'YouTube', color: '#FF0000' },
    { href: settings.instagram_url, icon: InstagramIcon, label: 'Instagram', color: '#E4405F' },
    { href: settings.tiktok_url, icon: TikTokIcon, label: 'TikTok', color: '#00f2ea' },
  ];

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerInner}`}>
        <div className={styles.footerTop}>
          <div className={styles.footerBrand}>
            <div className={styles.logoRow}>
              <div className={styles.logoIcon}>P</div>
              <span className={styles.logoText}>{settings.site_title}</span>
            </div>
            <p className={styles.tagline}>
              {settings.site_description} 🌑
            </p>
            <div className={styles.socialLinks}>
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  style={{ '--social-color': social.color } as React.CSSProperties}
                  title={social.label}
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>

          <div className={styles.footerNav}>
            <h4>Navigation</h4>
            <ul>
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.footerNav}>
            <h4>Content</h4>
            <ul>
              <li>
                <a href={`${settings.youtube_url}/videos`} target="_blank" rel="noopener noreferrer">
                  All Videos <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a href={`${settings.youtube_url}/playlists`} target="_blank" rel="noopener noreferrer">
                  Playlists <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a href={`${settings.youtube_url}/community`} target="_blank" rel="noopener noreferrer">
                  Community <ExternalLink size={12} />
                </a>
              </li>
            </ul>
          </div>

          <div className={styles.footerNav}>
            <h4>Contact</h4>
            <ul>
              <li>
                <a href={`mailto:${settings.contact_email}`}>
                  <Mail size={14} /> {settings.contact_email}
                </a>
              </li>
            </ul>
            <p className={styles.contactNote}>
              You can reach us through social media
            </p>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>Copyright © 2026 {settings.site_title}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
