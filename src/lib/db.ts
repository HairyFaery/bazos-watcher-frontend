import { sql } from '@vercel/postgres';
import { Product, SearchConfig, CreateProductInput, UpdateProductInput, UpdateSearchConfigInput } from './types';

export async function getProducts(): Promise<Product[]> {
  const { rows } = await sql`
    SELECT id, title, price, currency, link, source, last_seen as "lastSeen", 
           created_at as "createdAt", updated_at as "updatedAt"
    FROM products 
    ORDER BY created_at DESC
  `;
  return rows as Product[];
}

export async function getProductById(id: number): Promise<Product | null> {
  const { rows } = await sql`
    SELECT id, title, price, currency, link, source, last_seen as "lastSeen",
           created_at as "createdAt", updated_at as "updatedAt"
    FROM products 
    WHERE id = ${id}
  `;
  return (rows[0] as Product) || null;
}

export async function createProduct(input: CreateProductInput): Promise<Product> {
  const { rows } = await sql`
    INSERT INTO products (title, price, currency, link, source, last_seen)
    VALUES (${input.title}, ${input.price}, ${input.currency}, ${input.link}, ${input.source}, ${Date.now()})
    RETURNING id, title, price, currency, link, source, last_seen as "lastSeen", 
              created_at as "createdAt", updated_at as "updatedAt"
  `;
  return rows[0] as Product;
}

export async function updateProduct(id: number, input: UpdateProductInput): Promise<Product | null> {
  if (input.title === undefined && input.price === undefined && 
      input.currency === undefined && input.link === undefined && input.source === undefined) {
    return getProductById(id);
  }

  const { rows } = await sql`
    UPDATE products 
    SET 
      title = COALESCE(${input.title}, title),
      price = COALESCE(${input.price}, price),
      currency = COALESCE(${input.currency}, currency),
      link = COALESCE(${input.link}, link),
      source = COALESCE(${input.source}, source),
      last_seen = ${Date.now()}
    WHERE id = ${id}
    RETURNING id, title, price, currency, link, source, last_seen as "lastSeen",
              created_at as "createdAt", updated_at as "updatedAt"
  `;
  return (rows[0] as Product) || null;
}

export async function deleteProduct(id: number): Promise<boolean> {
  const { rowCount } = await sql`DELETE FROM products WHERE id = ${id}`;
  return (rowCount ?? 0) > 0;
}

export async function getSearchConfigs(): Promise<SearchConfig[]> {
  const { rows } = await sql`
    SELECT id, keyword, label, max_price as "maxPrice", currency, whitelist, 
           blacklist, locations, active
    FROM search_configs 
    ORDER BY created_at DESC
  `;
  return rows.map(row => ({
    ...row,
    whitelist: typeof row.whitelist === 'string' ? JSON.parse(row.whitelist) : row.whitelist,
    blacklist: typeof row.blacklist === 'string' ? JSON.parse(row.blacklist) : row.blacklist,
    locations: typeof row.locations === 'string' ? JSON.parse(row.locations) : row.locations,
  })) as SearchConfig[];
}

export async function createSearchConfig(input: Omit<SearchConfig, 'id'>): Promise<SearchConfig> {
  const { rows } = await sql`
    INSERT INTO search_configs (keyword, label, max_price, currency, whitelist, blacklist, locations, active)
    VALUES (
      ${input.keyword}, 
      ${input.label}, 
      ${input.maxPrice}, 
      ${input.currency}, 
      ${JSON.stringify(input.whitelist)}, 
      ${JSON.stringify(input.blacklist)}, 
      ${JSON.stringify(input.locations)},
      ${input.active ?? true}
    )
    RETURNING id, keyword, label, max_price as "maxPrice", currency, whitelist, 
              blacklist, locations, active
  `;
  const row = rows[0] as any;
  return {
    ...row,
    whitelist: JSON.parse(row.whitelist),
    blacklist: JSON.parse(row.blacklist),
    locations: JSON.parse(row.locations),
  };
}

export async function getSearchConfigById(id: number): Promise<SearchConfig | null> {
  const { rows } = await sql`
    SELECT id, keyword, label, max_price as "maxPrice", currency, whitelist, 
           blacklist, locations, active
    FROM search_configs 
    WHERE id = ${id}
  `;
  if (!rows[0]) return null;
  const row = rows[0] as any;
  return {
    ...row,
    whitelist: typeof row.whitelist === 'string' ? JSON.parse(row.whitelist) : row.whitelist,
    blacklist: typeof row.blacklist === 'string' ? JSON.parse(row.blacklist) : row.blacklist,
    locations: typeof row.locations === 'string' ? JSON.parse(row.locations) : row.locations,
  };
}

export async function updateSearchConfig(id: number, input: UpdateSearchConfigInput): Promise<SearchConfig | null> {
  if (input.keyword === undefined && input.label === undefined && 
      input.maxPrice === undefined && input.currency === undefined &&
      input.whitelist === undefined && input.blacklist === undefined &&
      input.locations === undefined && input.active === undefined) {
    return getSearchConfigById(id);
  }

  const { rows } = await sql`
    UPDATE search_configs 
    SET 
      keyword = COALESCE(${input.keyword}, keyword),
      label = COALESCE(${input.label}, label),
      max_price = COALESCE(${input.maxPrice}, max_price),
      currency = COALESCE(${input.currency}, currency),
      whitelist = COALESCE(${input.whitelist ? JSON.stringify(input.whitelist) : null}, whitelist),
      blacklist = COALESCE(${input.blacklist ? JSON.stringify(input.blacklist) : null}, blacklist),
      locations = COALESCE(${input.locations ? JSON.stringify(input.locations) : null}, locations),
      active = COALESCE(${input.active}, active)
    WHERE id = ${id}
    RETURNING id, keyword, label, max_price as "maxPrice", currency, whitelist, 
              blacklist, locations, active
  `;
  if (!rows[0]) return null;
  const row = rows[0] as any;
  return {
    ...row,
    whitelist: JSON.parse(row.whitelist),
    blacklist: JSON.parse(row.blacklist),
    locations: JSON.parse(row.locations),
  };
}

export async function deleteSearchConfig(id: number): Promise<boolean> {
  const { rowCount } = await sql`DELETE FROM search_configs WHERE id = ${id}`;
  return (rowCount ?? 0) > 0;
}
