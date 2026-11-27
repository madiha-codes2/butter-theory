import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, ChevronLeft, ChevronRight, Plus, Sparkles } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { api, formatINR } from '../services/api.js';
import { useCart } from '../context/CartContext.jsx';
import { CloudKitchenPackingVisual } from '../components/CloudKitchenPackingVisual.jsx';
import {
  BakeryStamp,
  HandArrow,
  HandScribbleUnderline,
  HandSparkle,
  HandSquiggle,
  HandStar,
  OrganicScallopEdge,
} from '../components/Graphics.jsx';

const HERO_CROISSANT_IMG = '/src/assets/images/hero_croissant_editorial_1795682169837.jpg';
const HERO_COOKIE_IMG = '/src/assets/images/editorial_cookie_stack_1795684648325.jpg';
const SEASONAL_CAKE_IMG = '/src/assets/images/editorial_cake_pink_1795684647606.jpg';
const BOX_COLLAGE_IMG = '/src/assets/images/editorial_box_collage_1795684648277.jpg';
const STORY_CRAFT_IMG = '/src/assets/images/bakery_story_craft_1795682168826.jpg';
const STORY_COFFEE_IMG = '/src/assets/images/prod_iced_matcha_1795686906206.jpg';

const MARQUEE_TOP = [
  '72-Hour Cultured Butter',
  'Cloud Kitchen Delivery',
  'Molten Brown Butter Cookies',
  'Build Your Own Treat Box',
  'Pistachio Dream Cookies',
  'Small-Batch Fudge Brownies',
];

const MARQUEE_BOTTOM = [
  'Baked Fresh Daily',
  'Zero Margarine',
  'Ceremonial Uji Matcha',
  'Online Bakery · Delivery Only',
  'Flaky · Crisp · Golden',
  'Little · Happy · Party Boxes',
];

const OBSESSION_CURATED_SLUGS = [
  'classic-choco-chunk',
  'chocolate-fudge-slice',
  'classic-butter-croissant',
  'brookie-bar',
  'spanish-latte',
  'lotus-crunch',
];

const OBSESSION_EDITORIAL_STYLE = [
  { span: 'md:col-span-7 md:row-span-2', bg: '#E8AFC0', text: '#3B241C', aspect: 'aspect-[4/3] md:aspect-auto md:h-full' },
  { span: 'md:col-span-5', bg: '#F2C94C', text: '#3B241C', aspect: 'aspect-[16/10]' },
  { span: 'md:col-span-5', bg: '#3556A5', text: '#F5E9C9', aspect: 'aspect-[16/10]' },
  { span: 'md:col-span-4', bg: '#FAF3DF', text: '#3B241C', aspect: 'aspect-[4/3]' },
  { span: 'md:col-span-4', bg: '#C83F35', text: '#F5E9C9', aspect: 'aspect-[4/3]' },
  { span: 'md:col-span-4', bg: '#E8AFC0', text: '#3B241C', aspect: 'aspect-[4/3]' },
];

const DEFAULT_BOX_PREVIEW_TIERS = [
  {
    tier: 'little',
    name: 'Little Box',
    capacity: 4,
    starting_price_inr: 665,
    slotColors: ['#C83F35', '#3556A5', '#E8AFC0', '#593B30'],
    note: 'Four cookies, brownies, donuts or cupcakes tucked into our butter-yellow box.',
  },
  {
    tier: 'happy',
    name: 'Happy Box',
    capacity: 6,
    starting_price_inr: 1000,
    slotColors: ['#C83F35', '#3556A5', '#593B30', '#C83F35', '#3556A5', '#593B30'],
    note: 'Six signature picks including flaky butter croissants and cinnamon rolls.',
  },
  {
    tier: 'party',
    name: 'Party Box',
    capacity: 12,
    starting_price_inr: 1995,
    slotColors: [
      '#F2C94C', '#E8AFC0', '#C83F35', '#FAF3DF',
      '#E8AFC0', '#F2C94C', '#FAF3DF', '#C83F35',
      '#FAF3DF', '#C83F35', '#F2C94C', '#E8AFC0',
    ],
    note: 'Twelve hand-packed bakery favourites for full-table celebrations.',
  },
];

