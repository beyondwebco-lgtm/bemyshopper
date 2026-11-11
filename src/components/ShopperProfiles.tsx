'use client';

import React from 'react';
import { Star, Award, Bike, MapPin, CheckCircle } from 'lucide-react';
import { FEATURED_SHOPPERS } from '../data/mockData';

interface ShopperProfilesProps {
  onSelectShopper?: (shopperId: string) => void;
}

export const ShopperProfiles: React.FC<ShopperProfilesProps> = () => {
  return (
    <section className="py-10 bg-gradient-to-b from-white to-gray-50/60 border-t border-b border-gray-100 my-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100/70 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <Award className="w-3.5 h-3.5" />
            Vetted Community Shoppers
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Meet Your Dedicated Personal Shoppers
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Real people from your neighborhood who treat your grocery cart like their own.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURED_SHOPPERS.map((shopper) => (
            <div
              key={shopper.id}
              className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-3xl shadow-xs">
                      {shopper.avatar}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-gray-900 flex items-center gap-1">
                        {shopper.name}
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500 fill-emerald-100" />
                      </h4>
                      <p className="text-[11px] text-gray-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        {shopper.neighborhood}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-900 px-2 py-0.5 rounded-lg text-xs font-bold">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                    <span>{shopper.rating}</span>
                  </div>
                </div>

                <p className="text-xs text-gray-600 mt-3 leading-relaxed italic">
                  "{shopper.bio}"
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500 font-medium">
                <span className="flex items-center gap-1">
                  <Bike className="w-3.5 h-3.5 text-emerald-600" />
                  {shopper.vehicle}
                </span>
                <span className="text-emerald-700 font-semibold">
                  {shopper.completedErrands}+ orders completed
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
