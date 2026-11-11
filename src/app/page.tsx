'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
  Minus,
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
  X,
  Trash2,
  Award,
  Quote,
  Building2,
  Car,
  Store,
  CheckCircle2,
} from 'lucide-react';
import { Hero } from '../components/Hero';

export default function Home() {
  // Dynamic Cart state: itemId -> quantity
  const [cartItems, setCartItems] = useState<Record<string, number>>({});
  // Wishlist state: itemId -> boolean
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});
  // Interactive UI panels
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  // Feedback
  const [addedItem, setAddedItem] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleAddToCart = (id: string) => {
    setCartItems((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
    setAddedItem(id);
    const item = essentials.find((e) => e.id === id);
    showToast(`Added ${item?.name || 'item'} to cart 🛒`);
    setTimeout(() => setAddedItem(null), 1200);
  };

  const updateCartQuantity = (id: string, delta: number) => {
    setCartItems((prev) => {
      const current = prev[id] || 0;
      const next = current + delta;
      if (next <= 0) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: next };
    });
  };

  const removeCartItem = (id: string) => {
    setCartItems((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
    showToast('Item removed from cart');
  };

  const toggleWishlist = (id: string) => {
    setWishlist((prev) => {
      const willLike = !prev[id];
      const item = essentials.find((e) => e.id === id);
      showToast(willLike ? `Saved ${item?.name || 'item'} to favorites ❤️` : `Removed from favorites`);
      return { ...prev, [id]: willLike };
    });
  };

  const totalCartCount = Object.values(cartItems).reduce((sum, q) => sum + q, 0);
  const totalWishlistCount = Object.values(wishlist).filter(Boolean).length;

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
      name: 'Surf Excel Detergent Powder',
      pack: '1 kg',
      img: '/images/prod-surf-excel.png',
      price: '₹349',
      originalPrice: '₹399',
      discount: 'Save 13%',
      badge: { text: 'Bestseller', icon: '👑', color: 'bg-[#48BB78] text-white' },
    },
    {
      id: 'vim-dishwash',
      name: 'Vim Dishwash Liquid',
      pack: '750 ml',
      img: '/images/prod-vim-dishwash.png',
      price: '₹135',
      originalPrice: '₹145',
      discount: 'Save 7%',
      badge: null,
    },
    {
      id: 'ambica-agarbatti',
      name: 'Ambica Durbar Bathi (Agarbathi)',
      pack: 'Pack of 5',
      img: '/images/prod-ambica-agarbatti.png',
      price: '₹89',
      originalPrice: '₹99',
      discount: 'Save 10%',
      badge: null,
    },
    {
      id: 'rice-5kg',
      name: 'Rice',
      pack: '5 kg',
      img: '/images/prod-rice-5kg.png',
      price: '₹329',
      originalPrice: '₹349',
      discount: 'Save 6%',
      badge: null,
    },
    {
      id: 'toilet-tissue',
      name: 'Toilet Tissue Roll (3 Ply)',
      pack: 'Pack of 4',
      img: '/images/prod-toilet-tissue.png',
      price: '₹149',
      originalPrice: '₹165',
      discount: 'Save 10%',
      badge: null,
    },
    {
      id: 'nandini-ghee',
      name: 'Nandini Ghee',
      pack: '500 ml',
      img: '/images/prod-nandini-ghee.png',
      price: '₹289',
      originalPrice: '₹320',
      discount: 'Save 10%',
      badge: { text: 'Trending', icon: '🔥', color: 'bg-[#FED7AA] text-[#C2410C]' },
    },
    {
      id: 'red-label',
      name: 'Brooke Bond Red Label Tea',
      pack: '500 g',
      img: '/images/prod-red-label.png',
      price: '₹299',
      originalPrice: '₹335',
      discount: 'Save 11%',
      badge: { text: 'Bestseller', icon: '👑', color: 'bg-[#48BB78] text-white' },
    },
    {
      id: 'maggi',
      name: 'Maggi 2-Minute Noodles',
      pack: '420 g (Pack of 4)',
      img: '/images/prod-maggi.png',
      price: '₹115',
      originalPrice: '₹125',
      discount: 'Save 8%',
      badge: null,
    },
    {
      id: 'horlicks',
      name: 'Horlicks Health Drink',
      pack: '500 g',
      img: '/images/prod-horlicks.png',
      price: '₹329',
      originalPrice: '₹360',
      discount: 'Save 9%',
      badge: null,
    },
    {
      id: 'dove-soap',
      name: 'Dove Beauty Bathing Bar',
      pack: '125 g (Pack of 3)',
      img: '/images/prod-dove-soap.png',
      price: '₹165',
      originalPrice: '₹195',
      discount: 'Save 15%',
      badge: null,
    },
    {
      id: 'colgate',
      name: 'Colgate Strong Teeth Toothpaste',
      pack: '150 g',
      img: '/images/prod-colgate.png',
      price: '₹129',
      originalPrice: '₹145',
      discount: 'Save 11%',
      badge: null,
    },
    {
      id: 'harpic',
      name: 'Harpic Power Plus Toilet Cleaner',
      pack: '1 L',
      img: '/images/prod-harpic.png',
      price: '₹189',
      originalPrice: '₹210',
      discount: 'Save 10%',
      badge: { text: 'Trending', icon: '🔥', color: 'bg-[#FED7AA] text-[#C2410C]' },
    },
  ];

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

              {/* Dynamic Categories Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsCategoriesOpen((prev) => !prev)}
                  className={`flex items-center gap-1.5 transition-colors font-medium px-3 py-1.5 rounded-full ${
                    isCategoriesOpen
                      ? 'text-[#1D7A34] bg-[#EAF5EC]'
                      : 'text-gray-700 hover:text-[#1D7A34] hover:bg-gray-50'
                  }`}
                >
                  <span>Categories</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      isCategoriesOpen ? 'rotate-180 text-[#1D7A34]' : 'text-gray-500'
                    }`}
                  />
                </button>

                {/* Categories Dropdown Menu */}
                {isCategoriesOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsCategoriesOpen(false)}
                    />
                    <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50 grid grid-cols-1 gap-1 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-3 py-1.5 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                        All Categories
                      </div>
                      <div className="max-h-[380px] overflow-y-auto space-y-0.5 py-1">
                        {categories.map((cat) => {
                          const CatIcon = cat.icon;
                          return (
                            <button
                              key={cat.id}
                              onClick={() => {
                                setIsCategoriesOpen(false);
                                scrollToSection('categories');
                              }}
                              className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors text-left group/item w-full"
                            >
                              <div
                                className={`w-8 h-8 rounded-lg bg-gradient-to-b ${cat.bgGradient} flex items-center justify-center shrink-0 border ${cat.borderColor}`}
                              >
                                <CatIcon className={`w-4 h-4 ${cat.iconColor}`} />
                              </div>
                              <span className="text-xs font-semibold text-gray-800 group-hover/item:text-[#1D7A34] transition-colors leading-tight">
                                {cat.name.replace('\n', ' ')}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Offers link - Smooth scrolls directly to Diwali Offers banner */}
              <button
                onClick={() => scrollToSection('diwali-offers')}
                className="text-gray-700 hover:text-[#1D7A34] transition-colors font-medium cursor-pointer"
              >
                Offers
              </button>

              <Link
                href="/about"
                className="text-gray-700 hover:text-[#1D7A34] transition-colors font-medium"
              >
                About
              </Link>
            </nav>
          </div>

          {/* Right Action Items (Location Removed) */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Search */}
            <button
              aria-label="Search"
              className="p-1.5 text-gray-700 hover:text-[#1D7A34] hover:bg-gray-50 rounded-full transition-colors"
            >
              <Search className="w-5 h-5" strokeWidth={1.8} />
            </button>

            {/* Favourites / Wishlist Button */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              aria-label="Favourites"
              className="relative p-1.5 text-gray-700 hover:text-red-500 hover:bg-rose-50 rounded-full transition-colors cursor-pointer"
            >
              <Heart
                className={`w-5 h-5 transition-colors ${
                  totalWishlistCount > 0 ? 'fill-red-500 text-red-500' : ''
                }`}
                strokeWidth={1.8}
              />
              {totalWishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-in zoom-in">
                  {totalWishlistCount}
                </span>
              )}
            </button>

            {/* User Account */}
            <button
              aria-label="Account"
              className="p-1.5 text-gray-700 hover:text-[#1D7A34] hover:bg-gray-50 rounded-full transition-colors"
            >
              <User className="w-5 h-5" strokeWidth={1.8} />
            </button>

            {/* Dynamic Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="Shopping Cart"
              className="relative p-1.5 text-gray-700 hover:text-[#1D7A34] hover:bg-gray-50 rounded-full transition-colors cursor-pointer"
            >
              <ShoppingCart className="w-5 h-5" strokeWidth={1.8} />
              {totalCartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#1D7A34] text-white text-[10px] font-bold flex items-center justify-center animate-in zoom-in">
                  {totalCartCount}
                </span>
              )}
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
                  <p className="text-[11px] text-gray-500">Superfast Doorstep Service</p>
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

        {/* 2. Full Bleed Diwali Offers Banner (Targeted by Navbar Offers button) */}
        <section
          id="diwali-offers"
          className="w-full bg-gradient-to-r from-[#3C0764] via-[#6B21A8]/90 via-45% via-purple-200/50 via-75% to-transparent my-6 sm:my-8 rounded-none shadow-xs scroll-mt-20"
        >
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

          {/* 4. Section: Top Essentials */}
          <section id="top-essentials" className="py-6 sm:py-8 pb-16 scroll-mt-24">
            {/* Header: Green icon, Title, Sparkle \ | /, Subtitle */}
            <div className="flex items-center gap-3.5 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#EAF5EC] flex items-center justify-center text-[#137A2C] shrink-0 shadow-2xs">
                <ShoppingBag className="w-5 h-5 text-[#137A2C]" strokeWidth={2.2} />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#142333] flex items-center gap-1.5 leading-tight">
                  <span>Top Essentials</span>
                  <span className="text-[#137A2C] font-extrabold text-lg select-none ml-0.5">\ | /</span>
                </h2>
                <p className="text-xs sm:text-[13px] text-gray-500 font-normal mt-0.5">
                  Your daily needs, always in stock
                </p>
              </div>
            </div>

            {/* 6 Responsive Grid Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {essentials.map((item) => {
                const isLiked = !!wishlist[item.id];
                const isAdded = addedItem === item.id;

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-gray-100 hover:border-gray-200/90 shadow-2xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-3 sm:p-3.5 flex flex-col justify-between relative group"
                  >
                    {/* Top Row: Badge & Wishlist Heart */}
                    <div className="flex items-center justify-between h-5 mb-1">
                      {item.badge ? (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md inline-flex items-center gap-1 leading-none shadow-2xs ${item.badge.color}`}
                        >
                          <span>{item.badge.icon}</span>
                          <span>{item.badge.text}</span>
                        </span>
                      ) : (
                        <div />
                      )}

                      <button
                        onClick={() => toggleWishlist(item.id)}
                        aria-label="Save to Wishlist"
                        className="p-1 text-gray-300 hover:text-red-500 transition-colors"
                      >
                        <Heart
                          className={`w-4 h-4 transition-transform duration-200 hover:scale-110 ${
                            isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'
                          }`}
                          strokeWidth={2}
                        />
                      </button>
                    </div>

                    {/* Product Image: High Clarity, Centered with soft backdrop */}
                    <div className="w-full h-32 sm:h-36 flex items-center justify-center p-1.5 my-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.img}
                        alt={item.name}
                        className="max-h-full max-w-full object-contain group-hover:scale-108 transition-transform duration-300 select-none drop-shadow-2xs"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="w-full pt-1">
                      <h4 className="text-xs sm:text-[13px] font-bold text-gray-900 leading-snug line-clamp-2 min-h-[34px]">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                        {item.pack}
                      </p>

                      {/* Pricing & Discount */}
                      <div className="flex items-center justify-between mt-2 pt-0.5">
                        <div className="flex items-baseline gap-1">
                          <span className="text-sm sm:text-base font-extrabold text-gray-900">
                            {item.price}
                          </span>
                          <span className="text-[11px] text-gray-400 line-through">
                            {item.originalPrice}
                          </span>
                        </div>
                        <span className="text-[10px] sm:text-[11px] font-bold text-[#137A2C] bg-[#EAF5EC] px-1.5 py-0.5 rounded-md">
                          {item.discount}
                        </span>
                      </div>
                    </div>

                    {/* Full Width Add to Cart Button */}
                    <button
                      onClick={() => handleAddToCart(item.id)}
                      className={`w-full mt-3 py-2 px-3 rounded-xl text-xs sm:text-[13px] font-bold flex items-center justify-center gap-1.5 shadow-2xs hover:shadow transition-all duration-200 active:scale-98 ${
                        isAdded
                          ? 'bg-[#0E5C21] text-white'
                          : 'bg-[#137A2C] hover:bg-[#0F6323] text-white'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-4 h-4 stroke-[2.5]" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4 stroke-[2]" />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </main>

      {/* ================= COMPREHENSIVE SITE FOOTER ================= */}
      <footer className="bg-white border-t border-gray-100 mt-12 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-gray-100">
            {/* Brand Column */}
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#1D7A34] flex items-center justify-center text-white font-bold text-sm">
                  🛍️
                </div>
                <span className="text-xl font-bold tracking-tight text-gray-900">
                  BeMy<span className="text-[#1D7A34]">Shopper</span>
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 max-w-md leading-relaxed">
                Your trusted digital ecosystem connecting local businesses, service providers, and everyday shoppers across Bapatla, Andhra Pradesh, and beyond.
              </p>
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 pt-1">
                <MapPin className="w-3.5 h-3.5 text-[#137A2C]" />
                <span>Bapatla, Andhra Pradesh, India</span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-3">
                Quick Navigation
              </h4>
              <ul className="space-y-2 text-xs text-gray-600">
                <li>
                  <button
                    onClick={() => scrollToSection('categories')}
                    className="hover:text-[#137A2C] transition-colors cursor-pointer"
                  >
                    Shop Categories
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('diwali-offers')}
                    className="hover:text-[#137A2C] transition-colors cursor-pointer"
                  >
                    Diwali Offers
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('top-essentials')}
                    className="hover:text-[#137A2C] transition-colors cursor-pointer"
                  >
                    Top Essentials
                  </button>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="hover:text-[#137A2C] transition-colors"
                  >
                    Founder Profile &amp; About
                  </Link>
                </li>
              </ul>
            </div>

            {/* Leadership & Trust */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-3">
                Leadership
              </h4>
              <div className="space-y-2 text-xs text-gray-600">
                <p className="font-bold text-gray-900">Sivaji</p>
                <p className="text-gray-500">Founder &amp; CEO</p>
                <p className="text-gray-500">Bapatla, Andhra Pradesh</p>
                <div className="pt-2">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#137A2C] bg-[#EBF7EE] px-2.5 py-1 rounded-full border border-[#DCF6E2]">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified Local Platform
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-3">
            <p>© 2026 BeMyShopper. Founded by Sivaji. All rights reserved.</p>
            <p>Made with passion for Bapatla &amp; Andhra Pradesh</p>
          </div>
        </div>
      </footer>

      {/* ================= DYNAMIC SHOPPING CART DRAWER ================= */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsCartOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative z-50 w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-250">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-[#137A2C]" />
                <h3 className="text-base sm:text-lg font-bold text-gray-900">
                  Your Cart ({totalCartCount})
                </h3>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
              {totalCartCount === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12 text-gray-400">
                  <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-3 text-gray-300">
                    <ShoppingCart className="w-8 h-8" />
                  </div>
                  <p className="text-base font-semibold text-gray-800">Your cart is empty</p>
                  <p className="text-xs text-gray-500 mt-1 max-w-xs">
                    Explore daily essentials and festival offers to fill your cart.
                  </p>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      scrollToSection('categories');
                    }}
                    className="mt-4 px-5 py-2 rounded-full bg-[#137A2C] text-white text-xs font-bold hover:bg-[#0F6323] transition-colors cursor-pointer"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                Object.entries(cartItems).map(([id, qty]) => {
                  const item = essentials.find((e) => e.id === id);
                  if (!item) return null;
                  const unitPrice = parseInt(item.price.replace(/[^\d]/g, ''), 10) || 0;

                  return (
                    <div
                      key={id}
                      className="flex items-center gap-3 p-3 rounded-2xl border border-gray-100 bg-[#FAFAFA] hover:bg-white hover:shadow-xs transition-all"
                    >
                      {/* Image */}
                      <div className="w-14 h-14 bg-white rounded-xl border border-gray-100 p-1 flex items-center justify-center shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.img}
                          alt={item.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-gray-900 truncate">
                          {item.name}
                        </h4>
                        <p className="text-[11px] text-gray-400">{item.pack}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-extrabold text-gray-900">
                            ₹{unitPrice * qty}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            (₹{unitPrice} each)
                          </span>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg p-0.5 shrink-0">
                        <button
                          onClick={() => updateCartQuantity(id, -1)}
                          className="w-6 h-6 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded transition-colors cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-gray-900 min-w-4 text-center">
                          {qty}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(id, 1)}
                          className="w-6 h-6 flex items-center justify-center text-[#137A2C] hover:bg-gray-100 rounded transition-colors cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Delete */}
                      <button
                        onClick={() => removeCartItem(id)}
                        className="p-1 text-gray-300 hover:text-red-500 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Summary */}
            {totalCartCount > 0 && (
              <div className="p-4 sm:p-5 border-t border-gray-100 bg-white space-y-3">
                <div className="space-y-1.5 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-900">
                      ₹{Object.entries(cartItems).reduce((sum, [id, qty]) => {
                        const item = essentials.find((e) => e.id === id);
                        if (!item) return sum;
                        const num = parseInt(item.price.replace(/[^\d]/g, ''), 10) || 0;
                        return sum + num * qty;
                      }, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span className="text-[#137A2C] font-semibold">FREE</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-gray-900 pt-2 border-t border-gray-100">
                    <span>Total Amount</span>
                    <span className="text-base text-[#137A2C]">
                      ₹{Object.entries(cartItems).reduce((sum, [id, qty]) => {
                        const item = essentials.find((e) => e.id === id);
                        if (!item) return sum;
                        const num = parseInt(item.price.replace(/[^\d]/g, ''), 10) || 0;
                        return sum + num * qty;
                      }, 0)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    showToast('Order placed successfully! 🎉');
                    setCartItems({});
                    setIsCartOpen(false);
                  }}
                  className="w-full py-3 rounded-full bg-[#137A2C] hover:bg-[#0F6323] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= DYNAMIC WISHLIST / FAVOURITES DRAWER ================= */}
      {isWishlistOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsWishlistOpen(false)}
          />

          <div className="relative z-50 w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-250">
            <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                <h3 className="text-base sm:text-lg font-bold text-gray-900">
                  Your Favourites ({totalWishlistCount})
                </h3>
              </div>
              <button
                onClick={() => setIsWishlistOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
              {totalWishlistCount === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12 text-gray-400">
                  <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center mb-3 text-rose-300">
                    <Heart className="w-8 h-8" />
                  </div>
                  <p className="text-base font-semibold text-gray-800">No favourites yet</p>
                  <p className="text-xs text-gray-500 mt-1 max-w-xs">
                    Click the heart icon on any product to save it to your favourites.
                  </p>
                </div>
              ) : (
                Object.keys(wishlist)
                  .filter((id) => wishlist[id])
                  .map((id) => {
                    const item = essentials.find((e) => e.id === id);
                    if (!item) return null;

                    return (
                      <div
                        key={id}
                        className="flex items-center gap-3 p-3 rounded-2xl border border-gray-100 bg-[#FAFAFA] hover:bg-white hover:shadow-xs transition-all"
                      >
                        <div className="w-14 h-14 bg-white rounded-xl border border-gray-100 p-1 flex items-center justify-center shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.img}
                            alt={item.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-gray-900 truncate">
                            {item.name}
                          </h4>
                          <p className="text-[11px] text-gray-400">{item.pack}</p>
                          <span className="text-xs font-extrabold text-gray-900 mt-1 inline-block">
                            {item.price}
                          </span>
                        </div>

                        <button
                          onClick={() => handleAddToCart(id)}
                          className="px-3 py-1.5 rounded-lg bg-[#137A2C] text-white text-xs font-bold hover:bg-[#0F6323] transition-colors shrink-0 cursor-pointer"
                        >
                          Add
                        </button>

                        <button
                          onClick={() => toggleWishlist(id)}
                          className="p-1 text-red-500 hover:text-gray-400 transition-colors cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= FLOATING TOAST NOTIFICATION ================= */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900/95 text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-full shadow-2xl backdrop-blur-md flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
