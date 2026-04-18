'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import PriceHistoryChart from '@/components/PriceHistoryChart';

interface PricePoint {
  price: number;
  currency: string;
  recordedAt: string;
}

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

function ArrowLeftIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
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

function getCurrency(url: string): string {
  return url.includes('bazos.cz') ? 'CZK' : 'EUR';
}

export default function WatchedDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [watchedUrl, setWatchedUrl] = useState<WatchedUrl | null>(null);
  const [priceHistory, setPriceHistory] = useState<PricePoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        const watchedRes = await fetch(`/api/watched-urls/${id}?id=${id}`);
        if (!watchedRes.ok) throw new Error('Failed to fetch watched URL');
        const watchedData = await watchedRes.json();
        setWatchedUrl(watchedData);

        const historyRes = await fetch(`/api/price-history?url=${encodeURIComponent(watchedData.url)}`);
        if (!historyRes.ok) throw new Error('Failed to fetch price history');
        const historyData = await historyRes.json();
        setPriceHistory(historyData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !watchedUrl) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="bg-red-900/20 border border-red-800 text-red-300 px-4 py-3 rounded-lg">
          {error || 'Watched URL not found'}
        </div>
      </div>
    );
  }

  const currency = getCurrency(watchedUrl.url);

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <Link
          href="/watched"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald-400 mb-6 transition-colors"
        >
          <ArrowLeftIcon />
          Späť na zoznam
        </Link>

        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 mb-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-slate-100 mb-2">
                {watchedUrl.label || 'Sledované URL'}
              </h1>
              <a
                href={watchedUrl.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 text-sm truncate"
              >
                {watchedUrl.url}
                <ExternalIcon />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-700/50 rounded-lg p-3">
              <p className="text-slate-400 text-sm mb-1">Aktuálna</p>
              <p className="text-xl font-bold text-slate-100 font-mono">
                {watchedUrl.lastPrice ? `${watchedUrl.lastPrice} ${currency}` : '-'}
              </p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-3">
              <p className="text-slate-400 text-sm mb-1">Min</p>
              <p className="text-xl font-bold text-emerald-400 font-mono">
                {watchedUrl.minPrice ? `${watchedUrl.minPrice} ${currency}` : '-'}
              </p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-3">
              <p className="text-slate-400 text-sm mb-1">Max</p>
              <p className="text-xl font-bold text-amber-400 font-mono">
                {watchedUrl.maxPrice ? `${watchedUrl.maxPrice} ${currency}` : '-'}
              </p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-3">
              <p className="text-slate-400 text-sm mb-1">Kontrolované</p>
              <p className="text-sm text-slate-300">
                {formatDate(watchedUrl.lastPriceAt)}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-100 mb-4">Cenová história</h2>
          <PriceHistoryChart data={priceHistory} />
        </div>

        {priceHistory.length > 0 && (
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-slate-100 mb-4">Záznamy cien</h2>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {[...priceHistory].reverse().map((point, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b border-slate-700 last:border-0"
                >
                  <span className="text-slate-400 text-sm">
                    {new Date(point.recordedAt).toLocaleDateString('sk-SK', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  <span className="text-emerald-400 font-mono font-semibold">
                    {point.price} {point.currency}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}