'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Mail, Trash2, Check, Clock } from 'lucide-react';

interface Message { id: string; name: string; email: string; subject: string; message: string; is_read: boolean; created_at: string; }

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Message | null>(null);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    const { data } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
    setMessages(data || []);
    setLoading(false);
  }

  async function markRead(id: string) {
    await supabase.from('contact_messages').update({ is_read: true }).eq('id', id);
    fetchData();
  }

  async function deleteMsg(id: string) {
    if (!confirm('Delete this message?')) return;
    await supabase.from('contact_messages').delete().eq('id', id);
    if (selected?.id === id) setSelected(null);
    fetchData();
  }

  const unread = messages.filter(m => !m.is_read).length;

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', marginBottom: 4 }}>Messages</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 24 }}>
        {messages.length} total • {unread > 0 && <span style={{ color: 'var(--error)' }}>{unread} unread</span>}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 20, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: '70vh', overflowY: 'auto' }}>
          {loading ? <p style={{ color: 'var(--text-secondary)' }}>Loading...</p> :
          messages.length === 0 ? (
            <div className="glass-card" style={{ padding: 40, textAlign: 'center', color: 'var(--text-secondary)' }}>No messages yet.</div>
          ) : messages.map((m) => (
            <div key={m.id} className="glass-card" style={{ padding: '14px 18px', cursor: 'pointer', borderColor: !m.is_read ? 'rgba(123,79,212,0.4)' : undefined, background: selected?.id === m.id ? 'rgba(123,79,212,0.1)' : undefined }}
              onClick={() => { setSelected(m); if (!m.is_read) markRead(m.id); }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{m.name}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {!m.is_read && <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--error)' }} />}
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.72rem' }}>{new Date(m.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              <p style={{ color: 'var(--accent-light)', fontSize: '0.82rem', marginBottom: 2 }}>{m.subject}</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.message}</p>
            </div>
          ))}
        </div>

        <div>
          {selected ? (
            <div className="glass-card" style={{ padding: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <div>
                  <h2 style={{ fontSize: '1.1rem', marginBottom: 4 }}>{selected.subject}</h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>From: {selected.name} &lt;{selected.email}&gt;</p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>{new Date(selected.created_at).toLocaleString()}</p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`} className="btn btn-primary" style={{ padding: '8px 14px', fontSize: '0.82rem' }}>
                    <Mail size={14} /> Reply
                  </a>
                  <button onClick={() => deleteMsg(selected.id)} style={{ background: 'none', border: '1px solid rgba(229,57,53,0.3)', borderRadius: 10, padding: '8px 12px', color: 'var(--error)', cursor: 'pointer' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div style={{ background: 'rgba(13,11,30,0.5)', borderRadius: 12, padding: 20 }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{selected.message}</p>
              </div>
            </div>
          ) : (
            <div className="glass-card" style={{ padding: 60, textAlign: 'center', color: 'var(--text-secondary)' }}>
              <Mail size={36} style={{ marginBottom: 12, opacity: 0.3 }} />
              <p>Select a message to view</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
