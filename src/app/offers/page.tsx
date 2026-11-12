'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowLeft,
  ArrowRight,
  ShoppingCart,
  Heart,
  Plus,
  Minus,
  Check,
  Flame,
  Tag,
  ShieldCheck,
  Truck,
  MapPin,
  X,
  Trash2,
} from 'lucide-react';

interface OfferProduct {
  id: string;
  name: string;
  category: 'pooja' | 'groceries' | 'cleaning' | 'all';
  pack: string;
  price: string;
  rawPrice: number;
  originalPrice: string;
  savePercent: string;
  tag: string;
  tagColor: string;
  img: string;
}

const diwaliOffers: OfferProduct[] = [
  {
    id: 'diwali-ghee',
    name: 'Nandini Pure Cow Ghee',
    category: 'pooja',
    pack: '500 ml',
    price: '₹289',
    rawPrice: 289,
    originalPrice: '₹340',
    savePercent: '15% OFF',
    tag: '🪔 Deepam Special',
    tagColor: 'bg-amber-100 text-amber-800 border-amber-200',
    img: '/images/prod-nandini-ghee.png',
  },
  {
    id: 'diwali-agarbatti',
    name: 'Ambica Durbar Bathi Agarbathi',
    category: 'pooja',
    pack: 'Pack of 5',
    price: '₹79',
    rawPrice: 79,
    originalPrice: '₹100',
    savePercent: '21% OFF',
    tag: '✨ Sacred Aroma',
    tagColor: 'bg-orange-100 text-orange-800 border-orange-200',
    img: '/images/prod-ambica-agarbatti.png',
  },
  {
    id: 'diwali-rice',
    name: 'Premium Sona Masoori Rice',
    category: 'groceries',
    pack: '5 kg',
    price: '₹299',
    rawPrice: 299,
    originalPrice: '₹360',
    savePercent: '17% OFF',
    tag: '🌾 Festive Feast',
    tagColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    img: '/images/prod-rice-5kg.png',
  },
  {
    id: 'diwali-tea',
    name: 'Brooke Bond Red Label Tea',
    category: 'groceries',
    pack: '500 g',
    price: '₹269',
    rawPrice: 269,
    originalPrice: '₹335',
    savePercent: '20% OFF',
    tag: '☕ Family Gatherings',
    tagColor: 'bg-rose-100 text-rose-800 border-rose-200',
    img: '/images/prod-red-label.png',
  },
  {
    id: 'diwali-surf',
    name: 'Surf Excel Quick Wash Detergent',
    category: 'cleaning',
    pack: '1 kg',
    price: '₹299',
    rawPrice: 299,
    originalPrice: '₹399',
    savePercent: '25% OFF',
    tag: '👑 Mega Saver',
    tagColor: 'bg-blue-100 text-blue-800 border-blue-200',
    img: '/images/prod-surf-excel.png',
  },
  {
    id: 'diwali-horlicks',
    name: 'Horlicks Classic Malt Health Drink',
    category: 'groceries',
    pack: '500 g',
    price: '₹289',
    rawPrice: 289,
    originalPrice: '₹360',
    savePercent: '20% OFF',
    tag: '🥛 Nutrition Deal',
    tagColor: 'bg-sky-100 text-sky-800 border-sky-200',
    img: '/images/prod-horlicks.png',
  },
  {
    id: 'diwali-maggi',
    name: 'Maggi 2-Minute Masala Noodles',
    category: 'groceries',
    pack: '420 g (Pack of 4)',
    price: '₹99',
    rawPrice: 99,
    originalPrice: '₹125',
    savePercent: '21% OFF',
    tag: '🍜 Festive Snacking',
    tagColor: 'bg-amber-100 text-amber-800 border-amber-200',
    img: '/images/prod-maggi.png',
  },
  {
    id: 'diwali-dove',
    name: 'Dove Beauty Moisture Bathing Bar',
    category: 'cleaning',
    pack: '125 g (Pack of 3)',
    price: '₹149',
    rawPrice: 149,
    originalPrice: '₹195',
    savePercent: '24% OFF',
    tag: '🌸 Festive Glow',
    tagColor: 'bg-pink-100 text-pink-800 border-pink-200',
    img: '/images/prod-dove-soap.png',
  },
  {
    id: 'diwali-vim',
    name: 'Vim Dishwash Gel Liquid',
    category: 'cleaning',
    pack: '750 ml',
    price: '₹119',
    rawPrice: 119,
    originalPrice: '₹145',
    savePercent: '18% OFF',
    tag: '🍋 Sparkle Clean',
    tagColor: 'bg-lime-100 text-lime-800 border-lime-200',
    img: '/images/prod-vim-dishwash.png',
  },
  {
    id: 'diwali-colgate',
    name: 'Colgate Strong Teeth Toothpaste',
    category: 'cleaning',
    pack: '150 g',
    price: '₹109',
    rawPrice: 109,
    originalPrice: '₹145',
    savePercent: '25% OFF',
    tag: '✨ Smile Bright',
    tagColor: 'bg-red-100 text-red-800 border-red-200',
    img: '/images/prod-colgate.png',
  },
  {
    id: 'diwali-harpic',
    name: 'Harpic Power Plus Disinfectant',
    category: 'cleaning',
    pack: '1 L',
    price: '₹165',
    rawPrice: 165,
    originalPrice: '₹210',
    savePercent: '21% OFF',
    tag: '🛡️ Deep Home Clean',
    tagColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    img: '/images/prod-harpic.png',
  },
  {
    id: 'diwali-tissue',
    name: 'Soft Touch 3-Ply Toilet Tissue',
    category: 'cleaning',
    pack: 'Pack of 4',
    price: '₹129',
    rawPrice: 129,
    originalPrice: '₹165',
    savePercent: '22% OFF',
    tag: '🧻 Daily Care',
    tagColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    img: '/images/prod-toilet-tissue.png',
  },
];

