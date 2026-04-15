import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

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
