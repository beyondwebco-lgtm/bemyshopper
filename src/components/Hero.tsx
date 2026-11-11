'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowRight,
  Home as HomeIcon,
  Zap,
  Sparkles,
  Star,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  HeartHandshake,
} from 'lucide-react';

export const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const slides = [
    {
      id: 'essentials',
      badge: "Bapatla's Own Shopping Platform",
      titleLine1: 'All Your Daily Essentials',
      titleLine2Prefix: 'in ',
      titleLine2Highlight: 'One Place',
      sparkle: true,
      description: 'Groceries, Pooja items, Cleaning & Home care, and more — delivered to your doorstep.',
      ctaText: 'Shop Now',
      ctaLink: '#categories',
      ratingText: '4.9/5',
      ordersText: '2,500+ orders in Bapatla',
      popularChips: [
        { label: '🌾 Rice & Essentials', link: '#categories' },
        { label: '🪔 Puja Diya & Flowers', link: '#categories' },
        { label: '🧴 Cleaning Care', link: '#categories' },
      ],
      floatingBadge1: {
        icon: Zap,
        gradient: 'from-emerald-600 to-teal-500',
        title: '30-Min Delivery',
        subtitle: 'To Your Doorstep',
      },
      floatingBadge2: {
        icon: ShieldCheck,
        gradient: 'from-amber-500 to-orange-500',
        title: '100% Authentic',
        subtitle: 'Original Store Bills',
      },
      tagBadge: 'Fresh Deals Today',
      imageSrc: '/images/hero-products.png',
      imageAlt: 'Be My Shopper Daily Essentials Collage',
      imageClass: 'max-h-[320px] sm:max-h-[360px] lg:max-h-[400px] w-auto max-w-full',
    },
    {
      id: 'pooja',
      badge: "Bapatla's Own Shopping Platform",
      titleLine1: 'Pooja Essentials',
      titleLine2Prefix: 'for ',
      titleLine2Highlight: 'Every Occasion',
      sparkle: true,
      description: 'A wide range of pooja items — agarbatti, camphor, kumkum, diyas and more.',
      ctaText: 'Shop Now',
      ctaLink: '#categories',
      ratingText: '4.98/5',
      ordersText: 'Trusted for Daily & Festival Puja',
      popularChips: [
        { label: '🪔 Brass Diyas', link: '#categories' },
        { label: '🌸 Fresh Puja Flowers', link: '#categories' },
        { label: '🪵 Camphor & Dhoop', link: '#categories' },
      ],
      floatingBadge1: {
        icon: Sparkles,
        gradient: 'from-amber-500 to-orange-500',
        title: '100% Pure & Sacred',
        subtitle: 'Traditional Quality',
      },
      floatingBadge2: {
        icon: Zap,
        gradient: 'from-emerald-600 to-teal-500',
        title: 'Express Puja Dispatch',
        subtitle: 'Before Morning Aarti',
      },
      tagBadge: 'Pooja Specials',
      imageSrc: '/images/hero-pooja.png',
      imageAlt: 'Be My Shopper Pooja Essentials Collage',
      imageClass: 'max-h-[270px] sm:max-h-[310px] lg:max-h-[350px] w-auto max-w-[85%]',
    },
    {
      id: 'cleaning',
      badge: "Bapatla's Own Shopping Platform",
      titleLine1: 'Cleaning & Home Care',
      titleLine2Prefix: 'for a ',
      titleLine2Highlight: 'Cleaner Home',
      sparkle: true,
      description: 'Detergents, dishwash, floor cleaners, sponges and more.',
      ctaText: 'Shop Now',
      ctaLink: '#categories',
      ratingText: '4.95/5',
      ordersText: 'Top Household Cleaners',
      popularChips: [
        { label: '🧴 Detergents & Bars', link: '#categories' },
        { label: '🍋 Vim Dishwash', link: '#categories' },
        { label: '🌸 Lizol Surface Cleaners', link: '#categories' },
      ],
      floatingBadge1: {
        icon: Sparkles,
        gradient: 'from-blue-600 to-cyan-500',
        title: 'Sparkling Clean',
        subtitle: 'Tough Stain Removal',
      },
      floatingBadge2: {
        icon: Zap,
        gradient: 'from-emerald-600 to-teal-500',
        title: '30-Min Delivery',
        subtitle: 'Essential Care Supplies',
      },
      tagBadge: 'Up to 25% Off',
      imageSrc: '/images/hero-cleaning.png',
      imageAlt: 'Be My Shopper Cleaning & Home Care Products',
      imageClass: 'max-h-[300px] sm:max-h-[340px] lg:max-h-[380px] w-auto max-w-[92%]',
    },
    {
      id: 'personal-care',
      badge: "Bapatla's Own Shopping Platform",
      titleLine1: 'Personal Care & Hygiene',
      titleLine2Prefix: 'for ',
      titleLine2Highlight: 'the Whole Family',
      sparkle: true,
      description: 'Soaps, shampoos, toothpaste, baby care and everyday hygiene essentials.',
      ctaText: 'Shop Now',
      ctaLink: '#categories',
      ratingText: '4.96/5',
      ordersText: 'Top Personal & Baby Care',
      popularChips: [
        { label: '🧼 Dove & Bath Bars', link: '#categories' },
        { label: '🧴 Pantene & Shampoos', link: '#categories' },
        { label: '👶 Himalaya Baby Care', link: '#categories' },
      ],
      floatingBadge1: {
        icon: HeartHandshake,
        gradient: 'from-pink-500 to-rose-400',
        title: 'Gentle & Dermatested',
        subtitle: 'Safe for All Ages',
      },
      floatingBadge2: {
        icon: Zap,
        gradient: 'from-emerald-600 to-teal-500',
        title: '30-Min Delivery',
        subtitle: 'Doorstep Care Supplies',
      },
      tagBadge: 'Family Care Deals',
      imageSrc: '/images/hero-personal-care.png',
      imageAlt: 'Be My Shopper Personal Care & Hygiene Products',
      imageClass: 'max-h-[300px] sm:max-h-[340px] lg:max-h-[380px] w-auto max-w-[92%]',
    },
  ];

  // Auto-scroll to left every 5 seconds
  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, slides.length]);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full overflow-hidden bg-gradient-to-b from-[#F5FAF6] via-[#EEF8F1] to-[#E5F5E8] rounded-none border-b border-[#CEEAD6] min-h-[500px] lg:h-[530px] flex items-center shadow-xs group/hero"
    >
      {/* ================= DYNAMIC GRAPHICAL BACKGROUND SHADING ================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-0">
        {/* Top-Left Warm Sunlit Aura */}
        <div className="absolute -top-32 -left-20 w-[560px] h-[480px] rounded-full bg-gradient-to-br from-[#FFF8E7]/90 via-[#EAF7ED]/80 to-transparent blur-3xl" />

        {/* Dynamic Sweeping Organic Curved Graphic */}
        <svg
          className="absolute -right-6 sm:-right-12 top-0 w-[80%] sm:w-[68%] lg:w-[60%] h-[120%] pointer-events-none"
          viewBox="0 0 750 620"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="richGreenWave" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C4F2CF" stopOpacity="0.85" />
              <stop offset="45%" stopColor="#DCF6E3" stopOpacity="0.9" />
              <stop offset="85%" stopColor="#B3EABE" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#9DE4AC" stopOpacity="0.75" />
            </linearGradient>

            <linearGradient id="innerWave" x1="15%" y1="100%" x2="85%" y2="0%">
              <stop offset="0%" stopColor="#E6F8EB" stopOpacity="0.95" />
              <stop offset="55%" stopColor="#CDF2D6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FFF8E8" stopOpacity="0.65" />
            </linearGradient>

            <radialGradient id="productSpotlight" cx="62%" cy="48%" r="48%">
              <stop offset="0%" stopColor="#C2F0CD" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#D5F4DE" stopOpacity="0.55" />
              <stop offset="90%" stopColor="#EAF7EE" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#EAF7EE" stopOpacity="0" />
            </radialGradient>
          </defs>

          <path
            d="M170 0C290 140 110 310 230 460C320 570 520 600 750 620V0H170Z"
            fill="url(#richGreenWave)"
          />
          <path
            d="M260 0C360 170 210 340 320 480C410 580 570 605 750 620V0H260Z"
            fill="url(#innerWave)"
          />
          <circle cx="480" cy="310" r="260" fill="url(#productSpotlight)" />
        </svg>

        {/* Ambient Organic Floating Color Spheres */}
        <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full bg-[#B2EFC2]/45 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-8 right-16 w-[420px] h-[340px] rounded-full bg-[#A2E6B4]/35 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full bg-[#FFF5D6]/30 blur-2xl pointer-events-none" />
      </div>

      {/* ================= SLIDING CAROUSEL CONTAINER ================= */}
      <div className="w-full h-full relative z-10 overflow-hidden flex items-center">
        <div
          className="w-full h-full flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide) => {
            const Icon1 = slide.floatingBadge1.icon;
            const Icon2 = slide.floatingBadge2.icon;

            return (
              <div
                key={slide.id}
                className="w-full shrink-0 h-full flex items-center"
              >
                <div className="max-w-[1240px] w-full mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center py-8 lg:py-0">
                  <div className="flex flex-col lg:flex-row items-center justify-between h-full w-full gap-8 lg:gap-0">
                    
                    {/* ================= LEFT CONTENT (48% Width) ================= */}
                    <div className="w-full lg:w-[48%] flex flex-col justify-center">
                      {/* Platform Tag */}
                      <div className="inline-flex items-center gap-2 bg-white/95 backdrop-blur-md text-[#08752A] border border-[#CFEBDA] text-xs sm:text-[13px] font-bold px-3.5 py-1.5 rounded-full w-fit mb-4 sm:mb-5 shadow-xs">
                        <HomeIcon className="w-3.5 h-3.5 text-[#08752A]" />
                        <span>{slide.badge}</span>
                      </div>

                      {/* Heading with Brand Accent & Sparkle */}
                      <h1 className="text-3xl sm:text-4xl lg:text-[50px] font-extrabold text-[#142333] leading-[1.14] tracking-tight mb-4 sm:mb-5">
                        {slide.titleLine1} <br />
                        <span className="text-[#142333]">{slide.titleLine2Prefix}</span>
                        <span className="text-[#08752A]">{slide.titleLine2Highlight}</span>
                        {slide.sparkle && (
                          <span className="inline-flex items-center ml-2 text-amber-500 font-extrabold text-2xl select-none align-middle tracking-wider">
                            \ | /
                          </span>
                        )}
                      </h1>

                      {/* Description */}
                      <p className="text-[#475569] text-base sm:text-lg lg:text-[19px] leading-relaxed max-w-lg mb-6">
                        {slide.description}
                      </p>

                      {/* CTA Button & Social Proof */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                        <a
                          href={slide.ctaLink}
                          className="group inline-flex items-center justify-center gap-2.5 bg-[#08752A] hover:bg-[#065C21] text-white font-semibold text-sm sm:text-base px-8 py-3.5 rounded-full shadow-lg shadow-[#08752A]/25 hover:shadow-xl hover:shadow-[#08752A]/35 transition-all duration-200 active:scale-98 w-fit"
                        >
                          <span>{slide.ctaText}</span>
                          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1.5" />
                        </a>

                        <div className="flex items-center gap-2 text-xs text-gray-700 bg-white/80 backdrop-blur-xs px-3.5 py-2 rounded-full border border-gray-200/80 w-fit shadow-2xs">
                          <div className="flex text-amber-500">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                          </div>
                          <span className="font-bold text-gray-900">{slide.ratingText}</span>
                          <span className="text-gray-500">• {slide.ordersText}</span>
                        </div>
                      </div>

                      {/* Popular Chips */}
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="text-gray-500 font-semibold">Popular:</span>
                        {slide.popularChips.map((chip, i) => (
                          <a
                            key={i}
                            href={chip.link}
                            className="bg-white/90 hover:bg-white text-gray-700 px-3 py-1 rounded-full border border-emerald-100 hover:border-emerald-300 transition-all font-medium shadow-2xs"
                          >
                            {chip.label}
                          </a>
                        ))}
                      </div>
                    </div>

                    {/* ================= RIGHT IMAGE & FLOATING BADGES (52% Width) ================= */}
                    <div className="w-full lg:w-[52%] relative h-full min-h-[380px] sm:min-h-[440px] lg:min-h-[500px] flex items-end justify-center lg:justify-end pb-3 sm:pb-5">
                      
                      {/* Floating Badge 1 (Top-Left) */}
                      <div className="absolute top-4 sm:top-8 left-2 sm:left-4 z-20 bg-white/95 backdrop-blur-md border border-emerald-100/90 rounded-2xl px-3.5 py-2.5 shadow-lg shadow-emerald-950/5 flex items-center gap-2.5 transition-transform hover:scale-105 cursor-pointer">
                        <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${slide.floatingBadge1.gradient} text-white flex items-center justify-center shrink-0 shadow-xs`}>
                          <Icon1 className="w-4 h-4 fill-white" />
                        </div>
                        <div>
                          <p className="text-[12px] font-extrabold text-gray-900 leading-tight">
                            {slide.floatingBadge1.title}
                          </p>
                          <p className="text-[10px] text-gray-500 font-medium">
                            {slide.floatingBadge1.subtitle}
                          </p>
                        </div>
                      </div>

                      {/* Floating Badge 2 (Bottom-Right) */}
                      <div className="hidden sm:flex absolute bottom-6 right-2 sm:right-4 z-20 bg-white/95 backdrop-blur-md border border-emerald-100/90 rounded-2xl px-3.5 py-2.5 shadow-lg shadow-emerald-950/5 items-center gap-2.5 transition-transform hover:scale-105 cursor-pointer">
                        <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${slide.floatingBadge2.gradient} text-white flex items-center justify-center shrink-0 shadow-xs`}>
                          <Icon2 className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[12px] font-extrabold text-gray-900 leading-tight">
                            {slide.floatingBadge2.title}
                          </p>
                          <p className="text-[10px] text-gray-500 font-medium">
                            {slide.floatingBadge2.subtitle}
                          </p>
                        </div>
                      </div>

                      {/* Floating Offer Pill (Top-Right) */}
                      <div className="hidden lg:flex absolute top-12 right-2 z-20 bg-emerald-600 text-white rounded-full px-3 py-1 shadow-md shadow-emerald-700/20 items-center gap-1.5 text-[11px] font-bold">
                        <Sparkles className="w-3 h-3 text-amber-300" />
                        <span>{slide.tagBadge}</span>
                      </div>

                      {/* Main Transparent Hero Cutout Image */}
                      <div className="relative z-10 w-full flex items-end justify-center lg:justify-end pb-1">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={slide.imageSrc}
                          alt={slide.imageAlt}
                          className={`${slide.imageClass} object-contain object-bottom drop-shadow-[0_16px_36px_rgba(0,0,0,0.08)] select-none pointer-events-none transition-all duration-500`}
                        />
                      </div>

                    </div>

                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= NAVIGATION CONTROLS (ARROWS & PAGINATION DOTS) ================= */}
      {/* Left Arrow */}
      <button
        onClick={handlePrev}
        aria-label="Previous Slide"
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-gray-700 hover:text-[#08752A] shadow-md border border-gray-200/80 flex items-center justify-center opacity-0 group-hover/hero:opacity-100 transition-all duration-200 hover:scale-105 active:scale-95"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Right Arrow */}
      <button
        onClick={handleNext}
        aria-label="Next Slide"
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-gray-700 hover:text-[#08752A] shadow-md border border-gray-200/80 flex items-center justify-center opacity-0 group-hover/hero:opacity-100 transition-all duration-200 hover:scale-105 active:scale-95"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              currentSlide === idx
                ? 'w-8 bg-[#08752A] shadow-xs'
                : 'w-2.5 bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>
    </section>
  );
};
