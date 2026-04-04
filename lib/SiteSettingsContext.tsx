'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

export interface SiteSettings {
  site_title: string;
  site_description: string;
  youtube_channel_id: string;
  youtube_url: string;
  instagram_url: string;
  tiktok_url: string;
  contact_email: string;
  maintenance_mode: boolean;
}

const defaults: SiteSettings = {
  site_title: 'ChoicelyRun',
  site_description: "Your fate is in PIKO's hands",
  youtube_channel_id: '',
  youtube_url: 'https://www.youtube.com/@ChoicelyRun',
  instagram_url: 'https://instagram.com/choicelyrun',
  tiktok_url: 'https://www.tiktok.com/@choicelyrun',
  contact_email: 'support@choicelyrun.com',
  maintenance_mode: false,
};

const SiteSettingsContext = createContext<SiteSettings>(defaults);

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaults);

  useEffect(() => {
    async function load() {
      try {
        const { data } = await supabase
          .from('site_content')
          .select('key, value')
          .eq('lang', 'settings');

        if (data && data.length > 0) {
          const s = { ...defaults };
          data.forEach((item: { key: string; value: string }) => {
            if (item.key in s) {
              if (item.key === 'maintenance_mode') {
                (s as Record<string, string | boolean>)[item.key] = item.value === 'true';
              } else {
                (s as Record<string, string | boolean>)[item.key] = item.value;
              }
            }
          });
          setSettings(s);
        }
      } catch (err) {
        console.error('Failed to load site settings:', err);
      }
    }
    load();
  }, []);

  return (
    <SiteSettingsContext.Provider value={settings}>
      {children}
    </SiteSettingsContext.Provider>
  );
}
