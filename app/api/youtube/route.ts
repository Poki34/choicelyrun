import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

interface YouTubeSearchItem {
  id: { videoId: string };
  snippet: {
    title: string;
    description: string;
    thumbnails: { high?: { url: string }; medium?: { url: string }; default?: { url: string } };
    publishedAt: string;
  };
}

interface YouTubeVideoStats {
  id: string;
  statistics: { viewCount: string };
}

interface YouTubePlaylistItem {
  id: string;
  snippet: {
    title: string;
    thumbnails: { high?: { url: string }; medium?: { url: string }; default?: { url: string } };
  };
  contentDetails: { itemCount: number };
}

// GET: Fetch YouTube data (existing)
export async function GET() {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    const channelId = process.env.YOUTUBE_CHANNEL_ID;
    if (!apiKey || !channelId) {
      return NextResponse.json({ error: 'YouTube API not configured' }, { status: 500 });
    }

    const [statsRes, videosRes, playlistsRes] = await Promise.all([
      fetch(`${YOUTUBE_API_BASE}/channels?part=statistics&id=${channelId}&key=${apiKey}`),
      fetch(`${YOUTUBE_API_BASE}/search?part=snippet&channelId=${channelId}&maxResults=50&order=date&type=video&key=${apiKey}`),
      fetch(`${YOUTUBE_API_BASE}/playlists?part=snippet,contentDetails&channelId=${channelId}&maxResults=50&key=${apiKey}`),
    ]);

    const statsData = await statsRes.json();
    const videosData = await videosRes.json();
    const playlistsData = await playlistsRes.json();

    return NextResponse.json({
      stats: statsData.items?.[0]?.statistics || null,
      videos: videosData.items || [],
      playlists: playlistsData.items || [],
    });
  } catch (err) {
    console.error('YouTube API error:', err);
    return NextResponse.json({ error: 'Failed to fetch YouTube data' }, { status: 500 });
  }
}

// POST: Sync YouTube videos/playlists to Supabase
export async function POST(request: NextRequest) {
  try {
    const { type } = await request.json(); // 'videos' | 'playlists' | 'all'
    const apiKey = process.env.YOUTUBE_API_KEY;
    const channelId = process.env.YOUTUBE_CHANNEL_ID;

    if (!apiKey || !channelId) {
      return NextResponse.json({ error: 'YouTube API not configured' }, { status: 500 });
    }

    const supabase = getServiceSupabase();
    let syncedVideos = 0;
    let syncedPlaylists = 0;

    // ============ SYNC VIDEOS ============
    if (type === 'videos' || type === 'all') {
      // Fetch all videos from YouTube channel
      const searchRes = await fetch(
        `${YOUTUBE_API_BASE}/search?part=snippet&channelId=${channelId}&maxResults=50&order=date&type=video&key=${apiKey}`
      );
      const searchData = await searchRes.json();
      const items: YouTubeSearchItem[] = searchData.items || [];

      if (items.length > 0) {
        // Get view counts
        const videoIds = items.map(item => item.id.videoId).join(',');
        const statsRes = await fetch(
          `${YOUTUBE_API_BASE}/videos?part=statistics&id=${videoIds}&key=${apiKey}`
        );
        const statsData = await statsRes.json();
        const statsMap = new Map<string, string>();
        (statsData.items || []).forEach((s: YouTubeVideoStats) => {
          statsMap.set(s.id, s.statistics.viewCount);
        });

        // Get existing videos in Supabase
        const { data: existing } = await supabase.from('videos').select('youtube_id');
        const existingIds = new Set((existing || []).map(v => v.youtube_id));

        // Insert new videos
        const newVideos = items
          .filter(item => !existingIds.has(item.id.videoId))
          .map((item, index) => ({
            youtube_id: item.id.videoId,
            title: item.snippet.title,
            description: item.snippet.description || '',
            thumbnail_url: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url || '',
            category: 'shorts' as const,
            is_visible: true,
            sort_order: index,
            view_count: parseInt(statsMap.get(item.id.videoId) || '0'),
            published_at: item.snippet.publishedAt,
          }));

        if (newVideos.length > 0) {
          await supabase.from('videos').insert(newVideos);
          syncedVideos = newVideos.length;
        }

        // Update view counts for existing videos
        for (const item of items) {
          if (existingIds.has(item.id.videoId)) {
            const viewCount = parseInt(statsMap.get(item.id.videoId) || '0');
            await supabase.from('videos')
              .update({ view_count: viewCount, thumbnail_url: item.snippet.thumbnails.high?.url || '' })
              .eq('youtube_id', item.id.videoId);
          }
        }
      }
    }

    // ============ SYNC PLAYLISTS ============
    if (type === 'playlists' || type === 'all') {
      const plRes = await fetch(
        `${YOUTUBE_API_BASE}/playlists?part=snippet,contentDetails&channelId=${channelId}&maxResults=50&key=${apiKey}`
      );
      const plData = await plRes.json();
      const plItems: YouTubePlaylistItem[] = plData.items || [];

      if (plItems.length > 0) {
        // Get existing playlists
        const { data: existing } = await supabase.from('playlists').select('youtube_playlist_id');
        const existingIds = new Set((existing || []).map(p => p.youtube_playlist_id));

        // Insert new playlists
        const newPlaylists = plItems
          .filter(item => !existingIds.has(item.id))
          .map((item, index) => ({
            youtube_playlist_id: item.id,
            title: item.snippet.title,
            thumbnail_url: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url || '',
            video_count: item.contentDetails.itemCount,
            is_featured: false,
            sort_order: index,
          }));

        if (newPlaylists.length > 0) {
          await supabase.from('playlists').insert(newPlaylists);
          syncedPlaylists = newPlaylists.length;
        }

        // Update existing playlists
        for (const item of plItems) {
          if (existingIds.has(item.id)) {
            await supabase.from('playlists')
              .update({
                title: item.snippet.title,
                video_count: item.contentDetails.itemCount,
                thumbnail_url: item.snippet.thumbnails.high?.url || '',
              })
              .eq('youtube_playlist_id', item.id);
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      synced: { videos: syncedVideos, playlists: syncedPlaylists },
      message: `Synced ${syncedVideos} videos and ${syncedPlaylists} playlists from YouTube`,
    });
  } catch (err) {
    console.error('YouTube sync error:', err);
    return NextResponse.json({ error: 'Failed to sync YouTube data' }, { status: 500 });
  }
}
