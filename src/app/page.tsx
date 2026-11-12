'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Search,
  User,
  ShoppingCart,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
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
  Clock,
  Calendar,
  MessageSquare,
  Phone,
} from 'lucide-react';
import { Hero } from '../components/Hero';
import { CarRentalHeroBanner } from '../components/CarRentalHeroBanner';

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

  // Rental Cars state
  const [isRentalModalOpen, setIsRentalModalOpen] = useState(false);
  const [rentalCarType, setRentalCarType] = useState<'5-seater' | '7-seater'>('5-seater');
  const [rentalDuration, setRentalDuration] = useState<'6hr' | '12hr' | '24hr'>('12hr');
  const [rentalName, setRentalName] = useState('');
  const [rentalPhone, setRentalPhone] = useState('');
  const [rentalDate, setRentalDate] = useState('');
  const [rentalLocation, setRentalLocation] = useState('');
  const [rentalSubmitted, setRentalSubmitted] = useState(false);

  const dailyScrollRef = useRef<HTMLDivElement>(null);

  const scrollDaily = (direction: 'left' | 'right') => {
    if (dailyScrollRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      dailyScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

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
    const item = allProducts.find((e) => e.id === id);
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
      const item = allProducts.find((e) => e.id === id);
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

  const dailyEssentials = [
    {
      id: 'daily-nandini-ghee',
      name: 'Nandini Pure Cow Ghee',
      pack: '500 ml',
      img: '/images/prod-nandini-ghee.png',
      price: '₹289',
      originalPrice: '₹320',
      discount: 'Save 10%',
      badge: { text: 'Trending', icon: '🔥', color: 'bg-[#FED7AA] text-[#C2410C]' },
    },
    {
      id: 'daily-rice',
      name: 'Premium Sona Masoori Rice',
      pack: '5 kg',
      img: '/images/prod-rice-5kg.png',
      price: '₹329',
      originalPrice: '₹349',
      discount: 'Save 6%',
      badge: { text: 'Daily Staple', icon: '🍚', color: 'bg-emerald-600 text-white' },
    },
    {
      id: 'daily-fruits-veg',
      name: 'Farm Fresh Fruits & Vegetables',
      pack: '1 kg Assorted Basket',
      img: '/images/cat-prod-fruits-veg.png',
      price: '₹149',
      originalPrice: '₹180',
      discount: 'Save 17%',
      badge: { text: 'Farm Fresh', icon: '🌿', color: 'bg-[#48BB78] text-white' },
    },
    {
      id: 'daily-red-label',
      name: 'Brooke Bond Red Label Tea',
      pack: '500 g',
      img: '/images/prod-red-label.png',
      price: '₹299',
      originalPrice: '₹335',
      discount: 'Save 11%',
      badge: { text: 'Bestseller', icon: '👑', color: 'bg-[#48BB78] text-white' },
    },
    {
      id: 'daily-pulses',
      name: 'Daily Kitchen Grains & Toor Dal',
      pack: '1 kg Pack',
      img: '/images/cat-prod-groceries.png',
      price: '₹139',
      originalPrice: '₹165',
      discount: 'Save 16%',
      badge: { text: 'Pure & Clean', icon: '🌾', color: 'bg-amber-500 text-white' },
    },
    {
      id: 'daily-maggi',
      name: 'Maggi 2-Minute Masala Noodles',
      pack: '420 g (Pack of 4)',
      img: '/images/prod-maggi.png',
      price: '₹115',
      originalPrice: '₹125',
      discount: 'Save 8%',
      badge: { text: 'Quick Snack', icon: '⚡', color: 'bg-yellow-400 text-yellow-950' },
    },
    {
      id: 'daily-horlicks',
      name: 'Horlicks Health Drink',
      pack: '500 g',
      img: '/images/prod-horlicks.png',
      price: '₹329',
      originalPrice: '₹360',
      discount: 'Save 9%',
      badge: null,
    },
    {
      id: 'daily-surf-excel',
      name: 'Surf Excel Detergent Powder',
      pack: '1 kg',
      img: '/images/prod-surf-excel.png',
      price: '₹349',
      originalPrice: '₹399',
      discount: 'Save 13%',
      badge: { text: 'Bestseller', icon: '👑', color: 'bg-[#48BB78] text-white' },
    },
    {
      id: 'daily-vim',
      name: 'Vim Dishwash Liquid Lemon',
      pack: '750 ml',
      img: '/images/prod-vim-dishwash.png',
      price: '₹135',
      originalPrice: '₹145',
      discount: 'Save 7%',
      badge: null,
    },
    {
      id: 'daily-colgate',
      name: 'Colgate Strong Teeth Toothpaste',
      pack: '150 g',
      img: '/images/prod-colgate.png',
      price: '₹129',
      originalPrice: '₹145',
      discount: 'Save 11%',
      badge: null,
    },
    {
      id: 'daily-dove',
      name: 'Dove Beauty Bathing Bar',
      pack: '125 g (Pack of 3)',
      img: '/images/prod-dove-soap.png',
      price: '₹165',
      originalPrice: '₹195',
      discount: 'Save 15%',
      badge: null,
    },
    {
      id: 'daily-ambica-agarbatti',
      name: 'Ambica Durbar Bathi (Agarbathi)',
      pack: 'Pack of 5',
      img: '/images/prod-ambica-agarbatti.png',
      price: '₹89',
      originalPrice: '₹99',
      discount: 'Save 10%',
      badge: { text: 'Sacred Pooja', icon: '🪔', color: 'bg-orange-500 text-white' },
    },
    {
      id: 'daily-harpic',
      name: 'Harpic Power Plus Cleaner',
      pack: '1 L',
      img: '/images/prod-harpic.png',
      price: '₹189',
      originalPrice: '₹210',
      discount: 'Save 10%',
      badge: { text: 'Trending', icon: '🔥', color: 'bg-[#FED7AA] text-[#C2410C]' },
    },
    {
      id: 'daily-toilet-tissue',
      name: 'Toilet Tissue Roll (3 Ply)',
      pack: 'Pack of 4',
      img: '/images/prod-toilet-tissue.png',
      price: '₹149',
      originalPrice: '₹165',
      discount: 'Save 10%',
      badge: null,
    },
  ];

  const allProducts = [...essentials, ...dailyEssentials];

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans antialiased">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-2xs">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-16 sm:h-18 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center py-1 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo.png"
                alt="Be My Shopper"
                className="h-9 sm:h-10 w-auto object-contain block shrink-0"
                style={{ height: '38px', width: 'auto', maxHeight: '38px' }}
              />
            </Link>

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

              {/* Top Essentials link */}
              <button
                onClick={() => scrollToSection('top-essentials')}
                className="text-gray-700 hover:text-[#1D7A34] transition-colors font-medium cursor-pointer"
              >
                Essentials
              </button>

              {/* Rental Cars link */}
              <button
                onClick={() => scrollToSection('rental-cars')}
                className="text-gray-700 hover:text-[#1D7A34] transition-colors font-medium cursor-pointer inline-flex items-center gap-1.5"
              >
                <span>Rental Cars</span>
                <span className="text-[10px] bg-emerald-100 text-[#137A2C] font-extrabold px-1.5 py-0.2 rounded-full">
                  Bapatla
                </span>
              </button>

              {/* Offers link */}
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
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          
          {/* 1. Value Proposition Features Strip */}
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

          {/* ================= 1. SHOP BY CATEGORY (ON TOP) ================= */}
          <section id="categories" className="py-6 sm:py-8 scroll-mt-24">
            {/* Header: Shop by Category with Sparkle \ | / and Pill Button */}
            <div className="flex items-center justify-between mb-5 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#142333] flex items-center gap-1.5 tracking-tight">
                <span>Shop by Category</span>
                <span className="text-amber-500 font-extrabold text-xl select-none align-middle tracking-wider ml-1">
                  \ | /
                </span>
              </h2>
              <button
                onClick={() => scrollToSection('categories')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#EAF5EC] hover:bg-[#D8EEDF] text-[#137A2C] text-xs sm:text-[13px] font-semibold transition-colors shadow-2xs cursor-pointer"
              >
                <span>View All Categories</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#137A2C]" />
              </button>
            </div>

            {/* 10 Category Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2.5 sm:gap-3">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className={`group relative rounded-2xl bg-gradient-to-b ${cat.bgGradient} border ${cat.borderColor} p-2 flex flex-col items-center justify-between h-[155px] sm:h-[165px] shadow-2xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden`}
                >
                  <div className="w-full h-24 sm:h-26 flex items-center justify-center pt-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={cat.prodImg}
                      alt={cat.name.replace('\n', ' ')}
                      className="max-h-[75px] max-w-[85px] object-contain group-hover:scale-108 transition-transform duration-300 select-none drop-shadow-2xs"
                      style={{ maxHeight: '75px', maxWidth: '85px', objectFit: 'contain' }}
                    />
                  </div>

                  <div className="w-full h-9 pb-1 flex items-center justify-center">
                    <span className="text-[11px] sm:text-[12px] font-bold text-gray-900 leading-[1.2] text-center whitespace-pre-line tracking-tight">
                      {cat.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ================= 2. TOP ESSENTIALS (NEXT) ================= */}
          <section id="top-essentials" className="py-6 sm:py-8 pb-10 scroll-mt-24">
            {/* Header: Green icon, Title, Sparkle \ | /, Subtitle */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#EAF5EC] flex items-center justify-center text-[#137A2C] shrink-0 shadow-2xs">
                  <ShoppingBag className="w-5 h-5 text-[#137A2C]" strokeWidth={2.2} />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#142333] flex items-center gap-1.5 leading-tight">
                    <span>Top Essentials</span>
                    <span className="text-[#137A2C] font-extrabold text-lg select-none ml-0.5">\ | /</span>
                  </h2>
                  <p className="text-xs sm:text-[13px] text-gray-500 font-normal mt-0.5">
                    Your daily needs, always in stock &amp; delivered fresh
                  </p>
                </div>
              </div>

              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#137A2C] text-xs font-bold border border-emerald-100">
                <span>🔥 In High Demand</span>
              </span>
            </div>

            {/* 12 Responsive Grid Cards */}
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
                        className="p-1 text-gray-300 hover:text-red-500 transition-colors cursor-pointer"
                      >
                        <Heart
                          className={`w-4 h-4 transition-transform duration-200 hover:scale-110 ${
                            isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'
                          }`}
                          strokeWidth={2}
                        />
                      </button>
                    </div>

                    {/* Product Image */}
                    <div className="w-full h-28 sm:h-32 flex items-center justify-center p-1 my-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.img}
                        alt={item.name}
                        className="max-h-[110px] sm:max-h-[120px] max-w-full object-contain group-hover:scale-108 transition-transform duration-300 select-none drop-shadow-2xs"
                        style={{ maxHeight: '115px', maxWidth: '100%', objectFit: 'contain' }}
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
                      className={`w-full mt-3 py-2 px-3 rounded-xl text-xs sm:text-[13px] font-bold flex items-center justify-center gap-1.5 shadow-2xs hover:shadow transition-all duration-200 active:scale-98 cursor-pointer ${
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

        {/* ================= 3. THE SECTION UPLOADED BY USER (HERO CAROUSEL: "ALL YOUR DAILY ESSENTIALS IN ONE PLACE") ================= */}
        <section id="daily-essentials" className="w-full my-4 sm:my-6 scroll-mt-20">
          <Hero />
        </section>

        {/* ================= 4. RENTAL CARS IN BAPATLA ================= */}
        <section id="rental-cars" className="w-full my-6 sm:my-8 scroll-mt-20">
          {/* Full-Width Premium Orange Hero Banner */}
          <CarRentalHeroBanner
            onExploreCars={() => {
              const el = document.getElementById('rental-tariff-plans');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
            onOpenBookingModal={() => {
              setRentalCarType('5-seater');
              setIsRentalModalOpen(true);
            }}
          />

          {/* Pricing Tariffs & Trust Pillars (Accessible via 'Explore Cars') */}
          <div id="rental-tariff-plans" className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 sm:py-12 scroll-mt-24">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
              <div>
                <span className="text-xs font-bold text-[#137A2C] uppercase tracking-wider block">
                  Transparent Hourly &amp; Daily Pricing
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-gray-900 mt-0.5">
                  Choose Your Vehicle &amp; Rental Plan
                </h3>
              </div>
              <button
                onClick={() => {
                  setRentalCarType('5-seater');
                  setIsRentalModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#137A2C] hover:bg-[#0E5C21] text-white text-xs font-bold transition-all shadow-xs cursor-pointer w-fit"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book a Car Online</span>
              </button>
            </div>

            {/* Pricing & Vehicle Category Cards (Two Column Grid) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8">
              {/* CARD 1: ANY 5 SEATER */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between">
                <div>
                  {/* Vehicle Header & Image */}
                  <div className="p-5 sm:p-6 pb-2">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold">
                        Compact SUV &amp; Hatchback
                      </span>
                    <span className="text-xs font-semibold text-gray-500">
                      Up to 5 Passengers
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-[#142333]">Any 5 Seater</h3>
                  <p className="text-xs text-gray-500 mt-0.5 font-normal">
                    Mahindra Thar, Maruti Fronx, Baleno, Swift &amp; more
                  </p>
                </div>

                {/* Car Packshot Image */}
                <div className="w-full h-48 sm:h-56 bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/car-5-seater.jpg"
                    alt="Any 5 Seater Car Rental in Bapatla"
                    className="max-h-full max-w-full object-contain hover:scale-105 transition-transform duration-300 drop-shadow-md"
                  />
                </div>

                {/* Tariff Plans Table */}
                <div className="p-5 sm:p-6 pt-2">
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">
                    Rental Tariff Plans
                  </div>

                  <div className="space-y-2.5">
                    {/* 6 Hours */}
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 hover:bg-emerald-50/50 border border-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-white border border-gray-200/70 flex items-center justify-center text-gray-700">
                          <Clock className="w-4 h-4 text-[#137A2C]" />
                        </div>
                        <div>
                          <span className="text-sm font-bold text-gray-900 block leading-tight">6 Hours</span>
                          <span className="text-[11px] text-gray-500">Short trips &amp; local errands</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-black text-[#137A2C] block leading-tight">₹900</span>
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                          120 KM Included
                        </span>
                      </div>
                    </div>

                    {/* 12 Hours */}
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50/40 border border-emerald-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-white border border-emerald-200 flex items-center justify-center text-gray-700">
                          <Clock className="w-4 h-4 text-[#137A2C]" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold text-gray-900 leading-tight">12 Hours</span>
                            <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-emerald-600 text-white">Popular</span>
                          </div>
                          <span className="text-[11px] text-gray-500">Day outings &amp; beach tours</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-black text-[#137A2C] block leading-tight">₹1,490</span>
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                          200 KM Included
                        </span>
                      </div>
                    </div>

                    {/* 24 Hours */}
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 hover:bg-emerald-50/50 border border-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-white border border-gray-200/70 flex items-center justify-center text-gray-700">
                          <Clock className="w-4 h-4 text-[#137A2C]" />
                        </div>
                        <div>
                          <span className="text-sm font-bold text-gray-900 block leading-tight">24 Hours</span>
                          <span className="text-[11px] text-gray-500">Full day &amp; outstation travel</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-black text-[#137A2C] block leading-tight">₹2,490</span>
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                          400 KM Included
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-5 sm:p-6 pt-0 flex gap-3">
                <button
                  onClick={() => {
                    setRentalCarType('5-seater');
                    setIsRentalModalOpen(true);
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#137A2C] hover:bg-[#0E5C21] text-white font-bold text-xs sm:text-sm text-center shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer"
                >
                  Book 5-Seater Now
                </button>
                <a
                  href="https://wa.me/919999999999?text=Hi%20BeMyShopper,%20I%20want%20to%20rent%20a%205-Seater%20car%20in%20Bapatla"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs sm:text-sm transition-all text-center"
                >
                  WhatsApp
                </a>
              </div>
            </div>

            {/* CARD 2: ANY 7 SEATER */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between">
              <div>
                {/* Vehicle Header & Image */}
                <div className="p-5 sm:p-6 pb-2">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-900 border border-purple-200 text-xs font-bold">
                      Luxury Family MPV
                    </span>
                    <span className="text-xs font-semibold text-gray-500">
                      Up to 7-8 Passengers
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-[#142333]">Any 7 Seater</h3>
                  <p className="text-xs text-gray-500 mt-0.5 font-normal">
                    Toyota Innova Hycross, Maruti Ertiga, Carens &amp; more
                  </p>
                </div>

                {/* Car Packshot Image */}
                <div className="w-full h-48 sm:h-56 bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/car-7-seater.jpg"
                    alt="Any 7 Seater Car Rental in Bapatla"
                    className="max-h-full max-w-full object-contain hover:scale-105 transition-transform duration-300 drop-shadow-md"
                  />
                </div>

                {/* Tariff Plans Table */}
                <div className="p-5 sm:p-6 pt-2">
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">
                    Rental Tariff Plans
                  </div>

                  <div className="space-y-2.5">
                    {/* 6 Hours */}
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 hover:bg-purple-50/50 border border-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-white border border-gray-200/70 flex items-center justify-center text-gray-700">
                          <Clock className="w-4 h-4 text-purple-700" />
                        </div>
                        <div>
                          <span className="text-sm font-bold text-gray-900 block leading-tight">6 Hours</span>
                          <span className="text-[11px] text-gray-500">Family temple visits &amp; dinners</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-black text-purple-900 block leading-tight">₹1,800</span>
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                          120 KM Included
                        </span>
                      </div>
                    </div>

                    {/* 12 Hours */}
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-purple-50/40 border border-purple-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-white border border-purple-200 flex items-center justify-center text-gray-700">
                          <Clock className="w-4 h-4 text-purple-700" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold text-gray-900 leading-tight">12 Hours</span>
                            <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-purple-700 text-white">Popular</span>
                          </div>
                          <span className="text-[11px] text-gray-500">Full day family &amp; beach trip</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-black text-purple-900 block leading-tight">₹2,490</span>
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                          200 KM Included
                        </span>
                      </div>
                    </div>

                    {/* 24 Hours */}
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 hover:bg-purple-50/50 border border-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-white border border-gray-200/70 flex items-center justify-center text-gray-700">
                          <Clock className="w-4 h-4 text-purple-700" />
                        </div>
                        <div>
                          <span className="text-sm font-bold text-gray-900 block leading-tight">24 Hours</span>
                          <span className="text-[11px] text-gray-500">Weekend getaway &amp; outstation</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-black text-purple-900 block leading-tight">₹3,490</span>
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                          400 KM Included
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-5 sm:p-6 pt-0 flex gap-3">
                <button
                  onClick={() => {
                    setRentalCarType('7-seater');
                    setIsRentalModalOpen(true);
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-purple-900 hover:bg-purple-950 text-white font-bold text-xs sm:text-sm text-center shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer"
                >
                  Book 7-Seater Now
                </button>
                <a
                  href="https://wa.me/919999999999?text=Hi%20BeMyShopper,%20I%20want%20to%20rent%20a%207-Seater%20car%20in%20Bapatla"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs sm:text-sm transition-all text-center"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* 4 Trust Pillars (Directly from Brochure) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 sm:p-6 rounded-3xl bg-[#F7FAF8] border border-emerald-100">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-[#137A2C] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-[#137A2C]" />
              </div>
              <div>
                <h4 className="text-xs sm:text-[13px] font-bold text-gray-900">Safe &amp; Reliable</h4>
                <p className="text-[11px] text-gray-500 mt-0.5">GPS enabled &amp; full insurance</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <Car className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <h4 className="text-xs sm:text-[13px] font-bold text-gray-900">Well Maintained</h4>
                <p className="text-[11px] text-gray-500 mt-0.5">Spotless &amp; sanitised cars</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <User className="w-5 h-5 text-blue-700" />
              </div>
              <div>
                <h4 className="text-xs sm:text-[13px] font-bold text-gray-900">Professional Service</h4>
                <p className="text-[11px] text-gray-500 mt-0.5">Doorstep delivery in Bapatla</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-purple-700" />
              </div>
              <div>
                <h4 className="text-xs sm:text-[13px] font-bold text-gray-900">Flexible Rental Plans</h4>
                <p className="text-[11px] text-gray-500 mt-0.5">6h, 12h, 24h &amp; outstation</p>
              </div>
            </div>
          </div>
        </div>
      </section>

        {/* ================= 5. DIWALI OFFERS (NEXT / AT LAST) ================= */}
        <section
          id="diwali-offers"
          className="w-full bg-gradient-to-r from-[#24033E] via-[#3B0763] via-40% via-[#5B108E] via-75% to-[#24033E] my-8 sm:my-10 rounded-none shadow-xl scroll-mt-20 relative overflow-hidden border-y-2 border-amber-400/30"
        >
          {/* Decorative Festive Background Glows & Pattern */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#F59E0B_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10 sm:py-14 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              {/* Left Side: Copy, Badges, Highlights & CTA */}
              <div className="lg:col-span-7 flex flex-col items-start justify-center text-left space-y-4 sm:space-y-5">
                {/* Festive Dhamaka Tag */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-400/25 to-yellow-300/15 border border-amber-400/40 text-amber-300 text-xs sm:text-[13px] font-black tracking-wide shadow-sm backdrop-blur-xs">
                  <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                  <span className="uppercase tracking-wider">Diwali Mahotsav Dhamaka Offers</span>
                </div>

                {/* Main Headline */}
                <h3 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-white leading-[1.15] tracking-tight">
                  Celebrate &amp; Save Big with{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 drop-shadow-sm">
                    Diwali Offers!
                  </span>
                </h3>

                {/* Discount Banner Strip */}
                <div className="inline-flex flex-wrap items-center gap-2 px-4 py-2 rounded-xl bg-amber-400/15 border border-amber-300/30 text-amber-200">
                  <span className="text-xl sm:text-2xl font-black text-amber-300 tracking-tight">
                    UP TO 30% - 50% OFF
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-purple-100">
                    on Pooja Essentials, Groceries &amp; Sweets
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm sm:text-base text-purple-100/90 leading-relaxed max-w-xl font-normal">
                  Stock up your festive home with pure ingredients, sacred puja essentials, fragrant agarbathi, and fresh groceries at guaranteed festival prices in Bapatla.
                </p>

                {/* 4 Client-Attractive Benefit Pills */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 w-full max-w-xl pt-1">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15 text-white text-xs font-semibold">
                    <span className="text-amber-300 text-sm">⚡</span>
                    <span>30-Min Fast Delivery</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15 text-white text-xs font-semibold">
                    <span className="text-amber-300 text-sm">🪔</span>
                    <span>Free Diya on ₹499+</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15 text-white text-xs font-semibold col-span-2 sm:col-span-1">
                    <span className="text-amber-300 text-sm">✨</span>
                    <span>Extra ₹100 1st Order</span>
                  </div>
                </div>

                {/* Featured Festive Deal Highlights Pills */}
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                  <span className="text-purple-200/80 font-bold uppercase tracking-wider text-[11px]">
                    Hot Deals:
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white/10 text-amber-200 font-medium border border-white/10">
                    🪔 Nandini Ghee @ ₹289
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white/10 text-amber-200 font-medium border border-white/10">
                    ✨ Ambica Agarbathi @ ₹79
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white/10 text-amber-200 font-medium border border-white/10">
                    🌾 Sona Masoori Rice @ ₹299
                  </span>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    href="/offers"
                    className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-purple-950 font-black text-sm sm:text-base shadow-lg hover:shadow-amber-400/25 hover:scale-105 active:scale-98 transition-all duration-200"
                  >
                    <span>Shop Diwali Deals Now</span>
                    <ArrowRight className="w-4 h-4 text-purple-950 stroke-[2.5]" />
                  </Link>

                  <Link
                    href="/offers"
                    className="inline-flex items-center gap-1.5 px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm backdrop-blur-xs border border-white/20 transition-all"
                  >
                    <span>View All 12+ Deals</span>
                  </Link>
                </div>
              </div>

              {/* Right Side: High-Clarity Festive Packshot with Glow Effect */}
              <div className="lg:col-span-5 flex items-center justify-center relative">
                <div className="relative w-full max-w-[460px] flex items-center justify-center group">
                  <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-2xl group-hover:bg-amber-400/30 transition-all" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/diwali-offer-products.png"
                    alt="Diwali Grocery Offers & Up to 30% OFF"
                    className="relative z-10 w-full max-w-[440px] h-auto object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ================= COMPREHENSIVE SITE FOOTER ================= */}
      <footer className="bg-white border-t border-gray-100 mt-12 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-gray-100">
            {/* Brand Column */}
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/logo.png"
                  alt="BeMyShopper"
                  className="h-8 w-auto object-contain block shrink-0"
                  style={{ height: '32px', width: 'auto', maxHeight: '32px' }}
                />
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
                    onClick={() => scrollToSection('top-essentials')}
                    className="hover:text-[#137A2C] transition-colors cursor-pointer"
                  >
                    Top Essentials
                  </button>
                </li>
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
                    onClick={() => scrollToSection('daily-essentials')}
                    className="hover:text-[#137A2C] transition-colors cursor-pointer"
                  >
                    Daily Essentials
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('rental-cars')}
                    className="hover:text-[#137A2C] transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Rental Cars (Bapatla)</span>
                    <span className="text-[9px] bg-emerald-100 text-[#137A2C] font-bold px-1 rounded">New</span>
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
                  const item = allProducts.find((e) => e.id === id);
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
                        const item = allProducts.find((e) => e.id === id);
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
                        const item = allProducts.find((e) => e.id === id);
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
                    const item = allProducts.find((e) => e.id === id);
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

      {/* ================= RENTAL CAR BOOKING MODAL ================= */}
      {isRentalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative border border-gray-100 animate-in zoom-in-95 duration-200">
            <button
              onClick={() => {
                setIsRentalModalOpen(false);
                setRentalSubmitted(false);
              }}
              className="absolute top-5 right-5 p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {!rentalSubmitted ? (
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#137A2C] text-xs font-bold mb-2">
                  <Car className="w-3.5 h-3.5" />
                  <span>Bapatla Car Rental Booking</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-[#142333]">
                  Book Your Rental Car
                </h3>
                <p className="text-xs text-gray-500 mt-1 mb-5">
                  Select your vehicle, duration, and let Sivaji &amp; the BeMyShopper team arrange your doorstep delivery in Bapatla.
                </p>

                {/* Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setRentalSubmitted(true);
                  }}
                  className="space-y-4 text-xs"
                >
                  {/* Select Vehicle Category */}
                  <div>
                    <label className="font-bold text-gray-800 block mb-1.5">
                      Select Car Category
                    </label>
                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setRentalCarType('5-seater')}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                          rentalCarType === '5-seater'
                            ? 'border-[#137A2C] bg-emerald-50/50 shadow-xs'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-bold text-sm text-gray-900">Any 5 Seater</div>
                        <div className="text-[11px] text-gray-500 mt-0.5">Thar / Fronx / Baleno</div>
                        <div className="text-xs font-black text-[#137A2C] mt-1">From ₹900</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setRentalCarType('7-seater')}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                          rentalCarType === '7-seater'
                            ? 'border-purple-600 bg-purple-50/50 shadow-xs'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-bold text-sm text-gray-900">Any 7 Seater</div>
                        <div className="text-[11px] text-gray-500 mt-0.5">Innova Hycross / Ertiga</div>
                        <div className="text-xs font-black text-purple-700 mt-1">From ₹1,800</div>
                      </button>
                    </div>
                  </div>

                  {/* Duration Plan */}
                  <div>
                    <label className="font-bold text-gray-800 block mb-1.5">
                      Select Duration Plan
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setRentalDuration('6hr')}
                        className={`py-2 px-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          rentalDuration === '6hr'
                            ? 'border-[#137A2C] bg-emerald-50 text-[#137A2C] font-bold'
                            : 'border-gray-200 text-gray-700 hover:border-gray-300 font-medium'
                        }`}
                      >
                        <div>6 Hours</div>
                        <div className="text-[10px] text-gray-500">120 KM</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setRentalDuration('12hr')}
                        className={`py-2 px-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          rentalDuration === '12hr'
                            ? 'border-[#137A2C] bg-emerald-50 text-[#137A2C] font-bold'
                            : 'border-gray-200 text-gray-700 hover:border-gray-300 font-medium'
                        }`}
                      >
                        <div>12 Hours</div>
                        <div className="text-[10px] text-gray-500">200 KM</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setRentalDuration('24hr')}
                        className={`py-2 px-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          rentalDuration === '24hr'
                            ? 'border-[#137A2C] bg-emerald-50 text-[#137A2C] font-bold'
                            : 'border-gray-200 text-gray-700 hover:border-gray-300 font-medium'
                        }`}
                      >
                        <div>24 Hours</div>
                        <div className="text-[10px] text-gray-500">400 KM</div>
                      </button>
                    </div>
                  </div>

                  {/* Name and Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-gray-800 block mb-1">Your Name</label>
                      <input
                        type="text"
                        required
                        value={rentalName}
                        onChange={(e) => setRentalName(e.target.value)}
                        placeholder="e.g. Sivaji / Suresh"
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#137A2C] text-xs"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-gray-800 block mb-1">Phone Number</label>
                      <input
                        type="tel"
                        required
                        value={rentalPhone}
                        onChange={(e) => setRentalPhone(e.target.value)}
                        placeholder="10-digit mobile number"
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#137A2C] text-xs"
                      />
                    </div>
                  </div>

                  {/* Pickup Date & Location */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-gray-800 block mb-1">Pickup Date &amp; Time</label>
                      <input
                        type="text"
                        required
                        value={rentalDate}
                        onChange={(e) => setRentalDate(e.target.value)}
                        placeholder="e.g. Tomorrow 9:00 AM"
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#137A2C] text-xs"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-gray-800 block mb-1">Pickup Location in Bapatla</label>
                      <input
                        type="text"
                        required
                        value={rentalLocation}
                        onChange={(e) => setRentalLocation(e.target.value)}
                        placeholder="e.g. Railway Station / Town"
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#137A2C] text-xs"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 rounded-2xl bg-[#137A2C] hover:bg-[#0E5C21] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>Confirm &amp; Reach Out on WhatsApp</span>
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-[#137A2C] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8 text-[#137A2C]" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900">Enquiry Recorded!</h3>
                  <p className="text-xs text-gray-600 mt-1 max-w-sm mx-auto">
                    Thank you <strong>{rentalName || 'Customer'}</strong>. Your request for a{' '}
                    <strong>{rentalCarType === '5-seater' ? '5-Seater' : '7-Seater'}</strong> car ({rentalDuration}) has been recorded.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-xs text-gray-700 text-left max-w-sm mx-auto">
                  <div><strong>Pickup:</strong> {rentalDate || 'As requested'}</div>
                  <div><strong>Location:</strong> {rentalLocation || 'Bapatla'}</div>
                  <div><strong>Phone:</strong> {rentalPhone}</div>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <a
                    href={`https://wa.me/919999999999?text=${encodeURIComponent(
                      `Hi BeMyShopper, I would like to book a ${rentalCarType === '5-seater' ? '5-Seater' : '7-Seater'} car for ${rentalDuration}. Name: ${rentalName}, Phone: ${rentalPhone}, Date: ${rentalDate}, Location: ${rentalLocation}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs flex items-center justify-center gap-2 shadow cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Send Details to WhatsApp Directly</span>
                  </a>

                  <button
                    onClick={() => {
                      setIsRentalModalOpen(false);
                      setRentalSubmitted(false);
                    }}
                    className="w-full py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
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
