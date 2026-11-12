'use client';

import React, { useState } from 'react';
import {
  MapPin,
  ArrowRight,
  ShieldCheck,
  Users,
  Car,
  Compass,
  Sparkles,
  Phone,
  MessageSquare,
  Navigation,
} from 'lucide-react';

interface CarRentalHeroBannerProps {
  onExploreCars?: () => void;
  onOpenBookingModal?: () => void;
}

export const CarRentalHeroBanner: React.FC<CarRentalHeroBannerProps> = ({
  onExploreCars,
  onOpenBookingModal,
}) => {
  const [activeLocation, setActiveLocation] = useState<string>('bapatla');

  const destinations = [
    {
      id: 'bapatla',
      name: 'Bapatla',
      label: 'Bapatla (Hub)',
      distance: 'Home Hub',
      time: 'Doorstep Delivery',
      coords: { x: 50, y: 46 }, // Percentage coordinates in map canvas
      description: 'Central vehicle pickup and doorstep drop anywhere in town',
      isHub: true,
    },
    {
      id: 'suryalanka',
      name: 'Suryalanka Beach',
      label: 'Suryalanka Beach',
      distance: '8 KM',
      time: '15 Mins',
      coords: { x: 78, y: 28 },
      description: 'Golden sand beaches, coastal resorts & sunrise drives',
      isHub: false,
    },
    {
      id: 'chirala',
      name: 'Chirala',
      label: 'Chirala',
      distance: '16 KM',
      time: '25 Mins',
      coords: { x: 26, y: 22 },
      description: 'Handloom shopping, Vodarevu beach & local dining',
      isHub: false,
    },
    {
      id: 'vijayawada',
      name: 'Vijayawada',
      label: 'Vijayawada (Outstation)',
      distance: '85 KM',
      time: '1.5 Hrs',
      coords: { x: 24, y: 72 },
      description: 'Airport transit, business travel & Kanaka Durga Temple visits',
      isHub: false,
    },
  ];

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
    <section className="relative w-full overflow-hidden bg-gradient-to-r from-[#FF9838] via-[#F46F1B] via-50% to-[#C2410C] text-white">
      {/* Background Lighting & Radial Glows */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Soft Warm Left Radial Light */}
        <div className="absolute -top-24 -left-24 w-[600px] h-[600px] bg-amber-200/25 rounded-full blur-3xl" />
        {/* Deep Burnt Orange Right Shadow Accent */}
        <div className="absolute top-0 right-0 w-[800px] h-full bg-gradient-to-l from-[#8C2B04]/70 via-transparent to-transparent" />
        {/* Subtle Coastal Wave Silhouette on Right */}
        <div
          className="absolute right-0 top-0 bottom-0 w-full lg:w-1/2 opacity-25 mix-blend-overlay bg-cover bg-right bg-no-repeat pointer-events-none"
          style={{ backgroundImage: `url('/images/suryalanka-coast-orange.jpg')` }}
        />
        {/* Road Surface Dark Vignette at Bottom */}
        <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-black/25 to-transparent pointer-events-none" />
      </div>

      {/* Main Content Container */}
      <div className="relative max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center min-h-[500px] lg:min-h-[540px]">
          {/* ================= LEFT SIDE: CONTENT ================= */}
          <div className="lg:col-span-5 flex flex-col items-start justify-center space-y-4 sm:space-y-5 text-left z-20">
            {/* 1. Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs sm:text-[13px] font-bold shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span className="tracking-wide">Bapatla&apos;s Trusted Car Rentals</span>
            </div>

            {/* 2. Main Heading with Artistic Underline Accent */}
            <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-black tracking-tight text-white leading-[1.12]">
              Explore Bapatla <br />
              <span className="relative inline-block text-amber-100">
                &amp; Beyond
                <svg
                  className="absolute -bottom-2 left-0 w-full overflow-visible"
                  height="10"
                  viewBox="0 0 100 10"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 5 Q 50 10, 100 3"
                    stroke="#FFD599"
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            {/* 3. Supporting Text */}
            <p className="text-sm sm:text-base text-amber-50/95 leading-relaxed max-w-lg font-normal">
              Your journey starts here. Book reliable SUVs and spacious family cars for local trips, beach outings and outstation travel.
            </p>

            {/* 4. Value Highlights Strip */}
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs sm:text-[13px] font-bold text-white">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/15 backdrop-blur-xs border border-white/15">
                <Car className="w-4 h-4 text-amber-200" />
                <span>5-Seater SUVs</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/15 backdrop-blur-xs border border-white/15">
                <Users className="w-4 h-4 text-amber-200" />
                <span>7-Seater MPVs</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/15 backdrop-blur-xs border border-white/15">
                <ShieldCheck className="w-4 h-4 text-amber-200" />
                <span>Safe &amp; Comfortable</span>
              </div>
            </div>

            {/* 5. CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2 w-full sm:w-auto">
              {/* Primary CTA */}
              <button
                onClick={handleScrollToPlans}
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3.5 rounded-full bg-gradient-to-r from-[#A53406] via-[#B93807] to-[#8F2803] hover:from-[#882802] hover:to-[#6F1E01] text-white font-extrabold text-sm sm:text-base shadow-xl hover:shadow-2xl hover:scale-103 active:scale-98 transition-all duration-200 border border-white/20 cursor-pointer"
              >
                <span>Explore Cars</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>

              {/* Secondary CTA */}
              <button
                onClick={() => {
                  const mapElement = document.getElementById('bapatla-route-map');
                  if (mapElement) {
                    mapElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                  setActiveLocation('suryalanka');
                }}
                className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3.5 rounded-full bg-white/15 hover:bg-white/25 text-white font-bold text-sm backdrop-blur-md border border-white/30 transition-all duration-200 cursor-pointer"
              >
                <Compass className="w-4 h-4 text-amber-200" />
                <span>View Locations</span>
              </button>

              {/* Quick WhatsApp Link */}
              <a
                href="https://wa.me/919999999999?text=Hi%20BeMyShopper,%20I%20would%20like%20to%20rent%20a%20car%20in%20Bapatla"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-3.5 rounded-full bg-black/20 hover:bg-black/30 text-amber-100 text-xs sm:text-sm font-semibold border border-white/15 transition-colors cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-300" />
                <span>Instant WhatsApp</span>
              </a>
            </div>
          </div>

          {/* ================= RIGHT SIDE: MAP & CAR COMPOSITION ================= */}
          <div
            id="bapatla-route-map"
            className="lg:col-span-7 relative flex flex-col items-center justify-end w-full h-[380px] sm:h-[460px] lg:h-[500px]"
          >
            {/* 1. Stylized Translucent Map & Route Network (Top/Center) */}
            <div className="absolute inset-x-0 top-0 bottom-16 sm:bottom-20 z-0 flex items-center justify-center">
              <div className="relative w-full max-w-[620px] h-[250px] sm:h-[300px] lg:h-[320px] rounded-3xl bg-white/10 backdrop-blur-md border border-white/25 p-4 sm:p-6 shadow-2xl overflow-hidden">
                {/* Map Grid & Geographic Stylized Shape of Bapatla Region */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  viewBox="0 0 500 250"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Subtle Grid Lines */}
                  <defs>
                    <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                      <path
                        d="M 30 0 L 0 0 0 30"
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.08)"
                        strokeWidth="1"
                      />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />

                  {/* Stylized Bapatla District Territorial Region Polygon */}
                  <path
                    d="M 90 40 Q 150 20, 230 45 T 380 60 Q 440 100, 410 170 T 320 220 Q 200 230, 130 190 T 70 110 Z"
                    fill="rgba(255, 255, 255, 0.07)"
                    stroke="rgba(255, 225, 185, 0.35)"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />

                  {/* Bay of Bengal Coastline Graphic on East */}
                  <path
                    d="M 370 20 C 410 80, 430 140, 460 240"
                    stroke="rgba(255, 255, 255, 0.4)"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <text x="400" y="215" fill="rgba(255,255,255,0.4)" fontSize="9" fontWeight="bold" letterSpacing="1">
                    BAY OF BENGAL
                  </text>

                  {/* Connecting Dashed Route Lines from Bapatla Hub (250, 115) */}
                  {/* Route 1: Bapatla -> Suryalanka Beach (390, 70) */}
                  <path
                    d="M 250 115 Q 320 80, 390 70"
                    stroke="rgba(255, 255, 255, 0.85)"
                    strokeWidth="2"
                    strokeDasharray="5 5"
                  />

                  {/* Route 2: Bapatla -> Chirala (130, 55) */}
                  <path
                    d="M 250 115 Q 190 75, 130 55"
                    stroke="rgba(255, 255, 255, 0.85)"
                    strokeWidth="2"
                    strokeDasharray="5 5"
                  />

                  {/* Route 3: Bapatla -> Vijayawada / Outstation (120, 180) */}
                  <path
                    d="M 250 115 Q 180 155, 120 180"
                    stroke="rgba(255, 255, 255, 0.85)"
                    strokeWidth="2"
                    strokeDasharray="5 5"
                  />
                </svg>

                {/* Interactive Location Markers & Pins */}
                {/* 1. BAPATLA HUB PIN (Center) */}
                <div
                  onClick={() => setActiveLocation('bapatla')}
                  className="absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer group z-30"
                >
                  <div className="relative flex items-center justify-center">
                    <span className="absolute -inset-2 rounded-full bg-amber-300 animate-ping opacity-40 pointer-events-none" />
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white to-amber-100 text-[#C2410C] flex items-center justify-center shadow-lg border-2 border-white group-hover:scale-110 transition-transform">
                      <MapPin className="w-5 h-5 fill-[#C2410C] text-[#C2410C]" />
                    </div>
                  </div>
                  <div className="mt-1 px-3 py-1 rounded-full bg-white text-gray-900 font-black text-xs shadow-md border border-gray-100 flex items-center gap-1 whitespace-nowrap">
                    <span>Bapatla</span>
                    <span className="w-2 h-2 rounded-full bg-[#137A2C]" />
                  </div>
                </div>

                {/* 2. SURYALANKA BEACH PIN (Top-Right Coast) */}
                <div
                  onClick={() => setActiveLocation('suryalanka')}
                  className="absolute right-[12%] sm:right-[15%] top-[18%] flex flex-col items-center cursor-pointer group z-20"
                >
                  <div className="w-7 h-7 rounded-full bg-white/90 text-amber-700 flex items-center justify-center shadow-md border border-white group-hover:scale-110 transition-transform">
                    <Navigation className="w-3.5 h-3.5 fill-amber-700 text-amber-700 rotate-45" />
                  </div>
                  <div className="mt-1 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[11px] font-bold shadow whitespace-nowrap border border-white/20">
                    Suryalanka Beach <span className="text-amber-300 ml-0.5">8 KM</span>
                  </div>
                </div>

                {/* 3. CHIRALA PIN (Top-Left) */}
                <div
                  onClick={() => setActiveLocation('chirala')}
                  className="absolute left-[12%] sm:left-[16%] top-[14%] flex flex-col items-center cursor-pointer group z-20"
                >
                  <div className="w-7 h-7 rounded-full bg-white/90 text-amber-700 flex items-center justify-center shadow-md border border-white group-hover:scale-110 transition-transform">
                    <MapPin className="w-3.5 h-3.5 fill-amber-700 text-amber-700" />
                  </div>
                  <div className="mt-1 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[11px] font-bold shadow whitespace-nowrap border border-white/20">
                    Chirala <span className="text-amber-300 ml-0.5">16 KM</span>
                  </div>
                </div>

                {/* 4. VIJAYAWADA / OUTSTATION PIN (Bottom-Left) */}
                <div
                  onClick={() => setActiveLocation('vijayawada')}
                  className="absolute left-[10%] sm:left-[14%] bottom-[20%] flex flex-col items-center cursor-pointer group z-20"
                >
                  <div className="w-7 h-7 rounded-full bg-white/90 text-amber-700 flex items-center justify-center shadow-md border border-white group-hover:scale-110 transition-transform">
                    <MapPin className="w-3.5 h-3.5 fill-amber-700 text-amber-700" />
                  </div>
                  <div className="mt-1 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[11px] font-bold shadow whitespace-nowrap border border-white/20">
                    Vijayawada <span className="text-amber-300 ml-0.5">85 KM</span>
                  </div>
                </div>

                {/* Active Destination Quick Info Pill (Bottom-Right) */}
                <div className="absolute right-3 bottom-3 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs z-20">
                  <span className="font-bold">
                    {destinations.find((d) => d.id === activeLocation)?.label}:
                  </span>
                  <span className="text-amber-200 font-semibold">
                    {destinations.find((d) => d.id === activeLocation)?.distance} •{' '}
                    {destinations.find((d) => d.id === activeLocation)?.time}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Integrated Cars Composition (Bottom Layer overlapping foreground) */}
            <div className="relative z-10 w-full max-w-[620px] flex items-end justify-center pointer-events-none mt-auto">
              {/* Contact Ground Shadow */}
              <div className="absolute bottom-2 inset-x-8 h-8 bg-black/35 rounded-full blur-xl pointer-events-none" />

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/rental-cars-lineup-transparent.png"
                alt="Bapatla Rental Fleet: Mahindra Thar, Hyundai Creta, Toyota Innova"
                className="relative z-10 w-full h-auto object-contain max-h-[220px] sm:max-h-[260px] lg:max-h-[290px] drop-shadow-2xl select-none"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
