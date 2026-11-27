import { Link } from 'react-router-dom';
import { ArrowRight, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { formatINR } from '../services/api.js';

export function CartPage() {
  const { cart, updateItemQuantity, removeItem, isSyncing } = useCart();

  return (
    <div className="mx-auto max-w-[1360px] px-4 py-10 sm:px-6 lg:px-8">
      <div className="border-b-2 border-[#593B30] pb-5">
        <p className="font-hand text-2xl font-bold text-[#C83F35]">Review your bakes</p>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#3B241C]">
          Shopping Bag ({cart.item_count || 0})
        </h1>
      </div>

      {cart.items.length === 0 ? (
        <div className="mt-10 border-2 border-[#593B30] bg-[#FAF3DF] p-12 text-center">
          <h2 className="font-display text-3xl font-bold text-[#3B241C]">Nothing in your bag yet</h2>
          <p className="mt-2 max-w-md mx-auto text-sm sm:text-base text-[#593B30]">
            Explore our fresh cookies, laminated croissants, and fudge brownies—or pack a custom treat box.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              to="/shop"
              className="border-2 border-[#593B30] bg-[#F2C94C] px-6 py-3 text-sm font-bold text-[#3B241C] shadow-[4px_4px_0_#593B30] hover:bg-[#C83F35] hover:text-[#F5E9C9] transition-colors"
            >
              Browse Shop
            </Link>
            <Link
              to="/build-your-box"
              className="border-2 border-[#593B30] bg-[#3556A5] px-6 py-3 text-sm font-bold text-[#F5E9C9] hover:bg-[#593B30] transition-colors"
            >
              Build Your Own Box
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-4">
            {cart.items.map((item) => (
              <div
                key={item.id}
                className="border-2 border-[#593B30] bg-[#FAF3DF] p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:items-center justify-between"
              >
                <div className="flex gap-4 items-start sm:items-center min-w-0">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="h-24 w-24 shrink-0 border-2 border-[#593B30] object-cover"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-[#593B30]/80">{item.subtitle}</p>
                    <h2 className="font-display text-xl font-bold text-[#3B241C]">{item.name}</h2>
                    <p className="mt-0.5 text-sm font-semibold tabular-nums text-[#593B30]">
                      {formatINR(item.unit_price_inr)} each
                    </p>

                    {item.box_contents && item.box_contents.length > 0 ? (
                      <div className="mt-2.5 border-t border-[#593B30]/20 pt-2 space-y-2">
                        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-[#593B30]">
                          {item.box_contents.map((sub, idx) => (
                            <span key={sub.product_id || sub.slug || idx} className="font-medium">
                              {sub.name} ×{sub.quantity}
                            </span>
                          ))}
                        </div>

                        {item.item_type === 'custom_box' && item.items_total_inr > 0 ? (
                          <div className="max-w-xs border border-[#593B30]/30 bg-[#F5E9C9] px-3 py-2 text-xs space-y-0.5 text-[#3B241C]">
                            <div className="flex justify-between gap-4">
                              <span className="text-[#593B30]">Individual total:</span>
                              <span className="tabular-nums font-medium">
                                {formatINR(item.items_total_inr * item.quantity)}
                              </span>
                            </div>
                            {item.discount_inr > 0 ? (
                              <div className="flex justify-between gap-4 text-[#C83F35]">
                                <span>Box discount:</span>
                                <span className="tabular-nums font-semibold">
                                  −{formatINR(item.discount_inr * item.quantity)}
                                </span>
                              </div>
                            ) : null}
                            <div className="flex justify-between gap-4 border-t border-[#593B30]/20 pt-1 font-bold">
                              <span>Box price:</span>
                              <span className="tabular-nums">{formatINR(item.line_total_inr)}</span>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#593B30]/20">
                  <div className="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto">
                    <div className="inline-flex items-center border-2 border-[#593B30] bg-[#F5E9C9]">
                      <button
                        type="button"
                        onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                        disabled={isSyncing}
                        aria-label="Decrease quantity"
                        className="px-3 py-2 hover:bg-[#E8AFC0] cursor-pointer disabled:opacity-40"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="px-4 text-sm font-bold tabular-nums">{item.quantity}</span>
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
                        className="px-3 py-2 hover:bg-[#F2C94C] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <span className="text-lg font-bold tabular-nums text-[#3B241C] min-w-[76px] text-right">
                      {formatINR(item.line_total_inr)}
                    </span>

                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      disabled={isSyncing}
                      aria-label={`Remove ${item.name}`}
                      className="p-2 text-[#593B30]/75 hover:text-[#C83F35] cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  {!item.is_available ? (
                    <p className="text-xs font-bold text-[#C83F35]">
                      Currently sold out — remove to continue checkout
                    </p>
                  ) : item.item_type === 'product' && item.quantity >= 5 ? (
                    <p className="text-xs font-bold text-[#C83F35]">
                      Maximum 5 per product
                    </p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          <aside className="lg:col-span-4 border-2 border-[#593B30] bg-[#FAF3DF] p-6 shadow-[6px_6px_0_#593B30] space-y-4">
            <h2 className="font-display text-2xl font-bold text-[#3B241C] border-b-2 border-[#593B30] pb-3">
              Order Summary
            </h2>

            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold tabular-nums">{formatINR(cart.subtotal_inr)}</span>
              </div>
              <div className="flex justify-between">
                <span>Local Delivery</span>
                <span className="font-bold tabular-nums">
                  {cart.delivery_fee_inr === 0 ? 'FREE' : formatINR(cart.delivery_fee_inr)}
                </span>
              </div>
              {cart.amount_to_free_delivery_inr > 0 ? (
                <p className="text-xs text-[#3556A5] font-medium">
                  Free delivery on orders of ₹{cart.free_delivery_threshold_inr} or more.
                </p>
              ) : null}
            </div>

            <div className="flex justify-between border-t-2 border-[#593B30] pt-4 text-lg font-extrabold">
              <span>Total</span>
              <span className="tabular-nums">{formatINR(cart.total_inr)}</span>
            </div>

            <Link
              to="/checkout"
              className="mt-2 w-full inline-flex items-center justify-center gap-2 border-2 border-[#593B30] bg-[#C83F35] py-3.5 text-base font-bold text-[#F5E9C9] shadow-[4px_4px_0_#593B30] hover:bg-[#3556A5] transition-colors"
            >
              <span>Proceed to Guest Checkout</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
