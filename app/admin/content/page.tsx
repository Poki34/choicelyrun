'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Save, CheckCircle } from 'lucide-react';

interface ContentItem { id: string; key: string; value: string; lang: string; updated_at: string; }

const contentKeys = [
  { key: 'hero_title', label: 'Hero Title', desc: 'Main heading on homepage' },
  { key: 'hero_slogan', label: 'Hero Slogan', desc: 'Subtitle text under the title' },
  { key: 'about_text', label: 'About Text', desc: 'About page main content' },
  { key: 'cta_text', label: 'CTA Text', desc: 'Call to action section text' },
];

export default function AdminContent() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [saved, setSaved] = useState('');

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    const { data } = await supabase.from('site_content').select('*').eq('lang', 'en');
    setContent(data || []);
  }

  function getValue(key: string): string {
    return content.find(c => c.key === key)?.value || '';
  }

  async function saveContent(key: string, value: string) {
    const existing = content.find(c => c.key === key);
    if (existing) {
      await supabase.from('site_content').update({ value, updated_at: new Date().toISOString() }).eq('id', existing.id);
    } else {
      await supabase.from('site_content').insert([{ key, value, lang: 'en' }]);
    }
    setSaved(key);
    setTimeout(() => setSaved(''), 2000);
    fetchData();
  }

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', marginBottom: 4 }}>Page Content</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 24 }}>Edit site-wide content</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {contentKeys.map((ck) => (
          <ContentEditor key={ck.key} contentKey={ck.key} label={ck.label} desc={ck.desc} value={getValue(ck.key)} onSave={saveContent} saved={saved === ck.key} />
        ))}
      </div>
    </div>
  );
}

function ContentEditor({ contentKey, label, desc, value, onSave, saved }: { contentKey: string; label: string; desc: string; value: string; onSave: (key: string, val: string) => void; saved: boolean }) {
  const [val, setVal] = useState(value);
  useEffect(() => setVal(value), [value]);

  return (
    <div className="glass-card" style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div>
          <h3 style={{ fontSize: '0.95rem', marginBottom: 2 }}>{label}</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>{desc}</p>
        </div>
        <button className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.82rem' }} onClick={() => onSave(contentKey, val)}>
          {saved ? <><CheckCircle size={14} /> Saved!</> : <><Save size={14} /> Save</>}
        </button>
      </div>
      <textarea value={val} onChange={(e) => setVal(e.target.value)} rows={3}
        style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'rgba(13,11,30,0.5)', color: 'white', fontSize: '0.9rem', resize: 'vertical', fontFamily: 'var(--font-body)' }} />
    </div>
  );
}
