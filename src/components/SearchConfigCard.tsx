'use client';

import { SearchConfig } from '@/lib/types';

interface SearchConfigCardProps {
  config: SearchConfig;
  onEdit: (config: SearchConfig) => void;
  onDelete: (id: number) => void;
  onToggle: (id: number, active: boolean) => void;
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

export default function SearchConfigCard({ config, onEdit, onDelete, onToggle }: SearchConfigCardProps) {
  return (
    <div className={`bg-white dark:bg-slate-800 rounded-xl border transition-all duration-150 hover:shadow-lg ${
      config.active 
        ? 'border-emerald-200 dark:border-emerald-800' 
        : 'border-zinc-200 dark:border-slate-700 opacity-60'
    }`}>
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-zinc-900 dark:text-zinc-100 truncate">
              {config.label}
            </h3>
            <p className="text-sm text-zinc-500 dark:text-slate-400 mt-0.5 font-mono">
              {config.keyword}
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer ml-3">
            <input
              type="checkbox"
              checked={config.active}
              onChange={(e) => onToggle(config.id!, e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-10 h-6 bg-zinc-200 dark:bg-slate-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-zinc-300 dark:after:border-slate-500 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
          </label>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-zinc-500 dark:text-slate-400">Cena:</span>
            <span className="font-semibold text-zinc-900 dark:text-zinc-100 font-mono">
              {config.minPrice || 0} - {config.maxPrice} {config.currency}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-zinc-500 dark:text-slate-400">Lokality:</span>
            <div className="flex flex-wrap gap-1">
              {config.locations.map((loc) => (
                <span key={loc} className="inline-flex items-center px-2 py-0.5 bg-zinc-100 dark:bg-slate-700 rounded text-xs text-zinc-600 dark:text-zinc-300">
                  {loc}
                </span>
              ))}
            </div>
          </div>
        </div>

        {(config.whitelist.length > 0 || config.blacklist.length > 0) && (
          <div className="text-xs text-zinc-500 dark:text-slate-400 mb-4 space-y-1">
            {config.whitelist.length > 0 && (
              <p className="truncate">
                <span className="font-medium">Whitelist:</span> {config.whitelist.join(', ')}
              </p>
            )}
            {config.blacklist.length > 0 && (
              <p className="truncate">
                <span className="font-medium">Blacklist:</span> {config.blacklist.join(', ')}
              </p>
            )}
          </div>
        )}

        <div className="flex gap-2 pt-3 border-t border-zinc-100 dark:border-slate-700">
          <button
            onClick={() => onEdit(config)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-zinc-700 dark:text-zinc-200 py-2 px-3 rounded-lg text-sm font-medium transition-colors"
          >
            <EditIcon />
            Upraviť
          </button>
          <button
            onClick={() => onDelete(config.id!)}
            className="inline-flex items-center justify-center p-2 text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
            title="Vymazať"
          >
            <TrashIcon />
          </button>
        </div>
      </div>
    </div>
  );
}