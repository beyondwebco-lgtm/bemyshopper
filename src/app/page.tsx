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
  Home as HomeIcon,
  Check,
} from 'lucide-react';

export default function Home() {
  const [cartCount, setCartCount] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState('Bapatla');
  const [addedItem, setAddedItem] = useState<string | null>(null);

  const categories = [
    { id: 'groceries', name: 'Groceries', icon: '/images/caticon-groceries.png' },
    { id: 'fruits-veg', name: 'Fruits &\nVegetables', icon: '/images/caticon-fruits-vegetables.png' },
    { id: 'puja-items', name: 'Puja Items', icon: '/images/caticon-puja-items.png' },
    { id: 'cleaning', name: 'Cleaning\nEssentials', icon: '/images/caticon-cleaning-essentials.png' },
    { id: 'personal-care', name: 'Personal\nCare', icon: '/images/caticon-personal-care.png' },
    { id: 'snacks', name: 'Snacks &\nBeverages', icon: '/images/caticon-snacks-beverages.png' },
    { id: 'home-kitchen', name: 'Home &\nKitchen', icon: '/images/caticon-home-kitchen.png' },
    { id: 'paper', name: 'Paper &\nDisposables', icon: '/images/caticon-paper-disposables.png' },
    { id: 'baby-care', name: 'Baby Care', icon: '/images/caticon-baby-care.png' },
    { id: 'more', name: 'More', icon: '/images/caticon-more.png' },
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

      <main className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-8 pb-10 sm:py-12">
          <div className="max-w-3xl space-y-4 sm:space-y-5">
            {/* Platform Tag */}
            <div className="inline-flex items-center gap-1.5 bg-[#EBF7EE] text-[#1E7B34] border border-[#D0EBD6] text-xs font-semibold px-3 py-1 rounded-full">
              <HomeIcon className="w-3.5 h-3.5 text-[#1E7B34]" />
              <span>Bapatla&apos;s Own Shopping Platform</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-extrabold text-gray-900 leading-[1.16] tracking-tight">
              All Your Daily Essentials <br />
              in <span className="text-[#137A2C]">One Place</span>
              <span className="inline-block ml-1.5 text-amber-500 text-xl font-bold align-middle">
                \ | /
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-xl">
              Groceries, Pooja items, Cleaning &amp; Home care, and more — delivered to your doorstep.
            </p>

            {/* Shop Now Button */}
            <div className="pt-2">
              <a
                href="#categories"
                className="bg-[#137A2C] hover:bg-[#0F6323] text-white font-semibold text-sm px-6 py-3 rounded-full inline-flex items-center gap-2 shadow-sm hover:shadow-md transition-all active:scale-98"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        {/* Value Proposition Strip (4 items) */}
        <section className="py-6 border-t border-b border-gray-100">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* 1. Fast Delivery */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#EAF5EC] text-[#137A2C] flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" strokeWidth={1.8} />
              </div>
              <div>
                <h4 className="text-xs sm:text-[13px] font-bold text-gray-900">Fast Delivery</h4>
                <p className="text-[11px] text-gray-500">Across Bapatla</p>
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

        {/* Section: Shop by Category */}
        <section id="categories" className="py-8 sm:py-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Shop by Category</h2>
            <a
              href="#"
              className="text-xs sm:text-sm font-semibold text-[#137A2C] hover:underline flex items-center gap-1"
            >
              <span>View All Categories</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2.5 sm:gap-3">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="group bg-[#F8F9FA] hover:bg-white hover:shadow-md border border-gray-100 hover:border-[#137A2C]/20 rounded-2xl p-2.5 sm:p-3 text-center flex flex-col items-center justify-between transition-all cursor-pointer min-h-[110px]"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center group-hover:scale-105 transition-transform">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cat.icon}
                    alt={cat.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-[11px] sm:text-xs font-semibold text-gray-800 leading-tight whitespace-pre-line mt-1">
                  {cat.name}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Top Essentials for You */}
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
      </main>
    </div>
  );
}
