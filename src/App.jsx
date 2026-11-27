import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { MotionConfig } from 'motion/react';
import { CartProvider } from './context/CartContext.jsx';
import { Navbar } from './components/Navbar.jsx';
import { Footer } from './components/Footer.jsx';
import { CartDrawer } from './components/CartDrawer.jsx';
import { SearchModal } from './components/SearchModal.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { ShopPage } from './pages/ShopPage.jsx';
import { ProductDetailPage } from './pages/ProductDetailPage.jsx';
import { BuildBoxPage } from './pages/BuildBoxPage.jsx';
import { CartPage } from './pages/CartPage.jsx';
import { CheckoutPage } from './pages/CheckoutPage.jsx';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage.jsx';
import { OurStoryPage } from './pages/OurStoryPage.jsx';
import { DeliveryOrdersPage } from './pages/DeliveryOrdersPage.jsx';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);
  return null;
}

function AppShell() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5E9C9] text-[#593B30]">
      <ScrollToTop />
      <Navbar onOpenSearch={() => setSearchOpen(true)} />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/shop/:slug" element={<ProductDetailPage />} />
          <Route path="/build-your-box" element={<BuildBoxPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-confirmation/:orderNumber" element={<OrderConfirmationPage />} />
          <Route path="/our-story" element={<OurStoryPage />} />
          <Route path="/delivery" element={<DeliveryOrdersPage />} />
          <Route path="/visit-us" element={<DeliveryOrdersPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>

      <Footer />
      <CartDrawer />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <CartProvider>
          <AppShell />
        </CartProvider>
      </BrowserRouter>
    </MotionConfig>
  );
}
