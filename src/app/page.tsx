'use client';

import { useState, useEffect, useCallback } from 'react';
import { Product, CreateProductInput } from '@/lib/types';
import ProductList from '@/components/ProductList';
import ProductForm from '@/components/ProductForm';
import SearchBar from '@/components/SearchBar';
import WatchModal from '@/components/WatchModal';

function PlusIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
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

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const [watchModalOpen, setWatchModalOpen] = useState(false);
  const [watchingProduct, setWatchingProduct] = useState<Product | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSave = async (data: CreateProductInput) => {
    const url = editingProduct 
      ? `/api/products/${editingProduct.id}` 
      : '/api/products';
    const method = editingProduct ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to save product');
    }

    await fetchProducts();
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Naozaj chcete vymazať tento produkt?')) return;

    const response = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete product');
    }

    await fetchProducts();
  };

  const handleWatch = (product: Product) => {
    setWatchingProduct(product);
    setWatchModalOpen(true);
  };

  const handleWatchConfirm = async (maxPrice: number | null) => {
    if (!watchingProduct) return;

    await fetch('/api/watched-urls', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: watchingProduct.link,
        label: watchingProduct.title,
        maxPrice: maxPrice,
        lastPrice: watchingProduct.price,
      }),
    });

    setWatchModalOpen(false);
    setWatchingProduct(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleSelectAll = () => {
    if (selectedIds.size === filteredProducts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredProducts.map(p => p.id)));
    }
  };

  const handleSelect = (id: number) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Naozaj chcete vymazať ${selectedIds.size} vybraných produktov?`)) return;

    for (const id of selectedIds) {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
    }
    setSelectedIds(new Set());
    await fetchProducts();
  };

  const filteredProducts = products.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.source.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h1 className="text-2xl font-bold text-slate-100">Produkty</h1>
          <button
            onClick={() => {
              setEditingProduct(null);
              setShowForm(true);
            }}
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-lg transition-colors font-medium shadow-sm"
          >
            <PlusIcon />
            Pridať produkt
          </button>
        </div>

        <div className="mb-6 max-w-xl">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={() => setSearchQuery('')}
          />
        </div>

        {!showForm && filteredProducts.length > 0 && (
          <div className="mb-6 flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedIds.size === filteredProducts.length && filteredProducts.length > 0}
                onChange={handleSelectAll}
                className="w-4 h-4 rounded border-slate-600 text-emerald-500 focus:ring-emerald-500"
              />
              <span className="text-sm text-slate-300">
                {selectedIds.size === filteredProducts.length ? 'Odznačiť všetko' : 'Označiť všetko'}
              </span>
            </label>
            {selectedIds.size > 0 && (
              <button
                onClick={handleBulkDelete}
                className="inline-flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
              >
                <TrashIcon />
                Vymazať ({selectedIds.size})
              </button>
            )}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-emerald-500 border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="bg-red-900/20 border border-red-800 text-red-300 px-4 py-3 rounded-lg">
            {error}
          </div>
        ) : showForm ? (
          <div className="max-w-2xl mx-auto">
            <ProductForm
              product={editingProduct}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </div>
        ) : (
          <ProductList
            products={filteredProducts}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onWatch={handleWatch}
            selectedIds={selectedIds}
            onSelect={handleSelect}
          />
        )}
      </div>

      {watchingProduct && (
        <WatchModal
          product={watchingProduct}
          isOpen={watchModalOpen}
          onClose={() => {
            setWatchModalOpen(false);
            setWatchingProduct(null);
          }}
          onConfirm={handleWatchConfirm}
        />
      )}
    </div>
  );
}