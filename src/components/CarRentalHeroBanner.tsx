'use client';

import React from 'react';
import {
  Car,
  Calendar,
  MessageSquare,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Users,
} from 'lucide-react';

interface CarRentalHeroBannerProps {
  onExploreCars?: () => void;
  onOpenBookingModal?: () => void;
}

export const CarRentalHeroBanner: React.FC<CarRentalHeroBannerProps> = ({
  onExploreCars,
  onOpenBookingModal,
}) => {
  const handleScrollToPlans = () => {
    if (onExploreCars) {
      onExploreCars();
    } else {
      const el = document.getElementById('rental-tariff-plans');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <div className="w-full bg-gradient-to-r from-[#FED7AA] via-[#FB923C] via-45% to-[#9A3412] p-1 sm:p-2 shadow-md">
      <div className="max-w-[1240px] mx-auto px-2 sm:px-4">
        {/* Top Quick Actions Bar */}
        <div className="flex items-center justify-between gap-3 py-2 px-1 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 backdrop-blur-xs text-[#9A3412] font-black text-xs shadow-2xs border border-orange-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Bapatla Self-Drive &amp; Chauffeur Car Rentals</span>
            </span>
            <span className="hidden md:inline-block text-xs font-semibold text-amber-950/80">
              Mahindra Thar • Brezza • Innova Crysta
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenBookingModal?.()}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#137A2C] hover:bg-[#0E5C21] text-white text-xs font-bold shadow-xs hover:shadow transition-all cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Online</span>
            </button>

            <a
              href="https://wa.me/919999999999?text=Hi%20BeMyShopper,%20I%20would%20like%20to%20rent%20a%20car%20in%20Bapatla"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-orange-50 text-[#9A3412] border border-orange-200 text-xs font-bold transition-all shadow-2xs cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Compact, Slender Full-Width Hero Banner */}
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-orange-300/40 group bg-gradient-to-r from-[#FED7AA] via-[#FB923C] to-[#9A3412]">
          {/* Main Banner Visual - Compact 3:1 Slender Aspect Ratio */}
          <div className="relative w-full aspect-[3/1] max-h-[320px] sm:max-h-[340px] flex items-center justify-center overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/bapatla-car-rental-banner.jpg"
              alt="Explore Bapatla & Nearby Destinations: Mahindra Thar, Brezza, Innova Crysta Car Rentals"
              className="w-full h-full object-cover object-center group-hover:scale-[1.01] transition-transform duration-500 select-none"
            />

            {/* Clickable Overlay Trigger to explore cars */}
            <button
              onClick={handleScrollToPlans}
              aria-label="Explore Our Cars & View Tariffs"
              className="absolute inset-0 w-full h-full cursor-pointer z-10 focus:outline-none"
            />

            {/* Live Interactive Button Overlaid exactly over 'Explore Our Cars' */}
            <div className="absolute left-[3.5%] sm:left-[4%] bottom-[10%] sm:bottom-[12%] z-20 pointer-events-auto">
              <button
                onClick={handleScrollToPlans}
                className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-[#E04F16] via-[#EA580C] to-[#C2410C] hover:from-[#C2410C] hover:to-[#9A3412] text-white font-black text-xs sm:text-sm shadow-lg hover:shadow-orange-600/40 hover:scale-105 active:scale-98 transition-all duration-200 border border-amber-200/40 cursor-pointer"
              >
                <span>Explore Our Cars</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
