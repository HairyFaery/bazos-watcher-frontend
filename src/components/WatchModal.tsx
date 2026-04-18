'use client';

import { useState } from 'react';
import { Product } from '@/lib/types';

interface WatchModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (maxPrice: number | null) => Promise<void>;
}

function EyeIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

export default function WatchModal({ product, isOpen, onClose, onConfirm }: WatchModalProps) {
  const [maxPrice, setMaxPrice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onConfirm(maxPrice ? parseFloat(maxPrice) : null);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCurrency = (url: string) => url.includes('bazos.cz') ? 'CZK' : 'EUR';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-slate-800 rounded-xl shadow-xl w-full max-w-md mx-4 p-6 border border-slate-700">
        <h2 className="text-xl font-semibold text-slate-100 mb-4 flex items-center gap-2">
          <EyeIcon />
          Pridať do sledovaných
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">URL</label>
            <input
              type="url"
              value={product.link}
              readOnly
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-300 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Názov</label>
            <input
              type="text"
              value={product.title}
              readOnly
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-300 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Aktuálna cena</label>
            <input
              type="text"
              value={`${product.price} ${product.currency}`}
              readOnly
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-emerald-400 font-mono font-semibold"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Max cena (Telegram)</label>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Pošle upozornenie ak cena klesne pod"
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-start gap-2 p-3 bg-emerald-900/20 border border-emerald-800 rounded-lg">
            <InfoIcon />
            <p className="text-sm text-emerald-300">
              Inzerát zostáva v "Produkty". Scraper ho automaticky preskočí, aby sa zabránilo dvojitej notifikácii.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-300 py-2.5 px-4 rounded-lg transition-colors font-medium"
            >
              Zrušiť
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-700 text-white py-2.5 px-4 rounded-lg transition-colors font-medium"
            >
              {isSubmitting ? 'Pridávam...' : 'Pridať'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}