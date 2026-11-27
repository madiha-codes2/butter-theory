import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Check, Minus, PackageCheck, Plus, RotateCcw, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '../context/CartContext.jsx';
import { api, formatINR } from '../services/api.js';
import { HandStar } from '../components/Graphics.jsx';

const MAX_PER_TREAT = 2;

export function BuildBoxPage() {
  const { addCustomBox } = useCart();
  const [searchParams] = useSearchParams();
  const initialTierParam = searchParams.get('tier');
  const initialTier = ['little', 'happy', 'party'].includes(initialTierParam)
    ? initialTierParam
    : 'happy';

  const [tiers, setTiers] = useState([]);
  const [allEligibleProducts, setAllEligibleProducts] = useState([]);
  const [selectedTier, setSelectedTier] = useState(initialTier);
  const [selections, setSelections] = useState({});
  const [activeCategory, setActiveCategory] = useState('all');
  const [giftNote, setGiftNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    async function loadBuilder() {
      try {
        const [tiersRes, prodRes] = await Promise.all([
          api.fetchBoxTiers(),
          api.fetchProducts({ box_eligible: true, limit: 60, sort: 'category_order' }),
        ]);
        if (!active) return;
        setTiers(tiersRes.tiers || []);
        setAllEligibleProducts(prodRes.items || []);
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    }
    loadBuilder();
    return () => {
      active = false;
    };
  }, []);

  const currentTier = useMemo(
    () =>
      tiers.find((t) => t.tier === selectedTier) || {
        tier: selectedTier,
        name: selectedTier === 'little' ? 'Little Box' : selectedTier === 'party' ? 'Party Box' : 'Happy Box',
        capacity: selectedTier === 'little' ? 4 : selectedTier === 'party' ? 12 : 6,
        discount_inr: selectedTier === 'little' ? 15 : selectedTier === 'party' ? 45 : 20,
        starting_price_inr: selectedTier === 'little' ? 665 : selectedTier === 'party' ? 1995 : 1000,
      },
    [tiers, selectedTier],
  );

  const tierEligibleProducts = useMemo(
    () =>
      allEligibleProducts.filter(
        (p) => !p.eligible_tiers || p.eligible_tiers.includes(selectedTier),
      ),
    [allEligibleProducts, selectedTier],
  );

  const productMap = useMemo(() => {
    const map = {};
    tierEligibleProducts.forEach((p) => {
      map[p.id] = p;
    });
    return map;
  }, [tierEligibleProducts]);

  const filledSlots = useMemo(() => {
    const slots = [];
    Object.entries(selections).forEach(([pidStr, qty]) => {
      const product = productMap[Number(pidStr)];
      if (!product) return;
      for (let i = 0; i < qty; i += 1) {
        slots.push(product);
      }
    });
    return slots.slice(0, currentTier.capacity);
  }, [selections, productMap, currentTier.capacity]);

  const selectedEntries = useMemo(
    () =>
      Object.entries(selections)
        .filter(([pidStr, qty]) => qty > 0 && productMap[Number(pidStr)])
        .map(([pidStr, qty]) => ({
          product: productMap[Number(pidStr)],
          qty,
        })),
    [selections, productMap],
  );

  const totalSelected = filledSlots.length;
  const remaining = Math.max(0, currentTier.capacity - totalSelected);
  const isBoxFull = totalSelected === currentTier.capacity;
  const fillPct = Math.round((totalSelected / Math.max(1, currentTier.capacity)) * 100);

  const itemsTotalInr = useMemo(
    () => filledSlots.reduce((sum, item) => sum + Number(item.price_inr || 0), 0),
    [filledSlots],
  );
  const discountInr = Number(currentTier.discount_inr || 0);
  const finalBoxPriceInr = itemsTotalInr > 0 ? Math.max(1, itemsTotalInr - discountInr) : 0;

  const categories = useMemo(() => {
    const seen = new Map();
    tierEligibleProducts.forEach((p) => {
      if (!seen.has(p.category_slug)) {
        seen.set(p.category_slug, p.category_name);
      }
    });
    return Array.from(seen.entries());
  }, [tierEligibleProducts]);

  useEffect(() => {
    if (activeCategory !== 'all' && !categories.some(([slug]) => slug === activeCategory)) {
      setActiveCategory('all');
    }
  }, [categories, activeCategory]);

  const visibleProducts = useMemo(() => {
    if (activeCategory === 'all') return tierEligibleProducts;
    return tierEligibleProducts.filter((p) => p.category_slug === activeCategory);
  }, [tierEligibleProducts, activeCategory]);

  const handleSelectTier = (tierKey) => {
    setSelectedTier(tierKey);
    setError('');
    const targetTier = tiers.find((t) => t.tier === tierKey);
    const targetCapacity = targetTier ? targetTier.capacity : tierKey === 'little' ? 4 : tierKey === 'party' ? 12 : 6;
    const validForTarget = new Set(
      allEligibleProducts
        .filter((p) => !p.eligible_tiers || p.eligible_tiers.includes(tierKey))
        .map((p) => p.id),
    );

    let running = 0;
    const trimmed = {};
    for (const [pid, qty] of Object.entries(selections)) {
      if (!validForTarget.has(Number(pid))) continue;
      if (running >= targetCapacity) break;
      const take = Math.min(qty, targetCapacity - running, MAX_PER_TREAT);
      if (take > 0) {
        trimmed[pid] = take;
        running += take;
      }
    }
    setSelections(trimmed);
  };

  const addTreat = (productId) => {
    const currentQty = selections[productId] || 0;
    if (remaining <= 0 || currentQty >= MAX_PER_TREAT) return;
    setError('');
    setSelections((prev) => ({
      ...prev,
      [productId]: Math.min(MAX_PER_TREAT, (prev[productId] || 0) + 1),
    }));
  };

  const removeTreat = (productId) => {
    setError('');
    setSelections((prev) => {
      const next = { ...prev };
      const current = next[productId] || 0;
      if (current <= 1) {
        delete next[productId];
      } else {
        next[productId] = current - 1;
      }
      return next;
    });
  };

  const handleSubmitBox = async () => {
    if (!isBoxFull || submitting) return;
    setSubmitting(true);
    setError('');
    try {
      const itemsPayload = Object.entries(selections)
        .filter(([, qty]) => qty > 0)
        .map(([pid, qty]) => ({
          product_id: Number(pid),
          quantity: qty,
        }));

      await addCustomBox({
        box_tier: currentTier.tier,
        items: itemsPayload,
        note: giftNote.trim(),
      });
      setSelections({});
      setGiftNote('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <section className="border-b-2 border-[#593B30] bg-[#3556A5] text-[#F5E9C9] py-9">
        <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <p className="font-hand text-3xl font-bold text-[#F2C94C]">
              Signature Box Studio
            </p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold leading-tight">
              Build Your Own Box
            </h1>
            <p className="mt-2 max-w-xl text-sm sm:text-base text-[#F5E9C9]/90">
              Choose a box size, pick your favourite bakes from the counter below, and watch your ribboned pastry box pack slot by slot.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {tiers.map((tier) => {
              const active = tier.tier === selectedTier;
              return (
                <button
                  key={tier.tier}
                  type="button"
                  onClick={() => handleSelectTier(tier.tier)}
                  className={`border-2 border-[#593B30] p-3.5 sm:p-4 text-left transition-all cursor-pointer ${
                    active
                      ? 'bg-[#F2C94C] text-[#3B241C] -translate-y-0.5 shadow-[4px_4px_0_#593B30]'
                      : 'bg-[#FAF3DF] text-[#3B241C] hover:bg-[#E8AFC0]'
                  }`}
                >
                  <p className="text-[11px] font-bold uppercase tracking-wider opacity-80 tabular-nums">
                    {tier.capacity} treats
                  </p>
                  <p className="font-display text-base sm:text-lg font-bold">{tier.name}</p>
                  <p className="mt-1.5 text-xs sm:text-sm font-extrabold tabular-nums">
                    From {formatINR(tier.starting_price_inr)}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1360px] px-4 py-10 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Treat Counter Picker */}
        <div className="lg:col-span-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#593B30] pb-4">
            <div>
              <h2 className="font-display text-2xl font-bold text-[#3B241C]">
                Pick Your Treats
              </h2>
              <p className="text-xs sm:text-sm text-[#593B30]/85 mt-0.5">
                {selectedTier === 'little'
                  ? 'Cookies, brownies, donuts, muffins & cupcakes curated for the Little Box.'
                  : selectedTier === 'happy'
                    ? 'Cookies, brownies, donuts, cupcakes & laminated croissants for the Happy Box.'
                    : 'Our complete box counter including almond croissants, berry danishes & tea loaves.'}{' '}
                <span className="font-semibold text-[#3B241C]">
                  Maximum {MAX_PER_TREAT} of each treat.
                </span>
              </p>
            </div>
            <span className="text-xs font-bold text-[#593B30] tabular-nums shrink-0">
              {totalSelected} / {currentTier.capacity} packed
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              className={`border-2 border-[#593B30] px-3 py-1 text-xs font-bold cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-[#593B30] text-[#F5E9C9]'
                  : 'bg-[#FAF3DF] text-[#3B241C] hover:bg-[#F2C94C]'
              }`}
            >
              All
            </button>
            {categories.map(([slug, name]) => (
              <button
                key={slug}
                type="button"
                onClick={() => setActiveCategory(slug)}
                className={`border-2 border-[#593B30] px-3 py-1 text-xs font-bold cursor-pointer ${
                  activeCategory === slug
                    ? 'bg-[#3556A5] text-[#F5E9C9]'
                    : 'bg-[#FAF3DF] text-[#3B241C] hover:bg-[#F2C94C]'
                }`}
              >
                {name}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-32 border-2 border-[#593B30]/30 bg-[#FAF3DF] animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {visibleProducts.map((item) => {
                const qty = selections[item.id] || 0;
                return (
                  <motion.div
                    key={item.id}
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.16 }}
                    className={`border-2 border-[#593B30] p-3 flex gap-3 items-center transition-colors ${
                      qty > 0 ? 'bg-[#F2C94C]/35 shadow-[3px_3px_0_#593B30]' : 'bg-[#FAF3DF]'
                    }`}
                  >
                    <img
                      src={item.image_url}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="h-20 w-20 shrink-0 border border-[#593B30] object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-medium text-[#593B30]/75 truncate">
                        {item.category_name}
                      </p>
                      <h3 className="font-display text-base font-bold text-[#3B241C] truncate">
                        {item.name}
                      </h3>
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <span className="text-sm font-bold tabular-nums text-[#3B241C]">
                          {formatINR(item.price_inr)}
                        </span>

                        {qty === 0 ? (
                          <button
                            type="button"
                            onClick={() => addTreat(item.id)}
                            disabled={remaining <= 0}
                            className="inline-flex items-center gap-1 border-2 border-[#593B30] bg-[#F2C94C] px-2.5 py-1 text-xs font-bold text-[#3B241C] hover:bg-[#3556A5] hover:text-[#F5E9C9] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                          >
                            <Plus className="h-3 w-3" aria-hidden="true" />
                            <span>Add</span>
                          </button>
                        ) : (
                          <div className="inline-flex items-center border-2 border-[#593B30] bg-[#F5E9C9]">
                            <button
                              type="button"
                              onClick={() => removeTreat(item.id)}
                              aria-label={`Remove one ${item.name}`}
                              className="px-2 py-1 hover:bg-[#E8AFC0] cursor-pointer"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="px-2.5 text-xs font-bold tabular-nums">{qty}</span>
                            <button
                              type="button"
                              onClick={() => addTreat(item.id)}
                              disabled={remaining <= 0 || qty >= MAX_PER_TREAT}
                              aria-label={`Add one more ${item.name}`}
                              title={qty >= MAX_PER_TREAT ? `Maximum ${MAX_PER_TREAT} of each treat` : undefined}
                              className="px-2 py-1 hover:bg-[#F2C94C] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                      </div>
                      {qty >= MAX_PER_TREAT ? (
                        <p className="mt-1 text-[11px] font-bold text-[#C83F35]">
                          Maximum {MAX_PER_TREAT} of each treat
                        </p>
                      ) : null}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Prominent, Spacious Physical Selected-Items Box */}
        <aside className="lg:col-span-6 lg:sticky lg:top-24 border-2 border-[#593B30] bg-[#FAF3DF] p-6 sm:p-7 shadow-[8px_8px_0_#593B30]">
          <div className="flex items-center justify-between gap-3 border-b-2 border-[#593B30] pb-4">
            <div>
              <p className="font-hand text-2xl font-bold text-[#C83F35] leading-none">
                Your Custom Pastry Box
              </p>
              <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-[#3B241C]">
                {currentTier.name} · {currentTier.capacity} Slots
              </h2>
            </div>

            {totalSelected > 0 ? (
              <button
                type="button"
                onClick={() => setSelections({})}
                className="inline-flex items-center gap-1.5 border-2 border-[#593B30] bg-[#F5E9C9] px-3 py-1.5 text-xs font-bold text-[#593B30] hover:bg-[#E8AFC0] cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Clear Box</span>
              </button>
            ) : null}
          </div>

          {/* Box fill progress strip */}
          <div className="mt-4">
            <div className="h-2.5 w-full border border-[#593B30] bg-[#F5E9C9] overflow-hidden">
              <div
                className="h-full bg-[#3556A5] transition-all duration-300"
                style={{ width: `${fillPct}%` }}
              />
            </div>
          </div>

          {/* Spacious Physical Keepsake Tray */}
          <div className="mt-4 border-2 border-[#593B30] bg-[#F2C94C]/25 p-4 sm:p-5">
            <div
              className={`grid gap-3.5 ${
                currentTier.capacity === 4
                  ? 'grid-cols-2'
                  : currentTier.capacity === 6
                    ? 'grid-cols-2 sm:grid-cols-3'
                    : 'grid-cols-3 sm:grid-cols-4'
              }`}
            >
              {Array.from({ length: currentTier.capacity }).map((_, idx) => {
                const slotItem = filledSlots[idx];
                return (
                  <div
                    key={idx}
                    className={`relative aspect-square border-2 flex flex-col overflow-hidden ${
                      slotItem
                        ? 'border-[#593B30] bg-[#FAF3DF] shadow-[3px_3px_0_#593B30]'
                        : 'border-dashed border-[#593B30]/45 bg-[#FAF3DF]/70 items-center justify-center'
                    }`}
                  >
                    <AnimatePresence mode="wait">
                      {slotItem ? (
                        <motion.div
                          key={`${slotItem.id}-${idx}`}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                          className="flex h-full w-full flex-col relative"
                        >
                          <div className="relative flex-1 min-h-0 overflow-hidden">
                            <img
                              src={slotItem.image_url}
                              alt={slotItem.name}
                              referrerPolicy="no-referrer"
                              className="h-full w-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeTreat(slotItem.id)}
                              aria-label={`Remove ${slotItem.name} from slot ${idx + 1}`}
                              className="absolute top-1.5 right-1.5 bg-[#C83F35] text-[#F5E9C9] p-1 border border-[#593B30] shadow-sm hover:bg-[#3B241C] transition-colors cursor-pointer"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <div className="border-t border-[#593B30] bg-[#3B241C] px-2 py-1 text-[11px] font-semibold text-[#F5E9C9] truncate">
                            {slotItem.name}
                          </div>
                        </motion.div>
                      ) : (
                        <div className="flex flex-col items-center text-center p-2">
                          <HandStar size={18} color="#593B30" className="opacity-25" />
                          <span className="mt-1.5 text-xs font-bold tabular-nums text-[#593B30]/50">
                            Slot {idx + 1}
                          </span>
                        </div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Quantity Adjustments Inside the Selected Box */}
          {selectedEntries.length > 0 ? (
            <div className="mt-4 border-2 border-[#593B30] bg-[#F5E9C9] p-3.5 space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-[#593B30]/75">
                Inside Your {currentTier.name}
              </p>
              <ul className="divide-y divide-[#593B30]/15">
                {selectedEntries.map(({ product, qty }) => (
                  <li key={product.id} className="py-2 flex items-center justify-between gap-3 text-sm">
                    <div className="min-w-0">
                      <span className="font-semibold text-[#3B241C] truncate block">{product.name}</span>
                      {qty >= MAX_PER_TREAT ? (
                        <span className="text-[11px] font-bold text-[#C83F35]">
                          Maximum {MAX_PER_TREAT} of each treat
                        </span>
                      ) : null}
                    </div>
                    <div className="inline-flex items-center border border-[#593B30] bg-[#FAF3DF] shrink-0">
                      <button
                        type="button"
                        onClick={() => removeTreat(product.id)}
                        aria-label={`Decrease ${product.name}`}
                        className="px-2 py-1 hover:bg-[#E8AFC0] cursor-pointer"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-2.5 text-xs font-bold tabular-nums">{qty}</span>
                      <button
                        type="button"
                        onClick={() => addTreat(product.id)}
                        disabled={remaining <= 0 || qty >= MAX_PER_TREAT}
                        aria-label={`Increase ${product.name}`}
                        title={qty >= MAX_PER_TREAT ? `Maximum ${MAX_PER_TREAT} of each treat` : undefined}
                        className="px-2 py-1 hover:bg-[#F2C94C] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="mt-4 flex items-center justify-between text-sm font-bold">
            {isBoxFull ? (
              <span className="inline-flex items-center gap-1.5 text-[#3556A5]">
                <PackageCheck className="h-4 w-4" aria-hidden="true" />
                <span>Box is full and ready to pack!</span>
              </span>
            ) : (
              <span className="text-[#C83F35] tabular-nums">
                Pick {remaining} more {remaining === 1 ? 'treat' : 'treats'} to fill your box
              </span>
            )}
            <span className="tabular-nums text-[#3B241C]">
              {totalSelected}/{currentTier.capacity}
            </span>
          </div>

          <div className="mt-4 flex items-center justify-between border-t-2 border-[#593B30] pt-4">
            <span className="font-display text-lg font-bold text-[#3B241C]">Box Total</span>
            <span className="font-display text-2xl font-extrabold tabular-nums text-[#3B241C]">
              {itemsTotalInr > 0 ? formatINR(finalBoxPriceInr) : '—'}
            </span>
          </div>

          <div className="mt-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#593B30]">
              Optional Box Note (Printed on Card)
              <input
                type="text"
                maxLength={140}
                value={giftNote}
                onChange={(e) => setGiftNote(e.target.value)}
                placeholder="e.g., Happy Birthday Riya!"
                className="mt-1.5 w-full border-2 border-[#593B30] bg-[#F5E9C9] px-3 py-2 text-sm font-normal text-[#3B241C] placeholder:text-[#593B30]/50 focus:outline-none focus:border-[#3556A5]"
              />
            </label>
          </div>

          {error ? (
            <p className="mt-3 text-xs font-bold text-[#C83F35]">{error}</p>
          ) : null}

          <button
            type="button"
            onClick={handleSubmitBox}
            disabled={!isBoxFull || submitting}
            className={`mt-5 w-full inline-flex items-center justify-center gap-2 border-2 border-[#593B30] py-3.5 text-base font-bold transition-colors cursor-pointer ${
              isBoxFull
                ? 'bg-[#F2C94C] text-[#3B241C] shadow-[4px_4px_0_#593B30] hover:bg-[#C83F35] hover:text-[#F5E9C9]'
                : 'bg-[#593B30]/15 text-[#593B30]/55 cursor-not-allowed'
            }`}
          >
            {isBoxFull ? <Check className="h-4 w-4" aria-hidden="true" /> : null}
            <span>
              {submitting
                ? 'Packing Box...'
                : isBoxFull
                  ? `Add ${currentTier.name} to Bag · ${formatINR(finalBoxPriceInr)}`
                  : `Select ${remaining} More to Continue`}
            </span>
          </button>
        </aside>
      </div>
    </div>
  );
}
