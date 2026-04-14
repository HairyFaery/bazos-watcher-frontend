'use client';

import { useState } from 'react';
import { Product } from '@/lib/types';
import ProductCard from './ProductCard';

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
  searchQuery: string;
}

export default function ProductList({ products, onEdit, onDelete, searchQuery }: ProductListProps) {
  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.source.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (filteredProducts.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        {searchQuery ? `Žiadne produkty neobsahujú "${searchQuery}"` : 'Žiadne produkty v databáze'}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredProducts.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
