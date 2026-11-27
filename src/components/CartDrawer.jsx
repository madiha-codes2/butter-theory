import { Link } from 'react-router-dom';
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { formatINR } from '../services/api.js';

export function CartDrawer() {
  const {
    cart,
    isDrawerOpen,
    closeDrawer,
    updateItemQuantity,
    removeItem,
    isSyncing,
  } = useCart();

  if (!isDrawerOpen) return null;

  const freeThreshold = cart.free_delivery_threshold_inr || 999;
  const progressPct = Math.min(100, Math.round(((cart.subtotal_inr || 0) / freeThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Shopping Bag">
      <div
        className="fixed inset-0 bg-[#3B241C]/50 backdrop-blur-[1px]"
        onClick={closeDrawer}
        aria-hidden="true"
      />

      <aside className="relative z-10 flex h-full w-full max-w-md flex-col border-l-2 border-[#593B30] bg-[#F5E9C9] text-[#3B241C]">
        <div className="flex items-center justify-between border-b-2 border-[#593B30] bg-[#F2C94C] px-5 py-4">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="h-5 w-5" aria-hidden="true" />
            <h2 className="font-display text-xl font-bold">Your Bag ({cart.item_count || 0})</h2>
          </div>
          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Close bag"
            className="border-2 border-[#593B30] bg-[#F5E9C9] p-1.5 hover:bg-[#C83F35] hover:text-[#F5E9C9] transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="border-b-2 border-[#593B30] bg-[#FAF3DF] px-5 py-3">
          <p className="text-xs font-medium text-[#593B30]">
            {cart.subtotal_inr >= freeThreshold ? (
              <span className="font-bold text-[#3556A5]">Unlocked complimentary local bakery delivery!</span>
            ) : (
              <span>
                Add <strong className="tabular-nums">{formatINR(cart.amount_to_free_delivery_inr)}</strong> more for free local delivery
              </span>
            )}
          </p>
          <div className="mt-2 h-2 w-full border border-[#593B30] bg-[#F5E9C9]">
            <div
              className="h-full bg-[#3556A5] transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-center">
              <p className="font-display text-2xl font-bold text-[#593B30]">Your bag is empty</p>
              <p className="mt-2 max-w-xs text-sm text-[#593B30]/80">
                Fill it with laminated croissants, fudgy brownies, or build your own custom treat box.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link
                  to="/shop"
                  onClick={closeDrawer}
                  className="border-2 border-[#593B30] bg-[#F2C94C] px-4 py-2 text-sm font-bold text-[#3B241C] hover:bg-[#C83F35] hover:text-[#F5E9C9] transition-colors"
                >
                  Shop Bakes
                </Link>
                <Link
                  to="/build-your-box"
                  onClick={closeDrawer}
                  className="border-2 border-[#593B30] bg-[#3556A5] px-4 py-2 text-sm font-bold text-[#F5E9C9] hover:bg-[#593B30] transition-colors"
                >
                  Build a Box
                </Link>
              </div>
            </div>
          ) : (
            cart.items.map((item) => (
              <div
                key={item.id}
                className="border-2 border-[#593B30] bg-[#FAF3DF] p-3.5 flex gap-3.5"
              >
                <img
                  src={item.image_url}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className="h-20 w-20 shrink-0 border border-[#593B30] object-cover"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-display text-base font-bold leading-tight text-[#3B241C]">
                        {item.name}
                      </h3>
                      <p className="mt-0.5 text-xs text-[#593B30]/75">{item.subtitle}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      disabled={isSyncing}
                      aria-label={`Remove ${item.name}`}
                      className="text-[#593B30]/70 hover:text-[#C83F35] p-1 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {item.box_contents && item.box_contents.length > 0 ? (
                    <div className="mt-2 border-t border-[#593B30]/20 pt-1.5 space-y-1.5">
                      <ul className="space-y-0.5 text-xs text-[#593B30]">
                        {item.box_contents.map((sub, idx) => (
                          <li key={sub.product_id || sub.slug || idx} className="flex justify-between gap-2">
                            <span className="truncate">{sub.name}</span>
                            <span className="tabular-nums font-semibold">×{sub.quantity}</span>
                          </li>
                        ))}
                      </ul>

                      {item.item_type === 'custom_box' && item.items_total_inr > 0 ? (
                        <div className="border-t border-dashed border-[#593B30]/30 pt-1.5 text-xs space-y-0.5 text-[#3B241C]">
                          <div className="flex justify-between">
                            <span className="text-[#593B30]">Individual total:</span>
                            <span className="tabular-nums font-medium">
                              {formatINR(item.items_total_inr * item.quantity)}
                            </span>
                          </div>
                          {item.discount_inr > 0 ? (
                            <div className="flex justify-between text-[#C83F35]">
                              <span>Box discount:</span>
                              <span className="tabular-nums font-semibold">
                                −{formatINR(item.discount_inr * item.quantity)}
                              </span>
                            </div>
                          ) : null}
                          <div className="flex justify-between font-bold">
                            <span>Box price:</span>
                            <span className="tabular-nums">{formatINR(item.line_total_inr)}</span>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ) : null}

                  <div className="mt-3 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="inline-flex items-center border-2 border-[#593B30] bg-[#F5E9C9]">
                        <button
                          type="button"
                          onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                          disabled={isSyncing}
                          aria-label="Decrease quantity"
                          className="px-2 py-1 hover:bg-[#E8AFC0] cursor-pointer disabled:opacity-40"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold tabular-nums">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                          disabled={isSyncing || (item.item_type === 'product' && item.quantity >= 5)}
                          aria-label="Increase quantity"
                          title={
                            item.item_type === 'product' && item.quantity >= 5
                              ? 'Maximum 5 per product'
                              : undefined
                          }
                          className="px-2 py-1 hover:bg-[#F2C94C] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <span className="text-sm font-bold tabular-nums text-[#3B241C]">
                        {formatINR(item.line_total_inr)}
                      </span>
                    </div>
                    {!item.is_available ? (
                      <p className="text-[11px] font-bold text-[#C83F35]">
                        Currently sold out — remove to continue checkout
                      </p>
                    ) : item.item_type === 'product' && item.quantity >= 5 ? (
                      <p className="text-[11px] font-bold text-[#C83F35]">
                        Maximum 5 per product
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.items.length > 0 ? (
          <div className="border-t-2 border-[#593B30] bg-[#FAF3DF] p-5 space-y-3">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span className="font-semibold tabular-nums">{formatINR(cart.subtotal_inr)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Delivery</span>
              <span className="font-semibold tabular-nums">
                {cart.delivery_fee_inr === 0 ? 'FREE' : formatINR(cart.delivery_fee_inr)}
              </span>
            </div>
            <div className="flex justify-between border-t border-[#593B30]/30 pt-2 text-base font-bold">
              <span>Total</span>
              <span className="tabular-nums">{formatINR(cart.total_inr)}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <Link
                to="/cart"
                onClick={closeDrawer}
                className="border-2 border-[#593B30] bg-[#F5E9C9] py-2.5 text-center text-sm font-bold text-[#3B241C] hover:bg-[#E8AFC0] transition-colors"
              >
                View Bag
              </Link>
              <Link
                to="/checkout"
                onClick={closeDrawer}
                className="border-2 border-[#593B30] bg-[#C83F35] py-2.5 text-center text-sm font-bold text-[#F5E9C9] hover:bg-[#3556A5] transition-colors"
              >
                Checkout
              </Link>
            </div>
          </div>
        ) : null}
      </aside>
    </div>
  );
}
