import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Check, Minus, Plus, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { api, formatINR } from '../services/api.js';
import { ProductImage } from '../components/Graphics.jsx';
import { ProductCard } from '../components/ProductCard.jsx';

const MAX_REGULAR_PRODUCT_QTY = 5;

export function ProductDetailPage() {
  const { slug } = useParams();
  const { cart, addProduct } = useCart();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    setQuantity(1);
    const fetchDetail = () => {
      api
        .fetchProductBySlug(slug)
        .then((data) => {
          if (active) setProduct(data);
        })
        .catch((err) => {
          if (active) setError(err.message);
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    };
    fetchDetail();
    return () => {
      active = false;
    };
  }, [slug]);

  const inBagQty =
    product && cart?.items
      ? cart.items.find((item) => item.item_type === 'product' && item.product_id === product.id)
          ?.quantity || 0
      : 0;
  const remainingAllowed = Math.max(0, MAX_REGULAR_PRODUCT_QTY - inBagQty);
  const maxStepperQty = Math.max(1, remainingAllowed);
  const atLimit = remainingAllowed === 0 || quantity >= maxStepperQty;

  useEffect(() => {
    setQuantity((q) => Math.min(q, maxStepperQty));
  }, [maxStepperQty]);

  const handleAddToBag = async () => {
    if (!product || adding || remainingAllowed === 0) return;
    setAdding(true);
    try {
      await addProduct(product.id, quantity, product.name);
      setQuantity(1);
      setAdded(true);
      window.setTimeout(() => setAdded(false), 1500);
    } catch {
      // Handled by CartContext
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-[1360px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="h-96 border-2 border-[#593B30]/30 bg-[#FAF3DF] animate-pulse" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="font-display text-3xl font-bold text-[#3B241C]">Bake Not Found</h1>
        <p className="mt-2 text-sm text-[#593B30]">{error || 'This pastry could not be located.'}</p>
        <Link
          to="/shop"
          className="mt-6 inline-block border-2 border-[#593B30] bg-[#F2C94C] px-5 py-2.5 text-sm font-bold text-[#3B241C]"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1360px] px-4 py-10 sm:px-6 lg:px-8">
      <Link
        to={`/shop?category=${product.category_slug}`}
        className="inline-flex items-center gap-2 text-sm font-bold text-[#593B30] hover:text-[#C83F35] transition-colors"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        <span>Back to {product.category_name}</span>
      </Link>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-6 border-2 border-[#593B30] bg-[#FAF3DF] p-3 shadow-[6px_6px_0_#593B30]">
          <ProductImage src={product.image_url} alt={product.name} />
        </div>

        <div className="lg:col-span-6 space-y-6">
          <div className="border-b-2 border-[#593B30] pb-5">
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#593B30]">
              <span>{product.category_name}</span>
              {product.is_seasonal ? (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-[#C83F35]">Seasonal Special</span>
                </>
              ) : null}
              {product.is_bestseller ? (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-[#3556A5]">Bestseller</span>
                </>
              ) : null}
            </div>

            <h1 className="mt-2 font-display text-4xl sm:text-5xl font-bold leading-tight text-[#3B241C]">
              {product.name}
            </h1>

            <div className="mt-4 flex items-center justify-between gap-4">
              <span className="text-3xl font-extrabold tabular-nums text-[#3B241C]">
                {formatINR(product.price_inr)}
              </span>
              <span className="text-sm font-bold text-[#3556A5]">
                {product.is_available ? 'Baked Fresh Today · In Stock' : 'Sold Out'}
              </span>
            </div>
          </div>

          <p className="text-base leading-relaxed text-[#593B30]">
            {product.description}
          </p>

          <div className="space-y-2 pt-2">
            <div className="flex flex-wrap items-center gap-4">
              <div className="inline-flex items-center border-2 border-[#593B30] bg-[#FAF3DF]">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={remainingAllowed === 0 || quantity <= 1}
                  aria-label="Decrease quantity"
                  className="px-3.5 py-3 hover:bg-[#E8AFC0] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-5 text-base font-bold tabular-nums">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(maxStepperQty, q + 1))}
                  disabled={atLimit}
                  aria-label="Increase quantity"
                  title={atLimit ? 'Maximum 5 per product' : undefined}
                  className="px-3.5 py-3 hover:bg-[#F2C94C] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToBag}
                disabled={!product.is_available || adding || remainingAllowed === 0}
                className={`flex-1 min-w-[200px] inline-flex items-center justify-center gap-2 border-2 border-[#593B30] px-6 py-3.5 text-base font-bold shadow-[4px_4px_0_#593B30] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  added
                    ? 'bg-[#3556A5] text-[#F5E9C9]'
                    : 'bg-[#F2C94C] text-[#3B241C] hover:bg-[#C83F35] hover:text-[#F5E9C9]'
                }`}
              >
                {added ? (
                  <>
                    <Check className="h-5 w-5" aria-hidden="true" />
                    <span>Added to Your Bag</span>
                  </>
                ) : (
                  <span>
                    {!product.is_available
                      ? 'Sold Out'
                      : adding
                        ? 'Adding...'
                        : remainingAllowed === 0
                          ? 'Maximum 5 in Bag'
                          : `Add to Bag · ${formatINR(product.price_inr * quantity)}`}
                  </span>
                )}
              </button>
            </div>

            {atLimit ? (
              <p className="text-xs font-bold text-[#C83F35]">
                Maximum {MAX_REGULAR_PRODUCT_QTY} per product
                {inBagQty > 0 ? ` (${inBagQty} already in your bag)` : ''}
              </p>
            ) : null}
          </div>

          {product.preset_contents && product.preset_contents.length > 0 ? (
            <div className="border-2 border-[#593B30] bg-[#F2C94C]/25 p-5 space-y-3">
              <div className="flex items-center justify-between gap-2 border-b border-[#593B30]/25 pb-2">
                <h2 className="font-display text-lg font-bold text-[#3B241C]">
                  What&apos;s Inside This Box
                </h2>
                <span className="text-xs font-bold uppercase tracking-wider text-[#3556A5] tabular-nums">
                  {product.preset_contents.reduce((sum, entry) => sum + entry.quantity, 0)} pieces total
                </span>
              </div>
              <ul className="divide-y divide-[#593B30]/15">
                {product.preset_contents.map((entry) => (
                  <li key={entry.slug} className="py-2 flex items-center justify-between gap-3 text-sm">
                    <div className="flex items-center gap-3 min-w-0">
                      {entry.image_url ? (
                        <img
                          src={entry.image_url}
                          alt={entry.name}
                          referrerPolicy="no-referrer"
                          className="h-10 w-10 shrink-0 border border-[#593B30] object-cover"
                        />
                      ) : null}
                      {entry.product_id ? (
                        <Link
                          to={`/shop/${entry.slug}`}
                          className="font-semibold text-[#3B241C] hover:text-[#C83F35] hover:underline truncate"
                        >
                          {entry.name}
                        </Link>
                      ) : (
                        <span className="font-semibold text-[#3B241C] truncate">{entry.name}</span>
                      )}
                    </div>
                    <span className="font-bold tabular-nums text-[#3556A5] shrink-0">
                      ×{entry.quantity}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {product.is_box_eligible ? (
            <div className="border-2 border-[#593B30] bg-[#E8AFC0]/45 p-4 flex items-center justify-between gap-4">
              <div className="text-sm text-[#3B241C]">
                <strong className="font-bold">Box Eligible:</strong>{' '}
                {product.eligible_tiers?.length === 3
                  ? 'Pack inside a Little, Happy, or Party Box.'
                  : product.eligible_tiers?.length === 2
                    ? 'Pack inside a Happy or Party Box.'
                    : 'Available inside our 12-treat Party Box.'}
              </div>
              <Link
                to={`/build-your-box?tier=${product.eligible_tiers?.[0] || 'happy'}`}
                className="inline-flex items-center gap-1.5 border-2 border-[#593B30] bg-[#FAF3DF] px-3 py-1.5 text-xs font-bold text-[#3B241C] hover:bg-[#F2C94C] whitespace-nowrap shrink-0"
              >
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Build Box</span>
              </Link>
            </div>
          ) : null}

          <div className={`grid grid-cols-1 ${product.category_slug !== 'gift-boxes' && product.ingredients ? 'sm:grid-cols-2' : ''} gap-4 pt-2`}>
            {product.category_slug !== 'gift-boxes' && product.ingredients ? (
              <div className="border-2 border-[#593B30] bg-[#FAF3DF] p-4">
                <h2 className="font-display text-base font-bold text-[#3B241C]">Key Ingredients</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-[#593B30]">{product.ingredients}</p>
              </div>
            ) : null}
            <div className="border-2 border-[#593B30] bg-[#FAF3DF] p-4">
              <h2 className="font-display text-base font-bold text-[#C83F35]">Allergen Notes</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-[#593B30]">
                Contains: <strong className="text-[#3B241C]">{product.allergens}</strong>. Prepared in a kitchen handling tree nuts, dairy, and wheat.
              </p>
            </div>
          </div>
        </div>
      </div>

      {product.related_products && product.related_products.length > 0 ? (
        <section className="mt-16 border-t-2 border-[#593B30] pt-10">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#3B241C]">
            Pair It With
          </h2>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {product.related_products.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
