'use client';

import { useState, useEffect, useCallback } from 'react';
import { SearchConfig } from '@/lib/types';
import SearchConfigCard from '@/components/SearchConfigCard';
import SearchConfigForm from '@/components/SearchConfigForm';

function PlusIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}

export default function SearchesPage() {
  const [configs, setConfigs] = useState<SearchConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingConfig, setEditingConfig] = useState<SearchConfig | null>(null);

  const fetchConfigs = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/searches');
      if (!response.ok) throw new Error('Failed to fetch search configs');
      const data = await response.json();
      setConfigs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConfigs();
  }, [fetchConfigs]);

  const handleSave = async (data: Omit<SearchConfig, 'id'>) => {
    const url = editingConfig 
      ? `/api/searches/${editingConfig.id}` 
      : '/api/searches';
    const method = editingConfig ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to save search config');
    }

    await fetchConfigs();
    setShowForm(false);
    setEditingConfig(null);

    fetch('/api/trigger-scrape', { method: 'POST' });
  };

  const handleEdit = (config: SearchConfig) => {
    setEditingConfig(config);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Naozaj chcete vymazať toto vyhľadávanie?')) return;

    const response = await fetch(`/api/searches/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete search config');
    }

    await fetchConfigs();
  };

  const handleToggle = async (id: number, active: boolean) => {
    const response = await fetch(`/api/searches/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active }),
    });

    if (!response.ok) {
      throw new Error('Failed to update search config');
    }

    await fetchConfigs();
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingConfig(null);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Vyhľadávania</h1>
          <button
            onClick={() => {
              setEditingConfig(null);
              setShowForm(true);
            }}
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-lg transition-colors font-medium shadow-sm"
          >
            <PlusIcon />
            Pridať vyhľadávanie
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-emerald-500 border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
            {error}
          </div>
        ) : showForm ? (
          <div className="max-w-2xl mx-auto">
            <SearchConfigForm
              config={editingConfig}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </div>
        ) : configs.length === 0 ? (
          <div className="text-center py-16 text-zinc-500 dark:text-zinc-400 bg-white dark:bg-slate-800 rounded-xl border border-zinc-200 dark:border-slate-700">
            Žiadne vyhľadávania. Pridajte svoje prvé vyhľadávanie.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {configs.map((config) => (
              <SearchConfigCard
                key={config.id}
                config={config}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggle={handleToggle}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}