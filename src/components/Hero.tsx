'use client';

import React from 'react';
import { ArrowRight, Home as HomeIcon } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-r from-[#F4FAF6] via-[#EDF8F0] to-[#E4F4E7] border-b border-[#DEF0E2] min-h-[460px] lg:h-[490px] flex items-center">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none -z-0">
        {/* Soft radial glow on the left content area */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/70 blur-3xl" />
        <div className="absolute -bottom-20 left-1/4 w-80 h-80 rounded-full bg-[#E2F4E6]/50 blur-2xl" />

        {/* Richer organic emerald & mint glow behind the right image */}
        <div className="absolute top-1/2 -translate-y-1/2 right-0 w-[55%] h-[120%] bg-gradient-to-l from-[#DBF2DF]/80 via-[#E6F6EA]/60 to-transparent rounded-l-[200px]" />
        <div className="absolute -top-10 right-20 w-80 h-80 rounded-full bg-[#CEECD4]/50 blur-3xl" />
        <div className="absolute -bottom-10 right-10 w-96 h-96 rounded-full bg-[#D4F0DA]/60 blur-3xl" />
      </div>

      <div className="max-w-[1240px] w-full mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between h-full w-full gap-8 lg:gap-0">
          
          {/* ================= LEFT CONTENT (48% Width) ================= */}
          <div className="w-full lg:w-[48%] flex flex-col justify-center pt-8 lg:pt-0 pb-4 lg:pb-0">
            {/* Small rounded badge */}
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-xs text-[#08752A] border border-[#CFEBDA] text-xs sm:text-[13px] font-semibold px-3.5 py-1.5 rounded-full w-fit mb-4 sm:mb-5 shadow-xs">
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

          {/* ================= RIGHT IMAGE & ABSTRACT BACKGROUND (52% Width) ================= */}
          <div className="w-full lg:w-[52%] relative h-full min-h-[360px] sm:min-h-[420px] lg:min-h-[480px] flex items-end justify-center lg:justify-end overflow-visible">
            
            {/* Abstract Mint-Green Decorative Backdrop Shapes */}
            <div className="absolute inset-0 w-full h-full pointer-events-none -z-0 flex items-center justify-center lg:justify-end overflow-visible">
              <svg
                viewBox="0 0 620 500"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-[125%] sm:w-[115%] lg:w-[120%] h-[115%] lg:h-[120%] -right-4 sm:-right-8 lg:-right-12 object-contain"
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  {/* Radiant mint glow */}
                  <radialGradient id="mintGlow" cx="60%" cy="50%" r="55%">
                    <stop offset="0%" stopColor="#D4EED8" stopOpacity="0.85" />
                    <stop offset="50%" stopColor="#DFEFE2" stopOpacity="0.65" />
                    <stop offset="85%" stopColor="#EDF8F0" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#EDF8F0" stopOpacity="0" />
                  </radialGradient>

                  {/* Flowing curve gradient */}
                  <linearGradient id="curveGradient" x1="0%" y1="20%" x2="100%" y2="80%">
                    <stop offset="0%" stopColor="#EDF8F0" stopOpacity="0.7" />
                    <stop offset="50%" stopColor="#DEF1E2" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#D2EBD7" stopOpacity="0.95" />
                  </linearGradient>

                  <radialGradient id="softEdge" cx="45%" cy="40%" r="50%">
                    <stop offset="0%" stopColor="#D8F1DD" stopOpacity="0.8" />
                    <stop offset="70%" stopColor="#E6F5EA" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#EDF8F0" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Soft ambient backdrop glow */}
                <ellipse cx="370" cy="260" rx="280" ry="220" fill="url(#mintGlow)" />

                {/* Organic flowing curved shape 1 */}
                <path
                  d="M160 270C110 180 160 90 280 50C400 10 540 30 590 130C640 230 610 370 510 435C410 500 280 470 200 415C145 375 190 330 160 270Z"
                  fill="url(#curveGradient)"
                />

                {/* Overlapping organic flowing curved shape 2 */}
                <path
                  d="M230 220C190 130 260 70 370 50C480 30 570 90 595 210C620 330 540 435 430 455C320 475 260 405 245 340C235 285 255 275 230 220Z"
                  fill="#EAF7ED"
                  fillOpacity="0.8"
                />

                {/* Floating soft aura */}
                <circle cx="430" cy="210" r="170" fill="url(#softEdge)" />
              </svg>
            </div>

            {/* The Uploaded Transparent Grocery Collage Image */}
            <div className="relative z-10 w-full flex items-end justify-center lg:justify-end pb-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/hero-products.png"
                alt="Be My Shopper Daily Essentials Collage"
                className="w-full max-h-[350px] sm:max-h-[400px] lg:max-h-[440px] object-contain object-bottom drop-shadow-[0_14px_30px_rgba(0,0,0,0.08)] select-none pointer-events-none"
              />
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
