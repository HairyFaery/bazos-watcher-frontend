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
    <div className="min-h-screen bg-gray-100">
      <main className="w-full px-4 py-6 sm:px-6 lg:px-8 overflow-x-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Sledované URL</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Pridať URL
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Nová sledovaná URL</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-base font-medium text-gray-900 mb-1">URL *</label>
                <input
                  type="url"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://deti.bazos.sk/inzerat/123456/"
                  required
                  className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-base font-medium text-gray-900 mb-1">Názov</label>
                <input
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="napr. Nosic Deuter Kid Comfort"
                  className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-base font-medium text-gray-900 mb-1">Aktuálna cena</label>
                  <input
                    type="number"
                    value={newLastPrice}
                    onChange={(e) => setNewLastPrice(e.target.value)}
                    placeholder="napr. 150"
                    className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                  <p className="text-sm text-gray-700 mt-1">Počiatočná cena (pre prvý výber)</p>
                </div>
                <div>
                  <label className="block text-base font-medium text-gray-900 mb-1">Max cena (Telegram)</label>
                  <input
                    type="number"
                    value={newMaxPrice}
                    onChange={(e) => setNewMaxPrice(e.target.value)}
                    placeholder="napr. 100"
                    className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                  <p className="text-sm text-gray-700 mt-1">Pošle upozornenie ak cena klesne pod</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white py-2 px-4 rounded transition-colors"
                >
                  {submitting ? 'Pridávam...' : 'Pridať'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-900 py-2 px-4 rounded transition-colors"
                >
                  Zrušiť
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        ) : watchedUrls.length === 0 ? (
          <div className="text-center py-12 text-gray-900">
            Žiadne sledované URL. Pridajte prvú URL.
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-x-auto">
            <table className="w-full divide-y divide-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 w-36">Názov</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 w-64">URL</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 w-24">Max cena</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 w-24">Najnižšia</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 w-24">Aktuálna</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 w-36">Kontrolované</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900 w-20">Akcie</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {watchedUrls.map((item) => {
                  const currency = getCurrency(item.url);
                  return (
                    <tr key={item.id}>
                      <td className="px-4 py-4">
                        <div className="text-base font-medium text-gray-900 truncate">{item.label || '-'}</div>
                      </td>
                      <td className="px-4 py-4">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-base text-blue-600 hover:text-blue-800 truncate block"
                          title={item.url}
                        >
                          {item.url}
                        </a>
                      </td>
                      <td className="px-4 py-4">
                        {editingId === item.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={editMaxPrice}
                              onChange={(e) => setEditMaxPrice(e.target.value)}
                              className="w-20 px-2 py-1 border border-gray-400 rounded text-base"
                              placeholder="Max"
                            />
                            <button
                              onClick={() => handleUpdateMaxPrice(item.id)}
                              className="text-green-600 hover:text-green-800 text-base"
                            >
                              Uložiť
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="text-gray-600 hover:text-gray-800 text-base"
                            >
                              Zrušiť
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className={`text-base ${item.maxPrice ? 'text-orange-600 font-semibold' : 'text-gray-500'}`}>
                              {item.maxPrice ? `${item.maxPrice} ${currency}` : '-'}
                            </span>
                            <button
                              onClick={() => {
                                setEditingId(item.id);
                                setEditMaxPrice(item.maxPrice?.toString() || '');
                              }}
                              className="text-blue-600 hover:text-blue-800 text-base"
                            >
                              Upraviť
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-base font-semibold text-green-600">
                          {item.minPrice ? `${item.minPrice} ${currency}` : '-'}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className={`text-base font-semibold ${item.maxPrice && item.lastPrice && item.lastPrice <= item.maxPrice ? 'text-green-600' : 'text-gray-900'}`}>
                          {item.lastPrice ? `${item.lastPrice} ${currency}` : '-'}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-base text-gray-900 truncate">
                          {formatDate(item.lastPriceAt)}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-800 text-base"
                        >
                          Vymazať
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}