export function HomePage() {
  const { cart, addProduct } = useCart();
  const [categories, setCategories] = useState([]);
  const [obsessionProducts, setObsessionProducts] = useState([]);
  const [bestsellers, setBestsellers] = useState([]);
  const [seasonal, setSeasonal] = useState([]);
  const [boxTiers, setBoxTiers] = useState(DEFAULT_BOX_PREVIEW_TIERS);
  const [loading, setLoading] = useState(true);
  const [activeTierId, setActiveTierId] = useState('happy');
  const [addingId, setAddingId] = useState(null);
  const [addedId, setAddedId] = useState(null);
  const sliderRef = useRef(null);
  const heroRef = useRef(null);

  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const cookieParallaxY = useTransform(heroScrollProgress, [0, 1], [0, -36]);
  const stampParallaxY = useTransform(heroScrollProgress, [0, 1], [0, 26]);

  useEffect(() => {
    let active = true;
    async function loadHome() {
      try {
        const [catsRes, allRes, bestRes, seaRes, tiersRes] = await Promise.all([
          api.fetchCategories(),
          api.fetchProducts({ limit: 40, sort: 'category_order' }),
          api.fetchProducts({ bestseller: true, limit: 6, sort: 'popular' }),
          api.fetchProducts({ seasonal: true, limit: 4, sort: 'popular' }),
          api.fetchBoxTiers(),
        ]);
        if (!active) return;
        setCategories(catsRes.items || []);

        const allItems = allRes.items || [];
        const picked = OBSESSION_CURATED_SLUGS
          .map((slug) => allItems.find((p) => p.slug === slug))
          .filter(Boolean);
        setObsessionProducts(picked.length >= 6 ? picked : allItems.slice(0, 6));

        setBestsellers(bestRes.items || []);
        setSeasonal(seaRes.items || []);
        if (tiersRes?.tiers?.length) {
          setBoxTiers(
            tiersRes.tiers.map((t) => {
              const fallback = DEFAULT_BOX_PREVIEW_TIERS.find((d) => d.tier === t.tier) || DEFAULT_BOX_PREVIEW_TIERS[1];
              return { ...fallback, ...t };
            }),
          );
        }
      } catch {
        // Handled cleanly via fallback states
      } finally {
        if (active) setLoading(false);
      }
    }
    loadHome();
    return () => {
      active = false;
    };
  }, []);

  const getInBagQty = (productId) =>
    cart?.items?.find((entry) => entry.item_type === 'product' && entry.product_id === productId)
      ?.quantity || 0;

  const handleQuickAdd = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.is_available || addingId === product.id || getInBagQty(product.id) >= 5) return;
    setAddingId(product.id);
    try {
      await addProduct(product.id, 1, product.name);
      setAddedId(product.id);
      window.setTimeout(() => setAddedId(null), 1200);
    } catch {
      // Handled by CartContext
    } finally {
      setAddingId(null);
    }
  };

  const scrollSlider = (direction) => {
    if (!sliderRef.current) return;
    const step = 330;
    sliderRef.current.scrollBy({
      left: direction === 'left' ? -step : step,
      behavior: 'smooth',
    });
  };

  const selectedTier = boxTiers.find((t) => t.tier === activeTierId) || boxTiers[1] || DEFAULT_BOX_PREVIEW_TIERS[1];
  const littleTier = boxTiers.find((t) => t.tier === 'little') || DEFAULT_BOX_PREVIEW_TIERS[0];

  return (
    <div className="overflow-x-clip">
      {/* =================================================================== */}
      {/* 1. EXPERIMENTAL ASYMMETRICAL HERO — Typography as Visual Artwork     */}
      {/* =================================================================== */}
      <section ref={heroRef} className="relative border-b-2 border-[#593B30] bg-[#F5E9C9]">
        {/* Offset Cobalt architectural color block anchored right */}
        <div
          aria-hidden="true"
          className="hidden lg:block absolute top-0 right-0 bottom-0 w-[41%] bg-[#3556A5] border-l-2 border-[#593B30]"
        />
        {/* Vertical checkerboard ribbon dividing editorial planes */}
        <div
          aria-hidden="true"
          className="hidden lg:block absolute top-0 bottom-0 right-[41%] w-4 bt-checker-cobalt border-l-2 border-[#593B30]"
        />

        <div className="relative mx-auto max-w-[1400px] px-4 pt-5 pb-10 sm:px-8 lg:pt-7 lg:pb-12">
          {/* Editorial top margin markers */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 lg:pb-4">
            <div className="inline-flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.2em] text-[#C83F35]">
              <HandStar size={16} color="#C83F35" />
              <span>Online Bakery & Cloud Kitchen · Delivery Only</span>
            </div>
            <span className="font-hand text-xl sm:text-2xl font-bold text-[#3556A5] lg:text-[#F2C94C] -rotate-2">
              morning dispatches out @ 8:30 AM sharp!
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center">
            {/* OVERSIZED STAGGERED TYPOGRAPHY ARTWORK */}
            <div className="lg:col-span-7 relative z-20">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <h1 className="font-display font-extrabold tracking-[-0.045em] leading-[0.86] text-[#3B241C]">
                  <span className="block text-[clamp(3.1rem,7vw,6.2rem)]">
                    Warm,{' '}
                    <span className="relative inline-block italic font-semibold text-[#C83F35]">
                      flaky
                      <HandScribbleUnderline
                        color="#F2C94C"
                        className="absolute -bottom-2 left-0 w-full h-4 pointer-events-none"
                      />
                    </span>
                  </span>

                  {/* Unexpected shifted colour-blocked word spanning toward the pastry arch */}
                  <span className="mt-1.5 sm:mt-2.5 flex flex-wrap items-center gap-4 sm:pl-10 lg:pl-16">
                    <motion.span
                      whileHover={{ rotate: 1, scale: 1.02 }}
                      transition={{ duration: 0.18 }}
                      className="inline-block border-2 border-[#593B30] bg-[#F2C94C] px-4 sm:px-5 py-1 text-[clamp(2.8rem,6.4vw,5.6rem)] text-[#3556A5] shadow-[6px_6px_0_#593B30] -rotate-1"
                    >
                      WILDLY
                    </motion.span>
                    <HandSparkle size={38} color="#E8AFC0" className="hidden sm:block bt-float shrink-0" />
                  </span>

                  <span className="mt-1.5 sm:mt-2.5 block sm:pl-4 text-[clamp(3.2rem,7.4vw,6.5rem)] text-[#3B241C]">
                    buttery
                    <span className="text-[#C83F35]">.</span>
                  </span>
                </h1>
              </motion.div>

              {/* Editorial annotation + broken-grid CTA arrangement */}
              <div className="mt-6 lg:mt-8 grid grid-cols-1 sm:grid-cols-12 gap-5 items-end">
                <div className="sm:col-span-7 space-y-4">
                  <p className="max-w-md text-sm sm:text-base leading-relaxed text-[#3B241C]/90">
                    Three-day laminated croissants, molten brown-butter cookies, crackle fudge brownies, and iced lattes baked small-batch in our cloud kitchen for doorstep delivery.
                  </p>

                  <div className="flex flex-wrap items-center gap-3">
                    <Link
                      to="/shop"
                      className="group inline-flex items-center gap-2 border-2 border-[#593B30] bg-[#C83F35] px-5 py-3 text-sm sm:text-base font-bold text-[#F5E9C9] shadow-[5px_5px_0_#593B30] transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-[#3556A5] hover:shadow-[7px_7px_0_#593B30]"
                    >
                      <span>Shop All Bakes</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </Link>

                    <Link
                      to="/build-your-box"
                      className="inline-flex items-center gap-2 border-2 border-[#593B30] bg-[#F2C94C] px-4 py-3 text-sm sm:text-base font-bold text-[#3B241C] shadow-[5px_5px_0_#593B30] transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-[#E8AFC0]"
                    >
                      <Sparkles className="h-4 w-4" aria-hidden="true" />
                      <span>Build Your Own Box</span>
                    </Link>
                  </div>
                </div>

                {/* Tilted perforated ticket stub */}
                <div className="sm:col-span-5">
                  <Link
                    to="/build-your-box"
                    className="group block rotate-1 hover:rotate-0 transition-transform duration-200 border-2 border-dashed border-[#593B30] bg-[#E8AFC0] p-3.5 shadow-[4px_4px_0_#593B30]"
                  >
                    <p className="font-hand text-2xl font-bold text-[#C83F35] leading-none">
                      Custom Treat Boxes
                    </p>
                    <p className="mt-1 text-xs sm:text-sm font-semibold text-[#3B241C]">
                      Pack 4, 6, or 12 bakes from{' '}
                      <span className="tabular-nums underline decoration-2">
                        {formatINR(littleTier.starting_price_inr || 665)}
                      </span>
                    </p>
                    <span className="mt-1.5 inline-flex items-center gap-1 text-xs font-bold text-[#3556A5] group-hover:text-[#C83F35]">
                      <span>Start packing</span>
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                  </Link>
                </div>
              </div>
            </div>

            {/* OVERLAPPING ARCH + POLAROID COLLAGE COMPOSITION WITH SCROLL PARALLAX */}
            <div className="lg:col-span-5 relative z-10 flex justify-center lg:justify-end pt-2 lg:pt-0">
              <div className="relative w-full max-w-[350px] xl:max-w-[395px]">
                {/* Spinning circular stamp overlapping top-left corner */}
                <motion.div
                  style={{ y: stampParallaxY }}
                  className="hidden sm:block absolute -top-6 -left-6 z-30"
                >
                  <BakeryStamp
                    labelTop="BUTTER THEORY"
                    labelBottom="CULTURED BUTTER"
                    bg="#F2C94C"
                    ink="#593B30"
                    size={94}
                    spin
                  />
                </motion.div>

                {/* Irregular Arch-Cropped Croissant Hero Frame */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.96, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  className="relative overflow-hidden rounded-t-[999px] border-2 border-[#593B30] bg-[#FAF3DF] p-2 shadow-[10px_10px_0_#593B30]"
                >
                  <img
                    src={HERO_CROISSANT_IMG}
                    alt="Oversized golden laminated butter croissants stacked on a cobalt platter"
                    referrerPolicy="no-referrer"
                    className="aspect-[4/4.6] w-full rounded-t-[999px] object-cover border border-[#593B30]"
                  />
                </motion.div>

                {/* Overlapping tilted cookie cutout with subtle scroll parallax */}
                <motion.div
                  style={{ y: cookieParallaxY }}
                  initial={{ opacity: 0, x: 18, rotate: -6 }}
                  animate={{ opacity: 1, x: 0, rotate: -4 }}
                  whileHover={{ rotate: 0, scale: 1.03 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="hidden sm:block absolute -bottom-6 -left-12 z-30 w-40 xl:w-44 border-2 border-[#593B30] bg-[#FAF3DF] p-1.5 shadow-[6px_6px_0_#C83F35]"
                >
                  <img
                    src={HERO_COOKIE_IMG}
                    alt="Molten brown butter chocolate chunk cookies on yellow plate"
                    referrerPolicy="no-referrer"
                    className="aspect-square w-full object-cover border border-[#593B30]"
                  />
                  <p className="mt-1 text-center font-hand text-base font-bold text-[#3B241C] leading-none">
                    gooey dark choc middle!
                  </p>
                </motion.div>

                {/* Handwritten arrow & callout on lower right */}
                <div className="hidden sm:flex items-center gap-2 absolute -bottom-7 right-1 z-30 text-[#3B241C] lg:text-[#F5E9C9]">
                  <HandArrow color="#F2C94C" className="h-5 w-10 -scale-x-100" />
                  <span className="font-hand text-xl font-bold text-[#3556A5] lg:text-[#F2C94C]">
                    27 butter layers
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 2. KINETIC DUAL-BAND MARQUEE                                        */}
      {/* =================================================================== */}
      <div className="border-b-2 border-[#593B30]">
        <div className="overflow-hidden bg-[#593B30] py-2.5 text-[#F5E9C9]">
          <div className="bt-marquee-track items-center gap-8">
            {[...MARQUEE_TOP, ...MARQUEE_TOP].map((phrase, idx) => (
              <span key={idx} className="inline-flex items-center gap-8 whitespace-nowrap">
                <span className="font-display italic text-base sm:text-lg font-semibold text-[#F2C94C]">
                  {phrase}
                </span>
                <HandStar size={16} color={idx % 2 === 0 ? '#E8AFC0' : '#C83F35'} />
              </span>
            ))}
          </div>
        </div>

        <div className="overflow-hidden border-t-2 border-[#593B30] bg-[#E8AFC0] py-1.5 text-[#3B241C]">
          <div className="bt-marquee-track-reverse items-center gap-7">
            {[...MARQUEE_BOTTOM, ...MARQUEE_BOTTOM].map((phrase, idx) => (
              <span key={idx} className="inline-flex items-center gap-7 whitespace-nowrap">
                <span className="text-xs font-bold uppercase tracking-[0.18em]">
                  {phrase}
                </span>
                <span className="inline-block h-3.5 w-3.5 bt-checker border border-[#593B30]" aria-hidden="true" />
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 3. ASYMMETRICAL PRODUCT SHOWCASE — PICK YOUR BUTTER OBSESSION       */}
      {/* =================================================================== */}
      <section className="mx-auto max-w-[1400px] px-4 py-12 sm:px-8 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Editorial Sticky Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-4 lg:sticky lg:top-24 space-y-4"
          >
            <div className="flex items-center gap-3">
              <span className="font-display text-4xl sm:text-5xl font-extrabold text-[#C83F35] tabular-nums leading-none">
                01
              </span>
              <HandSquiggle color="#593B30" />
            </div>

            <h2 className="font-display text-3xl sm:text-5xl font-extrabold leading-[0.96] tracking-[-0.03em] text-[#3B241C]">
              Pick your{' '}
              <span className="italic font-semibold text-[#3556A5]">butter</span>{' '}
              obsession.
            </h2>

            <p className="text-sm sm:text-base leading-relaxed text-[#593B30]">
              A curated tasting of our kitchen’s icons—baked with browned cultured butter, 72-hour laminated pastry, dark Belgian chocolate, and crisp brioche glazes.
            </p>

            {/* Quick Category Jump List */}
            {categories.length > 0 ? (
              <div className="border-t border-b border-[#593B30]/25 py-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs font-bold">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/shop?category=${cat.slug}`}
                    className="text-[#593B30] hover:text-[#C83F35] underline decoration-[#593B30]/35 underline-offset-4 transition-colors"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            ) : null}

            <div className="flex items-center gap-3">
              <span className="font-hand text-2xl font-bold text-[#C83F35] -rotate-2">
                fresh out the ovens
              </span>
              <HandArrow color="#C83F35" className="h-5 w-11" />
            </div>

            <div className="pt-1">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 border-2 border-[#593B30] bg-[#F2C94C] px-5 py-2.5 text-sm font-bold text-[#3B241C] shadow-[4px_4px_0_#593B30] hover:bg-[#3556A5] hover:text-[#F5E9C9] transition-colors"
              >
                <span>Explore All 38 Bakes</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </motion.div>

          {/* Asymmetrical Staggered Product Showcase Mosaic */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-12 gap-4">
            {loading
              ? Array.from({ length: 6 }).map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-52 border-2 border-[#593B30]/30 bg-[#FAF3DF] animate-pulse ${
                      idx === 0 ? 'md:col-span-7' : 'md:col-span-5'
                    }`}
                  />
                ))
              : obsessionProducts.map((item, idx) => {
                  const cfg = OBSESSION_EDITORIAL_STYLE[idx % OBSESSION_EDITORIAL_STYLE.length];
                  const isAdded = addedId === item.id;
                  const isAdding = addingId === item.id;
                  const atMaxQty = getInBagQty(item.id) >= 5;
                  const isDarkBg = cfg.bg === '#3556A5' || cfg.bg === '#C83F35';

                  return (
                    <motion.article
                      key={item.id}
                      initial={{ opacity: 0, y: 18 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.14 }}
                      transition={{ duration: 0.36, delay: Math.min(idx * 0.05, 0.25), ease: [0.16, 1, 0.3, 1] }}
                      whileHover={{ y: -3 }}
                      className={`${cfg.span} group flex flex-col justify-between border-2 border-[#593B30] overflow-hidden shadow-[5px_5px_0_#593B30] transition-shadow duration-200 hover:shadow-[8px_8px_0_#593B30]`}
                      style={{ backgroundColor: cfg.bg, color: cfg.text }}
                    >
                      <Link
                        to={`/shop/${item.slug}`}
                        className={`block overflow-hidden border-b-2 border-[#593B30] ${cfg.aspect}`}
                      >
                        <img
                          src={item.image_url}
                          alt={item.name}
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        />
                      </Link>

                      <div className="p-3.5 sm:p-4 flex flex-col gap-3">
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-wider opacity-80">
                            {item.category_name}
                          </p>
                          <Link to={`/shop/${item.slug}`} className="mt-0.5 block">
                            <h3 className="font-display text-lg sm:text-xl font-bold leading-tight hover:underline underline-offset-4">
                              {item.name}
                            </h3>
                          </Link>
                        </div>

                        <div className="pt-2 border-t border-current/20">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-display text-lg font-extrabold tabular-nums">
                              {formatINR(item.price_inr)}
                            </span>

                            <motion.button
                              type="button"
                              whileTap={{ scale: 0.94 }}
                              onClick={(e) => handleQuickAdd(e, item)}
                              disabled={!item.is_available || isAdding || atMaxQty}
                              title={atMaxQty ? 'Maximum 5 per product' : undefined}
                              className={`inline-flex items-center gap-1.5 border-2 border-[#593B30] px-3 py-1.5 text-xs font-bold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                                isAdded
                                  ? 'bg-[#3556A5] text-[#F5E9C9]'
                                  : isDarkBg
                                    ? 'bg-[#F2C94C] text-[#3B241C] hover:bg-[#FAF3DF]'
                                    : 'bg-[#C83F35] text-[#F5E9C9] hover:bg-[#3556A5]'
                              } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                              {!item.is_available ? (
                                <span>Sold Out</span>
                              ) : isAdded ? (
                                <>
                                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                                  <span>Added</span>
                                </>
                              ) : atMaxQty ? (
                                <span>Max 5 in Bag</span>
                              ) : (
                                <>
                                  <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                                  <span>{isAdding ? 'Adding...' : 'Add to Bag'}</span>
                                </>
                              )}
                            </motion.button>
                          </div>
                          {atMaxQty ? (
                            <p className={`mt-1 text-[11px] font-bold text-right ${isDarkBg ? 'text-[#F2C94C]' : 'text-[#C83F35]'}`}>
                              Maximum 5 per product
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 4. CURATED HORIZONTAL SLIDER — GONE BEFORE NOON (6 SIGNATURES)      */}
      {/* =================================================================== */}
      <section className="relative border-y-2 border-[#593B30] bg-[#3556A5] text-[#F5E9C9] py-12 lg:py-14">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-5"
          >
            <div>
              <p className="font-hand text-2xl sm:text-3xl font-bold text-[#F2C94C]">
                02 · The Morning Crush
              </p>
              <h2 className="mt-1 font-display text-4xl sm:text-5xl font-extrabold leading-[0.92] tracking-[-0.03em]">
                Gone{' '}
                <span className="italic font-semibold text-[#E8AFC0]">Before</span>{' '}
                <span className="text-[#F2C94C]">Noon.</span>
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => scrollSlider('left')}
                aria-label="Scroll signature bakes left"
                className="inline-flex h-10 w-10 items-center justify-center border-2 border-[#593B30] bg-[#F5E9C9] text-[#3B241C] shadow-[3px_3px_0_#593B30] hover:bg-[#F2C94C] transition-colors cursor-pointer"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => scrollSlider('right')}
                aria-label="Scroll signature bakes right"
                className="inline-flex h-10 w-10 items-center justify-center border-2 border-[#593B30] bg-[#F2C94C] text-[#3B241C] shadow-[3px_3px_0_#593B30] hover:bg-[#E8AFC0] transition-colors cursor-pointer"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <Link
                to="/shop?sort=popular"
                className="ml-2 inline-flex items-center gap-2 border-2 border-[#F5E9C9] px-4 py-2 text-sm font-bold text-[#F5E9C9] hover:bg-[#F5E9C9] hover:text-[#3556A5] transition-colors whitespace-nowrap"
              >
                <span>View Full Menu</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </motion.div>

          {/* Horizontal Snap-Scrolling Collection (4–6 curated bakes) */}
          <div
            ref={sliderRef}
            className="mt-8 flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar pb-3"
          >
            {bestsellers.map((item, idx) => {
              const cardBg = idx % 2 === 0 ? '#FAF3DF' : '#F2C94C';
              const isAdded = addedId === item.id;
              const isAdding = addingId === item.id;
              const atMaxQty = getInBagQty(item.id) >= 5;
              return (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.35, delay: Math.min(idx * 0.05, 0.25) }}
                  whileHover={{ y: -6 }}
                  className={`group w-[270px] sm:w-[300px] shrink-0 snap-start border-2 border-[#593B30] text-[#3B241C] shadow-[6px_6px_0_#593B30] flex flex-col justify-between transition-shadow duration-200 hover:shadow-[9px_9px_0_#593B30] ${
                    idx % 2 === 1 ? 'md:mt-3' : ''
                  }`}
                  style={{ backgroundColor: cardBg }}
                >
                  <div>
                    <Link to={`/shop/${item.slug}`} className="block border-b-2 border-[#593B30] overflow-hidden">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="aspect-[4/3] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                    </Link>

                    <div className="p-4">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-[#3556A5]">
                        {item.category_name} · Bestseller
                      </p>
                      <Link to={`/shop/${item.slug}`} className="mt-1 block">
                        <h3 className="font-display text-xl font-bold leading-snug text-[#3B241C] group-hover:text-[#C83F35] transition-colors">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="mt-1.5 line-clamp-2 text-xs sm:text-sm text-[#593B30]">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="px-4 pb-4 pt-3 border-t border-[#593B30]/20">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-display text-lg font-extrabold tabular-nums text-[#3B241C]">
                        {formatINR(item.price_inr)}
                      </span>
                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.94 }}
                        onClick={(e) => handleQuickAdd(e, item)}
                        disabled={!item.is_available || isAdding || atMaxQty}
                        title={atMaxQty ? 'Maximum 5 per product' : undefined}
                        className={`inline-flex items-center gap-1.5 border-2 border-[#593B30] px-3 py-1.5 text-xs font-bold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                          isAdded
                            ? 'bg-[#3556A5] text-[#F5E9C9]'
                            : 'bg-[#C83F35] text-[#F5E9C9] hover:bg-[#593B30]'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {!item.is_available ? (
                          <span>Sold Out</span>
                        ) : isAdded ? (
                          <>
                            <Check className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>Added</span>
                          </>
                        ) : atMaxQty ? (
                          <span>Max 5 in Bag</span>
                        ) : (
                          <>
                            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>{isAdding ? 'Adding...' : 'Add to Bag'}</span>
                          </>
                        )}
                      </motion.button>
                    </div>
                    {atMaxQty ? (
                      <p className="mt-1 text-[11px] font-bold text-[#C83F35] text-right">
                        Maximum 5 per product
                      </p>
                    ) : null}
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 5. MAGAZINE LOOKBOOK SPREAD — LIMITED SEASONAL SPECIALS (4 PICKS)   */}
      {/* =================================================================== */}
      <section className="relative border-b-2 border-[#593B30] bg-[#E8AFC0]">
        <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-8 lg:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Tall Fashion-Food Magazine Cover Photography */}
            <motion.div
              initial={{ opacity: 0, x: -24, scale: 0.97 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 relative max-w-[430px] mx-auto w-full"
            >
              <div className="group border-2 border-[#593B30] bg-[#FAF3DF] p-2.5 shadow-[8px_8px_0_#3556A5] overflow-hidden">
                <img
                  src={SEASONAL_CAKE_IMG}
                  alt="Tall layered strawberry buttercream cake topped with a cherry on pink ceramic plate"
                  referrerPolicy="no-referrer"
                  className="aspect-[4/4.6] w-full object-cover border border-[#593B30] transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>

              <div className="absolute -top-3.5 -right-2 sm:right-4 rotate-2 border-2 border-[#593B30] bg-[#C83F35] px-4 py-1 text-xs font-bold uppercase tracking-widest text-[#F5E9C9] shadow-[3px_3px_0_#593B30]">
                Limited Seasonal Edit
              </div>

              <p className="mt-3 font-hand text-xl sm:text-2xl font-bold text-[#3B241C] -rotate-1">
                * small-batch fruit, ceremonial matcha & roasted pistachio while crates last
              </p>
            </motion.div>

            {/* Right: Oversized Editorial Type + Stacked 4-Pick Lookbook Rows */}
            <div className="lg:col-span-7 space-y-5">
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4 }}
              >
                <p className="font-hand text-2xl sm:text-3xl font-bold text-[#C83F35]">
                  03 · Limited Seasonal Specials
                </p>
                <h2 className="mt-1 font-display text-4xl sm:text-5xl font-extrabold leading-[0.94] tracking-[-0.03em] text-[#3B241C]">
                  Berry Season &{' '}
                  <span className="italic font-semibold text-[#C83F35]">Pistachio</span>{' '}
                  Crunch
                </h2>
              </motion.div>

              <div className="space-y-3">
                {seasonal.map((item, idx) => {
                  const isAdded = addedId === item.id;
                  const isAdding = addingId === item.id;
                  const atMaxQty = getInBagQty(item.id) >= 5;
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, amount: 0.15 }}
                      transition={{ duration: 0.35, delay: idx * 0.06 }}
                      whileHover={{ x: 4 }}
                      className="group border-2 border-[#593B30] bg-[#FAF3DF] p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 shadow-[5px_5px_0_#593B30] transition-shadow duration-150 hover:shadow-[7px_7px_0_#3556A5]"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <Link
                          to={`/shop/${item.slug}`}
                          className="shrink-0 border-2 border-[#593B30] overflow-hidden"
                        >
                          <img
                            src={item.image_url}
                            alt={item.name}
                            referrerPolicy="no-referrer"
                            className="h-16 w-16 sm:h-20 sm:w-20 object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </Link>
                        <div className="min-w-0">
                          <span className="font-hand text-base sm:text-lg font-bold text-[#3556A5]">
                            Limited Drop 0{idx + 1} · {item.category_name}
                          </span>
                          <Link to={`/shop/${item.slug}`} className="block">
                            <h3 className="font-display text-lg sm:text-xl font-bold text-[#3B241C] group-hover:text-[#C83F35] transition-colors truncate">
                              {item.name}
                            </h3>
                          </Link>
                          <p className="mt-0.5 text-xs text-[#593B30]/85 line-clamp-1">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 border-t sm:border-t-0 border-[#593B30]/15 pt-2.5 sm:pt-0">
                        <div className="flex items-center justify-between sm:justify-end gap-4">
                          <span className="font-display text-lg sm:text-xl font-extrabold tabular-nums text-[#3B241C]">
                            {formatINR(item.price_inr)}
                          </span>
                          <motion.button
                            type="button"
                            whileTap={{ scale: 0.94 }}
                            onClick={(e) => handleQuickAdd(e, item)}
                            disabled={!item.is_available || isAdding || atMaxQty}
                            title={atMaxQty ? 'Maximum 5 per product' : undefined}
                            className={`inline-flex items-center gap-1.5 border-2 border-[#593B30] px-3.5 py-2 text-xs font-bold whitespace-nowrap cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                              isAdded
                                ? 'bg-[#3556A5] text-[#F5E9C9]'
                                : 'bg-[#F2C94C] text-[#3B241C] hover:bg-[#C83F35] hover:text-[#F5E9C9]'
                            }`}
                          >
                            {!item.is_available ? 'Sold Out' : isAdded ? 'Added' : atMaxQty ? 'Max 5 in Bag' : isAdding ? 'Adding...' : 'Add to Bag'}
                          </motion.button>
                        </div>
                        {atMaxQty ? (
                          <p className="mt-1 text-[11px] font-bold text-[#C83F35] text-right">
                            Maximum 5 per product
                          </p>
                        ) : null}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="pt-1">
                <Link
                  to="/shop?seasonal=true"
                  className="inline-flex items-center gap-2 border-2 border-[#593B30] bg-[#3556A5] px-5 py-2.5 text-sm font-bold text-[#F5E9C9] shadow-[4px_4px_0_#593B30] hover:bg-[#C83F35] transition-colors"
                >
                  <span>Shop Limited Seasonal Edit</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 6. SIGNATURE INTERACTIVE SHOWCASE — BUILD YOUR OWN BOX ON YELLOW    */}
      {/* =================================================================== */}
      <section className="relative border-b-2 border-[#593B30] bg-[#F2C94C] text-[#3B241C]">
        <div className="h-3 w-full bt-checker-red border-b-2 border-[#593B30]" aria-hidden="true" />

        <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-8 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Editorial Collage Box Photo */}
            <div className="lg:col-span-6 relative">
              <motion.div
                initial={{ opacity: 0, rotate: -2, y: 18 }}
                whileInView={{ opacity: 1, rotate: -1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45 }}
                whileHover={{ rotate: 0 }}
                className="border-2 border-[#593B30] bg-[#FAF3DF] p-2.5 shadow-[10px_10px_0_#593B30]"
              >
                <img
                  src={BOX_COLLAGE_IMG}
                  alt="Open ribboned Butter Theory box packed with pistachio croissants, glazed donuts, fudge brownies and cookies"
                  referrerPolicy="no-referrer"
                  className="aspect-[4/3] w-full object-cover border border-[#593B30]"
                />
              </motion.div>

              <div className="hidden sm:flex items-center gap-2 absolute -bottom-4 right-4 border-2 border-[#593B30] bg-[#C83F35] px-4 py-1.5 text-[#F5E9C9] shadow-[4px_4px_0_#593B30] rotate-2">
                <HandSparkle size={18} color="#F2C94C" stroke="#593B30" />
                <span className="font-hand text-xl font-bold">
                  zero fillers, only your picks!
                </span>
              </div>
            </div>

            {/* Interactive Tier Previewer */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45 }}
              className="lg:col-span-6 space-y-5"
            >
              <div>
                <p className="font-hand text-2xl sm:text-3xl font-bold text-[#C83F35]">
                  04 · Your Box, Your Rules
                </p>
                <h2 className="mt-1 font-display text-4xl sm:text-5xl font-extrabold leading-[0.94] tracking-[-0.03em]">
                  Build Your{' '}
                  <span className="italic font-semibold text-[#3556A5]">Own</span>{' '}
                  Treat Box.
                </h2>
                <p className="mt-2.5 text-sm sm:text-base leading-relaxed text-[#3B241C]/90">
                  Preview a box size below, mix cookies, brownies, croissants, and donuts, and pack every slot to order.
                </p>
              </div>

              {/* Tier Selector Tabs */}
              <div className="grid grid-cols-3 gap-3">
                {boxTiers.map((tier) => {
                  const active = tier.tier === selectedTier.tier;
                  return (
                    <button
                      key={tier.tier}
                      type="button"
                      onClick={() => setActiveTierId(tier.tier)}
                      className={`border-2 border-[#593B30] p-3.5 text-left transition-all cursor-pointer ${
                        active
                          ? 'bg-[#3556A5] text-[#F5E9C9] shadow-[4px_4px_0_#593B30] -translate-y-0.5'
                          : 'bg-[#FAF3DF] text-[#3B241C] hover:bg-[#E8AFC0]'
                      }`}
                    >
                      <span className="block text-[11px] font-bold uppercase tracking-wider opacity-80 tabular-nums">
                        {tier.capacity} treats
                      </span>
                      <span className="mt-0.5 block font-display text-base sm:text-lg font-bold leading-tight">
                        {tier.name}
                      </span>
                      <span className="mt-1.5 block text-xs sm:text-sm font-extrabold tabular-nums">
                        From {formatINR(tier.starting_price_inr)}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Spacious Animated Slot Preview Tray */}
              <div className="border-2 border-[#593B30] bg-[#FAF3DF] p-5 shadow-[6px_6px_0_#593B30]">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#593B30]/20">
                  <span className="font-display text-lg font-bold text-[#3B241C]">
                    {selectedTier.name} Slot Layout ({selectedTier.capacity} Slots)
                  </span>
                  <span className="font-hand text-xl font-bold text-[#C83F35]">
                    curated by you
                  </span>
                </div>

                <div
                  className={`mt-4 grid gap-2.5 ${
                    selectedTier.capacity === 12
                      ? 'grid-cols-6'
                      : selectedTier.capacity === 6
                        ? 'grid-cols-3 sm:grid-cols-6'
                        : 'grid-cols-4'
                  }`}
                >
                  {selectedTier.slotColors.map((slotHex, idx) => (
                    <motion.div
                      key={`${selectedTier.tier}-${idx}`}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.2, delay: idx * 0.025 }}
                      className="aspect-square border-2 border-[#593B30] flex items-center justify-center"
                      style={{ backgroundColor: slotHex }}
                    >
                      <HandStar size={14} color={slotHex === '#593B30' || slotHex === '#3556A5' || slotHex === '#C83F35' ? '#F5E9C9' : '#593B30'} />
                    </motion.div>
                  ))}
                </div>

                <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                  <p className="text-xs sm:text-sm text-[#593B30]">{selectedTier.note}</p>
                  <Link
                    to={`/build-your-box?tier=${selectedTier.tier}`}
                    className="inline-flex items-center justify-center gap-2 border-2 border-[#593B30] bg-[#C83F35] px-5 py-2.5 text-sm font-bold text-[#F5E9C9] shadow-[4px_4px_0_#593B30] hover:bg-[#3556A5] transition-colors whitespace-nowrap shrink-0"
                  >
                    <Sparkles className="h-4 w-4" aria-hidden="true" />
                    <span>Pack {selectedTier.name}</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 7. CLOUD KITCHEN FINALE — CREATIVE 3-COLUMN INTERACTIVE COMPOSITION */}
      {/* =================================================================== */}
      <section className="relative bg-[#593B30] text-[#F5E9C9]">
        <OrganicScallopEdge color="#F2C94C" className="rotate-180" />

        <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-8 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Cloud Kitchen Story & Metrics */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45 }}
              className="lg:col-span-4 space-y-5"
            >
              <p className="font-hand text-2xl sm:text-3xl font-bold text-[#E8AFC0]">
                05 · Inside the Cloud Kitchen
              </p>

              <h2 className="font-display text-3xl sm:text-5xl font-extrabold leading-[0.94] tracking-[-0.03em]">
                <span className="text-[#F2C94C]">Three days</span> to laminate.{' '}
                <span className="italic font-semibold text-[#E8AFC0]">Thirty seconds</span>{' '}
                to devour.
              </h2>

              <p className="text-sm sm:text-base leading-relaxed text-[#F5E9C9]/90">
                Every croissant rests for 72 hours before hitting stone deck ovens at dawn—dispatched warm straight from our delivery-only kitchen to your doorstep.
              </p>

              <div className="grid grid-cols-2 gap-3.5 pt-1">
                <div className="border-2 border-[#F5E9C9] bg-[#3B241C] p-3.5">
                  <p className="font-display text-2xl sm:text-3xl font-extrabold text-[#F2C94C] tabular-nums">
                    84%
                  </p>
                  <p className="mt-1 text-xs text-[#F5E9C9]/85">
                    High-fat cultured butter in every sheet.
                  </p>
                </div>
                <div className="border-2 border-[#F5E9C9] bg-[#3556A5] p-3.5">
                  <p className="font-display text-2xl sm:text-3xl font-extrabold text-[#E8AFC0] tabular-nums">
                    8:30 AM
                  </p>
                  <p className="mt-1 text-xs text-[#F5E9C9]">
                    First delivery batches dispatched daily.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-1">
                <Link
                  to="/our-story"
                  className="inline-flex items-center gap-2 border-2 border-[#593B30] bg-[#F2C94C] px-4 py-2.5 text-sm font-bold text-[#3B241C] shadow-[4px_4px_0_#E8AFC0] hover:bg-[#E8AFC0] transition-colors"
                >
                  <span>Read Our Story</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  to="/delivery"
                  className="inline-flex items-center gap-2 border-2 border-[#F5E9C9] px-4 py-2.5 text-sm font-bold text-[#F5E9C9] hover:bg-[#F5E9C9] hover:text-[#3B241C] transition-colors"
                >
                  <span>Delivery & Orders</span>
                </Link>
              </div>
            </motion.div>

            {/* Center Column: Interactive Animated Box Packing Visual filling middle space */}
            <div className="lg:col-span-4 flex items-center justify-center">
              <CloudKitchenPackingVisual />
            </div>

            {/* Right Column: Overlapping Dual Editorial Collage */}
            <motion.div
              initial={{ opacity: 0, x: 18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45 }}
              className="lg:col-span-4 relative flex justify-center lg:justify-end"
            >
              <div className="relative w-full max-w-sm">
                <div className="border-2 border-[#F5E9C9] bg-[#FAF3DF] p-2 shadow-[8px_8px_0_#C83F35]">
                  <img
                    src={STORY_CRAFT_IMG}
                    alt="Cultured butter blocks and pastry dough preparation inside Butter Theory"
                    referrerPolicy="no-referrer"
                    className="aspect-[4/3] w-full object-cover border border-[#593B30]"
                  />
                </div>

                <motion.div
                  whileHover={{ rotate: 0, y: -3 }}
                  transition={{ duration: 0.2 }}
                  className="hidden sm:block relative -mt-14 ml-auto w-48 border-2 border-[#593B30] bg-[#E8AFC0] p-2 shadow-[6px_6px_0_#F2C94C] rotate-2"
                >
                  <img
                    src={STORY_COFFEE_IMG}
                    alt="Ceremonial iced matcha latte prepared for delivery"
                    referrerPolicy="no-referrer"
                    className="aspect-[4/3] w-full object-cover border border-[#593B30]"
                  />
                  <p className="mt-1 text-center font-hand text-base font-bold text-[#3B241C]">
                    house espresso & matcha drops
                  </p>
                </motion.div>

                <div className="hidden sm:block absolute -top-5 -left-5">
                  <BakeryStamp
                    labelTop="CLOUD KITCHEN"
                    labelBottom="DELIVERY ONLY"
                    bg="#E8AFC0"
                    ink="#593B30"
                    size={84}
                    spin
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
