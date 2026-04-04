'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, Star, StarOff, RefreshCw, Download } from 'lucide-react';

interface Playlist {
  id: string;
  youtube_playlist_id: string;
  title: string;
  thumbnail_url: string;
  video_count: number;
  is_featured: boolean;
  sort_order: number;
}

export default function AdminPlaylists() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ url: '', title: '', videoCount: '' });
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState('');

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    const { data } = await supabase.from('playlists').select('*').order('sort_order');
    setPlaylists(data || []);
    setLoading(false);
  }

  function extractPlaylistId(url: string): string {
    const match = url.match(/[?&]list=([^&]+)/);
    return match ? match[1] : url;
  }

  async function handleAdd() {
    if (!form.title) return;
    const plId = extractPlaylistId(form.url);
    await supabase.from('playlists').insert([{
      youtube_playlist_id: plId,
      title: form.title,
      video_count: parseInt(form.videoCount) || 0,
      is_featured: false,
      sort_order: playlists.length,
    }]);
    setForm({ url: '', title: '', videoCount: '' });
    setShowAdd(false);
    fetchData();
  }

  async function syncFromYouTube() {
    setSyncing(true);
    setSyncResult('');
    try {
      const res = await fetch('/api/youtube', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'playlists' }),
      });
      const data = await res.json();
      if (data.success) {
        setSyncResult(`✅ ${data.synced.playlists} yeni playlist senkronize edildi!`);
        fetchData();
      } else {
        setSyncResult(`❌ Hata: ${data.error}`);
      }
    } catch {
      setSyncResult('❌ Senkronizasyon başarısız oldu');
    }
    setSyncing(false);
  }

  async function toggleFeatured(id: string, current: boolean) {
    await supabase.from('playlists').update({ is_featured: !current }).eq('id', id);
    fetchData();
  }

  async function deletePlaylist(id: string) {
    if (!confirm('Delete this playlist?')) return;
    await supabase.from('playlists').delete().eq('id', id);
    fetchData();
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: 4 }}>Playlist Management</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{playlists.length} playlists</p>
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

      {showAdd && (
        <div className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
          <h3 style={{ marginBottom: 16 }}>Manuel Playlist Ekle</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input placeholder="YouTube Playlist URL" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })}
              style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--card-bg)', color: 'white' }} />
            <input placeholder="Playlist Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--card-bg)', color: 'white' }} />
            <input placeholder="Video Count" type="number" value={form.videoCount} onChange={(e) => setForm({ ...form, videoCount: e.target.value })}
              style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--card-bg)', color: 'white' }} />
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn btn-primary" onClick={handleAdd}>Save</button>
              <button className="btn btn-outline" onClick={() => setShowAdd(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {loading ? <p style={{ color: 'var(--text-secondary)' }}>Loading...</p> :
        playlists.length === 0 ? (
          <div className="glass-card" style={{ padding: 40, textAlign: 'center', color: 'var(--text-secondary)' }}>
            <Download size={32} style={{ marginBottom: 12, opacity: 0.3 }} />
            <p style={{ marginBottom: 8 }}>Henüz playlist yok.</p>
            <p style={{ fontSize: '0.85rem' }}>&quot;YouTube&apos;dan Çek&quot; butonuyla playlistlerinizi otomatik çekebilirsiniz.</p>
          </div>
        ) : playlists.map((pl) => (
          <div key={pl.id} className="glass-card" style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 12, overflow: 'hidden', background: 'linear-gradient(135deg, var(--primary-purple), var(--accent-purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {pl.thumbnail_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={pl.thumbnail_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.2rem' }}>📋</span>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 600, fontSize: '0.92rem', marginBottom: 2 }}>{pl.title}</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>{pl.video_count} videos</p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => toggleFeatured(pl.id, pl.is_featured)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: pl.is_featured ? 'var(--accent-light)' : 'var(--text-secondary)' }}
                title={pl.is_featured ? 'Öne çıkarmayı kaldır' : 'Öne çıkar'}>
                {pl.is_featured ? <Star size={18} fill="var(--accent-light)" /> : <StarOff size={18} />}
              </button>
              <button onClick={() => deletePlaylist(pl.id)}
                style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer' }} title="Sil">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
