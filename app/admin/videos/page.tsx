'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, Eye, EyeOff, ExternalLink, RefreshCw, Download } from 'lucide-react';

interface VideoItem {
  id: string;
  youtube_id: string;
  title: string;
  thumbnail_url: string;
  category: string;
  is_visible: boolean;
  sort_order: number;
  view_count: number;
  created_at: string;
}

export default function AdminVideos() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [addTitle, setAddTitle] = useState('');
  const [addCategory, setAddCategory] = useState('shorts');
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState('');

  useEffect(() => { fetchVideos(); }, []);

  async function fetchVideos() {
    const { data } = await supabase.from('videos').select('*').order('sort_order');
    setVideos(data || []);
    setLoading(false);
  }

  function extractVideoId(url: string): string {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/))([^&\n?]+)/);
    return match ? match[1] : '';
  }

  async function handleAdd() {
    const videoId = extractVideoId(youtubeUrl);
    if (!videoId || !addTitle) return;

    await supabase.from('videos').insert([{
      youtube_id: videoId,
      title: addTitle,
      thumbnail_url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      category: addCategory,
      is_visible: true,
      sort_order: videos.length,
    }]);

    setYoutubeUrl('');
    setAddTitle('');
    setShowAdd(false);
    fetchVideos();
  }

  async function syncFromYouTube() {
    setSyncing(true);
    setSyncResult('');
    try {
      const res = await fetch('/api/youtube', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'all' }),
      });
      const data = await res.json();
      if (data.success) {
        setSyncResult(`✅ ${data.synced.videos} yeni video, ${data.synced.playlists} yeni playlist senkronize edildi!`);
        fetchVideos();
      } else {
        setSyncResult(`❌ Hata: ${data.error}`);
      }
    } catch {
      setSyncResult('❌ Senkronizasyon başarısız oldu');
    }
    setSyncing(false);
  }

  async function toggleVisibility(id: string, current: boolean) {
    await supabase.from('videos').update({ is_visible: !current }).eq('id', id);
    fetchVideos();
  }

  async function deleteVideo(id: string) {
    if (!confirm('Delete this video?')) return;
    await supabase.from('videos').delete().eq('id', id);
    fetchVideos();
  }

  function formatCount(count: number): string {
    if (!count) return '0';
    if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
    if (count >= 1000) return (count / 1000).toFixed(1) + 'K';
    return count.toString();
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: 4 }}>Video Management</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{videos.length} videos</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            className="btn btn-outline"
            onClick={syncFromYouTube}
            disabled={syncing}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            {syncing ? (
              <><RefreshCw size={16} className="spin" /> Syncing...</>
            ) : (
              <><Download size={16} /> YouTube&apos;dan Çek</>
            )}
          </button>
          <button className="btn btn-primary" onClick={() => setShowAdd(!showAdd)}>
            <Plus size={18} /> Manuel Ekle
          </button>
        </div>
      </div>

      {/* Sync Result */}
      {syncResult && (
        <div className="glass-card" style={{
          padding: '14px 20px',
          marginBottom: 20,
          fontSize: '0.9rem',
          borderColor: syncResult.startsWith('✅') ? 'rgba(76,175,80,0.3)' : 'rgba(229,57,53,0.3)',
        }}>
          {syncResult}
        </div>
      )}

      {/* Manual Add Form */}
      {showAdd && (
        <div className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
          <h3 style={{ marginBottom: 16 }}>Manuel Video Ekle</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input
              placeholder="YouTube URL (shorts or video)"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--card-bg)', color: 'white', fontSize: '0.9rem' }}
            />
            <input
              placeholder="Video Title"
              value={addTitle}
              onChange={(e) => setAddTitle(e.target.value)}
              style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--card-bg)', color: 'white', fontSize: '0.9rem' }}
            />
            <select
              value={addCategory}
              onChange={(e) => setAddCategory(e.target.value)}
              style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--card-bg)', color: 'white', fontSize: '0.9rem' }}
            >
              <option value="shorts">Shorts</option>
              <option value="playlist">Playlist</option>
              <option value="special">Special</option>
            </select>
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn btn-primary" onClick={handleAdd}>Save</button>
              <button className="btn btn-outline" onClick={() => setShowAdd(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Video List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {loading ? (
          <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
        ) : videos.length === 0 ? (
          <div className="glass-card" style={{ padding: 40, textAlign: 'center', color: 'var(--text-secondary)' }}>
            <Download size={32} style={{ marginBottom: 12, opacity: 0.3 }} />
            <p style={{ marginBottom: 8 }}>Henüz video yok.</p>
            <p style={{ fontSize: '0.85rem' }}>
              &quot;YouTube&apos;dan Çek&quot; butonuna tıklayarak kanalınızdaki videoları otomatik olarak çekebilirsiniz.
            </p>
          </div>
        ) : (
          videos.map((v) => (
            <div key={v.id} className="glass-card" style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 80, height: 60, borderRadius: 8, overflow: 'hidden', background: 'var(--card-bg)', flexShrink: 0 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {v.thumbnail_url && <img src={v.thumbnail_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.title}</p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
                  {v.category} • {formatCount(v.view_count)} views • {new Date(v.created_at).toLocaleDateString()}
                </p>
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <button onClick={() => toggleVisibility(v.id, v.is_visible)}
                  style={{ background: 'none', border: 'none', color: v.is_visible ? 'var(--success)' : 'var(--text-secondary)', cursor: 'pointer' }}
                  title={v.is_visible ? 'Gizle' : 'Göster'}>
                  {v.is_visible ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
                <a href={`https://youtube.com/watch?v=${v.youtube_id}`} target="_blank" rel="noopener noreferrer"
                  style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }} title="YouTube'da aç">
                  <ExternalLink size={18} />
                </a>
                <button onClick={() => deleteVideo(v.id)}
                  style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer' }} title="Sil">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
