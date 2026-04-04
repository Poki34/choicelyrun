import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with the ChoicelyRun team. Send us a message, collaborate with us, or reach out on social media.',
  openGraph: {
    title: 'Contact | ChoicelyRun',
    description: 'Get in touch with the ChoicelyRun team.',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
