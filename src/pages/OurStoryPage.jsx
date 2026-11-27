import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { BakeryStamp, HandSquiggle, HandStar } from '../components/Graphics.jsx';

export function OurStoryPage() {
  return (
    <div>
      <section className="border-b-2 border-[#593B30] bg-[#E8AFC0] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1360px] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <p className="font-hand text-3xl font-bold text-[#C83F35]">Inside Our Kitchen</p>
            <h1 className="font-display text-5xl sm:text-6xl font-bold tracking-tight leading-[0.98] text-[#3B241C]">
              Built on Cultured Butter, Patience & Bold Flavour.
            </h1>
            <HandSquiggle color="#593B30" />
            <p className="max-w-2xl text-base sm:text-lg leading-relaxed text-[#3B241C]/90">
              BUTTER THEORY started with a single laminated dough table and a stubborn refusal to choose between classic French technique and joyful, flavour-packed desserts. Every pastry begins days ahead—slow-fermented, folded with high-fat cultured butter, and baked in small batches throughout the morning.
            </p>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="border-2 border-[#593B30] bg-[#FAF3DF] p-3 shadow-[8px_8px_0_#593B30]">
              <img
                src="/src/assets/images/bakery_story_craft_1795682168826.jpg"
                alt="Baker laminating butter croissant dough in the Butter Theory kitchen"
                className="aspect-[4/3] w-full object-cover border border-[#593B30]"
              />
            </div>
            <div className="hidden sm:block absolute -bottom-6 -left-6">
              <BakeryStamp labelTop="LAMINATED DAILY" labelBottom="CULTURED BUTTER" bg="#F2C94C" size={96} />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1360px] px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <article className="border-2 border-[#593B30] bg-[#FAF3DF] p-6 shadow-[5px_5px_0_#593B30]">
            <div className="flex items-center justify-between">
              <span className="font-display text-4xl font-bold text-[#C83F35]">72h</span>
              <HandStar size={22} color="#C83F35" />
            </div>
            <h2 className="mt-4 font-display text-2xl font-bold text-[#3B241C]">Cold-Fermented Dough</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#593B30]">
              Our viennoiserie dough rests over three days so honeycombed layers bake up crisp outside and tender inside without ever tasting rushed.
            </p>
          </article>

          <article className="border-2 border-[#593B30] bg-[#F2C94C] p-6 shadow-[5px_5px_0_#593B30]">
            <div className="flex items-center justify-between">
              <span className="font-display text-4xl font-bold text-[#3556A5]">84%</span>
              <HandStar size={22} color="#3556A5" />
            </div>
            <h2 className="mt-4 font-display text-2xl font-bold text-[#3B241C]">Cultured Butterfat</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#3B241C]">
              Butter is never an afterthought here. We brown it for our miso chocolate chip cookies, whip it into frostings, and fold it into every flaky croissant.
            </p>
          </article>

          <article className="border-2 border-[#593B30] bg-[#3556A5] p-6 text-[#F5E9C9] shadow-[5px_5px_0_#593B30]">
            <div className="flex items-center justify-between">
              <span className="font-display text-4xl font-bold text-[#F2C94C]">100%</span>
              <HandStar size={22} color="#F2C94C" />
            </div>
            <h2 className="mt-4 font-display text-2xl font-bold">Baked Small Batch</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#F5E9C9]/90">
              From sea-salt fudge brownies to pistachio cream croissants and house cold brew, everything on our counter is finished fresh the same day.
            </p>
          </article>
        </div>
      </section>

      <section className="border-t-2 border-[#593B30] bg-[#FAF3DF] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1360px] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5">
            <div className="border-2 border-[#593B30] bg-[#F5E9C9] p-3 shadow-[6px_6px_0_#593B30]">
              <img
                src="/src/assets/images/category_coffee_drinks_1795682169289.jpg"
                alt="Iced matcha latte and cold brew coffee served with flaky pastries"
                className="aspect-[4/3] w-full object-cover border border-[#593B30]"
              />
            </div>
          </div>
          <div className="lg:col-span-7 space-y-4">
            <p className="font-hand text-2xl font-bold text-[#3556A5]">Online Kitchen & Beverage Bar</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#3B241C]">
              Paired With House-Roasted Espresso & Ceremonial Matcha
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-[#593B30]">
              A great pastry deserves a drink crafted to balance browned butter and dark chocolate. Packed warm straight from our cloud kitchen for doorstep delivery, pair velvety Spanish lattes, iced mochas, or ceremonial Uji matcha with any custom treat box at your own table.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 border-2 border-[#593B30] bg-[#C83F35] px-5 py-3 text-sm font-bold text-[#F5E9C9] shadow-[4px_4px_0_#593B30] hover:bg-[#3556A5] transition-colors"
              >
                <span>Explore the Menu</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                to="/build-your-box"
                className="inline-flex items-center gap-2 border-2 border-[#593B30] bg-[#F2C94C] px-5 py-3 text-sm font-bold text-[#3B241C] shadow-[4px_4px_0_#593B30] hover:bg-[#E8AFC0] transition-colors"
              >
                <span>Build Your Own Box</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
