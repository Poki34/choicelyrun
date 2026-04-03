import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import VideoGrid from '@/components/home/VideoGrid';
import CharactersSection from '@/components/home/CharactersSection';
import PlaylistsSection from '@/components/home/PlaylistsSection';
import CTASection from '@/components/home/CTASection';
import { getChannelStats, getLatestVideos, getPlaylists } from '@/lib/youtube';

export const revalidate = 3600; // ISR: 1 hour

export default async function HomePage() {
  const [stats, videos, playlists] = await Promise.all([
    getChannelStats(),
    getLatestVideos(6),
    getPlaylists(4),
  ]);

  return (
    <>
      <HeroSection stats={stats} />
      <FeaturesSection />
      <VideoGrid videos={videos} />
      <CharactersSection />
      <PlaylistsSection playlists={playlists} />
      <CTASection />
    </>
  );
}
