'use client';

import React, { useState } from 'react';
import { Sparkles, Clock, ShieldCheck, MessageSquare, ArrowRight, Zap } from 'lucide-react';

interface HeroProps {
  onQuickSearch: (query: string) => void;
  onOpenErrandModal: () => void;
  onSelectCategory: (cat: string) => void;
  selectedCategory: string;
}

export const Hero: React.FC<HeroProps> = ({
  onQuickSearch,
  onOpenErrandModal,
  onSelectCategory,
  selectedCategory,
}) => {
  const [quickInput, setQuickInput] = useState('');

  const handleInstantRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickInput.trim()) {
      onQuickSearch(quickInput.trim());
    } else {
      onOpenErrandModal();
    }
  };

  const categories = [
    { label: 'All Items', value: 'all' },
    { label: '🥑 Fresh Produce', value: 'Produce' },
    { label: '🍞 Dairy & Bakery', value: 'Dairy & Bakery' },
    { label: '🫒 Pantry & Staples', value: 'Pantry' },
    { label: '☕ Beverages', value: 'Beverages' },
    { label: '💊 Pharmacy', value: 'Pharmacy' },
    { label: '🧻 Household', value: 'Household' },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/60 via-teal-50/30 to-white pt-10 pb-8 px-4 sm:px-6 lg:px-8 border-b border-emerald-100/60">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-emerald-100/80 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-200">
            <Zap className="w-3.5 h-3.5 text-emerald-600" />
            <span>Fast, Personal Grocery & Errand Delivery</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Need groceries or an errand done? <br />
            <span className="text-emerald-600 bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              BeMyShopper handles it all.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            A dedicated local shopper visits your favorite stores, picks the freshest produce, texts you if items need substitution, and delivers straight to your doorstep.
          </p>

          {/* Quick Errand Search Bar */}
          <form onSubmit={handleInstantRequest} className="mt-6 max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center gap-2 bg-white p-2 rounded-2xl shadow-lg shadow-emerald-900/5 border border-emerald-100">
              <div className="flex-1 w-full flex items-center px-3 py-1">
                <Sparkles className="w-5 h-5 text-emerald-500 mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="Need avocados, milk, or dry cleaning picked up? Type here..."
                  value={quickInput}
                  onChange={(e) => setQuickInput(e.target.value)}
                  className="w-full text-sm sm:text-base text-gray-800 placeholder-gray-400 bg-transparent focus:outline-none"
                />
              </div>
              <div className="w-full sm:w-auto flex items-center gap-2">
                <button
                  type="submit"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm"
                >
                  <span>Find Shopper</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </form>

          {/* Value Props */}
          <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto text-left">
            <div className="flex items-start gap-3 bg-white/70 backdrop-blur-xs p-3 rounded-xl border border-gray-100 shadow-2xs">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">Zero Receipt Markups</h4>
                <p className="text-[11px] text-gray-500">Pay authentic store shelf prices with original photo receipts attached.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white/70 backdrop-blur-xs p-3 rounded-xl border border-gray-100 shadow-2xs">
              <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">Direct In-Store Chat</h4>
                <p className="text-[11px] text-gray-500">Your shopper texts you directly from the aisle for substitutions or ripeness.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white/70 backdrop-blur-xs p-3 rounded-xl border border-gray-100 shadow-2xs">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">Express 30-Min Option</h4>
                <p className="text-[11px] text-gray-500">Immediate neighborhood dispatch for urgent groceries or last-minute errands.</p>
              </div>
            </div>
          </div>

          {/* Category Chips */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-2">
            {categories.map((c) => {
              const active = selectedCategory === c.value;
              return (
                <button
                  key={c.value}
                  onClick={() => onSelectCategory(c.value)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                    active
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white hover:bg-emerald-50 text-gray-700 border border-gray-200 hover:border-emerald-200'
                  }`}
                >
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
