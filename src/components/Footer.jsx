import { Link } from 'react-router-dom';
import { ButterTheoryLogo, ButterTheoryMonogram } from './Graphics.jsx';

export function Footer() {
  return (
    <footer className="border-t-2 border-[#593B30] bg-[#593B30] text-[#F5E9C9]">
      <div className="h-3 w-full bt-checker opacity-30" aria-hidden="true" />
      <div className="mx-auto max-w-[1360px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-5 space-y-4">
            <ButterTheoryLogo inverted />
            <p className="max-w-sm text-sm leading-relaxed text-[#F5E9C9]/85">
              Independent online bakery and cloud kitchen delivering small-batch viennoiserie, cookies, brownies, drinks, and custom treat boxes daily.
            </p>
            <div className="pt-2">
              <ButterTheoryMonogram size={52} />
            </div>
          </div>

          <div className="md:col-span-2 space-y-3">
            <h3 className="font-display text-base font-bold text-[#F2C94C]">Bakery</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/shop" className="hover:text-[#F2C94C] transition-colors">All Bakes</Link></li>
              <li><Link to="/build-your-box" className="hover:text-[#F2C94C] transition-colors">Build Your Own Box</Link></li>
              <li><Link to="/our-story" className="hover:text-[#F2C94C] transition-colors">Our Story</Link></li>
              <li><Link to="/delivery" className="hover:text-[#F2C94C] transition-colors">Delivery & Orders</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-3">
            <h3 className="font-display text-base font-bold text-[#E8AFC0]">Order</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/cart" className="hover:text-[#F2C94C] transition-colors">Shopping Bag</Link></li>
              <li><Link to="/checkout" className="hover:text-[#F2C94C] transition-colors">Guest Checkout</Link></li>
              <li><Link to="/shop?category=gift-boxes" className="hover:text-[#F2C94C] transition-colors">Gift Boxes</Link></li>
              <li><Link to="/shop?seasonal=true" className="hover:text-[#F2C94C] transition-colors">Seasonal Drop</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h3 className="font-display text-base font-bold text-[#F2C94C]">Cloud Kitchen (Placeholder)</h3>
            <p className="text-sm text-[#F5E9C9]/85 leading-relaxed">
              Online Bakery · Delivery Only (No Dine-In)<br />
              Bandra West Dispatch Hub · Mumbai 400050<br />
              Tue – Sun · 8:30 AM – 8:30 PM
            </p>
            <p className="text-xs text-[#F5E9C9]/70">
              orders@buttertheory.example · +91 22 4000 1890
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-t border-[#F5E9C9]/20 pt-6 text-xs text-[#F5E9C9]/70">
          <p>© {new Date().getFullYear()} BUTTER THEORY. Online Bakery &amp; Cloud Kitchen.</p>
          <p className="font-semibold text-[#F2C94C]">Designed &amp; Developed by MADIHA</p>
          <p>Prices in INR (₹) · Delivery Only · Portfolio Storefront</p>
        </div>
      </div>
    </footer>
  );
}
