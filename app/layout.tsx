import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'ChoicelyRun — Your Fate is in PIKO\'s Hands',
  description: 'Welcome to ChoicelyRun! Meet PIKO, the master of chaos, and explore our world of animated adventures, original characters, and daily entertainment.',
  keywords: 'ChoicelyRun, PIKO, animation, YouTube, shorts, characters, Nova, Finn',
  openGraph: {
    title: 'ChoicelyRun — Your Fate is in PIKO\'s Hands',
    description: 'Meet PIKO, the master of chaos. Original characters, daily animated content, cinematic quality.',
    url: 'https://choicelyrun.com',
    siteName: 'ChoicelyRun',
    type: 'website',
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
        <Header />
        <main style={{ paddingTop: 'var(--header-height)' }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
