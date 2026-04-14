import { NextResponse } from 'next/server';

const SCRAPER_URL = process.env.SCRAPER_URL || 'https://rapsik.tailcf1a9c.ts.net/bazos-watcher';

export async function POST() {
  try {
    const res = await fetch(`${SCRAPER_URL}/trigger-scrape`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    return NextResponse.json({ success: res.ok });
  } catch (error) {
    console.error('Scraper trigger failed:', error);
    return NextResponse.json({ success: false, error: 'Scraper offline' }, { status: 503 });
  }
}
