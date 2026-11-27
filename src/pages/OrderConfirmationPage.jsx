import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { CheckCircle2, Package, Receipt, ShoppingBag } from 'lucide-react';
import { api, formatINR } from '../services/api.js';
import { BakeryStamp } from '../components/Graphics.jsx';

const PAYMENT_LABELS = {
  card_uncollected: 'Card Preference (Not Charged)',
  upi_uncollected: 'UPI Preference (Not Charged)',
  cash_on_delivery: 'Cash on Delivery',
};

const PAYMENT_STATUS_LABELS = {
  not_charged_test_order: 'Recorded Locally — No Online Payment Collected',
  cash_due_on_delivery: 'Cash Due Upon Delivery',
};

export function OrderConfirmationPage() {
  const { orderNumber } = useParams();
  const location = useLocation();
  const initialOrder = location.state?.order || null;

  const [order, setOrder] = useState(
    initialOrder && initialOrder.order_number === orderNumber ? initialOrder : null,
  );
  const [loading, setLoading] = useState(!order);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    if (!orderNumber) return;

    const loadOrder = async () => {
      if (!order || order.order_number !== orderNumber) {
        setLoading(true);
      }
      setError('');
      try {
        const fetched = await api.fetchOrder(orderNumber);
        if (active) setOrder(fetched);
      } catch (err) {
        if (active && !order) {
          setError(err.message || 'Could not locate this order.');
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadOrder();
    return () => {
      active = false;
    };
  }, [orderNumber]);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="font-display text-2xl font-bold text-[#3B241C]">Loading your bakery receipt...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="font-display text-3xl font-bold text-[#C83F35]">Order Not Found</h1>
        <p className="mt-2 text-sm text-[#593B30]">
          {error || 'We could not find an order matching that confirmation number.'}
        </p>
        <Link
          to="/shop"
          className="mt-6 inline-block border-2 border-[#593B30] bg-[#F2C94C] px-6 py-3 text-sm font-bold text-[#3B241C]"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1040px] px-4 py-10 sm:px-6 lg:px-8">
      <section className="relative overflow-hidden border-2 border-[#593B30] bg-[#F2C94C] p-6 sm:p-10 shadow-[8px_8px_0_#593B30]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 border-2 border-[#593B30] bg-[#FAF3DF] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#3556A5]">
              <CheckCircle2 className="h-4 w-4 text-[#C83F35]" aria-hidden="true" />
              <span>Order Recorded · Cloud Kitchen Dispatch</span>
            </div>
            <p className="mt-4 font-hand text-2xl font-bold text-[#C83F35]">
              Fresh from our ovens to your doorstep
            </p>
            <h1 className="mt-1 font-display text-4xl sm:text-5xl font-bold tracking-tight text-[#3B241C]">
              Thank you, {order.customer_name}
            </h1>
            <p className="mt-3 max-w-xl text-sm sm:text-base text-[#3B241C]/90">
              Your order has been recorded locally for this storefront preview and is not sent to a real business. Keep your unique order reference below.
            </p>
          </div>

          <div className="shrink-0 flex flex-col items-start md:items-end gap-3">
            <div className="border-2 border-[#593B30] bg-[#FAF3DF] px-5 py-3 shadow-[4px_4px_0_#593B30]">
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#593B30]/75">
                Unique Order ID
              </p>
              <p className="mt-0.5 font-display text-2xl sm:text-3xl font-bold tabular-nums text-[#C83F35]">
                {order.order_number}
              </p>
            </div>
            <div className="hidden sm:block">
              <BakeryStamp labelTop="BAKED TO ORDER" labelBottom="DISPATCH QUEUED" bg="#E8AFC0" size={88} />
            </div>
          </div>
        </div>
      </section>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 border-2 border-[#593B30] bg-[#FAF3DF] p-6 shadow-[6px_6px_0_#593B30]">
          <div className="flex items-center gap-2.5 border-b-2 border-[#593B30] pb-4">
            <Receipt className="h-5 w-5 text-[#C83F35]" aria-hidden="true" />
            <h2 className="font-display text-2xl font-bold text-[#3B241C]">Itemized Receipt</h2>
          </div>

          <ul className="divide-y-2 divide-[#593B30]/15">
            {order.items.map((item) => (
              <li key={item.id} className="py-4 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-lg font-bold text-[#3B241C]">
                      {item.name}
                    </span>
                    <span className="border border-[#593B30] bg-[#F5E9C9] px-1.5 py-0.5 text-xs font-bold tabular-nums">
                      ×{item.quantity}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-[#593B30]/75 tabular-nums">
                    {formatINR(item.unit_price_inr)} each
                  </p>
                  {item.box_contents && item.box_contents.length > 0 ? (
                    <div className="mt-2 border-l-2 border-[#3556A5] pl-3 space-y-0.5 text-xs text-[#593B30]">
                      <p className="font-bold text-[#3556A5] uppercase tracking-wider text-[11px]">
                        Selected Box Treats
                      </p>
                      {item.box_contents.map((sub, idx) => (
                        <p key={`${sub.product_id || idx}-${sub.name}`}>
                          {sub.name} ×{sub.quantity}
                        </p>
                      ))}
                    </div>
                  ) : null}
                </div>

                <span className="font-bold text-base tabular-nums text-[#3B241C] shrink-0">
                  {formatINR(item.line_total_inr)}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-4 border-t-2 border-[#593B30] pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold tabular-nums">{formatINR(order.subtotal_inr)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span className="font-bold tabular-nums">
                {order.delivery_fee_inr === 0 ? 'FREE' : formatINR(order.delivery_fee_inr)}
              </span>
            </div>
            <div className="flex justify-between border-t border-[#593B30]/30 pt-3 text-xl font-extrabold text-[#3B241C]">
              <span>Total</span>
              <span className="tabular-nums">{formatINR(order.total_inr)}</span>
            </div>
          </div>
        </div>

        <aside className="lg:col-span-5 space-y-6">
          <div className="border-2 border-[#593B30] bg-[#FAF3DF] p-6 space-y-4">
            <div className="flex items-center gap-2 border-b-2 border-[#593B30] pb-3">
              <Package className="h-5 w-5 text-[#3556A5]" aria-hidden="true" />
              <h2 className="font-display text-xl font-bold text-[#3B241C]">Delivery & Payment</h2>
            </div>

            <div className="space-y-3 text-sm text-[#593B30]">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#593B30]/70">Customer</p>
                <p className="font-bold text-[#3B241C]">{order.customer_name}</p>
                <p>{order.customer_email}</p>
                <p className="tabular-nums">{order.customer_phone}</p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#593B30]/70">
                  Delivery Address
                </p>
                <p className="text-[#3B241C]">{order.address_line1}</p>
                {order.address_line2 ? <p className="text-[#3B241C]">{order.address_line2}</p> : null}
                <p className="text-[#3B241C]">
                  {order.city}, {order.state} – {order.postal_code}
                </p>
                {order.delivery_notes ? (
                  <p className="mt-1 text-xs italic text-[#593B30]/80">Note: {order.delivery_notes}</p>
                ) : null}
              </div>

              <div className="border-t border-[#593B30]/20 pt-3 space-y-1">
                <p className="text-xs font-bold uppercase tracking-wider text-[#593B30]/70">
                  Payment &amp; Order Status
                </p>
                <p className="font-bold text-[#3B241C]">
                  {PAYMENT_LABELS[order.payment_method] || order.payment_method}
                </p>
                <p className="text-xs font-bold text-[#3556A5]">
                  {PAYMENT_STATUS_LABELS[order.payment_status] || 'Recorded Locally — No Online Payment Collected'}
                </p>
                <p className="pt-1 text-xs font-bold text-[#C83F35]">
                  Order Status: Confirmed
                </p>
              </div>
            </div>
          </div>

          <div className="border-2 border-[#593B30] bg-[#3556A5] p-6 text-[#F5E9C9] space-y-4">
            <h3 className="font-display text-2xl font-bold">Craving another box?</h3>
            <p className="text-sm text-[#F5E9C9]/85">
              Keep browsing our daily cloud-kitchen menu or assemble a custom treat box for friends.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 border-2 border-[#593B30] bg-[#F2C94C] px-4 py-2.5 text-sm font-bold text-[#3B241C] hover:bg-[#E8AFC0] transition-colors"
              >
                <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                <span>Continue Shopping</span>
              </Link>
              <Link
                to="/build-your-box"
                className="inline-flex items-center gap-2 border-2 border-[#F5E9C9] px-4 py-2.5 text-sm font-bold text-[#F5E9C9] hover:bg-[#F5E9C9] hover:text-[#3556A5] transition-colors"
              >
                <span>Build Another Box</span>
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
