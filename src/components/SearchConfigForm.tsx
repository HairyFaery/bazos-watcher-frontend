'use client';

import { useState, useEffect } from 'react';
import { SearchConfig } from '@/lib/types';

interface SearchConfigFormProps {
  config?: SearchConfig | null;
  onSave: (data: Omit<SearchConfig, 'id'>) => Promise<void>;
  onCancel: () => void;
}

const LOCATION_OPTIONS = [
  { value: 'sk', label: 'SK - Celé Slovensko' },
  { value: 'sk-pezinok', label: 'SK - Pezinok (50km)' },
  { value: 'sk-bratislava', label: 'SK - Bratislava (50km)' },
  { value: 'cz', label: 'CZ - Celé Česko' },
  { value: 'cz-ostrava', label: 'CZ - Ostrava (30km)' },
  { value: 'cz-zlin', label: 'CZ - Zlín (30km)' },
];

export default function SearchConfigForm({ config, onSave, onCancel }: SearchConfigFormProps) {
  const [formData, setFormData] = useState({
    keyword: '',
    label: '',
    minPrice: 0,
    maxPrice: 1000,
    currency: 'EUR',
    whitelist: '',
    blacklist: '',
    locations: ['sk'] as string[],
    active: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (config) {
      setFormData({
        keyword: config.keyword,
        label: config.label,
        minPrice: config.minPrice || 0,
        maxPrice: config.maxPrice,
        currency: config.currency,
        whitelist: config.whitelist.join(', '),
        blacklist: config.blacklist.join(', '),
        locations: config.locations,
        active: config.active,
      });
    }
  }, [config]);

  const handleLocationToggle = (location: string) => {
    setFormData(prev => ({
      ...prev,
      locations: prev.locations.includes(location)
        ? prev.locations.filter(l => l !== location)
        : [...prev.locations, location],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave({
        keyword: formData.keyword,
        label: formData.label,
        minPrice: formData.minPrice || undefined,
        maxPrice: formData.maxPrice,
        currency: formData.currency,
        whitelist: formData.whitelist.split(',').map(s => s.trim()).filter(Boolean),
        blacklist: formData.blacklist.split(',').map(s => s.trim()).filter(Boolean),
        locations: formData.locations,
        active: formData.active,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-zinc-200 dark:border-slate-700 p-6">
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-6">
        {config ? 'Upraviť vyhľadávanie' : 'Nové vyhľadávanie'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Názov *</label>
          <input
            type="text"
            value={formData.label}
            onChange={(e) => setFormData({ ...formData, label: e.target.value })}
            required
            placeholder="napr. Deuter Kid Comfort"
            className="w-full px-3 py-2.5 border border-zinc-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Kľúčové slovo *</label>
          <input
            type="text"
            value={formData.keyword}
            onChange={(e) => setFormData({ ...formData, keyword: e.target.value })}
            required
            placeholder="napr. deuter+kid+comfort"
            className="w-full px-3 py-2.5 border border-zinc-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-mono text-sm"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Min cena</label>
            <input
              type="number"
              value={formData.minPrice}
              onChange={(e) => setFormData({ ...formData, minPrice: Number(e.target.value) })}
              min="0"
              className="w-full px-3 py-2.5 border border-zinc-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Max cena</label>
            <input
              type="number"
              value={formData.maxPrice}
              onChange={(e) => setFormData({ ...formData, maxPrice: Number(e.target.value) })}
              min="0"
              className="w-full px-3 py-2.5 border border-zinc-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Mena</label>
            <select
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              className="w-full px-3 py-2.5 border border-zinc-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="EUR">EUR</option>
              <option value="CZK">CZK</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Lokality</label>
          <div className="flex flex-wrap gap-2">
            {LOCATION_OPTIONS.map(opt => (
              <label key={opt.value} className="flex items-center gap-2 px-3 py-2 border border-zinc-200 dark:border-slate-600 rounded-lg cursor-pointer hover:bg-zinc-50 dark:hover:bg-slate-700 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.locations.includes(opt.value)}
                  onChange={() => handleLocationToggle(opt.value)}
                  className="w-4 h-4 rounded border-zinc-300 text-emerald-500 focus:ring-emerald-500"
                />
                <span className="text-sm text-zinc-700 dark:text-zinc-300">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Whitelist (čo musí obsahovať)</label>
          <input
            type="text"
            value={formData.whitelist}
            onChange={(e) => setFormData({ ...formData, whitelist: e.target.value })}
            placeholder="napr. kid comfort, comfort pro"
            className="w-full px-3 py-2.5 border border-zinc-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
          <p className="text-xs text-zinc-500 dark:text-slate-400 mt-1">Oddelené čiarkou</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Blacklist (čo nesmie obsahovať)</label>
          <input
            type="text"
            value={formData.blacklist}
            onChange={(e) => setFormData({ ...formData, blacklist: e.target.value })}
            placeholder="napr. comfort 1, comfort 2, prenájom"
            className="w-full px-3 py-2.5 border border-zinc-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
          <p className="text-xs text-zinc-500 dark:text-slate-400 mt-1">Oddelené čiarkou</p>
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