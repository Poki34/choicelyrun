import type { Metadata } from 'next';
import './globals.css';
import LayoutShell from '@/components/layout/LayoutShell';

export const metadata: Metadata = {
  title: {
    default: 'ChoicelyRun — Your Fate is in PIKO\'s Hands',
    template: '%s | ChoicelyRun',
  },
  description: 'Welcome to ChoicelyRun! Meet PIKO, the master of chaos, and explore our world of animated adventures, original characters, and daily entertainment.',
  keywords: 'ChoicelyRun, PIKO, animation, YouTube, shorts, characters, Nova, Finn',
  metadataBase: new URL('https://choicelyrun.com'),
  openGraph: {
    title: 'ChoicelyRun — Your Fate is in PIKO\'s Hands',
    description: 'Meet PIKO, the master of chaos. Original characters, daily animated content, cinematic quality.',
    url: 'https://choicelyrun.com',
    siteName: 'ChoicelyRun',
    type: 'website',
    locale: 'en_US',
    images: [{
      url: '/images/og-image.png',
      width: 1200,
      height: 630,
      alt: 'ChoicelyRun — Meet PIKO',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ChoicelyRun — Your Fate is in PIKO\'s Hands',
    description: 'Meet PIKO, the master of chaos. Original characters, daily animated content.',
    images: ['/images/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <LayoutShell>
          {children}
        </LayoutShell>
      </body>
    </html>
  );
}
