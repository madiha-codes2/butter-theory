import { Link } from 'react-router-dom';
import { Clock, Info, Mail, MapPin, Phone, Truck } from 'lucide-react';
import { HandSquiggle } from '../components/Graphics.jsx';

const DISPATCH_SCHEDULE = [
  { window: '08:30 AM – 11:30 AM', batch: 'Morning Viennoiserie Drop — Croissants, Cinnamon Rolls & Berry Danishes' },
  { window: '11:30 AM – 03:30 PM', batch: 'Midday Cookie & Brownie Dispatch — Molten Cookies, Brookies & Glazed Donuts' },
  { window: '03:30 PM – 08:30 PM', batch: 'Afternoon Cake & Custom Box Run — Cheesecake, Cake Slices & Gift Boxes' },
];

const DELIVERY_ZONES = [
  'Bandra West & Pali Hill',
  'Khar West & Santacruz',
  'Juhu & Versova',
  'BKC & Kalina',
  'Lower Parel & Worli',
  'Marine Drive, Fort & Colaba',
];

export function DeliveryOrdersPage() {
  return (
    <div className="mx-auto max-w-[1360px] px-4 py-10 sm:px-6 lg:px-8">
      <div className="border-b-2 border-[#593B30] pb-6">
        <p className="font-hand text-3xl font-bold text-[#C83F35]">
          Online Bakery & Cloud Kitchen · Delivery Only
        </p>
        <h1 className="mt-1 font-display text-4xl sm:text-6xl font-bold tracking-tight text-[#3B241C]">
          Delivery & Orders
        </h1>
        <div className="mt-3">
          <HandSquiggle />
        </div>
      </div>

      <div className="mt-6 border-2 border-[#3556A5] bg-[#FAF3DF] p-4 flex items-start gap-3">
        <Info className="h-5 w-5 shrink-0 text-[#3556A5] mt-0.5" aria-hidden="true" />
        <p className="text-sm text-[#3B241C]">
          <strong>Cloud Kitchen Notice:</strong> BUTTER THEORY operates strictly as an online bakery and cloud kitchen. We do not offer dine-in tables or walk-in seating—all bakes and drinks are dispatched directly to your door. Delivery zones, dispatch coordinates, and contact details below are placeholder data for this portfolio experience.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-6 space-y-6">
          <section className="border-2 border-[#593B30] bg-[#FAF3DF] p-6 shadow-[6px_6px_0_#593B30] space-y-5">
            <h2 className="font-display text-2xl font-bold text-[#3B241C] border-b-2 border-[#593B30] pb-3">
              Dispatch Kitchen & Coverage (Placeholder)
            </h2>

            <div className="flex items-start gap-3 text-sm text-[#593B30]">
              <MapPin className="h-5 w-5 shrink-0 text-[#C83F35] mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-bold text-[#3B241C]">Central Cloud Kitchen</p>
                <p>Unit 4, Chapel Road Bakehouse Hub, Bandra West</p>
                <p>Mumbai, Maharashtra 400050 (Delivery Dispatch Only)</p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-sm text-[#593B30]">
              <Clock className="h-5 w-5 shrink-0 text-[#3556A5] mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-bold text-[#3B241C]">Online Ordering & Dispatch Hours</p>
                <p>Tuesday – Sunday: 8:30 AM – 8:30 PM</p>
                <p className="text-xs text-[#C83F35] font-semibold mt-0.5">
                  Closed Mondays for 72-hour dough lamination prep
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-sm text-[#593B30]">
              <Truck className="h-5 w-5 shrink-0 text-[#3556A5] mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-bold text-[#3B241C]">Delivery Fees</p>
                <p>Flat ₹60 local courier fee · Free delivery on orders of ₹999 or more.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-sm text-[#593B30]">
              <Phone className="h-5 w-5 shrink-0 text-[#593B30] mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-bold text-[#3B241C]">Order Support Desk</p>
                <p className="tabular-nums">+91 22 4000 1890</p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-sm text-[#593B30]">
              <Mail className="h-5 w-5 shrink-0 text-[#593B30] mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-bold text-[#3B241C]">Bulk Gifting & Corporate Boxes</p>
                <p>orders@buttertheory.example</p>
              </div>
            </div>
          </section>

          <section className="border-2 border-[#593B30] bg-[#FAF3DF] p-6 shadow-[6px_6px_0_#593B30]">
            <p className="font-hand text-2xl font-bold text-[#3556A5]">Service Areas (Placeholder)</p>
            <h2 className="font-display text-2xl font-bold text-[#3B241C]">Active Delivery Zones</h2>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {DELIVERY_ZONES.map((zone) => (
                <div
                  key={zone}
                  className="border border-[#593B30] bg-[#F5E9C9] px-3.5 py-2 text-sm font-medium text-[#3B241C]"
                >
                  {zone}
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="lg:col-span-6 space-y-6">
          <div className="border-2 border-[#593B30] bg-[#F2C94C] p-3 shadow-[6px_6px_0_#593B30]">
            <img
              src="/src/assets/images/editorial_box_collage_1795684648277.jpg"
              alt="Ribboned Butter Theory treat box packed for doorstep delivery"
              className="aspect-[16/10] w-full object-cover border border-[#593B30]"
            />
          </div>

          <section className="border-2 border-[#593B30] bg-[#FAF3DF] p-6 shadow-[6px_6px_0_#593B30]">
            <p className="font-hand text-2xl font-bold text-[#C83F35]">Baked to Ship Warm</p>
            <h2 className="font-display text-2xl font-bold text-[#3B241C]">Daily Oven & Dispatch Windows</h2>
            <ul className="mt-4 divide-y-2 divide-[#593B30]/15">
              {DISPATCH_SCHEDULE.map((slot) => (
                <li key={slot.window} className="py-3 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-5">
                  <span className="shrink-0 font-bold text-xs sm:text-sm tabular-nums text-[#C83F35] w-44">
                    {slot.window}
                  </span>
                  <span className="text-sm text-[#3B241C]">{slot.batch}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="border-2 border-[#593B30] bg-[#3556A5] p-6 text-[#F5E9C9] shadow-[6px_6px_0_#593B30]">
            <h2 className="font-display text-2xl font-bold text-[#F2C94C]">Ready for Delivery?</h2>
            <p className="mt-2 text-sm text-[#F5E9C9]/90 leading-relaxed">
              Order individual bakes from our daily counter or assemble a custom Little, Happy, or Party Box for doorstep delivery.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                to="/build-your-box"
                className="border-2 border-[#593B30] bg-[#F2C94C] px-4 py-2.5 text-sm font-bold text-[#3B241C] hover:bg-[#E8AFC0] transition-colors"
              >
                Build Your Own Box
              </Link>
              <Link
                to="/shop"
                className="border-2 border-[#F5E9C9] px-4 py-2.5 text-sm font-bold text-[#F5E9C9] hover:bg-[#F5E9C9] hover:text-[#3556A5] transition-colors"
              >
                Shop All Bakes
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
