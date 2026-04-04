import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about ChoicelyRun — the story behind PIKO and our animated universe of chaos, adventure and fun.',
  openGraph: {
    title: 'About | ChoicelyRun',
    description: 'The story behind the chaos. Learn about ChoicelyRun and PIKO.',
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
