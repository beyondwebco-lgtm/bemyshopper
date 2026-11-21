'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import {
  Car,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  MapPin,
  Clock,
  Phone,
  MessageSquare,
  Users,
  Fuel,
  Gauge,
  CheckCircle2,
  Calendar,
  HelpCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
} from 'lucide-react';

interface CarRentalItem {
  id: string;
  name: string;
  category: '5-seater' | '7-seater';
  categoryLabel?: string;
  tag?: string;
  tagColor?: string;
  images: string[];
  description?: string;
  specs: {
    seats: string;
    transmission: string;
    fuel: string;
    mileage: string;
  };
  features: string[];
  plans?: {
    '6hr'?: { price: string; km: string };
    '12hr'?: { price: string; km: string };
    '24hr'?: { price: string; km: string };
  };
  isAvailable?: boolean;
  createdAt?: number;
}

export default function AvailableCarsPage() {
  const [selectedFilter, setSelectedFilter] = useState<'all' | '5-seater' | '7-seater'>('all');
  const [selectedDuration, setSelectedDuration] = useState<'6hr' | '12hr' | '24hr'>('12hr');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const [fleetCars, setFleetCars] = useState<CarRentalItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activePhotoIndex, setActivePhotoIndex] = useState<Record<string, number>>({});
  const [tariffs, setTariffs] = useState<any>(null);

  // Active WhatsApp number for bookings
  const activeWhatsAppQuery = useQuery(api.whatsapp.getActive);
  const activeStoreWhatsApp = activeWhatsAppQuery || '919999999999';
  const cleanActivePhone = (activeStoreWhatsApp || '919999999999').replace(/[^0-9]/g, '');
  const activeWaNumber = cleanActivePhone.length === 10 ? `91${cleanActivePhone}` : cleanActivePhone;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get('category');
      if (cat === '5-seater' || cat === '7-seater') {
        setSelectedFilter(cat);
      }
    }

    // Load dynamic fleet from API
    fetch('/api/cars')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setFleetCars(data);
      })
      .catch((err) => console.error('Error fetching fleet:', err))
      .finally(() => setIsLoading(false));

    // Load dynamic tariffs from API
    fetch('/api/tariffs')
      .then((r) => r.json())
      .then((data) => {
        if (data && data.fiveSeater) setTariffs(data);
      })
      .catch((err) => console.error('Error fetching tariffs:', err));
  }, []);

  const filteredCars = fleetCars
    .filter((car) => {
      if (selectedFilter === 'all') return true;
      return car.category === selectedFilter;
    })
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

  const durationLabels: Record<'6hr' | '12hr' | '24hr', { title: string; subtitle: string }> = {
    '6hr': { title: '6 Hours', subtitle: '120 KM • Temple & City' },
    '12hr': { title: '12 Hours', subtitle: '200 KM • Beach & Outing' },
    '24hr': { title: '24 Hours', subtitle: '400 KM • Outstation & Trips' },
  };

  const faqs = [
    {
      q: 'What documents are required to rent a car in Bapatla?',
      a: 'You simply need an original Valid Driving License (DL) and an Aadhaar Card. The verification takes less than 2 minutes via WhatsApp!',
    },
    {
      q: 'Do you deliver the car to my home or Bapatla Railway Station?',
      a: 'Yes! We provide 100% doorstep delivery anywhere within Bapatla town, hotels, residences, and the Bapatla Railway Station platform exit.',
    },
    {
      q: 'Is fuel included in the rental tariff?',
      a: 'Fuel is pay-as-you-drive. We handover the car with sufficient fuel and you return it at the same fuel level, giving you full control over your trip costs.',
    },
    {
      q: 'What if I exceed the included kilometers?',
      a: 'Extra kilometers are billed at a nominal rate of just ₹10 per kilometer with completely transparent billing.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-gray-900 flex flex-col font-sans">
      {/* ================= 1. TOP NAVIGATION BAR ================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo Lockup */}
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center py-1 group shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/logo.png"
                  alt="BeMyShopper"
                  className="h-9 sm:h-10 w-auto object-contain block shrink-0"
                  style={{ height: '38px', width: 'auto', maxHeight: '38px' }}
                />
              </Link>

              {/* Navigation Links */}
              <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                <Link
                  href="/"
                  className="text-gray-700 hover:text-[#1D7A34] transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/category/groceries"
                  className="text-gray-700 hover:text-[#1D7A34] transition-colors"
                >
                  Categories
                </Link>
                <Link
                  href="/rentals"
                  className="text-[#9A3412] font-bold border-b-2 border-[#9A3412] pb-0.5"
                >
                  Rental Cars
                </Link>
                <Link
                  href="/offers"
                  className="text-gray-700 hover:text-[#1D7A34] transition-colors"
                >
                  Offers
                </Link>
                <Link
                  href="/about"
                  className="text-gray-700 hover:text-[#1D7A34] transition-colors"
                >
                  About
                </Link>
              </nav>
            </div>

            {/* Right Action Items */}
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3.5 py-2 rounded-full transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Back to Home</span>
              </Link>
              <a
                href={`https://wa.me/${activeWaNumber}?text=Hi%20BeMyShopper,%20I%20want%20to%20rent%20a%20car%20in%20Bapatla`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#25D366] hover:bg-[#1EBE5D] px-4 py-2 rounded-full transition-all shadow-sm hover:shadow cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 fill-white" />
                <span>WhatsApp Booking</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* ================= 2. HERO SHOWCASE BANNER ================= */}
      <section className="bg-gradient-to-r from-[#7C2D12] via-[#9A3412] to-[#C2410C] text-white py-10 sm:py-14 relative overflow-hidden">
        {/* Glow Effects & Coastal Accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-orange-950/40 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Copy & Value Points */}
            <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/25 text-amber-200 text-xs font-black uppercase tracking-wider backdrop-blur-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                <span>Bapatla Self-Drive &amp; Chauffeur Cars</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                Available Cars in Bapatla
              </h1>

              <p className="text-sm sm:text-base text-orange-100/90 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Explore our sanitized, verified collection of 5-Seater SUVs and 7-Seater Family MPVs. Fast doorstep delivery at Railway Station, Beach Road &amp; your home.
              </p>

              {/* 3 Value Pillars */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 pt-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20 text-xs font-bold text-white">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>100% Insured Vehicles</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20 text-xs font-bold text-white">
                  <MapPin className="w-3.5 h-3.5 text-amber-300" />
                  <span>Doorstep Handover</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20 text-xs font-bold text-white">
                  <Clock className="w-3.5 h-3.5 text-orange-300" />
                  <span>Instant WhatsApp Booking</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual */}
            <div className="lg:col-span-5 flex items-center justify-center relative">
              <div className="relative w-full max-w-md group">
                <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-400/30 transition-all" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/bapatla-car-rental-map-cars.png"
                  alt="Available Rental Cars in Bapatla"
                  loading="lazy"
                  decoding="async"
                  className="relative z-10 w-full h-auto max-h-[260px] sm:max-h-[300px] object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-300 select-none"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 3. INTERACTIVE CONTROLS BAR ================= */}
      <section className="bg-white border-b border-gray-100 sticky top-16 sm:top-20 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Category Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
              <button
                onClick={() => setSelectedFilter('all')}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${selectedFilter === 'all'
                  ? 'bg-[#9A3412] text-white shadow-xs'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
              >
                All Vehicles ({fleetCars.length})
              </button>
              <button
                onClick={() => setSelectedFilter('5-seater')}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${selectedFilter === '5-seater'
                  ? 'bg-[#9A3412] text-white shadow-xs'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
              >
                5-Seater SUVs
              </button>
              <button
                onClick={() => setSelectedFilter('7-seater')}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${selectedFilter === '7-seater'
                  ? 'bg-[#9A3412] text-white shadow-xs'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
              >
                7-Seater MPVs
              </button>
            </div>

            {/* Plan / Duration Selector Toggle */}
            <div className="flex items-center gap-1.5 bg-orange-50/70 p-1 rounded-2xl border border-orange-200/80 w-full sm:w-auto justify-center">
              <span className="text-[11px] font-black text-[#9A3412] uppercase tracking-wider px-2 hidden sm:inline">
                Rental Plan:
              </span>
              {(['6hr', '12hr', '24hr'] as const).map((dur) => (
                <button
                  key={dur}
                  onClick={() => setSelectedDuration(dur)}
                  className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${selectedDuration === dur
                    ? 'bg-[#EA580C] text-white shadow-xs font-black'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-white/60'
                    }`}
                >
                  {durationLabels[dur].title}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= 4. FLEET VEHICLE CARDS GRID ================= */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Dynamic Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              {selectedFilter === 'all'
                ? 'All Available Cars'
                : selectedFilter === '5-seater'
                  ? '5-Seater SUV & Hatchback Cars'
                  : '7-Seater Luxury MPV Cars'}
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1 font-medium">
              Showing pricing for{' '}
              <span className="font-bold text-[#EA580C]">
                {durationLabels[selectedDuration].title} ({durationLabels[selectedDuration].subtitle})
              </span>
              . Click on any car to book immediately via WhatsApp.
            </p>
          </div>

          <div className="text-xs font-bold text-gray-500 bg-white px-3 py-1.5 rounded-xl border border-gray-200 shrink-0 w-fit">
            <span>
              {filteredCars.length > 0
                ? `${filteredCars.length} vehicles ready for delivery`
                : 'Vehicles ready for delivery'}
            </span>
          </div>
        </div>

        {/* Cars Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-white rounded-3xl border border-gray-200/70 p-5 space-y-4 animate-pulse h-96 flex flex-col justify-between"
              >
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-40 bg-gray-100 rounded-2xl w-full" />
                <div className="h-10 bg-gray-100 rounded-xl w-full" />
                <div className="h-10 bg-gray-200 rounded-2xl w-full" />
              </div>
            ))}
          </div>
        ) : filteredCars.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-200/70 p-8">
            <Car className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-gray-600">No cars available in this category currently.</p>
            <p className="text-xs text-gray-400 mt-1">Please select another category or check back shortly.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredCars.map((car) => {
              const photos = car.images && car.images.length > 0 ? car.images : ['/images/cars/placeholder.png'];
              const photoIndex = activePhotoIndex[car.id] || 0;
              const currentImage = photos[photoIndex] || photos[0];

              let planPrice = '₹1,490';
              let planKm = '200 KM Included';
              if (tariffs) {
                const catTariff = car.category === '5-seater' ? tariffs.fiveSeater : tariffs.sevenSeater;
                const tPlan = catTariff?.plans?.[selectedDuration];
                if (tPlan) {
                  planPrice = `₹${tPlan.price.toLocaleString('en-IN')}`;
                  planKm = tPlan.km;
                }
              } else {
                planPrice = car.category === '5-seater'
                  ? selectedDuration === '6hr' ? '₹900' : selectedDuration === '12hr' ? '₹1,490' : '₹2,490'
                  : selectedDuration === '6hr' ? '₹1,800' : selectedDuration === '12hr' ? '₹2,490' : '₹3,490';
                planKm = selectedDuration === '6hr' ? '120 KM Included' : selectedDuration === '12hr' ? '200 KM Included' : '400 KM Included';
              }

              const waText = encodeURIComponent(
                `Hi BeMyShopper, I would like to book the "${car.name}" in Bapatla for ${durationLabels[selectedDuration].title} (${planKm} - ${planPrice}). Please share availability and handover details.`
              );

              return (
                <div
                  key={car.id}
                  className="bg-white rounded-3xl border border-orange-200/70 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between group"
                >
                  <div>
                    {/* Card Header & Tag */}
                    <div className="p-5 pb-3 bg-gradient-to-r from-orange-50/60 via-white to-amber-50/30 border-b border-orange-100 flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[11px] font-black uppercase tracking-wider text-orange-900/70 block">
                          {car.categoryLabel || (car.category === '5-seater' ? '5-Seater SUV' : '7-Seater MPV')}
                        </span>
                        <h3 className="text-lg sm:text-xl font-black text-gray-900 leading-snug mt-0.5">
                          {car.name}
                        </h3>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-2xs shrink-0 ${car.tagColor ? car.tagColor : 'bg-orange-100 text-orange-800'
                        }`}>
                        {car.tag || 'Available'}
                      </span>
                    </div>

                    {/* Vehicle Packshot Image with Multi-Photo Carousel */}
                    <div className="w-full h-48 sm:h-52 bg-gradient-to-b from-gray-50/50 to-white flex items-center justify-center p-3 relative overflow-hidden group/image">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={currentImage}
                        alt={car.name}
                        loading="lazy"
                        decoding="async"
                        className="max-h-[160px] max-w-[90%] object-contain group-hover/image:scale-105 transition-transform duration-300 drop-shadow-md select-none"
                      />

                      {/* Next / Prev Photo Controls */}
                      {photos.length > 1 && (
                        <>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setActivePhotoIndex((prev) => ({
                                ...prev,
                                [car.id]: (photoIndex - 1 + photos.length) % photos.length,
                              }));
                            }}
                            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center opacity-80 sm:opacity-0 group-hover/image:opacity-100 transition-opacity cursor-pointer shadow-md"
                            title="Previous photo"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setActivePhotoIndex((prev) => ({
                                ...prev,
                                [car.id]: (photoIndex + 1) % photos.length,
                              }));
                            }}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center opacity-80 sm:opacity-0 group-hover/image:opacity-100 transition-opacity cursor-pointer shadow-md"
                            title="Next photo"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>

                          {/* Photo Count Pill */}
                          <div className="absolute bottom-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold flex items-center gap-1 shadow-xs">
                            <ImageIcon className="w-3 h-3 text-amber-300" />
                            <span>
                              {photoIndex + 1} / {photos.length} Photos
                            </span>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Thumbnail Strip (if multiple photos) */}
                    {photos.length > 1 && (
                      <div className="px-4 py-2 bg-gray-50/90 border-y border-gray-100 flex items-center gap-1.5 overflow-x-auto">
                        {photos.map((img, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setActivePhotoIndex((prev) => ({ ...prev, [car.id]: idx }))}
                            className={`w-9 h-7 rounded-md overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${idx === photoIndex ? 'border-orange-500 ring-1 ring-orange-400' : 'border-gray-200 opacity-60 hover:opacity-100'
                              }`}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Specifications Badge Pill Row */}
                    <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/40 grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="flex flex-col items-center justify-center p-1.5 rounded-xl bg-white border border-gray-200/70 shadow-2xs">
                        <Users className="w-3.5 h-3.5 text-[#9A3412] mb-0.5" />
                        <span className="text-[10px] text-gray-500 font-semibold">Capacity</span>
                        <span className="text-[11px] font-black text-gray-800">{car.specs?.seats || '5 Seats'}</span>
                      </div>
                      <div className="flex flex-col items-center justify-center p-1.5 rounded-xl bg-white border border-gray-200/70 shadow-2xs">
                        <Gauge className="w-3.5 h-3.5 text-[#9A3412] mb-0.5" />
                        <span className="text-[10px] text-gray-500 font-semibold">Drive</span>
                        <span className="text-[11px] font-black text-gray-800">{car.specs?.transmission || 'Manual'}</span>
                      </div>
                      <div className="flex flex-col items-center justify-center p-1.5 rounded-xl bg-white border border-gray-200/70 shadow-2xs">
                        <Fuel className="w-3.5 h-3.5 text-[#9A3412] mb-0.5" />
                        <span className="text-[10px] text-gray-500 font-semibold">Fuel / Km</span>
                        <span className="text-[11px] font-black text-gray-800">{car.specs?.mileage || '18 km/l'}</span>
                      </div>
                    </div>

                    {/* Feature Highlights */}
                    <div className="p-5 space-y-2">
                      {car.description && (
                        <p className="text-xs text-gray-600 line-clamp-2 mb-2 font-medium">
                          {car.description}
                        </p>
                      )}
                      {car.features && car.features.slice(0, 3).map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-gray-600 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pricing & Call To Action */}
                  <div className="p-5 pt-3 bg-gradient-to-b from-white to-orange-50/40 border-t border-orange-100 space-y-3">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                          {durationLabels[selectedDuration].title} Tariff
                        </span>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-2xl sm:text-3xl font-black text-[#9A3412] tracking-tight">
                            {planPrice}
                          </span>
                          <span className="text-xs text-gray-500 font-semibold">/ package</span>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-black">
                        {planKm}
                      </span>
                    </div>

                    {/* Primary WhatsApp Action */}
                    <a
                      href={`https://wa.me/${activeWaNumber}?text=${waText}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#137A2C] via-[#106B26] to-[#0E5C21] hover:from-[#0E5C21] hover:to-[#0A4719] text-white font-black text-xs sm:text-sm text-center shadow-md hover:shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4 text-emerald-300" />
                      <span>Book on WhatsApp</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ================= 5. WHY RENT WITH BEMYSHOPPER ================= */}
        <section className="mt-14 sm:mt-20 p-6 sm:p-10 rounded-3xl bg-gradient-to-r from-orange-50/80 via-amber-50/60 to-orange-50/80 border border-orange-200/80 shadow-xs">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-[#9A3412] font-black text-xs uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#EA580C]" />
              <span>The Bapatla Advantage</span>
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-gray-900">
              Why Customers Love BeMyShopper Rentals
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Zero stress, no hidden clauses, and immediate doorstep delivery in Bapatla.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-5 rounded-2xl bg-white border border-orange-100 shadow-2xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#EA580C] flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-black text-gray-900">Doorstep Delivery</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Car delivered straight to Bapatla Railway Station, beach resorts, or your residence.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-orange-100 shadow-2xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#137A2C] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-black text-gray-900">Verified &amp; Insured</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                All vehicles carry comprehensive commercial insurance, active pollution &amp; fitness docs.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-orange-100 shadow-2xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-black text-gray-900">Flexible Hourly Plans</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Choose between 6hr, 12hr, or 24hr plans with extra KM billed at just ₹10/KM.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-orange-100 shadow-2xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-black text-gray-900">24x7 Local Support</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Direct phone &amp; WhatsApp support from Sivaji and the local Bapatla logistics team.
              </p>
            </div>
          </div>
        </section>

        {/* ================= 6. FREQUENTLY ASKED QUESTIONS ================= */}
        <section className="mt-12 sm:mt-16 max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-xs font-black uppercase tracking-wider text-gray-400">
              Clear &amp; Transparent
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-gray-900 mt-1">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-2xs transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between text-left cursor-pointer hover:bg-gray-50/50 transition-colors"
                  >
                    <span className="text-xs sm:text-sm font-black text-gray-900 pr-4">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#9A3412]' : ''
                        }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-xs text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ================= 7. BOTTOM STICKY CALLOUT ================= */}
        <div className="mt-14 sm:mt-20 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#9A3412] via-[#C2410C] to-[#EA580C] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl text-center sm:text-left">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-amber-200 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ready for the road?</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black">
              Need a Custom Outstation Package or Driver?
            </h3>
            <p className="text-xs sm:text-sm text-orange-100/90 max-w-lg">
              Contact Sivaji &amp; the BeMyShopper team on WhatsApp for customized outstation packages and wedding car arrangements.
            </p>
          </div>

          <a
            href={`https://wa.me/${activeWaNumber}?text=Hi%20BeMyShopper,%20I%20need%20a%20custom%20car%20rental%20package%20in%20Bapatla`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-7 py-3.5 rounded-full bg-white text-[#9A3412] font-black text-xs sm:text-sm shadow-md hover:bg-orange-50 hover:scale-105 active:scale-98 transition-all shrink-0 cursor-pointer flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </main>

      {/* ================= 8. FOOTER ================= */}
      <footer className="bg-white border-t border-gray-100 py-8 text-center text-xs text-gray-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <div className="flex items-center justify-center gap-2 font-bold text-gray-800">
            <span>BeMyShopper Bapatla</span>
            <span>•</span>
            <span>Self-Drive &amp; Chauffeur Car Rentals</span>
          </div>
          <p className="text-gray-400">
            Suryalanka Beach Road, Bapatla, Andhra Pradesh 522101.
          </p>
          <p className="text-[11px] text-gray-400 pt-1">
            © 2026 BeMyShopper. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
