'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Save, CheckCircle, Shield, Globe, Mail, AlertTriangle } from 'lucide-react';
import { YoutubeIcon } from '@/components/ui/SocialIcons';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    site_title: 'ChoicelyRun',
    site_description: 'Your fate is in PIKO\'s hands',
    youtube_channel_id: '',
    youtube_url: 'https://www.youtube.com/@ChoicelyRun',
    instagram_url: 'https://instagram.com/choicelyrun',
    tiktok_url: 'https://www.tiktok.com/@choicelyrun',
    contact_email: 'support@choicelyrun.com',
    maintenance_mode: false,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: '', newPass: '', confirm: '' });
  const [passwordMsg, setPasswordMsg] = useState('');

  useEffect(() => {
    async function loadSettings() {
      const { data } = await supabase.from('site_content').select('*').eq('lang', 'settings');
      if (data) {
        const s: any = { ...settings };
        data.forEach(item => { if (item.key in s) s[item.key] = item.value; });
        setSettings(s);
      }
    }
    loadSettings();
  }, []);

  async function saveSettings() {
    setSaving(true);
    for (const [key, value] of Object.entries(settings)) {
      const { data: existing } = await supabase.from('site_content').select('id').eq('key', key).eq('lang', 'settings').single();
      if (existing) {
        await supabase.from('site_content').update({ value: String(value) }).eq('id', existing.id);
      } else {
        await supabase.from('site_content').insert([{ key, value: String(value), lang: 'settings' }]);
      }
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function changePassword() {
    if (passwordForm.newPass !== passwordForm.confirm) {
      setPasswordMsg('Passwords do not match');
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: passwordForm.newPass });
    if (error) setPasswordMsg(error.message);
    else {
      setPasswordMsg('Password updated successfully!');
      setPasswordForm({ current: '', newPass: '', confirm: '' });
    }
  }

  const inputStyle = { padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'rgba(13,11,30,0.5)', color: 'white', fontSize: '0.9rem', width: '100%', fontFamily: 'var(--font-body)' };

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', marginBottom: 4 }}>Settings</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 24 }}>Site configuration</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* SEO */}
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}><Globe size={18} /> SEO</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div><label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 4, display: 'block' }}>Site Title</label>
            <input style={inputStyle} value={settings.site_title} onChange={(e) => setSettings({ ...settings, site_title: e.target.value })} /></div>
            <div><label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 4, display: 'block' }}>Site Description</label>
            <input style={inputStyle} value={settings.site_description} onChange={(e) => setSettings({ ...settings, site_description: e.target.value })} /></div>
          </div>
        </div>

        {/* Social */}
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}><YoutubeIcon size={18} /> Social Media</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div><label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 4, display: 'block' }}>YouTube Channel ID</label>
            <input style={inputStyle} value={settings.youtube_channel_id} onChange={(e) => setSettings({ ...settings, youtube_channel_id: e.target.value })} /></div>
            <div><label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 4, display: 'block' }}>YouTube URL</label>
            <input style={inputStyle} value={settings.youtube_url} onChange={(e) => setSettings({ ...settings, youtube_url: e.target.value })} /></div>
            <div><label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 4, display: 'block' }}>Instagram URL</label>
            <input style={inputStyle} value={settings.instagram_url} onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })} /></div>
            <div><label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 4, display: 'block' }}>TikTok URL</label>
            <input style={inputStyle} value={settings.tiktok_url} onChange={(e) => setSettings({ ...settings, tiktok_url: e.target.value })} /></div>
          </div>
        </div>

        {/* Contact */}
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}><Mail size={18} /> Contact</h3>
          <div><label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 4, display: 'block' }}>Contact Email</label>
          <input style={inputStyle} value={settings.contact_email} onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })} /></div>
        </div>

        {/* Maintenance */}
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}><AlertTriangle size={18} /> Maintenance</h3>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
            <input type="checkbox" checked={settings.maintenance_mode as boolean} onChange={(e) => setSettings({ ...settings, maintenance_mode: e.target.checked })}
              style={{ width: 18, height: 18, accentColor: 'var(--accent-purple)' }} />
            <span style={{ fontSize: '0.9rem' }}>Enable maintenance mode</span>
          </label>
        </div>

        <button className="btn btn-primary" onClick={saveSettings} disabled={saving} style={{ alignSelf: 'flex-start' }}>
          {saved ? <><CheckCircle size={16} /> Saved!</> : <><Save size={16} /> {saving ? 'Saving...' : 'Save Settings'}</>}
        </button>

        {/* Password */}
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}><Shield size={18} /> Change Password</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input type="password" placeholder="New Password" style={inputStyle} value={passwordForm.newPass}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPass: e.target.value })} />
            <input type="password" placeholder="Confirm New Password" style={inputStyle} value={passwordForm.confirm}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })} />
            {passwordMsg && <p style={{ fontSize: '0.85rem', color: passwordMsg.includes('success') ? 'var(--success)' : 'var(--error)' }}>{passwordMsg}</p>}
            <button className="btn btn-outline" onClick={changePassword} style={{ alignSelf: 'flex-start' }}>Update Password</button>
          </div>
        </div>
      </div>
    </div>
  );
}
