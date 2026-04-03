'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Upload, Trash2, Copy, Image } from 'lucide-react';

interface MediaFile { name: string; id: string; created_at: string; metadata: any; }

export default function AdminMedia() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState('');

  useEffect(() => { fetchFiles(); }, []);

  async function fetchFiles() {
    const { data } = await supabase.storage.from('media').list('', { sortBy: { column: 'created_at', order: 'desc' } });
    setFiles(data || []);
    setLoading(false);
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) return alert('Max file size is 10MB');

    setUploading(true);
    const fileName = `${Date.now()}_${file.name}`;
    await supabase.storage.from('media').upload(fileName, file);
    setUploading(false);
    fetchFiles();
  }

  function getPublicUrl(name: string): string {
    const { data } = supabase.storage.from('media').getPublicUrl(name);
    return data.publicUrl;
  }

  async function copyUrl(name: string) {
    const url = getPublicUrl(name);
    await navigator.clipboard.writeText(url);
    setCopied(name);
    setTimeout(() => setCopied(''), 2000);
  }

  async function deleteFile(name: string) {
    if (!confirm('Delete this file?')) return;
    await supabase.storage.from('media').remove([name]);
    fetchFiles();
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: 4 }}>Media Library</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{files.length} files</p>
        </div>
        <label className="btn btn-primary" style={{ cursor: 'pointer' }}>
          <Upload size={18} /> {uploading ? 'Uploading...' : 'Upload File'}
          <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleUpload} style={{ display: 'none' }} />
        </label>
      </div>

      {loading ? <p style={{ color: 'var(--text-secondary)' }}>Loading...</p> :
      files.length === 0 ? (
        <div className="glass-card" style={{ padding: 60, textAlign: 'center', color: 'var(--text-secondary)' }}>
          <Image size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
          <p>No media files yet. Upload images to get started.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
          {files.map((f) => (
            <div key={f.name} className="glass-card" style={{ overflow: 'hidden' }}>
              <div style={{ aspectRatio: '1', background: 'var(--card-bg)', position: 'relative' }}>
                <img src={getPublicUrl(f.name)} alt={f.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '10px 12px' }}>
                <p style={{ fontSize: '0.78rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 8 }}>{f.name}</p>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => copyUrl(f.name)} style={{ flex: 1, padding: '6px', borderRadius: 8, border: '1px solid var(--border-color)', background: 'transparent', color: copied === f.name ? 'var(--success)' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.72rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                    <Copy size={12} /> {copied === f.name ? 'Copied!' : 'Copy URL'}
                  </button>
                  <button onClick={() => deleteFile(f.name)} style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid rgba(229,57,53,0.2)', background: 'transparent', color: 'var(--error)', cursor: 'pointer' }}>
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
