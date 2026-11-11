'use client';

import React from 'react';
import { ArrowRight, Home as HomeIcon } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-r from-[#F6FBF7] via-[#EEF7F0] to-[#E3F4E7] border-b border-[#DEF0E2] min-h-[460px] lg:h-[490px] flex items-center">
      {/* Seamless Soft Ambient Green Glow (No hard lines or overlapping SVG curves) */}
      <div className="absolute inset-0 pointer-events-none -z-0">
        <div className="absolute right-0 top-0 bottom-0 w-[55%] bg-gradient-to-l from-[#DDF2E2]/60 via-[#E7F6EB]/40 to-transparent" />
      </div>

      <div className="max-w-[1240px] w-full mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between h-full w-full gap-8 lg:gap-0">
          
          {/* ================= LEFT CONTENT (48% Width) ================= */}
          <div className="w-full lg:w-[48%] flex flex-col justify-center pt-8 lg:pt-0 pb-4 lg:pb-0">
            {/* Small rounded badge */}
            <div className="inline-flex items-center gap-2 bg-white/90 text-[#08752A] border border-[#CFEBDA] text-xs sm:text-[13px] font-semibold px-3.5 py-1.5 rounded-full w-fit mb-4 sm:mb-5 shadow-2xs">
              <HomeIcon className="w-3.5 h-3.5 text-[#08752A]" />
              <span>Bapatla&apos;s Own Shopping Platform</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-[50px] font-extrabold text-[#142333] leading-[1.14] tracking-tight mb-4 sm:mb-5">
              All Your Daily Essentials <br />
              <span className="text-[#142333]">in </span>
              <span className="text-[#08752A]">One Place</span>
            </h1>

            {/* Description */}
            <p className="text-[#475569] text-base sm:text-lg lg:text-[19px] leading-relaxed max-w-lg mb-7">
              Groceries, Pooja items, Cleaning &amp; Home care, and more — delivered to your doorstep.
            </p>

            {/* Shop Now Button */}
            <div>
              <a
                href="#categories"
                className="group inline-flex items-center gap-2.5 bg-[#08752A] hover:bg-[#065C21] text-white font-semibold text-sm sm:text-base px-8 py-3.5 rounded-full shadow-md shadow-[#08752A]/25 hover:shadow-lg hover:shadow-[#08752A]/30 transition-all duration-200 active:scale-98"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1.5" />
              </a>
            </div>
          </div>

          {/* ================= RIGHT IMAGE (52% Width) ================= */}
          <div className="w-full lg:w-[52%] relative h-full min-h-[360px] sm:min-h-[420px] lg:min-h-[480px] flex items-end justify-center lg:justify-end">
            
            {/* The Uploaded Transparent Grocery Collage Image */}
            <div className="relative z-10 w-full flex items-end justify-center lg:justify-end pb-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/hero-products.png"
                alt="Be My Shopper Daily Essentials Collage"
                className="w-full max-h-[360px] sm:max-h-[410px] lg:max-h-[450px] object-contain object-bottom drop-shadow-[0_12px_24px_rgba(0,0,0,0.06)] select-none pointer-events-none"
              />
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
