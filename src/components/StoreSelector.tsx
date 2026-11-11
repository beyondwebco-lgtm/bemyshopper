'use client';

import React from 'react';
import { Store, Clock } from 'lucide-react';
import { STORES } from '../data/mockData';

interface StoreSelectorProps {
  selectedStore: string;
  onSelectStore: (storeId: string) => void;
}

export const StoreSelector: React.FC<StoreSelectorProps> = ({
  selectedStore,
  onSelectStore,
}) => {
  return (
    <div className="py-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
          <Store className="w-4 h-4 text-emerald-600" />
          Shop By Local Partner Store
        </h3>
        <span className="text-xs text-gray-500 font-medium">All local stores in 3-mile radius</span>
      </div>

      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
        {STORES.map((s) => {
          const isSelected = selectedStore === s.id;
          return (
            <button
              key={s.id}
              onClick={() => onSelectStore(s.id)}
              className={`shrink-0 flex items-center gap-2.5 px-3.5 py-2 rounded-xl border text-xs font-medium transition-all ${
                isSelected
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-xs'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-emerald-200 hover:bg-gray-50'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-emerald-500' : 'bg-gray-300'}`} />
              <div className="text-left">
                <p className="font-semibold">{s.name}</p>
                {s.time && (
                  <p className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">
                    <Clock className="w-2.5 h-2.5 text-emerald-600" />
                    <span>{s.time}</span> • <span>{s.distance}</span>
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
