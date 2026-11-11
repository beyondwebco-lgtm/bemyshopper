'use client';

import React from 'react';
import { ShoppingBag, MapPin, Search, UserCheck, Bell, Sparkles } from 'lucide-react';
import { CartItem, OrderState } from '../types';

interface NavbarProps {
  cartItems: CartItem[];
  onOpenCart: () => void;
  onOpenErrandModal: () => void;
  onOpenShopperSignup: () => void;
  activeOrder: OrderState | null;
  onOpenTracking: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartItems,
  onOpenCart,
  onOpenErrandModal,
  onOpenShopperSignup,
  activeOrder,
  onOpenTracking,
  searchQuery,
  setSearchQuery,
}) => {
  const totalItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      {/* Top Banner */}
      <div className="bg-emerald-600 text-white text-xs py-1.5 px-4 font-medium flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-700 px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider">Fast Delivery</span>
            <span>Local personal shoppers ready in your area • 100% store receipt guarantee</span>
          </div>
          <button 
            onClick={onOpenShopperSignup}
            className="hidden sm:inline-flex items-center gap-1.5 hover:underline font-semibold"
          >
            <UserCheck className="w-3.5 h-3.5" />
            Earn $25-$35/hr as a BeMyShopper Partner
          </button>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <a href="#" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight text-gray-900 flex items-center">
                  BeMy<span className="text-emerald-600">Shopper</span>
                </span>
                <span className="text-[10px] text-gray-500 font-medium -mt-1 tracking-wider uppercase">Grocery & Errands</span>
              </div>
            </a>

            {/* Address Pill */}
            <div className="hidden lg:flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-full transition-colors cursor-pointer">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span className="font-medium text-gray-900">Downtown, 5th Ave</span>
              <span className="text-gray-400">• 25 min</span>
            </div>
          </div>

          {/* Search Box */}
          <div className="flex-1 max-w-xl hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search fresh groceries, bakery, pharmacy, or enter any errand request..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 hover:bg-white focus:bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all text-gray-800 placeholder-gray-400"
              />
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Custom Errand Button */}
            <button
              onClick={onOpenErrandModal}
              className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 sm:px-4 py-2 rounded-full transition-all hover:shadow-xs active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">Request</span> Custom Errand
            </button>

            {/* Live Order Tracker Pill (if active) */}
            {activeOrder && (
              <button
                onClick={onOpenTracking}
                className="flex items-center gap-1.5 text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 px-3 py-2 rounded-full transition-all animate-pulse"
              >
                <Bell className="w-3.5 h-3.5 text-amber-600" />
                <span>Track Order</span>
              </button>
            )}

            {/* Shopping Cart Pill */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all shadow-sm hover:shadow-md active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              <span className="bg-white text-emerald-700 px-1.5 py-0.2 rounded-full text-xs font-bold">
                {totalItemCount}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-3 md:hidden">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search groceries or errands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-1 focus:ring-emerald-500 text-gray-800"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
