import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const { rows } = await sql`
      SELECT price, currency, recorded_at as "recordedAt"
      FROM price_history
      WHERE url = ${url}
      ORDER BY recorded_at ASC
    `;

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching price history:', error);
    return NextResponse.json({ error: 'Failed to fetch price history' }, { status: 500 });
  }
}