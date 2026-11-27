import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { useCart } from '../context/CartContext.jsx';
import { formatINR } from '../services/api.js';
import { ProductImage } from './Graphics.jsx';

const MAX_REGULAR_PRODUCT_QTY = 5;

export function ProductCard({ product, accentBg = '#FAF3DF' }) {
  const { cart, addProduct } = useCart();
  const [adding, setAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const inBagQty =
    cart?.items?.find((item) => item.item_type === 'product' && item.product_id === product.id)
      ?.quantity || 0;
  const atMaxQty = inBagQty >= MAX_REGULAR_PRODUCT_QTY;

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.is_available || adding || atMaxQty) return;
    setAdding(true);
    try {
      await addProduct(product.id, 1, product.name);
      setJustAdded(true);
      window.setTimeout(() => setJustAdded(false), 1200);
    } catch {
      // Handled by CartContext
    } finally {
      setAdding(false);
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4 }}
      className="group flex flex-col border-2 border-[#593B30] transition-shadow duration-200 hover:shadow-[5px_5px_0_#593B30]"
      style={{ backgroundColor: accentBg }}
    >
      <Link to={`/shop/${product.slug}`} className="block border-b-2 border-[#593B30]">
        <ProductImage src={product.image_url} alt={product.name} />
      </Link>

      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-[#593B30]/75">
            <span>{product.category_name}</span>
            {product.is_seasonal ? (
              <>
                <span aria-hidden="true">·</span>
                <span className="font-semibold text-[#C83F35]">Seasonal</span>
              </>
            ) : product.is_bestseller ? (
              <>
                <span aria-hidden="true">·</span>
                <span className="font-semibold text-[#3556A5]">Bestseller</span>
              </>
            ) : null}
          </div>

          <Link to={`/shop/${product.slug}`} className="mt-1 block">
            <h3 className="font-display text-lg font-semibold leading-snug text-[#3B241C] group-hover:text-[#C83F35] transition-colors">
              {product.name}
            </h3>
          </Link>

          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-[#593B30]/85">
            {product.description}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-[#593B30]/20">
          <div className="flex items-center justify-between gap-3">
            <span className="text-base font-bold tabular-nums text-[#3B241C]">
              {formatINR(product.price_inr)}
            </span>

            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={handleQuickAdd}
              disabled={!product.is_available || adding || atMaxQty}
              title={atMaxQty ? 'Maximum 5 per product' : undefined}
              className={`inline-flex items-center gap-1.5 border-2 border-[#593B30] px-3 py-1.5 text-xs font-bold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                justAdded
                  ? 'bg-[#3556A5] text-[#F5E9C9]'
                  : 'bg-[#F2C94C] text-[#3B241C] hover:bg-[#C83F35] hover:text-[#F5E9C9]'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {!product.is_available ? (
                <span>Sold Out</span>
              ) : justAdded ? (
                <>
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Added</span>
                </>
              ) : atMaxQty ? (
                <span>Max 5 in Bag</span>
              ) : (
                <>
                  <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{adding ? 'Adding...' : 'Add to Bag'}</span>
                </>
              )}
            </motion.button>
          </div>
          {atMaxQty ? (
            <p className="mt-1.5 text-[11px] font-bold text-[#C83F35] text-right">
              Maximum 5 per product
            </p>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
}
