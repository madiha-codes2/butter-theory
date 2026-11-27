import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { api, formatINR } from '../services/api.js';

export function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    let active = true;
    const timer = window.setTimeout(async () => {
      setLoading(true);
      try {
        const data = await api.fetchProducts({
          search: query.trim() || undefined,
          limit: 8,
          sort: 'popular',
        });
        if (active) setResults(data.items || []);
      } catch {
        if (active) setResults([]);
      } finally {
        if (active) setLoading(false);
      }
    }, 180);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [query, isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-[#3B241C]/55 p-4 pt-16 sm:pt-24"
      role="dialog"
      aria-modal="true"
      aria-label="Search Bakery Catalogue"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl border-2 border-[#593B30] bg-[#F5E9C9] shadow-[8px_8px_0_#593B30]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b-2 border-[#593B30] bg-[#FAF3DF] px-4 py-3">
          <Search className="h-5 w-5 text-[#593B30]" aria-hidden="true" />
          <input
            type="search"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search croissants, pistachio cookies, brownies, matcha..."
            className="w-full bg-transparent text-base text-[#3B241C] placeholder:text-[#593B30]/55 focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="border-2 border-[#593B30] bg-[#F5E9C9] p-1 hover:bg-[#C83F35] hover:text-[#F5E9C9] cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-4">
          {loading ? (
            <p className="py-6 text-center text-sm text-[#593B30]/75">Searching fresh bakes...</p>
          ) : results.length === 0 ? (
            <p className="py-6 text-center text-sm text-[#593B30]/75">
              No treats matched "{query}". Try "croissant", "brownie", or "matcha".
            </p>
          ) : (
            <ul className="divide-y divide-[#593B30]/20">
              {results.map((item) => (
                <li key={item.id}>
                  <Link
                    to={`/shop/${item.slug}`}
                    onClick={onClose}
                    className="flex items-center justify-between gap-4 py-3 px-2 hover:bg-[#FAF3DF] transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="h-12 w-12 shrink-0 border border-[#593B30] object-cover"
                      />
                      <div className="min-w-0">
                        <p className="font-display text-base font-bold truncate text-[#3B241C]">
                          {item.name}
                        </p>
                        <p className="text-xs text-[#593B30]/75">{item.category_name}</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold tabular-nums text-[#3B241C] shrink-0">
                      {formatINR(item.price_inr)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
