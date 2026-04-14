'use client';

import { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

export default function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('sk-SK', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden">
      {product.imageUrl && (
        <div className="relative w-full h-48 mb-3 bg-gray-100 rounded">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      )}
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg text-gray-800 line-clamp-2 flex-1 pr-2">
          {product.title}
        </h3>
        <span className="text-lg font-bold text-green-600 whitespace-nowrap">
          {product.price} {product.currency}
        </span>
      </div>
      
      <div className="text-sm text-gray-500 mb-3">
        <span className="inline-block bg-gray-100 rounded px-2 py-1 mr-2">
          {product.source}
        </span>
        <span>Videné: {formatDate(product.lastSeen)}</span>
      </div>

      <div className="flex gap-2 mt-4">
        <a
          href={product.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-center py-2 px-4 rounded transition-colors text-sm"
        >
          Otvoriť
        </a>
        <button
          onClick={() => onEdit(product)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded transition-colors text-sm"
        >
          Upraviť
        </button>
        <button
          onClick={() => onDelete(product.id)}
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition-colors text-sm"
        >
          Vymazať
        </button>
      </div>
    </div>
  );
}
