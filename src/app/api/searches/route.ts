import { NextResponse } from 'next/server';
import { getSearchConfigs, createSearchConfig } from '@/lib/db';
import { SearchConfig } from '@/lib/types';

export async function GET() {
  try {
    const configs = await getSearchConfigs();
    return NextResponse.json(configs);
  } catch (error) {
    console.error('Error fetching search configs:', error);
    return NextResponse.json({ error: 'Failed to fetch search configs' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body: Omit<SearchConfig, 'id'> = await request.json();
    
    if (!body.keyword || !body.label) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const config = await createSearchConfig({
      keyword: body.keyword,
      label: body.label,
      minPrice: body.minPrice ?? 0,
      maxPrice: body.maxPrice ?? 1000,
      currency: body.currency ?? 'EUR',
      whitelist: body.whitelist ?? [],
      blacklist: body.blacklist ?? [],
      locations: body.locations ?? ['sk'],
      active: body.active ?? true,
    });

    return NextResponse.json(config, { status: 201 });
  } catch (error) {
    console.error('Error creating search config:', error);
    return NextResponse.json({ error: 'Failed to create search config' }, { status: 500 });
  }
}
