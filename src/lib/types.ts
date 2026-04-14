export interface Product {
  id: number;
  title: string;
  price: number;
  currency: string;
  link: string;
  imageUrl?: string;
  source: string;
  lastSeen: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SearchConfig {
  id?: number;
  keyword: string;
  label: string;
  maxPrice: number;
  currency: string;
  whitelist: string[];
  blacklist: string[];
  locations: string[];
  active: boolean;
}

export interface CreateProductInput {
  title: string;
  price: number;
  currency: string;
  link: string;
  source: string;
}

export interface UpdateProductInput {
  title?: string;
  price?: number;
  currency?: string;
  link?: string;
  source?: string;
}

export interface UpdateSearchConfigInput {
  keyword?: string;
  label?: string;
  maxPrice?: number;
  currency?: string;
  whitelist?: string[];
  blacklist?: string[];
  locations?: string[];
  active?: boolean;
}
