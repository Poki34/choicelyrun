import { NextResponse } from 'next/server';
import { getChannelStats, getLatestVideos, getPlaylists } from '@/lib/youtube';

export async function GET() {
  try {
    const [stats, videos, playlists] = await Promise.all([
      getChannelStats(),
      getLatestVideos(12),
      getPlaylists(10),
    ]);

    return NextResponse.json({
      stats,
      videos,
      playlists,
    });
  } catch (err) {
    console.error('YouTube API error:', err);
    return NextResponse.json({ error: 'Failed to fetch YouTube data' }, { status: 500 });
  }
}
