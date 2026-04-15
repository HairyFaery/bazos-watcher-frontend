import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET() {
  try {
    const { rows } = await sql`
      SELECT id, url, label, max_price as "maxPrice", min_price as "minPrice", last_price as "lastPrice", last_price_at as "lastPriceAt", 
             created_at as "createdAt", updated_at as "updatedAt"
      FROM watched_urls 
      ORDER BY created_at DESC
    `;
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching watched URLs:', error);
    return NextResponse.json({ error: 'Failed to fetch watched URLs' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const { rows } = await sql`
      INSERT INTO watched_urls (url, label, max_price)
      VALUES (${body.url}, ${body.label || ''}, ${body.maxPrice || null})
      RETURNING id, url, label, max_price as "maxPrice", last_price as "lastPrice", last_price_at as "lastPriceAt",
                created_at as "createdAt", updated_at as "updatedAt"
    `;
    
    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating watched URL:', error);
    return NextResponse.json({ error: 'Failed to create watched URL' }, { status: 500 });
  }
}
