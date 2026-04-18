'use client';

import { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
  isSelected: boolean;
  onSelect: () => void;
}

function ExternalIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

export default function ProductCard({ product, onEdit, onDelete, isSelected, onSelect }: ProductCardProps) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('sk-SK', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isNew = product.createdAt && Date.now() - new Date(product.createdAt).getTime() < 30 * 60 * 1000;

  return (
    <div className={`
      bg-white dark:bg-slate-800 rounded-xl border transition-all duration-150
      hover:shadow-lg hover:border-emerald-200 dark:hover:border-emerald-700/50
      ${isSelected 
        ? 'border-emerald-500 ring-2 ring-emerald-200 dark:ring-emerald-800' 
        : 'border-zinc-200 dark:border-slate-700'
      }
    `}>
      {isNew && (
        <div className="px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/50 rounded-t-xl border-b border-emerald-200 dark:border-emerald-800">
          <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">NOVÉ</span>
        </div>
      )}
      
      <div className="p-4">
        <div className="flex items-start gap-3 mb-4">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onSelect}
            className="mt-1 w-4 h-4 rounded border-zinc-300 dark:border-slate-600 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
          />
          {product.imageUrl && (
            <div className="relative w-full h-40 bg-zinc-100 dark:bg-slate-700 rounded-lg overflow-hidden">
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
        </div>
        
        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-2 mb-3 leading-snug">
          {product.title}
        </h3>
        
        <div className="flex items-baseline justify-between mb-3">
          <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">
            {product.price} {product.currency}
          </span>
          {product.priceEur && product.currency === 'CZK' && (
            <span className="text-sm text-zinc-500 dark:text-slate-400">
              (~{product.priceEur} EUR)
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-slate-400 mb-4">
          <span className="inline-flex items-center px-2 py-0.5 bg-zinc-100 dark:bg-slate-700 rounded text-xs font-medium">
            {product.source}
          </span>
          <span>Videné: {formatDate(product.lastSeen)}</span>
        </div>

        <div className="flex gap-2">
          <a
            href={product.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white py-2 px-3 rounded-lg transition-colors text-sm font-medium"
          >
            Otvoriť <ExternalIcon />
          </a>
          <button
            onClick={() => onEdit(product)}
            className="p-2 text-zinc-500 hover:text-emerald-600 hover:bg-emerald-50 dark:text-slate-400 dark:hover:text-emerald-400 dark:hover:bg-emerald-900/30 rounded-lg transition-colors"
            title="Upraviť"
          >
            <EditIcon />
          </button>
          <button
            onClick={() => onDelete(product.id)}
            className="p-2 text-zinc-500 hover:text-red-600 hover:bg-red-50 dark:text-slate-400 dark:hover:text-red-400 dark:hover:bg-red-900/30 rounded-lg transition-colors"
            title="Vymazať"
          >
            <TrashIcon />
          </button>
        </div>
      </div>
    </div>
  );
}