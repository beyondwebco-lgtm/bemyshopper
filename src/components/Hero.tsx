'use client';

import React from 'react';
import { ArrowRight, Home as HomeIcon, Zap, Sparkles, Star, ShieldCheck } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#F5FAF6] via-[#EEF8F1] to-[#E5F5E8] rounded-b-[36px] sm:rounded-b-[48px] border-b border-[#CEEAD6] min-h-[500px] lg:h-[530px] flex items-center shadow-xs">
      
      {/* ================= DYNAMIC GRAPHICAL BACKGROUND SHADING (ORGANIC WAVES & DEPTH) ================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-0">
        
        {/* Top-Left Warm Sunlit Aura */}
        <div className="absolute -top-32 -left-20 w-[560px] h-[480px] rounded-full bg-gradient-to-br from-[#FFF8E7]/90 via-[#EAF7ED]/80 to-transparent blur-3xl" />

        {/* Dynamic Sweeping Organic Curved Graphic (Breaks the rectangle look) */}
        <svg
          className="absolute -right-6 sm:-right-12 top-0 w-[80%] sm:w-[68%] lg:w-[60%] h-[120%] pointer-events-none"
          viewBox="0 0 750 620"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Primary Rich Emerald-Mint Wave Gradient */}
            <linearGradient id="richGreenWave" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C4F2CF" stopOpacity="0.85" />
              <stop offset="45%" stopColor="#DCF6E3" stopOpacity="0.9" />
              <stop offset="85%" stopColor="#B3EABE" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#9DE4AC" stopOpacity="0.75" />
            </linearGradient>

            {/* Secondary Soft Ambient Wave */}
            <linearGradient id="innerWave" x1="15%" y1="100%" x2="85%" y2="0%">
              <stop offset="0%" stopColor="#E6F8EB" stopOpacity="0.95" />
              <stop offset="55%" stopColor="#CDF2D6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FFF8E8" stopOpacity="0.65" />
            </linearGradient>

            {/* Central Luminous Sunlit Spotlight */}
            <radialGradient id="productSpotlight" cx="62%" cy="48%" r="48%">
              <stop offset="0%" stopColor="#C2F0CD" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#D5F4DE" stopOpacity="0.55" />
              <stop offset="90%" stopColor="#EAF7EE" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#EAF7EE" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Outer Organic Flowing Wave */}
          <path
            d="M170 0C290 140 110 310 230 460C320 570 520 600 750 620V0H170Z"
            fill="url(#richGreenWave)"
          />

          {/* Inner Layered Curve for rich visual depth */}
          <path
            d="M260 0C360 170 210 340 320 480C410 580 570 605 750 620V0H260Z"
            fill="url(#innerWave)"
          />

          {/* Radial Spotlight behind product collage */}
          <circle cx="480" cy="310" r="260" fill="url(#productSpotlight)" />
        </svg>

        {/* Ambient Organic Floating Color Spheres */}
        <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full bg-[#B2EFC2]/45 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-8 right-16 w-[420px] h-[340px] rounded-full bg-[#A2E6B4]/35 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full bg-[#FFF5D6]/30 blur-2xl pointer-events-none" />
      </div>

      {/* ================= CONTENT CONTAINER ================= */}
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
              <div className="flex items-center gap-2 text-xs text-gray-700 bg-white/80 backdrop-blur-xs px-3.5 py-2 rounded-full border border-gray-200/80 w-fit shadow-2xs">
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
            <div className="absolute top-4 sm:top-8 left-2 sm:left-4 z-20 bg-white/95 backdrop-blur-md border border-emerald-100/90 rounded-2xl px-3.5 py-2.5 shadow-lg shadow-emerald-950/5 flex items-center gap-2.5 transition-transform hover:scale-105 cursor-pointer">
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
