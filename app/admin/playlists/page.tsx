'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, Star, StarOff } from 'lucide-react';

interface Playlist { id: string; youtube_playlist_id: string; title: string; thumbnail_url: string; video_count: number; is_featured: boolean; sort_order: number; }

export default function AdminPlaylists() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ url: '', title: '', videoCount: '' });

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
        <button className="btn btn-primary" onClick={() => setShowAdd(!showAdd)}><Plus size={18} /> Add Playlist</button>
      </div>

      {showAdd && (
        <div className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
          <h3 style={{ marginBottom: 16 }}>Add Playlist</h3>
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
          <div className="glass-card" style={{ padding: 40, textAlign: 'center', color: 'var(--text-secondary)' }}>No playlists yet.</div>
        ) : playlists.map((pl) => (
          <div key={pl.id} className="glass-card" style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 600, fontSize: '0.92rem', marginBottom: 2 }}>{pl.title}</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>{pl.video_count} videos</p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => toggleFeatured(pl.id, pl.is_featured)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: pl.is_featured ? 'var(--accent-light)' : 'var(--text-secondary)' }}>
                {pl.is_featured ? <Star size={18} fill="var(--accent-light)" /> : <StarOff size={18} />}
              </button>
              <button onClick={() => deletePlaylist(pl.id)} style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer' }}>
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
