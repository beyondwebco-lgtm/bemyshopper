'use client';

import React from 'react';
import { ArrowRight, ShieldCheck, Car, Users, Sparkles } from 'lucide-react';

interface CarRentalHeroBannerProps {
  onExploreCars?: () => void;
  onOpenBookingModal?: () => void;
}

export const CarRentalHeroBanner: React.FC<CarRentalHeroBannerProps> = ({
  onExploreCars,
  onOpenBookingModal,
}) => {
  const handleAction = () => {
    if (onExploreCars) {
      onExploreCars();
    } else if (onOpenBookingModal) {
      onOpenBookingModal();
    } else {
      const el = document.getElementById('rental-tariff-plans');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.open(
          'https://wa.me/919999999999?text=Hi%20BeMyShopper,%20I%20would%20like%20to%20explore%20car%20rentals%20in%20Bapatla',
          '_blank'
        );
      }
    }
  };

  return (
    <div className="w-full h-auto lg:h-[400px] shadow-xl bg-gradient-to-r from-[#9A3412] via-[#EA580C] via-45% to-[#FED7AA] relative overflow-hidden flex items-center border-y border-orange-500/20">
      {/* Subtle smooth ambient lighting depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-white/10 pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-[#7C2D12]/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-16 -right-16 w-80 h-80 bg-white/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Content Grid */}
      <div className="max-w-[1240px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-0 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Left Side: Uploaded Route Map & Car Fleet Cutout - Reduced size & shifted left */}
          <div className="lg:col-span-5 flex items-center justify-start lg:-ml-2 xl:-ml-6 relative">
            <div className="relative group flex items-center justify-start">
              <div className="absolute inset-0 bg-white/10 rounded-full blur-2xl group-hover:bg-white/15 transition-all pointer-events-none" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/bapatla-car-rental-map-cars.png"
                alt="Bapatla's Trusted Car Rentals - Explore Bapatla & Beyond"
                className="relative z-10 w-auto h-[200px] sm:h-[240px] lg:h-[280px] max-h-[290px] max-w-full object-contain drop-shadow-2xl group-hover:scale-[1.02] transition-transform duration-300 select-none"
              />
            </div>
          </div>

          {/* Right Side: Headline, Copy, Specifications & CTA */}
          <div className="lg:col-span-7 flex flex-col items-start justify-center text-left space-y-3 sm:space-y-3.5 lg:pl-6 xl:pl-8">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/85 backdrop-blur-md border border-orange-200/80 text-[#9A3412] font-black text-xs uppercase tracking-wider shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#EA580C]" />
              <span>Bapatla&apos;s Trusted Car Rentals</span>
            </div>

            {/* Superheading & Main Headline */}
            <div className="space-y-1">
              <p className="text-xs sm:text-sm font-extrabold text-[#7C2D12] uppercase tracking-wider">
                Your Journey. Your Way.
              </p>
              <h2 className="text-2xl sm:text-3xl lg:text-[36px] font-black text-[#3A0F03] leading-tight tracking-tight">
                Explore Bapatla &amp; Beyond
              </h2>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-[#4E1706] font-medium leading-relaxed max-w-xl">
              From local city rides to beautiful beach escapes and outstation journeys, find the perfect car for every occasion.
            </p>

            {/* 3 Value Pillars / Specs Bar */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 pt-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/70 backdrop-blur-xs border border-orange-200/60 text-[#5B1E0A] text-xs font-bold shadow-2xs">
                <Car className="w-3.5 h-3.5 text-[#9A3412]" />
                <span>5-Seater SUVs</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/70 backdrop-blur-xs border border-orange-200/60 text-[#5B1E0A] text-xs font-bold shadow-2xs">
                <Users className="w-3.5 h-3.5 text-[#9A3412]" />
                <span>7-Seater MPVs</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/70 backdrop-blur-xs border border-orange-200/60 text-[#5B1E0A] text-xs font-bold shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 text-[#137A2C]" />
                <span>Safe &amp; Comfortable</span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-2">
              <button
                onClick={handleAction}
                className="inline-flex items-center gap-2.5 px-7 py-3 rounded-full bg-gradient-to-r from-[#9A3412] via-[#832608] to-[#601A04] hover:from-[#7C2D12] hover:to-[#431407] text-white font-black text-xs sm:text-sm shadow-xl hover:shadow-orange-950/30 hover:scale-105 active:scale-98 transition-all duration-200 border border-orange-400/30 cursor-pointer"
              >
                <span>Explore Cars</span>
                <ArrowRight className="w-4 h-4 text-white stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
