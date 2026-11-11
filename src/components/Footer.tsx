'use client';

import React from 'react';
import { ShoppingBag, ShieldCheck, Heart, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 text-xs py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-base text-white">
                BeMy<span className="text-emerald-500">Shopper</span>
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Your neighborhood grocery and personal errand delivery platform. Real humans, authentic receipts, zero hidden markups.
            </p>
            <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>100% In-Store Receipt Guarantee</span>
            </div>
          </div>

          {/* Grocery Categories */}
          <div>
            <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">Popular Aisles</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">Organic Produce & Herbs</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Artisan Sourdough & Bakery</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Farm Fresh Dairy & Eggs</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pantry Essentials & Spices</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pharmacy & Wellness Care</a></li>
            </ul>
          </div>

          {/* Errand Services */}
          <div>
            <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">Errand Concierge</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">Dry Cleaning Dropoff & Pickup</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Post Office & Parcel Dispatch</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Specialty Gourmet Sourcing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Urgent Prescription Delivery</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Hardware & Pet Supply Runs</a></li>
            </ul>
          </div>

          {/* Partner & Community */}
          <div>
            <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">Earn With Us</h4>
            <p className="text-xs text-gray-400 mb-3">
              Become a verified local personal shopper in your city and make your own hours.
            </p>
            <div className="bg-gray-800/80 p-3 rounded-xl border border-gray-700 space-y-2">
              <div className="flex items-center justify-between text-white font-bold text-xs">
                <span>Earn up to $35/hour</span>
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <p className="text-[10px] text-gray-400">Weekly payouts, retain 100% of customer tips.</p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>© 2026 BeMyShopper Technologies Inc. All rights reserved.</p>
          <div className="flex items-center gap-1 text-gray-500">
            <span>Built with care for busy households & neighborhoods</span>
            <Heart className="w-3 h-3 text-red-500 fill-red-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};
