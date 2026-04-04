import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Videos',
  description: 'Watch all ChoicelyRun animated shorts, playlists and special episodes featuring PIKO, Nova and Finn.',
  openGraph: {
    title: 'Videos | ChoicelyRun',
    description: 'Watch all ChoicelyRun animated shorts and playlists.',
  },
};

export default function VideosLayout({ children }: { children: React.ReactNode }) {
  return children;
}