export default function DiwaliOffersPage() {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [cartItems, setCartItems] = useState<Record<string, number>>({});
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [addedItem, setAddedItem] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleAddToCart = (id: string) => {
    setCartItems((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
    setAddedItem(id);
    setTimeout(() => setAddedItem(null), 1500);
    const item = diwaliOffers.find((p) => p.id === id);
    if (item) showToast(`Added ${item.name} to cart!`);
  };

  const updateCartQty = (id: string, delta: number) => {
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

  const toggleWishlist = (id: string) => {
    setWishlist((prev) => {
      const next = !prev[id];
      const item = diwaliOffers.find((p) => p.id === id);
      if (next && item) {
        showToast(`Saved ${item.name} to favourites!`);
      }
      return { ...prev, [id]: next };
    });
  };

  const totalCartCount = Object.values(cartItems).reduce((a, b) => a + b, 0);
  const totalWishlistCount = Object.values(wishlist).filter(Boolean).length;

  const cartSubtotal = Object.entries(cartItems).reduce((sum, [id, qty]) => {
    const item = diwaliOffers.find((p) => p.id === id);
    return sum + (item ? item.rawPrice * qty : 0);
  }, 0);

  const filteredProducts =
    selectedFilter === 'all'
      ? diwaliOffers
      : diwaliOffers.filter((p) => p.category === selectedFilter);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-gray-900 flex flex-col font-sans">
      {/* ================= TOP NAVIGATION BAR ================= */}
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
                  href="/#categories"
                  className="text-gray-700 hover:text-[#1D7A34] transition-colors"
                >
                  Categories
                </Link>
                <Link
                  href="/#rental-cars"
                  className="text-gray-700 hover:text-[#1D7A34] transition-colors"
                >
                  Rental Cars
                </Link>
                <Link
                  href="/offers"
                  className="text-[#3C0764] font-bold border-b-2 border-[#3C0764] pb-0.5"
                >
                  Diwali Deals
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
              <button
                onClick={() => setIsWishlistOpen(true)}
                aria-label="Wishlist"
                className="relative p-2 text-gray-700 hover:text-red-500 hover:bg-rose-50 rounded-full transition-colors cursor-pointer"
              >
                <Heart
                  className={`w-5 h-5 ${totalWishlistCount > 0 ? 'fill-red-500 text-red-500' : ''}`}
                />
                {totalWishlistCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-in zoom-in">
                    {totalWishlistCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setIsCartOpen(true)}
                aria-label="Shopping Cart"
                className="relative p-2 text-gray-700 hover:text-[#137A2C] hover:bg-emerald-50 rounded-full transition-colors cursor-pointer"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalCartCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-[#137A2C] text-white text-[10px] font-bold flex items-center justify-center animate-in zoom-in">
                    {totalCartCount}
                  </span>
                )}
              </button>

              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3.5 py-2 rounded-full transition-colors ml-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Back</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ================= DIWALI OFFERS HERO BANNER ================= */}
      <section className="bg-gradient-to-r from-[#2F0550] via-[#3C0764] to-[#58158C] text-white py-10 sm:py-14 relative overflow-hidden">
        {/* Decorative Festive Sparkle Shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-purple-400/15 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-black uppercase tracking-wider mb-4 border border-amber-300/30 backdrop-blur-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Diwali Mahotsav Dhamaka Deals</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                Shop Diwali Deals &amp; Save{' '}
                <span className="text-amber-300 underline decoration-amber-400/50 decoration-wavy decoration-2">
                  Up to 30% OFF
                </span>
              </h1>

              <p className="text-sm sm:text-base text-purple-100/90 mt-3 max-w-xl leading-relaxed">
                Handpicked festive groceries, pure pooja ghee, fragrant agarbathi, and home cleaning essentials at guaranteed festival prices for Bapatla!
              </p>

              {/* Highlights */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 mt-5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 text-xs font-semibold backdrop-blur-xs border border-white/15">
                  ⚡ 30-Min Fast Delivery
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 text-xs font-semibold backdrop-blur-xs border border-white/15">
                  🪔 Free Diya on Orders ₹499+
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 text-xs font-semibold backdrop-blur-xs border border-white/15">
                  ✨ Fresh Stock Guaranteed
                </span>
              </div>
            </div>

            {/* Packshot Image */}
            <div className="relative w-full max-w-md lg:max-w-lg flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/diwali-offer-products.png"
                alt="Diwali Offer Products"
                className="max-h-64 sm:max-h-72 object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= CATEGORY FILTER TABS ================= */}
      <div className="bg-white border-b border-gray-100 sticky top-16 sm:top-20 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4 overflow-x-auto">
          <div className="flex items-center gap-2">
            {[
              { id: 'all', label: 'All Diwali Deals (12)' },
              { id: 'pooja', label: '🪔 Pooja & Ghee' },
              { id: 'groceries', label: '🌾 Festive Groceries' },
              { id: 'cleaning', label: '✨ Home & Clean Care' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedFilter(tab.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedFilter === tab.id
                    ? 'bg-[#3C0764] text-white shadow-xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="hidden sm:flex items-center gap-1 text-xs text-gray-500 shrink-0 font-medium">
            <span>Showing</span>
            <strong className="text-gray-900 font-bold">{filteredProducts.length}</strong>
            <span>festival products</span>
          </div>
        </div>
      </div>

      {/* ================= PRODUCTS GRID ================= */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {filteredProducts.map((item) => {
            const isWishlisted = !!wishlist[item.id];
            const isAdded = addedItem === item.id;
            const inCartQty = cartItems[item.id] || 0;

            return (
              <div
                key={item.id}
                className="group relative rounded-2xl bg-white border border-gray-100 hover:border-purple-200 p-2.5 sm:p-3 flex flex-col justify-between shadow-2xs hover:shadow-lg transition-all duration-300"
              >
                <div>
                  {/* Top Badges Row */}
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${item.tagColor} truncate`}
                    >
                      {item.tag}
                    </span>

                    {/* Wishlist Button */}
                    <button
                      onClick={() => toggleWishlist(item.id)}
                      aria-label="Save to favourites"
                      className="w-7 h-7 rounded-full bg-white/90 hover:bg-rose-50 flex items-center justify-center transition-colors shadow-2xs cursor-pointer shrink-0"
                    >
                      <Heart
                        className={`w-4 h-4 transition-colors ${
                          isWishlisted
                            ? 'fill-red-500 text-red-500'
                            : 'text-gray-400 hover:text-red-500'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Product Packshot */}
                  <div className="w-full h-28 sm:h-32 flex items-center justify-center p-2 mb-2 bg-[#FAFAFA] rounded-xl group-hover:bg-[#FCF9FF] transition-colors">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.img}
                      alt={item.name}
                      className="max-h-[110px] sm:max-h-[120px] max-w-full object-contain group-hover:scale-108 transition-transform duration-300 drop-shadow-xs"
                      style={{ maxHeight: '115px', maxWidth: '100%', objectFit: 'contain' }}
                    />
                  </div>

                  {/* Product Meta */}
                  <h3 className="text-xs sm:text-[13px] font-bold text-gray-900 leading-snug line-clamp-2 min-h-[34px]">
                    {item.name}
                  </h3>
                  <p className="text-[11px] text-gray-500 mt-0.5">{item.pack}</p>

                  {/* Price Row */}
                  <div className="flex items-baseline gap-1.5 mt-2 flex-wrap">
                    <span className="text-sm sm:text-base font-extrabold text-gray-900">
                      {item.price}
                    </span>
                    <span className="text-xs text-gray-400 line-through">
                      {item.originalPrice}
                    </span>
                    <span className="text-[10px] font-black text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">
                      {item.savePercent}
                    </span>
                  </div>
                </div>

                {/* Add to Cart CTA */}
                <div className="mt-3">
                  {inCartQty > 0 ? (
                    <div className="w-full py-1.5 px-2 rounded-xl bg-[#3C0764] text-white flex items-center justify-between shadow-2xs">
                      <button
                        onClick={() => updateCartQty(item.id, -1)}
                        className="w-6 h-6 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-extrabold">{inCartQty} in cart</span>
                      <button
                        onClick={() => updateCartQty(item.id, 1)}
                        className="w-6 h-6 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleAddToCart(item.id)}
                      className={`w-full py-2 px-3 rounded-xl text-xs sm:text-[13px] font-bold flex items-center justify-center gap-1.5 shadow-2xs hover:shadow transition-all duration-200 active:scale-98 cursor-pointer ${
                        isAdded
                          ? 'bg-[#2F0550] text-white'
                          : 'bg-[#3C0764] hover:bg-[#2F0550] text-white'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-4 h-4 stroke-[2.5]" />
                          <span>Added!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4" />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* ================= DYNAMIC SHOPPING CART DRAWER ================= */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsCartOpen(false)}
          />

          <div className="relative z-50 w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-250">
            <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-[#3C0764]" />
                <h3 className="text-base sm:text-lg font-bold text-gray-900">
                  Diwali Cart ({totalCartCount})
                </h3>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
              {totalCartCount === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12 text-gray-400">
                  <div className="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center mb-3 text-purple-300">
                    <ShoppingCart className="w-8 h-8" />
                  </div>
                  <p className="text-base font-semibold text-gray-800">Your cart is empty</p>
                  <p className="text-xs text-gray-500 mt-1 max-w-xs">
                    Add products from our special Diwali offers to get festival discounts!
                  </p>
                </div>
              ) : (
                Object.entries(cartItems).map(([id, qty]) => {
                  const item = diwaliOffers.find((p) => p.id === id);
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
                        <h4 className="text-xs font-bold text-gray-900 truncate">{item.name}</h4>
                        <p className="text-[11px] text-gray-400">{item.pack}</p>
                        <span className="text-xs font-extrabold text-gray-900 mt-1 inline-block">
                          {item.price}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg p-1 shrink-0">
                        <button
                          onClick={() => updateCartQty(id, -1)}
                          className="w-5 h-5 rounded hover:bg-gray-100 flex items-center justify-center text-gray-600 cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold px-1.5 min-w-[18px] text-center">
                          {qty}
                        </span>
                        <button
                          onClick={() => updateCartQty(id, 1)}
                          className="w-5 h-5 rounded hover:bg-gray-100 flex items-center justify-center text-gray-600 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => updateCartQty(id, -qty)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {totalCartCount > 0 && (
              <div className="p-4 sm:p-5 border-t border-gray-100 bg-white space-y-3">
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>Subtotal</span>
                  <span className="text-sm font-extrabold text-gray-900">₹{cartSubtotal}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>Festival Delivery</span>
                  <span className="text-xs font-bold text-[#137A2C]">FREE Delivery</span>
                </div>
                <button
                  onClick={() => showToast('Proceeding to checkout with Diwali savings!')}
                  className="w-full py-3 rounded-xl bg-[#3C0764] hover:bg-[#2F0550] text-white font-bold text-sm shadow-md transition-all cursor-pointer"
                >
                  Checkout (₹{cartSubtotal})
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= DYNAMIC FAVOURITES DRAWER ================= */}
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
                  Favourites ({totalWishlistCount})
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
                    Click the heart icon on any Diwali deal to save it.
                  </p>
                </div>
              ) : (
                Object.keys(wishlist)
                  .filter((id) => wishlist[id])
                  .map((id) => {
                    const item = diwaliOffers.find((p) => p.id === id);
                    if (!item) return null;

                    return (
                      <div
                        key={id}
                        className="flex items-center gap-3 p-3 rounded-2xl border border-gray-100 bg-[#FAFAFA]"
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
                          <h4 className="text-xs font-bold text-gray-900 truncate">{item.name}</h4>
                          <p className="text-[11px] text-gray-400">{item.pack}</p>
                          <span className="text-xs font-extrabold text-gray-900 mt-1 inline-block">
                            {item.price}
                          </span>
                        </div>

                        <button
                          onClick={() => handleAddToCart(id)}
                          className="px-3 py-1.5 rounded-lg bg-[#3C0764] text-white text-xs font-bold hover:bg-[#2F0550] transition-colors shrink-0 cursor-pointer"
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

      {/* ================= SITE FOOTER ================= */}
      <footer className="bg-white border-t border-gray-100 pt-10 pb-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-3">
            <p>&copy; 2026 BeMyShopper. Diwali Festival Deals &bull; Bapatla, AP.</p>
            <div className="flex items-center gap-4">
              <Link href="/" className="hover:text-gray-700">
                Home
              </Link>
              <Link href="/about" className="hover:text-gray-700">
                About Founder
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

