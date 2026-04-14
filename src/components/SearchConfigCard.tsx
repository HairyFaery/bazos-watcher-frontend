'use client';

import { SearchConfig } from '@/lib/types';

interface SearchConfigCardProps {
  config: SearchConfig;
  onEdit: (config: SearchConfig) => void;
  onDelete: (id: number) => void;
  onToggle: (id: number, active: boolean) => void;
}

export default function SearchConfigCard({ config, onEdit, onDelete, onToggle }: SearchConfigCardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-md p-4 border ${config.active ? 'border-green-200' : 'border-gray-200 opacity-60'}`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg text-gray-800">
          {config.label}
        </h3>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={config.active}
            onChange={(e) => onToggle(config.id!, e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
        </label>
      </div>
      
      <div className="space-y-1 text-sm text-gray-600 mb-3">
        <p><span className="font-medium">Kľúčové slovo:</span> {config.keyword}</p>
        <p><span className="font-medium">Max cena:</span> {config.maxPrice} {config.currency}</p>
        <p><span className="font-medium">Lokality:</span> {config.locations.join(', ')}</p>
      </div>

      <div className="text-xs text-gray-500 mb-3">
        <p className="truncate"><span className="font-medium">Whitelist:</span> {config.whitelist.join(', ') || '-'}</p>
        <p className="truncate"><span className="font-medium">Blacklist:</span> {config.blacklist.join(', ') || '-'}</p>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={() => onEdit(config)}
          className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-3 rounded text-sm transition-colors"
        >
          Upraviť
        </button>
        <button
          onClick={() => onDelete(config.id!)}
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded text-sm transition-colors"
        >
          Vymazať
        </button>
      </div>
    </div>
  );
}
