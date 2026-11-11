'use client';

import React, { useState } from 'react';
import {
  MapPin,
  Search,
  User,
  ShoppingCart,
  ChevronDown,
  ArrowRight,
  Truck,
  ShieldCheck,
  CreditCard,
  Headphones,
  Plus,
  Check,
  ShoppingBag,
  Leaf,
  Flame,
  Sparkles,
  Heart,
  Coffee,
  Utensils,
  Package,
  Smile,
  LayoutGrid,
} from 'lucide-react';
import { Hero } from '../components/Hero';

export default function Home() {
  const [cartCount, setCartCount] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState('Hyderabad');
  const [addedItem, setAddedItem] = useState<string | null>(null);

  const categories = [
    {
      id: 'groceries',
      name: 'Groceries',
      prodImg: '/images/cat-prod-groceries.png',
      icon: ShoppingBag,
      iconColor: 'text-emerald-700',
      bgGradient: 'from-[#FFF8E7] via-[#FFF3D6] to-[#FFEEC4]',
      borderColor: 'border-amber-200/60',
    },
    {
      id: 'fruits-veg',
      name: 'Fruits &\nVegetables',
      prodImg: '/images/cat-prod-fruits-veg.png',
      icon: Leaf,
      iconColor: 'text-emerald-600',
      bgGradient: 'from-[#EBF7EE] via-[#DCF6E2] to-[#CEF2D6]',
      borderColor: 'border-emerald-200/60',
    },
    {
      id: 'puja-items',
      name: 'Puja Items',
      prodImg: '/images/cat-prod-puja-items.png',
      icon: Flame,
      iconColor: 'text-orange-500',
      bgGradient: 'from-[#FFF4EA] via-[#FFEAD9] to-[#FFDEC4]',
      borderColor: 'border-orange-200/60',
    },
    {
      id: 'cleaning',
      name: 'Cleaning\nEssentials',
      prodImg: '/images/cat-prod-cleaning.png',
      icon: Sparkles,
      iconColor: 'text-sky-600',
      bgGradient: 'from-[#EDF6FF] via-[#DBEEFF] to-[#C9E4FF]',
      borderColor: 'border-blue-200/60',
    },
    {
      id: 'personal-care',
      name: 'Personal\nCare',
      prodImg: '/images/cat-prod-personal-care.png',
      icon: Heart,
      iconColor: 'text-purple-600',
      bgGradient: 'from-[#F7EFFF] via-[#EFE2FF] to-[#E5D2FF]',
      borderColor: 'border-purple-200/60',
    },
    {
      id: 'snacks',
      name: 'Snacks &\nBeverages',
      prodImg: '/images/cat-prod-snacks.png',
      icon: Coffee,
      iconColor: 'text-amber-600',
      bgGradient: 'from-[#FFF8ED] via-[#FFEECF] to-[#FFE3AF]',
      borderColor: 'border-amber-200/60',
    },
    {
      id: 'home-kitchen',
      name: 'Home &\nKitchen',
      prodImg: '/images/cat-prod-home-kitchen.png',
      icon: Utensils,
      iconColor: 'text-indigo-600',
      bgGradient: 'from-[#EFF6FF] via-[#E2EDFF] to-[#D0E2FF]',
      borderColor: 'border-indigo-200/60',
    },
    {
      id: 'paper',
      name: 'Paper &\nDisposables',
      prodImg: '/images/cat-prod-paper.png',
      icon: Package,
      iconColor: 'text-teal-600',
      bgGradient: 'from-[#EDFAF1] via-[#DCF5E4] to-[#C8EFD3]',
      borderColor: 'border-emerald-200/60',
    },
    {
      id: 'baby-care',
      name: 'Baby Care',
      prodImg: '/images/cat-prod-baby-care.png',
      icon: Smile,
      iconColor: 'text-rose-500',
      bgGradient: 'from-[#FFF0F4] via-[#FFE0E8] to-[#FFD0DC]',
      borderColor: 'border-rose-200/60',
    },
    {
      id: 'more',
      name: 'More',
      prodImg: '/images/cat-prod-more.png',
      icon: LayoutGrid,
      iconColor: 'text-purple-600',
      bgGradient: 'from-[#F7EFFF] via-[#ECE0FC] to-[#DFCEFA]',
      borderColor: 'border-purple-200/60',
    },
  ];

  const essentials = [
    {
      id: 'surf-excel',
      name: 'Surf Excel Detergent (1 kg)',
      img: '/images/prod-surf-excel.png',
      price: '₹140',
    },
    {
      id: 'vim-dishwash',
      name: 'Vim Dishwash Liquid (750 ml)',
      img: '/images/prod-vim-dishwash.png',
      price: '₹115',
    },
    {
      id: 'ambica-agarbatti',
      name: 'Ambica Kadilu Agarbatti',
      img: '/images/prod-ambica-agarbatti.png',
      price: '₹65',
    },
    {
      id: 'rice-5kg',
      name: 'Rice (5 kg)',
      img: '/images/prod-rice-5kg.png',
      price: '₹290',
    },
    {
      id: 'toilet-tissue',
      name: 'Toilet Tissue Roll (4 pcs)',
      img: '/images/prod-toilet-tissue.png',
      price: '₹120',
    },
    {
      id: 'nandini-ghee',
      name: 'Nandini Ghee (500 ml)',
      img: '/images/prod-nandini-ghee.png',
      price: '₹310',
    },
  ];

  const handleAddToCart = (id: string) => {
    setCartCount((prev) => prev + 1);
    setAddedItem(id);
    setTimeout(() => setAddedItem(null), 1200);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans antialiased">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <a href="#" className="flex items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo.png"
                alt="Be My Shopper"
                className="h-10 sm:h-11 w-auto object-contain"
              />
            </a>

            {/* Navigation links */}
            <nav className="hidden md:flex items-center gap-6 text-[13px] font-medium">
              <a
                href="#"
                className="bg-[#EAF5EC] text-[#1D7A34] font-semibold px-4 py-1.5 rounded-full transition-colors"
              >
                Home
              </a>
              <button className="flex items-center gap-1 text-gray-700 hover:text-[#1D7A34] transition-colors">
                <span>Categories</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
              </button>
              <a href="#" className="text-gray-700 hover:text-[#1D7A34] transition-colors">
                Offers
              </a>
              <a href="#" className="text-gray-700 hover:text-[#1D7A34] transition-colors">
                About
              </a>
            </nav>
          </div>

          {/* Right Action Items */}
          <div className="flex items-center gap-4 sm:gap-5">
            {/* Location Selector */}
            <button className="flex items-center gap-1.5 text-xs sm:text-[13px] font-medium text-gray-800 bg-white border border-gray-200/90 rounded-full px-3 py-1.5 hover:border-gray-300 transition-all shadow-2xs">
              <MapPin className="w-3.5 h-3.5 text-[#1D7A34]" />
              <span>{selectedLocation}</span>
              <ChevronDown className="w-3 h-3 text-gray-500" />
            </button>

            {/* Icons: Search, User, Cart */}
            <button
              aria-label="Search"
              className="p-1.5 text-gray-700 hover:text-[#1D7A34] hover:bg-gray-50 rounded-full transition-colors"
            >
              <Search className="w-5 h-5" strokeWidth={1.8} />
            </button>

            <button
              aria-label="Account"
              className="p-1.5 text-gray-700 hover:text-[#1D7A34] hover:bg-gray-50 rounded-full transition-colors"
            >
              <User className="w-5 h-5" strokeWidth={1.8} />
            </button>

            <button
              aria-label="Shopping Cart"
              className="relative p-1.5 text-gray-700 hover:text-[#1D7A34] hover:bg-gray-50 rounded-full transition-colors"
            >
              <ShoppingCart className="w-5 h-5" strokeWidth={1.8} />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#1D7A34] text-white text-[10px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* Auto-scrolling Hero Carousel */}
        <Hero />

        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          
          {/* 1. Value Proposition Features Strip (Placed TOP to Diwali Offers) */}
          <section className="py-5 sm:py-6 border-t border-b border-gray-100 my-4 sm:my-5">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {/* 1. Fast Delivery */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#EAF5EC] text-[#137A2C] flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5" strokeWidth={1.8} />
                </div>
                <div>
                  <h4 className="text-xs sm:text-[13px] font-bold text-gray-900">Fast Delivery</h4>
                  <p className="text-[11px] text-gray-500">Across {selectedLocation}</p>
                </div>
              </div>

              {/* 2. Trusted Local Stores */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#EAF5EC] text-[#137A2C] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" strokeWidth={1.8} />
                </div>
                <div>
                  <h4 className="text-xs sm:text-[13px] font-bold text-gray-900">Trusted Local Stores</h4>
                  <p className="text-[11px] text-gray-500">Quality Products</p>
                </div>
              </div>

              {/* 3. Secure Payments */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#EAF5EC] text-[#137A2C] flex items-center justify-center shrink-0">
                  <CreditCard className="w-5 h-5" strokeWidth={1.8} />
                </div>
                <div>
                  <h4 className="text-xs sm:text-[13px] font-bold text-gray-900">Secure Payments</h4>
                  <p className="text-[11px] text-gray-500">Safe &amp; Hassle-Free</p>
                </div>
              </div>

              {/* 4. Customer Support */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#EAF5EC] text-[#137A2C] flex items-center justify-center shrink-0">
                  <Headphones className="w-5 h-5" strokeWidth={1.8} />
                </div>
                <div>
                  <h4 className="text-xs sm:text-[13px] font-bold text-gray-900">Customer Support</h4>
                  <p className="text-[11px] text-gray-500">We&apos;re Always Here</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* 2. Full Bleed Diwali Offers Banner (Complete Left End to Right End of Page, Square Type) */}
        <section className="w-full bg-gradient-to-r from-[#3C0764] via-[#6B21A8]/90 via-45% via-purple-200/50 via-75% to-transparent my-6 sm:my-8 rounded-none shadow-xs">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 sm:py-10">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Left Side: On Dark Purple background with crisp high-contrast white & gold */}
              <div className="md:col-span-7 flex flex-col items-start justify-center text-left space-y-3 sm:space-y-4">
                {/* Festive Tag */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/30 text-amber-300 text-xs font-semibold tracking-wide shadow-2xs">
                  <span>🪔</span>
                  <span>Diwali Special Offers</span>
                </div>

                {/* Main Headline */}
                <h3 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold text-white leading-tight tracking-tight">
                  Buy Groceries with{' '}
                  <span className="text-amber-400 drop-shadow-sm">Diwali Offers!</span>
                </h3>

                {/* Description */}
                <p className="text-sm sm:text-base text-purple-100/90 leading-relaxed max-w-xl">
                  Up to <span className="text-amber-300 font-bold">30% OFF</span> on Groceries, Pooja Essentials &amp; Home Care. Stock up your festive kitchen with pure ingredients and guaranteed lowest prices.
                </p>

                {/* Client Attractive Highlights */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/15 text-white text-xs font-medium backdrop-blur-xs border border-white/10">
                    ⚡ 30-Min Fast Delivery
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/15 text-white text-xs font-medium backdrop-blur-xs border border-white/10">
                    🎁 Free Diya on Orders ₹499+
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/15 text-white text-xs font-medium backdrop-blur-xs border border-white/10">
                    ✨ Extra ₹100 OFF on 1st Order
                  </span>
                </div>

                {/* CTA Button */}
                <div className="pt-2">
                  <a
                    href="#categories"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-[#3C0764] hover:bg-amber-50 font-bold text-sm sm:text-base shadow-md hover:shadow-xl hover:scale-[1.02] active:scale-98 transition-all duration-200"
                  >
                    <span>Shop Diwali Deals</span>
                    <ArrowRight className="w-4 h-4 text-[#3C0764]" />
                  </a>
                </div>
              </div>

              {/* Right Side: Turning into Light Purple & Transparent where products sit */}
              <div className="md:col-span-5 flex items-center justify-center lg:justify-end">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/diwali-offer-products.png"
                  alt="Diwali Grocery Offers & Up to 30% OFF"
                  className="w-full max-w-[450px] h-auto object-contain drop-shadow-md hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <section id="categories" className="py-6 sm:py-8">
            {/* Header: Shop by Category with Sparkle \ | / and Pill Button */}
            <div className="flex items-center justify-between mb-5 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#142333] flex items-center gap-1.5 tracking-tight">
                <span>Shop by Category</span>
                <span className="text-amber-500 font-extrabold text-xl select-none align-middle tracking-wider ml-1">
                  \ | /
                </span>
              </h2>
              <a
                href="#"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#EAF5EC] hover:bg-[#D8EEDF] text-[#137A2C] text-xs sm:text-[13px] font-semibold transition-colors shadow-2xs"
              >
                <span>View All Categories</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#137A2C]" />
              </a>
            </div>

            {/* 10 Category Cards properly aligned with high clarity */}
            <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2.5 sm:gap-3">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className={`group relative rounded-2xl sm:rounded-[20px] bg-gradient-to-b ${cat.bgGradient} border ${cat.borderColor} p-2 sm:p-2.5 flex flex-col items-center justify-between h-[160px] sm:h-[175px] shadow-2xs hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 cursor-pointer overflow-hidden`}
                >
                  {/* Top: Product Visual - Perfectly centered with high clarity */}
                  <div className="w-full h-24 sm:h-26 flex items-center justify-center pt-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={cat.prodImg}
                      alt={cat.name.replace('\n', ' ')}
                      className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-300 select-none drop-shadow-2xs"
                    />
                  </div>

                  {/* Bottom: Crisp Real HTML Typography - Perfectly baseline-aligned */}
                  <div className="w-full h-9 pb-1 flex items-center justify-center">
                    <span className="text-[11px] sm:text-[12px] font-bold text-gray-900 leading-[1.2] text-center whitespace-pre-line tracking-tight">
                      {cat.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 4. Section: Top Essentials for You */}
          <section className="py-4 pb-16">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Top Essentials for You</h2>
              <a
                href="#"
                className="text-xs sm:text-sm font-semibold text-[#137A2C] hover:underline flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {essentials.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-gray-100 hover:border-gray-200 rounded-2xl p-3 shadow-2xs hover:shadow-md transition-all flex items-center justify-between gap-2.5"
                >
                  {/* Item Thumbnail */}
                  <div className="w-12 h-14 shrink-0 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.img}
                      alt={item.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-gray-800 leading-snug line-clamp-2">
                      {item.name}
                    </h4>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => handleAddToCart(item.id)}
                    aria-label={`Add ${item.name}`}
                    className="w-6 h-6 rounded-full bg-[#137A2C] hover:bg-[#0F6323] text-white flex items-center justify-center shrink-0 shadow-xs hover:scale-110 active:scale-95 transition-all"
                  >
                    {addedItem === item.id ? (
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    ) : (
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
