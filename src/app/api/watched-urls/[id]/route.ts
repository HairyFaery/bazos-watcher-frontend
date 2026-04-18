import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const { rows } = await sql`
      SELECT id, url, label, max_price as "maxPrice", min_price as "minPrice", 
             last_price as "lastPrice", last_price_at as "lastPriceAt",
             scrape_count as "scrapeCount",
             created_at as "createdAt", updated_at as "updatedAt"
      FROM watched_urls 
      WHERE id = ${id}
    `;

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Watched URL not found' }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Error fetching watched URL:', error);
    return NextResponse.json({ error: 'Failed to fetch watched URL' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const { rows } = await sql`
      UPDATE watched_urls 
      SET max_price = ${body.maxPrice || null}
      WHERE id = ${id}
      RETURNING id, url, label, max_price as "maxPrice", last_price as "lastPrice", last_price_at as "lastPriceAt",
                created_at as "createdAt", updated_at as "updatedAt"
    `;
    
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Watched URL not found' }, { status: 404 });
    }
    
    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Error updating watched URL:', error);
    return NextResponse.json({ error: 'Failed to update watched URL' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const { rowCount } = await sql`DELETE FROM watched_urls WHERE id = ${id}`;
    
    if (rowCount === 0) {
      return NextResponse.json({ error: 'Watched URL not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting watched URL:', error);
    return NextResponse.json({ error: 'Failed to delete watched URL' }, { status: 500 });
  }
}
