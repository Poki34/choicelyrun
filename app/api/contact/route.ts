import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 3; // max 3 messages
const RATE_WINDOW = 60 * 60 * 1000; // per hour

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return false;
  }

  if (entry.count >= RATE_LIMIT) return true;

  entry.count++;
  return false;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
               request.headers.get('x-real-ip') || 
               'unknown';
    
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many messages. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // Sanitize inputs (basic XSS prevention)
    const sanitize = (str: string) => str.replace(/[<>]/g, '').trim().substring(0, 2000);

    // Save to Supabase
    const supabase = getServiceSupabase();
    const { error } = await supabase
      .from('contact_messages')
      .insert([{
        name: sanitize(name),
        email: sanitize(email),
        subject: sanitize(subject),
        message: sanitize(message),
        is_read: false,
      }]);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to save message' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Message sent successfully' });
  } catch (err) {
    console.error('Contact API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
