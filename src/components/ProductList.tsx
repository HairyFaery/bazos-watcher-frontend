'use client';

import { Product } from '@/lib/types';
import ProductCard from './ProductCard';

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
  selectedIds: Set<number>;
  onSelect: (id: number) => void;
}

export default function ProductList({ products, onEdit, onDelete, selectedIds, onSelect }: ProductListProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        Žiadne produkty v databáze
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onEdit={onEdit}
          onDelete={onDelete}
          isSelected={selectedIds.has(product.id)}
          onSelect={() => onSelect(product.id)}
        />
      ))}
    </div>
  );
}
