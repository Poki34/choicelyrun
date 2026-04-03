'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, Eye, EyeOff, Star } from 'lucide-react';

interface Character {
  id: string;
  name: string;
  slug: string;
  bio: string;
  image_url: string;
  is_main: boolean;
  is_visible: boolean;
  sort_order: number;
  traits: string[];
}

export default function AdminCharacters() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', bio: '', traits: '' });

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    const { data } = await supabase.from('characters').select('*').order('sort_order');
    setCharacters(data || []);
    setLoading(false);
  }

  async function handleAdd() {
    if (!form.name) return;
    await supabase.from('characters').insert([{
      name: form.name,
      slug: form.name.toLowerCase().replace(/\s+/g, '-'),
      bio: form.bio,
      is_main: false,
      is_visible: true,
      sort_order: characters.length,
      traits: form.traits.split(',').map(t => t.trim()).filter(Boolean),
    }]);
    setForm({ name: '', bio: '', traits: '' });
    setShowAdd(false);
    fetchData();
  }

  async function toggleVisibility(id: string, current: boolean) {
    await supabase.from('characters').update({ is_visible: !current }).eq('id', id);
    fetchData();
  }

  async function deleteChar(id: string, isMain: boolean) {
    if (isMain) return alert('Cannot delete main character');
    if (!confirm('Delete this character?')) return;
    await supabase.from('characters').delete().eq('id', id);
    fetchData();
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: 4 }}>Character Management</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{characters.length} characters</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(!showAdd)}>
          <Plus size={18} /> Add Character
        </button>
      </div>

      {showAdd && (
        <div className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
          <h3 style={{ marginBottom: 16 }}>Add New Character</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input placeholder="Character Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--card-bg)', color: 'white' }} />
            <textarea placeholder="Biography" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3}
              style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--card-bg)', color: 'white', resize: 'vertical' }} />
            <input placeholder="Traits (comma separated)" value={form.traits} onChange={(e) => setForm({ ...form, traits: e.target.value })}
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
        characters.length === 0 ? (
          <div className="glass-card" style={{ padding: 40, textAlign: 'center', color: 'var(--text-secondary)' }}>
            No characters yet.
          </div>
        ) : characters.map((c) => (
          <div key={c.id} className="glass-card" style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary-purple), var(--accent-purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>
              {c.is_main ? '👾' : '🎭'}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>{c.name}</p>
                {c.is_main && <Star size={14} fill="var(--accent-light)" color="var(--accent-light)" />}
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>{c.bio?.substring(0, 80)}...</p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => toggleVisibility(c.id, c.is_visible)} style={{ background: 'none', border: 'none', color: c.is_visible ? 'var(--success)' : 'var(--text-secondary)', cursor: 'pointer' }}>
                {c.is_visible ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
              <button onClick={() => deleteChar(c.id, c.is_main)} style={{ background: 'none', border: 'none', color: c.is_main ? 'var(--text-secondary)' : 'var(--error)', cursor: 'pointer', opacity: c.is_main ? 0.3 : 1 }}>
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
