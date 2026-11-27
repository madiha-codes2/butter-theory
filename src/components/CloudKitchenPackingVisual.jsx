import { useState } from 'react';
import { Check, Package, Sparkles } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { HandSparkle, HandStar } from './Graphics.jsx';

const PACKING_SLOTS = [
  {
    name: 'Butter Croissant',
    img: '/src/assets/images/classic_butter_croissant_1795696392215.jpg',
    bg: '#F2C94C',
    tilt: -3,
  },
  {
    name: 'Choco Chunk',
    img: '/src/assets/images/editorial_cookie_stack_1795684648325.jpg',
    bg: '#E8AFC0',
    tilt: 2,
  },
  {
    name: 'Fudge Brownie',
    img: '/src/assets/images/classic_fudge_brownie_1795696393734.jpg',
    bg: '#FAF3DF',
    tilt: -2,
  },
  {
    name: 'Lotus Donut',
    img: '/src/assets/images/prod_lotus_crunch_donut_1795686966615.jpg',
    bg: '#3556A5',
    tilt: 3,
  },
];

export function CloudKitchenPackingVisual() {
  const [sealed, setSealed] = useState(false);
  const [hoveredSlot, setHoveredSlot] = useState(null);
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="relative mx-auto w-full max-w-[340px]"
    >
      {/* Floating bakery decorations around the dispatch box */}
      <div className="hidden sm:block absolute -top-5 -right-4 z-20 bt-float pointer-events-none">
        <HandSparkle size={32} color="#F2C94C" stroke="#3B241C" />
      </div>
      <div className="hidden sm:block absolute -bottom-4 -left-4 z-20 pointer-events-none">
        <HandStar size={24} color="#E8AFC0" />
      </div>

      {/* Tactile Dispatch Box Container */}
      <div className="relative border-2 border-[#F5E9C9] bg-[#3B241C] p-4 shadow-[8px_8px_0_#F2C94C]">
        <div className="flex items-center justify-between gap-2 border-b border-[#F5E9C9]/20 pb-3">
          <div>
            <p className="font-hand text-lg font-bold text-[#F2C94C] leading-none">
              Fresh Dispatch Box
            </p>
            <p className="mt-0.5 text-[11px] font-bold uppercase tracking-wider text-[#F5E9C9]/80">
              {sealed ? 'Sealed for Courier' : 'Packing Warm Batch'}
            </p>
          </div>
          <span
            className={`inline-flex h-8 w-8 items-center justify-center border border-[#F5E9C9] transition-colors ${
              sealed ? 'bg-[#C83F35] text-[#F5E9C9]' : 'bg-[#F2C94C] text-[#3B241C]'
            }`}
          >
            {sealed ? <Check className="h-4 w-4" aria-hidden="true" /> : <Package className="h-4 w-4" aria-hidden="true" />}
          </span>
        </div>

        {/* Parchment-lined 4-slot packing tray */}
        <div className="relative mt-3.5 border-2 border-[#593B30] bg-[#FAF3DF] p-3 overflow-hidden">
          <div className="grid grid-cols-2 gap-2.5">
            {PACKING_SLOTS.map((slot, idx) => {
              const isHovered = hoveredSlot === idx;
              return (
                <motion.button
                  key={slot.name}
                  type="button"
                  onMouseEnter={() => setHoveredSlot(idx)}
                  onMouseLeave={() => setHoveredSlot(null)}
                  onClick={() => setSealed((prev) => !prev)}
                  initial={reduceMotion ? false : { scale: 0.85, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  animate={
                    reduceMotion
                      ? undefined
                      : sealed
                        ? { scale: 0.96, rotate: 0 }
                        : isHovered
                          ? { scale: 1.04, y: -3, rotate: 0 }
                          : { scale: 1, y: 0, rotate: slot.tilt }
                  }
                  transition={{ duration: 0.22, delay: idx * 0.04 }}
                  className="group relative aspect-square border-2 border-[#593B30] p-1 text-left cursor-pointer"
                  style={{ backgroundColor: slot.bg }}
                  aria-label={`Inspect ${slot.name} in dispatch box`}
                >
                  <img
                    src={slot.img}
                    alt={slot.name}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover border border-[#593B30]"
                  />
                  <span className="absolute inset-x-1 bottom-1 bg-[#3B241C]/90 px-1.5 py-0.5 text-[10px] font-bold text-[#F5E9C9] truncate">
                    {slot.name}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Animated Cherry Ribbon & Seal Overlay when sealed */}
          <motion.div
            initial={false}
            animate={{
              opacity: sealed ? 1 : 0,
              scaleX: sealed ? 1 : 0.2,
            }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center"
          >
            <div className="w-full h-7 bg-[#C83F35]/95 border-y-2 border-[#593B30] flex items-center justify-center shadow-md">
              <span className="font-hand text-base font-bold text-[#F5E9C9] tracking-wide">
                baked warm · sealed with care
              </span>
            </div>
          </motion.div>
        </div>

        <button
          type="button"
          onClick={() => setSealed((prev) => !prev)}
          className={`mt-3.5 w-full inline-flex items-center justify-center gap-2 border-2 border-[#F5E9C9] py-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
            sealed
              ? 'bg-[#3556A5] text-[#F5E9C9] hover:bg-[#E8AFC0] hover:text-[#3B241C]'
              : 'bg-[#F2C94C] text-[#3B241C] hover:bg-[#E8AFC0]'
          }`}
        >
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          <span>{sealed ? 'Unseal & Preview Bakes' : 'Tie Ribbon & Seal Box'}</span>
        </button>
      </div>
    </motion.div>
  );
}
