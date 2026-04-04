import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Characters',
  description: 'Meet PIKO, Nova, Finn and all the characters from the ChoicelyRun animated universe.',
  openGraph: {
    title: 'Characters | ChoicelyRun',
    description: 'Meet the stars of ChoicelyRun\'s animated universe.',
  },
};

export default function CharactersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
