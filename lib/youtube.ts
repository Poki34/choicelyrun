const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

interface YouTubeChannelStats {
  subscriberCount: string;
  viewCount: string;
  videoCount: string;
}

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  publishedAt: string;
  viewCount?: string;
}

interface YouTubePlaylist {
  id: string;
  title: string;
  thumbnailUrl: string;
  videoCount: number;
}

interface YouTubeSearchItem {
  id: { videoId: string };
  snippet: {
    title: string;
    description: string;
    thumbnails: { high?: { url: string }; default?: { url: string } };
    publishedAt: string;
  };
}

interface YouTubePlaylistItem {
  id: string;
  snippet: {
    title: string;
    thumbnails: { high?: { url: string }; default?: { url: string } };
  };
  contentDetails: { itemCount: number };
}

export async function getChannelStats(): Promise<YouTubeChannelStats | null> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID;
  
  if (!apiKey || !channelId) return null;
  
  try {
    const res = await fetch(
      `${YOUTUBE_API_BASE}/channels?part=statistics&id=${channelId}&key=${apiKey}`,
      { next: { revalidate: 3600 } }
    );
    const data = await res.json();
    
    if (data.items && data.items.length > 0) {
      const stats = data.items[0].statistics;
      return {
        subscriberCount: stats.subscriberCount,
        viewCount: stats.viewCount,
        videoCount: stats.videoCount,
      };
    }
    return null;
  } catch {
    return null;
  }
}

export async function getLatestVideos(maxResults = 6): Promise<YouTubeVideo[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID;
  
  if (!apiKey || !channelId) return [];
  
  try {
    const searchRes = await fetch(
      `${YOUTUBE_API_BASE}/search?part=snippet&channelId=${channelId}&maxResults=${maxResults}&order=date&type=video&key=${apiKey}`,
      { next: { revalidate: 3600 } }
    );
    const searchData = await searchRes.json();
    
    if (!searchData.items) return [];
    
    const videoIds = searchData.items.map((item: YouTubeSearchItem) => item.id.videoId).join(',');
    
    const statsRes = await fetch(
      `${YOUTUBE_API_BASE}/videos?part=statistics&id=${videoIds}&key=${apiKey}`,
      { next: { revalidate: 3600 } }
    );
    const statsData = await statsRes.json();
    
    return searchData.items.map((item: YouTubeSearchItem, index: number) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnailUrl: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
      publishedAt: item.snippet.publishedAt,
      viewCount: statsData.items?.[index]?.statistics?.viewCount || '0',
    }));
  } catch {
    return [];
  }
}

export async function getPlaylists(maxResults = 6): Promise<YouTubePlaylist[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID;
  
  if (!apiKey || !channelId) return [];
  
  try {
    const res = await fetch(
      `${YOUTUBE_API_BASE}/playlists?part=snippet,contentDetails&channelId=${channelId}&maxResults=${maxResults}&key=${apiKey}`,
      { next: { revalidate: 3600 } }
    );
    const data = await res.json();
    
    if (!data.items) return [];
    
    return data.items.map((item: YouTubePlaylistItem) => ({
      id: item.id,
      title: item.snippet.title,
      thumbnailUrl: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
      videoCount: item.contentDetails.itemCount,
    }));
  } catch {
    return [];
  }
}

export function formatCount(count: string | number): string {
  const num = typeof count === 'string' ? parseInt(count) : count;
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}
