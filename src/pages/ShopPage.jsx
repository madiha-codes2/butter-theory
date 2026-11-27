import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { api } from '../services/api.js';
import { ProductCard } from '../components/ProductCard.jsx';

const FETCH_LIMIT = 100;

export function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const activeCategory = searchParams.get('category') || 'all';
  const activeSort =
    searchParams.get('sort') || (activeCategory === 'all' ? 'category_order' : 'popular');
  const seasonalOnly = searchParams.get('seasonal') === 'true';
  const searchQuery = searchParams.get('search') || '';
  const [searchInput, setSearchInput] = useState(searchQuery);

  useEffect(() => {
    api.fetchCategories().then((res) => setCategories(res.items || [])).catch(() => {});
  }, []);

  useEffect(() => {
    let active = true;
    async function loadProducts() {
      setLoading(true);
      setError('');
      try {
        const res = await api.fetchProducts({
          category: activeCategory === 'all' ? undefined : activeCategory,
          search: searchQuery || undefined,
          sort: activeSort,
          seasonal: seasonalOnly ? true : undefined,
          limit: FETCH_LIMIT,
          offset: 0,
        });
        if (!active) return;
        setProducts(res.items || []);
        setTotal(res.total || 0);
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    }
    loadProducts();
    return () => {
      active = false;
    };
  }, [activeCategory, activeSort, seasonalOnly, searchQuery]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === 'all' || value === 'false') {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParam('search', searchInput.trim());
  };

  return (
    <div className="mx-auto max-w-[1360px] px-4 py-10 sm:px-6 lg:px-8">
      <div className="border-b-2 border-[#593B30] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="font-hand text-2xl font-bold text-[#C83F35]">
            Dispatched fresh from our cloud kitchen
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#3B241C]">
            Online Bakery Shop
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#593B30] tabular-nums">
            Showing {products.length} of {total} small-batch bakes and drinks
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <form onSubmit={handleSearchSubmit} className="flex border-2 border-[#593B30] bg-[#FAF3DF]">
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search treats..."
              className="w-full sm:w-56 px-3 py-2 text-sm bg-transparent text-[#3B241C] placeholder:text-[#593B30]/55 focus:outline-none"
            />
            {searchInput ? (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => {
                  setSearchInput('');
                  updateParam('search', '');
                }}
                className="px-2 text-[#593B30] hover:text-[#C83F35] cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
            <button
              type="submit"
              aria-label="Run search"
              className="border-l-2 border-[#593B30] bg-[#F2C94C] px-3 text-[#3B241C] hover:bg-[#3556A5] hover:text-[#F5E9C9] transition-colors cursor-pointer"
            >
              <Search className="h-4 w-4" />
            </button>
          </form>

          <label className="inline-flex items-center gap-2 border-2 border-[#593B30] bg-[#FAF3DF] px-3 py-2 text-sm font-medium">
            <SlidersHorizontal className="h-4 w-4 text-[#593B30]" aria-hidden="true" />
            <span className="sr-only">Sort products</span>
            <select
              value={activeSort}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="bg-transparent font-bold text-[#3B241C] focus:outline-none cursor-pointer"
            >
              {activeCategory === 'all' ? (
                <option value="category_order">Default Order</option>
              ) : null}
              <option value="popular">Popular first</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">Name: A to Z</option>
            </select>
          </label>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => {
            const next = new URLSearchParams(searchParams);
            next.delete('category');
            if (next.get('sort') === 'popular') next.delete('sort');
            setSearchParams(next);
          }}
          className={`border-2 border-[#593B30] px-3.5 py-1.5 text-xs sm:text-sm font-bold whitespace-nowrap transition-colors cursor-pointer ${
            activeCategory === 'all'
              ? 'bg-[#593B30] text-[#F5E9C9]'
              : 'bg-[#FAF3DF] text-[#3B241C] hover:bg-[#F2C94C]'
          }`}
        >
          All Products
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => {
              const next = new URLSearchParams(searchParams);
              next.set('category', cat.slug);
              if (next.get('sort') === 'category_order') next.delete('sort');
              setSearchParams(next);
            }}
            className={`border-2 border-[#593B30] px-3.5 py-1.5 text-xs sm:text-sm font-bold whitespace-nowrap transition-colors cursor-pointer ${
              activeCategory === cat.slug
                ? 'bg-[#3556A5] text-[#F5E9C9]'
                : 'bg-[#FAF3DF] text-[#3B241C] hover:bg-[#F2C94C]'
            }`}
          >
            {cat.name}
          </button>
        ))}

        <button
          type="button"
          onClick={() => updateParam('seasonal', seasonalOnly ? 'false' : 'true')}
          className={`border-2 border-[#593B30] px-3.5 py-1.5 text-xs sm:text-sm font-bold whitespace-nowrap transition-colors cursor-pointer ${
            seasonalOnly
              ? 'bg-[#C83F35] text-[#F5E9C9]'
              : 'bg-[#E8AFC0]/60 text-[#3B241C] hover:bg-[#E8AFC0]'
          }`}
        >
          Seasonal Specials
        </button>
      </div>

      {error ? (
        <div className="mt-8 border-2 border-[#C83F35] bg-[#FAF3DF] p-6 text-center">
          <p className="font-bold text-[#C83F35]">{error}</p>
        </div>
      ) : null}

      {loading ? (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div key={idx} className="h-80 border-2 border-[#593B30]/30 bg-[#FAF3DF] animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="mt-10 border-2 border-[#593B30] bg-[#FAF3DF] p-12 text-center">
          <h2 className="font-display text-2xl font-bold text-[#3B241C]">No bakes matched</h2>
          <p className="mt-2 text-sm text-[#593B30]">
            Try clearing your search or switching back to all bakery categories.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchInput('');
              setSearchParams({});
            }}
            className="mt-5 border-2 border-[#593B30] bg-[#F2C94C] px-5 py-2 text-sm font-bold text-[#3B241C] cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
