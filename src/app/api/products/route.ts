import { NextResponse } from 'next/server';
import { getProducts, createProduct } from '@/lib/db';
import { CreateProductInput } from '@/lib/types';

export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body: CreateProductInput = await request.json();
    
    if (!body.title || !body.price || !body.link) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const product = await createProduct({
      title: body.title,
      price: Number(body.price),
      currency: body.currency || 'EUR',
      link: body.link,
      source: body.source || 'unknown',
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
