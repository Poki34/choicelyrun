-- ChoicelyRun Database Schema
-- Run this in Supabase SQL Editor

-- 1. Playlists table (must be created before videos due to FK)
CREATE TABLE IF NOT EXISTS playlists (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  youtube_playlist_id text NOT NULL,
  title text NOT NULL,
  thumbnail_url text DEFAULT '',
  video_count integer DEFAULT 0,
  is_featured boolean DEFAULT false,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- 2. Videos table
CREATE TABLE IF NOT EXISTS videos (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  youtube_id text NOT NULL,
  title text NOT NULL,
  description text DEFAULT '',
  thumbnail_url text DEFAULT '',
  category text DEFAULT 'shorts' CHECK (category IN ('shorts', 'playlist', 'special')),
  playlist_id uuid REFERENCES playlists(id) ON DELETE SET NULL,
  is_visible boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  view_count bigint DEFAULT 0,
  published_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- 3. Characters table
CREATE TABLE IF NOT EXISTS characters (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  bio text DEFAULT '',
  image_url text DEFAULT '',
  is_main boolean DEFAULT false,
  is_visible boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  traits jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- 4. Site Content table
CREATE TABLE IF NOT EXISTS site_content (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  key text NOT NULL,
  value text DEFAULT '',
  lang text DEFAULT 'en',
  updated_at timestamptz DEFAULT now(),
  UNIQUE(key, lang)
);

-- 5. Contact Messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- ============================================
-- Row Level Security (RLS) Policies
-- ============================================

-- Enable RLS on all tables
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Public read policies (anyone can view visible content)
CREATE POLICY "Public can view visible videos" ON videos FOR SELECT USING (is_visible = true);
CREATE POLICY "Public can view visible characters" ON characters FOR SELECT USING (is_visible = true);
CREATE POLICY "Public can view playlists" ON playlists FOR SELECT USING (true);
CREATE POLICY "Public can view site content" ON site_content FOR SELECT USING (true);

-- Public can insert contact messages
CREATE POLICY "Public can send messages" ON contact_messages FOR INSERT WITH CHECK (true);

-- Admin full access policies (using service_role key bypasses RLS,
-- but for auth-based access we add policies for authenticated users with admin role)
CREATE POLICY "Admin full access videos" ON videos FOR ALL USING (
  auth.jwt() ->> 'role' = 'admin' OR
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);

CREATE POLICY "Admin full access characters" ON characters FOR ALL USING (
  auth.jwt() ->> 'role' = 'admin' OR
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);

CREATE POLICY "Admin full access playlists" ON playlists FOR ALL USING (
  auth.jwt() ->> 'role' = 'admin' OR
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);

CREATE POLICY "Admin full access site_content" ON site_content FOR ALL USING (
  auth.jwt() ->> 'role' = 'admin' OR
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);

CREATE POLICY "Admin full access messages" ON contact_messages FOR ALL USING (
  auth.jwt() ->> 'role' = 'admin' OR
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);

-- ============================================
-- Seed Data: Default Characters
-- ============================================

INSERT INTO characters (name, slug, bio, is_main, is_visible, sort_order, traits) VALUES
('PIKO', 'piko', 'The main character of ChoicelyRun. PIKO never plays by the rules. Every episode is a new adventure in chaos, mischief, and unpredictable fun.', true, true, 0, '["Chaos Master", "No Mercy", "Unpredictable", "Fearless"]'::jsonb),
('Nova', 'nova', 'A bunny girl who serves as the police force of this chaotic world. Nova is always one step behind PIKO, trying to maintain order.', false, true, 1, '["Justice Seeker", "Brave", "Quick Thinker", "Loyal"]'::jsonb),
('Finn', 'finn', 'A sly fox who sometimes helps PIKO, sometimes works against him. You never know whose side Finn is really on.', false, true, 2, '["Cunning", "Charming", "Sneaky", "Witty"]'::jsonb);

-- ============================================
-- Seed Data: Default Site Content
-- ============================================

INSERT INTO site_content (key, value, lang) VALUES
('hero_title', 'Meet PIKO — Master of Chaos', 'en'),
('hero_slogan', 'Experience world-class animated adventures with PIKO and friends', 'en'),
('about_text', 'ChoicelyRun started with a simple idea: what if every choice led to chaos?', 'en'),
('cta_text', 'Subscribe now and never miss a chaotic moment!', 'en');

-- ============================================
-- Storage: Create media bucket
-- ============================================
-- NOTE: Create a storage bucket named 'media' from Supabase Dashboard
-- Dashboard → Storage → New Bucket → Name: media → Public: ON
