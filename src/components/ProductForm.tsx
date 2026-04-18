'use client';

import { useState, useEffect } from 'react';
import { Product, CreateProductInput } from '@/lib/types';

interface ProductFormProps {
  product?: Product | null;
  onSave: (data: CreateProductInput) => Promise<void>;
  onCancel: () => void;
}

export default function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState<CreateProductInput>({
    title: '',
    price: 0,
    currency: 'EUR',
    link: '',
    source: 'manual',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title,
        price: product.price,
        currency: product.currency,
        link: product.link,
        source: product.source,
      });
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-zinc-200 dark:border-slate-700 p-6">
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-6">
        {product ? 'Upraviť produkt' : 'Pridať nový produkt'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
            Názov *
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            className="w-full px-3 py-2.5 border border-zinc-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              Cena *
            </label>
            <input
              type="number"
              id="price"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              required
              min="0"
              step="0.01"
              className="w-full px-3 py-2.5 border border-zinc-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              Mena
            </label>
            <select
              id="currency"
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              className="w-full px-3 py-2.5 border border-zinc-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="EUR">EUR</option>
              <option value="CZK">CZK</option>
              <option value="SKK">SKK</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="link" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
            Odkaz *
          </label>
          <input
            type="url"
            id="link"
            value={formData.link}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
            required
            className="w-full px-3 py-2.5 border border-zinc-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="source" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
            Zdroj
          </label>
          <input
            type="text"
            id="source"
            value={formData.source}
            onChange={(e) => setFormData({ ...formData, source: e.target.value })}
            placeholder="napr. bazos.sk, manual"
            className="w-full px-3 py-2.5 border border-zinc-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white py-2.5 px-4 rounded-lg transition-colors font-medium"
          >
            {isSubmitting ? 'Ukladám...' : 'Uložiť'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-zinc-100 hover:bg-zinc-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-zinc-700 dark:text-zinc-200 py-2.5 px-4 rounded-lg transition-colors font-medium"
          >
            Zrušiť
          </button>
        </div>
      </form>
    </div>
  );
}