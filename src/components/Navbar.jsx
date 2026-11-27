import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, Search, ShoppingBag, X } from 'lucide-react';
import { motion, useScroll, useSpring } from 'motion/react';
import { useCart } from '../context/CartContext.jsx';
import { ButterTheoryLogo } from './Graphics.jsx';

const NAV_LINKS = [
  { to: '/shop', label: 'Shop' },
  { to: '/build-your-box', label: 'Build Your Own Box' },
  { to: '/our-story', label: 'Our Story' },
  { to: '/delivery', label: 'Delivery & Orders' },
];

export function Navbar({ onOpenSearch }) {
  const { cart, openDrawer } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 220, damping: 30, restDelta: 0.001 });

  return (
    <header className="sticky top-0 z-40 border-b-2 border-[#593B30] bg-[#F5E9C9]/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1360px] items-center justify-between gap-6 px-4 py-3.5 sm:px-6 lg:px-8">
        <Link to="/" className="shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#3556A5]">
          <ButterTheoryLogo />
        </Link>

        <nav className="hidden md:flex items-center gap-7" aria-label="Primary navigation">
          {NAV_LINKS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `relative py-1 text-sm font-medium whitespace-nowrap shrink-0 transition-colors ${
                  isActive
                    ? 'text-[#C83F35] font-bold'
                    : 'text-[#593B30] hover:text-[#3556A5]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span>{item.label}</span>
                  {isActive ? (
                    <span className="absolute inset-x-0 -bottom-0.5 h-[2px] bg-[#C83F35]" />
                  ) : null}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onOpenSearch}
            aria-label="Search bakes"
            className="inline-flex items-center justify-center border-2 border-[#593B30] bg-[#FAF3DF] p-2 text-[#593B30] hover:bg-[#E8AFC0] transition-colors cursor-pointer"
          >
            <Search className="h-4 w-4" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={openDrawer}
            className="inline-flex items-center gap-2 border-2 border-[#593B30] bg-[#F2C94C] px-3.5 py-2 text-xs sm:text-sm font-bold text-[#3B241C] hover:bg-[#3556A5] hover:text-[#F5E9C9] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ShoppingBag className="h-4 w-4" aria-hidden="true" />
            <span>Bag</span>
            <span className="tabular-nums font-bold">({cart.item_count || 0})</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="md:hidden inline-flex items-center justify-center border-2 border-[#593B30] bg-[#FAF3DF] p-2 text-[#593B30] cursor-pointer"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <nav
          aria-label="Mobile navigation"
          className="md:hidden border-t-2 border-[#593B30] bg-[#FAF3DF] px-4 py-3 flex flex-col gap-2"
        >
          {NAV_LINKS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `py-2 px-2 text-base font-medium border-b border-[#593B30]/15 ${
                  isActive ? 'text-[#C83F35] font-bold' : 'text-[#593B30]'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      ) : null}

      <motion.div
        aria-hidden="true"
        className="h-[3px] w-full origin-left bg-[#C83F35]"
        style={{ scaleX }}
      />
    </header>
  );
}
