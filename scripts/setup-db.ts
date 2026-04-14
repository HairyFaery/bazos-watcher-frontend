import { sql } from '@vercel/postgres';
import { config } from 'dotenv';
import { join } from 'path';

config({ path: join(process.cwd(), '.env.local') });

async function setupDatabase() {
  console.log('Setting up database...');

  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      title VARCHAR(500) NOT NULL,
      price DECIMAL(12, 2) NOT NULL,
      currency VARCHAR(10) DEFAULT 'EUR',
      link VARCHAR(1000) NOT NULL,
      image_url VARCHAR(1000) DEFAULT '',
      source VARCHAR(100) DEFAULT 'manual',
      last_seen BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()) * 1000,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  console.log('Products table created or already exists');

  await sql`
    CREATE TABLE IF NOT EXISTS search_configs (
      id SERIAL PRIMARY KEY,
      keyword VARCHAR(255) NOT NULL,
      label VARCHAR(255) NOT NULL,
      max_price INTEGER DEFAULT 1000,
      currency VARCHAR(10) DEFAULT 'EUR',
      whitelist TEXT DEFAULT '[]',
      blacklist TEXT DEFAULT '[]',
      locations TEXT DEFAULT '[]',
      active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  console.log('Search configs table created or already exists');

  console.log('Database setup completed successfully!');
}

setupDatabase().catch((error) => {
  console.error('Database setup failed:', error);
  process.exit(1);
});
