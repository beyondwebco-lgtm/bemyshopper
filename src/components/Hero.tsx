'use client';

import React from 'react';
import { ArrowRight, Home as HomeIcon, Zap, Sparkles, Star, ShieldCheck } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-r from-[#F4FAF6] via-[#EDF8F1] to-[#E2F4E7] border-b border-[#D8EFE0] min-h-[500px] lg:h-[530px] flex items-center">
      {/* Background Multi-Layer Ambient Depth */}
      <div className="absolute inset-0 pointer-events-none -z-0">
        {/* Soft sunlit warm highlight on top-center */}
        <div className="absolute top-0 left-1/3 w-[600px] h-[350px] bg-gradient-to-b from-white/70 via-white/30 to-transparent blur-2xl" />

        {/* Luminous emerald glow centered behind products on the right */}
        <div className="absolute top-1/2 -translate-y-1/2 right-12 w-[480px] h-[480px] rounded-full bg-radial from-[#CEECD3]/80 via-[#DDF3E3]/40 to-transparent blur-2xl" />

        {/* Subtle decorative background organic shape */}
        <div className="absolute -bottom-16 right-0 w-[58%] h-[120%] bg-gradient-to-tl from-[#D4F1DB]/50 via-transparent to-transparent rounded-tl-[160px]" />
      </div>

      <div className="max-w-[1240px] w-full mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center relative z-10 py-8 lg:py-0">
        <div className="flex flex-col lg:flex-row items-center justify-between h-full w-full gap-8 lg:gap-0">
          
          {/* ================= LEFT CONTENT (48% Width) ================= */}
          <div className="w-full lg:w-[48%] flex flex-col justify-center">
            {/* Small rounded badge */}
            <div className="inline-flex items-center gap-2 bg-white/95 backdrop-blur-md text-[#08752A] border border-[#CFEBDA] text-xs sm:text-[13px] font-bold px-3.5 py-1.5 rounded-full w-fit mb-4 sm:mb-5 shadow-xs">
              <HomeIcon className="w-3.5 h-3.5 text-[#08752A]" />
              <span>Bapatla&apos;s Own Shopping Platform</span>
            </div>

            {/* Main Heading with Golden Sparkle Accent */}
            <h1 className="text-3xl sm:text-4xl lg:text-[50px] font-extrabold text-[#142333] leading-[1.14] tracking-tight mb-4 sm:mb-5">
              All Your Daily Essentials <br />
              <span className="text-[#142333]">in </span>
              <span className="text-[#08752A]">One Place</span>
              <span className="inline-flex items-center ml-2 text-amber-500 font-extrabold text-2xl select-none align-middle tracking-wider">
                \ | /
              </span>
            </h1>

            {/* Description */}
            <p className="text-[#475569] text-base sm:text-lg lg:text-[19px] leading-relaxed max-w-lg mb-6">
              Groceries, Pooja items, Cleaning &amp; Home care, and more — delivered to your doorstep.
            </p>

            {/* CTA Button & Trust Rating */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
              <a
                href="#categories"
                className="group inline-flex items-center justify-center gap-2.5 bg-[#08752A] hover:bg-[#065C21] text-white font-semibold text-sm sm:text-base px-8 py-3.5 rounded-full shadow-lg shadow-[#08752A]/25 hover:shadow-xl hover:shadow-[#08752A]/35 transition-all duration-200 active:scale-98 w-fit"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1.5" />
              </a>

              {/* Social Proof Pill */}
              <div className="flex items-center gap-2 text-xs text-gray-700 bg-white/70 backdrop-blur-xs px-3.5 py-2 rounded-full border border-gray-200/70 w-fit shadow-2xs">
                <div className="flex text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                </div>
                <span className="font-bold text-gray-900">4.9/5</span>
                <span className="text-gray-500">• 2,500+ orders in Bapatla</span>
              </div>
            </div>

            {/* Popular quick-jump chips */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-gray-500 font-semibold">Popular:</span>
              <a
                href="#categories"
                className="bg-white/90 hover:bg-white text-gray-700 px-3 py-1 rounded-full border border-emerald-100 hover:border-emerald-300 transition-all font-medium shadow-2xs"
              >
                🌾 Rice &amp; Essentials
              </a>
              <a
                href="#categories"
                className="bg-white/90 hover:bg-white text-gray-700 px-3 py-1 rounded-full border border-emerald-100 hover:border-emerald-300 transition-all font-medium shadow-2xs"
              >
                🪔 Puja Diya &amp; Flowers
              </a>
              <a
                href="#categories"
                className="bg-white/90 hover:bg-white text-gray-700 px-3 py-1 rounded-full border border-emerald-100 hover:border-emerald-300 transition-all font-medium shadow-2xs"
              >
                🧴 Cleaning Care
              </a>
            </div>
          </div>

          {/* ================= RIGHT IMAGE WITH FLOATING CLIENT-ATTRACTIVE BADGES (52% Width) ================= */}
          <div className="w-full lg:w-[52%] relative h-full min-h-[380px] sm:min-h-[440px] lg:min-h-[500px] flex items-end justify-center lg:justify-end">
            
            {/* Floating Trust Badge 1: 30-Min Fast Delivery (Top-Left of product collage) */}
            <div className="absolute top-4 sm:top-8 left-2 sm:left-4 z-20 bg-white/95 backdrop-blur-md border border-emerald-100/90 rounded-2xl px-3.5 py-2.5 shadow-lg shadow-emerald-950/5 flex items-center gap-2.5 animate-in fade-in transition-transform hover:scale-105 cursor-pointer">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Zap className="w-4 h-4 fill-white" />
              </div>
              <div>
                <p className="text-[12px] font-extrabold text-gray-900 leading-tight">30-Min Delivery</p>
                <p className="text-[10px] text-gray-500 font-medium">To Your Doorstep</p>
              </div>
            </div>

            {/* Floating Trust Badge 2: 100% Genuine & Verified Stores (Bottom-Right) */}
            <div className="hidden sm:flex absolute bottom-6 right-2 sm:right-4 z-20 bg-white/95 backdrop-blur-md border border-emerald-100/90 rounded-2xl px-3.5 py-2.5 shadow-lg shadow-emerald-950/5 items-center gap-2.5 transition-transform hover:scale-105 cursor-pointer">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[12px] font-extrabold text-gray-900 leading-tight">100% Authentic</p>
                <p className="text-[10px] text-gray-500 font-medium">Original Store Bills</p>
              </div>
            </div>

            {/* Floating Trust Badge 3: Free Delivery Offer (Top-Right) */}
            <div className="hidden lg:flex absolute top-12 right-2 z-20 bg-emerald-600 text-white rounded-full px-3 py-1 shadow-md shadow-emerald-700/20 items-center gap-1.5 text-[11px] font-bold">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Fresh Deals Today</span>
            </div>

            {/* The Uploaded Transparent Grocery Collage Image */}
            <div className="relative z-10 w-full flex items-end justify-center lg:justify-end pb-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/hero-products.png"
                alt="Be My Shopper Daily Essentials Collage"
                className="w-full max-h-[380px] sm:max-h-[430px] lg:max-h-[470px] object-contain object-bottom drop-shadow-[0_16px_36px_rgba(0,0,0,0.08)] select-none pointer-events-none"
              />
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
