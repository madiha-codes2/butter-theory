import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CreditCard, Info, ShieldCheck, Smartphone, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { api, formatINR } from '../services/api.js';

export function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, resetCartState } = useCart();

  const [form, setForm] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    address_line1: '',
    address_line2: '',
    city: 'Mumbai',
    state: 'Maharashtra',
    postal_code: '',
    delivery_notes: '',
    payment_method: 'card_uncollected',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.items.length === 0 || submitting) return;
    setSubmitting(true);
    setError('');
    try {
      const order = await api.submitCheckout(form);
      resetCartState();
      navigate(`/order-confirmation/${order.order_number}`, { state: { order } });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="font-display text-3xl font-bold text-[#3B241C]">Your Bag Is Empty</h1>
        <p className="mt-2 text-sm text-[#593B30]">
          Add pastries or build a custom box before checking out.
        </p>
        <Link
          to="/shop"
          className="mt-6 inline-block border-2 border-[#593B30] bg-[#F2C94C] px-6 py-3 text-sm font-bold text-[#3B241C]"
        >
          Shop Our Bakes
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1360px] px-4 py-10 sm:px-6 lg:px-8">
      <div className="border-b-2 border-[#593B30] pb-5">
        <p className="font-hand text-2xl font-bold text-[#C83F35]">Guest Checkout · Delivery Only</p>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#3B241C]">
          Delivery & Order Details
        </h1>
      </div>

      <div className="mt-6 border-2 border-[#3556A5] bg-[#FAF3DF] p-4 flex items-start gap-3">
        <Info className="h-5 w-5 shrink-0 text-[#3556A5] mt-0.5" aria-hidden="true" />
        <p className="text-sm text-[#3B241C]">
          <strong>Portfolio Checkout Notice:</strong> Submitting this checkout records your order locally in this browser and issues a unique order reference, without processing real payments or sending orders to an active bakery.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <section className="border-2 border-[#593B30] bg-[#FAF3DF] p-6 space-y-4">
            <h2 className="font-display text-2xl font-bold text-[#3B241C]">1. Contact Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#593B30]">
                Full Name *
                <input
                  required
                  name="customer_name"
                  value={form.customer_name}
                  onChange={handleChange}
                  placeholder="Aarav Mehta"
                  className="mt-1.5 w-full border-2 border-[#593B30] bg-[#F5E9C9] px-3 py-2.5 text-sm font-normal text-[#3B241C] focus:outline-none focus:border-[#3556A5]"
                />
              </label>

              <label className="block text-xs font-bold uppercase tracking-wider text-[#593B30]">
                Phone Number *
                <input
                  required
                  type="tel"
                  name="customer_phone"
                  value={form.customer_phone}
                  onChange={handleChange}
                  placeholder="+91 98201 55443"
                  className="mt-1.5 w-full border-2 border-[#593B30] bg-[#F5E9C9] px-3 py-2.5 text-sm font-normal text-[#3B241C] focus:outline-none focus:border-[#3556A5]"
                />
              </label>
            </div>

            <label className="block text-xs font-bold uppercase tracking-wider text-[#593B30]">
              Email Address *
              <input
                required
                type="email"
                name="customer_email"
                value={form.customer_email}
                onChange={handleChange}
                placeholder="aarav@example.com"
                className="mt-1.5 w-full border-2 border-[#593B30] bg-[#F5E9C9] px-3 py-2.5 text-sm font-normal text-[#3B241C] focus:outline-none focus:border-[#3556A5]"
              />
            </label>
          </section>

          <section className="border-2 border-[#593B30] bg-[#FAF3DF] p-6 space-y-4">
            <h2 className="font-display text-2xl font-bold text-[#3B241C]">2. Delivery Address</h2>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#593B30]">
              Street Address / House & Building *
              <input
                required
                name="address_line1"
                value={form.address_line1}
                onChange={handleChange}
                placeholder="14 Chapel Road, Bandra West"
                className="mt-1.5 w-full border-2 border-[#593B30] bg-[#F5E9C9] px-3 py-2.5 text-sm font-normal text-[#3B241C] focus:outline-none focus:border-[#3556A5]"
              />
            </label>

            <label className="block text-xs font-bold uppercase tracking-wider text-[#593B30]">
              Apartment / Landmark (Optional)
              <input
                name="address_line2"
                value={form.address_line2}
                onChange={handleChange}
                placeholder="Flat 4B, Bandra West"
                className="mt-1.5 w-full border-2 border-[#593B30] bg-[#F5E9C9] px-3 py-2.5 text-sm font-normal text-[#3B241C] focus:outline-none focus:border-[#3556A5]"
              />
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#593B30]">
                City *
                <input
                  required
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className="mt-1.5 w-full border-2 border-[#593B30] bg-[#F5E9C9] px-3 py-2.5 text-sm font-normal text-[#3B241C] focus:outline-none focus:border-[#3556A5]"
                />
              </label>

              <label className="block text-xs font-bold uppercase tracking-wider text-[#593B30]">
                State *
                <input
                  required
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  className="mt-1.5 w-full border-2 border-[#593B30] bg-[#F5E9C9] px-3 py-2.5 text-sm font-normal text-[#3B241C] focus:outline-none focus:border-[#3556A5]"
                />
              </label>

              <label className="block text-xs font-bold uppercase tracking-wider text-[#593B30]">
                PIN Code *
                <input
                  required
                  name="postal_code"
                  value={form.postal_code}
                  onChange={handleChange}
                  placeholder="400050"
                  className="mt-1.5 w-full border-2 border-[#593B30] bg-[#F5E9C9] px-3 py-2.5 text-sm font-normal text-[#3B241C] focus:outline-none focus:border-[#3556A5]"
                />
              </label>
            </div>

            <label className="block text-xs font-bold uppercase tracking-wider text-[#593B30]">
              Delivery Instructions (Optional)
              <input
                name="delivery_notes"
                value={form.delivery_notes}
                onChange={handleChange}
                placeholder="Ring bell once, leave with security if unavailable"
                className="mt-1.5 w-full border-2 border-[#593B30] bg-[#F5E9C9] px-3 py-2.5 text-sm font-normal text-[#3B241C] focus:outline-none focus:border-[#3556A5]"
              />
            </label>
          </section>

          <section className="border-2 border-[#593B30] bg-[#FAF3DF] p-6 space-y-4">
            <h2 className="font-display text-2xl font-bold text-[#3B241C]">3. Payment Preference</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'card_uncollected', label: 'Card (Test)', sub: 'No online card charge taken', icon: CreditCard },
                { id: 'upi_uncollected', label: 'UPI (Test)', sub: 'No UPI payment collected', icon: Smartphone },
                { id: 'cash_on_delivery', label: 'Cash on Delivery', sub: 'Pay courier at your door', icon: Truck },
              ].map((opt) => {
                const Icon = opt.icon;
                const active = form.payment_method === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, payment_method: opt.id }))}
                    className={`border-2 border-[#593B30] p-3.5 text-left transition-colors cursor-pointer ${
                      active
                        ? 'bg-[#F2C94C] text-[#3B241C] shadow-[3px_3px_0_#593B30]'
                        : 'bg-[#F5E9C9] text-[#593B30] hover:bg-[#E8AFC0]/50'
                    }`}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                    <p className="mt-2 font-display text-base font-bold">{opt.label}</p>
                    <p className="text-xs opacity-80">{opt.sub}</p>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        <aside className="lg:col-span-5 border-2 border-[#593B30] bg-[#FAF3DF] p-6 shadow-[6px_6px_0_#593B30] space-y-5">
          <h2 className="font-display text-2xl font-bold text-[#3B241C] border-b-2 border-[#593B30] pb-3">
            Your Order ({cart.item_count} {cart.item_count === 1 ? 'item' : 'items'})
          </h2>

          <ul className="divide-y divide-[#593B30]/20 max-h-80 overflow-y-auto pr-1">
            {cart.items.map((item) => (
              <li key={item.id} className="py-3 flex justify-between gap-3 text-sm">
                <div className="min-w-0">
                  <p className="font-bold text-[#3B241C]">
                    {item.name} × {item.quantity}
                  </p>
                  {item.box_contents && item.box_contents.length > 0 ? (
                    <p className="mt-0.5 text-xs text-[#593B30]/80">
                      {item.box_contents.map((b) => `${b.name} ×${b.quantity}`).join(', ')}
                    </p>
                  ) : null}
                  {item.item_type === 'custom_box' && item.items_total_inr > 0 ? (
                    <p className="mt-1 text-xs text-[#593B30] tabular-nums">
                      Individual total: {formatINR(item.items_total_inr * item.quantity)}
                      {item.discount_inr > 0 ? (
                        <span className="text-[#C83F35] font-semibold">
                          {' '}· Box discount: −{formatINR(item.discount_inr * item.quantity)}
                        </span>
                      ) : null}
                    </p>
                  ) : null}
                </div>
                <span className="font-bold tabular-nums shrink-0">
                  {formatINR(item.line_total_inr)}
                </span>
              </li>
            ))}
          </ul>

          <div className="border-t-2 border-[#593B30] pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold tabular-nums">{formatINR(cart.subtotal_inr)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span className="font-bold tabular-nums">
                {cart.delivery_fee_inr === 0 ? 'FREE' : formatINR(cart.delivery_fee_inr)}
              </span>
            </div>
            <div className="flex justify-between border-t border-[#593B30]/30 pt-2 text-lg font-extrabold">
              <span>Order Total</span>
              <span className="tabular-nums">{formatINR(cart.total_inr)}</span>
            </div>
          </div>

          {error ? (
            <p className="border border-[#C83F35] bg-[#C83F35]/10 p-3 text-xs font-bold text-[#C83F35]">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 border-2 border-[#593B30] bg-[#C83F35] py-3.5 text-base font-bold text-[#F5E9C9] shadow-[4px_4px_0_#593B30] hover:bg-[#3556A5] transition-colors cursor-pointer disabled:opacity-50"
          >
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            <span>
              {submitting
                ? 'Placing Order...'
                : `Place Order · ${formatINR(cart.total_inr)}`}
            </span>
          </button>
        </aside>
      </form>
    </div>
  );
}
