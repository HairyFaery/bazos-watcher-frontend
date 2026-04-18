'use client';

import { useState, useEffect, useCallback } from 'react';

interface WatchedUrl {
  id: number;
  url: string;
  label: string;
  maxPrice: number | null;
  minPrice: number | null;
  lastPrice: number | null;
  lastPriceAt: number | null;
  createdAt: string;
}

function getCurrency(url: string): string {
  return url.includes('bazos.cz') ? 'CZK' : 'EUR';
}

function PlusIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
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

function ExternalIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  );
}

export default function WatchedPage() {
  const [watchedUrls, setWatchedUrls] = useState<WatchedUrl[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [newMaxPrice, setNewMaxPrice] = useState('');
  const [newLastPrice, setNewLastPrice] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editMaxPrice, setEditMaxPrice] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchWatchedUrls = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/watched-urls');
      if (!response.ok) throw new Error('Failed to fetch watched URLs');
      const data = await response.json();
      setWatchedUrls(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWatchedUrls();
  }, [fetchWatchedUrls]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl) return;

    setSubmitting(true);
    try {
      const response = await fetch('/api/watched-urls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          url: newUrl, 
          label: newLabel,
          maxPrice: newMaxPrice ? parseFloat(newMaxPrice) : null,
          lastPrice: newLastPrice ? parseFloat(newLastPrice) : null 
        }),
      });

      if (!response.ok) throw new Error('Failed to add URL');

      setNewUrl('');
      setNewLabel('');
      setNewMaxPrice('');
      setNewLastPrice('');
      setShowForm(false);
      await fetchWatchedUrls();
      
      fetch('/api/trigger-scrape', { method: 'POST' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add URL');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateMaxPrice = async (id: number) => {
    try {
      const response = await fetch(`/api/watched-urls/${id}?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ maxPrice: editMaxPrice ? parseFloat(editMaxPrice) : null }),
      });

      if (!response.ok) throw new Error('Failed to update');

      setEditingId(null);
      setEditMaxPrice('');
      await fetchWatchedUrls();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Naozaj chcete vymazať túto URL?')) return;

    try {
      const response = await fetch(`/api/watched-urls/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete');

      await fetchWatchedUrls();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  const formatDate = (timestamp: number | null) => {
    if (!timestamp) return '-';
    return new Date(timestamp).toLocaleDateString('sk-SK', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Sledované URL</h1>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-lg transition-colors font-medium shadow-sm"
          >
            <PlusIcon />
            Pridať URL
          </button>
        </div>

        {showForm && (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-zinc-200 dark:border-slate-700 p-6 mb-6">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Nová sledovaná URL</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">URL *</label>
                <input
                  type="url"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://deti.bazos.sk/inzerat/123456/"
                  required
                  className="w-full px-3 py-2.5 border border-zinc-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Názov</label>
                <input
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="napr. Nosic Deuter Kid Comfort"
                  className="w-full px-3 py-2.5 border border-zinc-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Aktuálna cena</label>
                  <input
                    type="number"
                    value={newLastPrice}
                    onChange={(e) => setNewLastPrice(e.target.value)}
                    placeholder="napr. 150"
                    className="w-full px-3 py-2.5 border border-zinc-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  <p className="text-xs text-zinc-500 dark:text-slate-400 mt-1">Počiatočná cena (pre prvý výber)</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Max cena (Telegram)</label>
                  <input
                    type="number"
                    value={newMaxPrice}
                    onChange={(e) => setNewMaxPrice(e.target.value)}
                    placeholder="napr. 100"
                    className="w-full px-3 py-2.5 border border-zinc-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  <p className="text-xs text-zinc-500 dark:text-slate-400 mt-1">Pošle upozornenie ak cena klesne pod</p>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white py-2.5 px-5 rounded-lg transition-colors font-medium"
                >
                  {submitting ? 'Pridávam...' : 'Pridať'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-zinc-100 hover:bg-zinc-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-zinc-700 dark:text-zinc-200 py-2.5 px-5 rounded-lg transition-colors font-medium"
                >
                  Zrušiť
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-emerald-500 border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
            {error}
          </div>
        ) : watchedUrls.length === 0 ? (
          <div className="text-center py-16 text-zinc-500 dark:text-zinc-400 bg-white dark:bg-slate-800 rounded-xl border border-zinc-200 dark:border-slate-700">
            Žiadne sledované URL. Pridajte prvú URL.
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-zinc-200 dark:border-slate-700 overflow-hidden">
            <table className="w-full">
              <thead className="bg-zinc-50 dark:bg-slate-700/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">Názov</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">URL</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">Max</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">Min</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">Aktuálna</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">Kontrolované</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">Akcie</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-slate-700">
                {watchedUrls.map((item) => {
                  const currency = getCurrency(item.url);
                  return (
                    <tr key={item.id} className="hover:bg-zinc-50 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="px-4 py-4">
                        <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate max-w-[140px]">{item.label || '-'}</div>
                      </td>
                      <td className="px-4 py-4">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 truncate block max-w-[200px]"
                          title={item.url}
                        >
                          <span className="inline-flex items-center gap-1">
                            {item.url.includes('bazos.cz') ? '🇨🇿' : '🇸🇰'} {item.url.replace(/https?:\/\//, '').substring(0, 30)}...
                            <ExternalIcon />
                          </span>
                        </a>
                      </td>
                      <td className="px-4 py-4">
                        {editingId === item.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={editMaxPrice}
                              onChange={(e) => setEditMaxPrice(e.target.value)}
                              className="w-20 px-2 py-1 border border-zinc-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-zinc-900 dark:text-zinc-100 text-sm"
                              placeholder="Max"
                            />
                            <button
                              onClick={() => handleUpdateMaxPrice(item.id)}
                              className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                            >
                              Uložiť
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="text-zinc-500 hover:text-zinc-700 text-sm"
                            >
                              Zrušiť
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-semibold font-mono ${item.maxPrice ? 'text-amber-600 dark:text-amber-400' : 'text-zinc-400 dark:text-slate-500'}`}>
                              {item.maxPrice ? `${item.maxPrice} ${currency}` : '-'}
                            </span>
                            <button
                              onClick={() => {
                                setEditingId(item.id);
                                setEditMaxPrice(item.maxPrice?.toString() || '');
                              }}
                              className="p-1 text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400"
                              title="Upraviť max cenu"
                            >
                              <EditIcon />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                          {item.minPrice ? `${item.minPrice} ${currency}` : '-'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`text-sm font-semibold font-mono ${
                          item.maxPrice && item.lastPrice && item.lastPrice <= item.maxPrice 
                            ? 'text-emerald-600 dark:text-emerald-400' 
                            : 'text-zinc-900 dark:text-zinc-100'
                        }`}>
                          {item.lastPrice ? `${item.lastPrice} ${currency}` : '-'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-zinc-500 dark:text-slate-400">
                          {formatDate(item.lastPriceAt)}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                          title="Vymazať"
                        >
                          <TrashIcon />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}