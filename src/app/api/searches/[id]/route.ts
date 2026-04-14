import { NextResponse } from 'next/server';
import { getSearchConfigById, updateSearchConfig, deleteSearchConfig } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const config = await getSearchConfigById(Number(id));
    
    if (!config) {
      return NextResponse.json({ error: 'Search config not found' }, { status: 404 });
    }

    return NextResponse.json(config);
  } catch (error) {
    console.error('Error fetching search config:', error);
    return NextResponse.json({ error: 'Failed to fetch search config' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const config = await updateSearchConfig(Number(id), body);
    
    if (!config) {
      return NextResponse.json({ error: 'Search config not found' }, { status: 404 });
    }

    return NextResponse.json(config);
  } catch (error) {
    console.error('Error updating search config:', error);
    return NextResponse.json({ error: 'Failed to update search config' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await deleteSearchConfig(Number(id));
    
    if (!deleted) {
      return NextResponse.json({ error: 'Search config not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting search config:', error);
    return NextResponse.json({ error: 'Failed to delete search config' }, { status: 500 });
  }
}
