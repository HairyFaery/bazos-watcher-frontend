'use client';

import { useState, useEffect } from 'react';
import { SearchConfig } from '@/lib/types';

interface SearchConfigFormProps {
  config?: SearchConfig | null;
  onSave: (data: Omit<SearchConfig, 'id'>) => Promise<void>;
  onCancel: () => void;
}

const LOCATION_OPTIONS = [
  { value: 'sk', label: 'SK - Bazos.sk' },
  { value: 'cz', label: 'CZ - Bazos.cz (celé)' },
  { value: 'cz-ostrava', label: 'CZ - Ostrava (30km)' },
  { value: 'cz-zlin', label: 'CZ - Zlín (30km)' },
  { value: 'cz-prague', label: 'CZ - Praha (50km)' },
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
    locations: ['sk'],
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
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h2 className="text-xl font-semibold mb-4">
        {config ? 'Upraviť vyhľadávanie' : 'Nové vyhľadávanie'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Názov *</label>
          <input
            type="text"
            value={formData.label}
            onChange={(e) => setFormData({ ...formData, label: e.target.value })}
            required
            placeholder="napr. Deuter Kid Comfort"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Kľúčové slovo *</label>
          <input
            type="text"
            value={formData.keyword}
            onChange={(e) => setFormData({ ...formData, keyword: e.target.value })}
            required
            placeholder="napr. deuter+kid+comfort"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Min cena</label>
            <input
              type="number"
              value={formData.minPrice}
              onChange={(e) => setFormData({ ...formData, minPrice: Number(e.target.value) })}
              min="0"
              placeholder="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max cena</label>
            <input
              type="number"
              value={formData.maxPrice}
              onChange={(e) => setFormData({ ...formData, maxPrice: Number(e.target.value) })}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mena</label>
            <select
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="EUR">EUR</option>
              <option value="CZK">CZK</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Lokality</label>
          <div className="flex flex-wrap gap-2">
            {LOCATION_OPTIONS.map(opt => (
              <label key={opt.value} className="flex items-center gap-1 px-3 py-1.5 border rounded cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={formData.locations.includes(opt.value)}
                  onChange={() => handleLocationToggle(opt.value)}
                />
                <span className="text-sm">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Whitelist (čo musí obsahovať)</label>
          <input
            type="text"
            value={formData.whitelist}
            onChange={(e) => setFormData({ ...formData, whitelist: e.target.value })}
            placeholder="napr. kid comfort, comfort pro"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">Oddelené čiarkou</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Blacklist (čo nesmie obsahovať)</label>
          <input
            type="text"
            value={formData.blacklist}
            onChange={(e) => setFormData({ ...formData, blacklist: e.target.value })}
            placeholder="napr. comfort 1, comfort 2, prenájom"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">Oddelené čiarkou</p>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white py-2 px-4 rounded transition-colors"
          >
            {isSubmitting ? 'Ukladám...' : 'Uložiť'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded transition-colors"
          >
            Zrušiť
          </button>
        </div>
      </form>
    </div>
  );
}
