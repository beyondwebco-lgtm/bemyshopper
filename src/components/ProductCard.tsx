'use client';

import React from 'react';
import { Plus, Minus, Check, Store } from 'lucide-react';
import { Product, CartItem } from '../types';

interface ProductCardProps {
  product: Product;
  cartItem?: CartItem;
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (productId: string, delta: number) => void;
  onUpdateSubstitution: (productId: string, pref: 'best_match' | 'call_me' | 'refund') => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  cartItem,
  onAddToCart,
  onUpdateQuantity,
  onUpdateSubstitution,
}) => {
  const isInCart = cartItem && cartItem.quantity > 0;

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all p-4 flex flex-col justify-between relative">
      {/* Badges */}
      <div className="flex items-center justify-between gap-1 mb-2">
        <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
          {product.category}
        </span>
        {product.organic && (
          <span className="text-[10px] font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md">
            🌱 Organic
          </span>
        )}
      </div>

      {/* Visual Icon / Presentation */}
      <div className="w-full h-32 rounded-xl bg-gradient-to-b from-gray-50 to-emerald-50/30 flex items-center justify-center text-5xl group-hover:scale-105 transition-transform">
        {product.image}
      </div>

      {/* Store tag */}
      <div className="mt-3 flex items-center gap-1 text-[11px] text-gray-500 font-medium">
        <Store className="w-3 h-3 text-emerald-600 shrink-0" />
        <span className="truncate">{product.store}</span>
      </div>

      {/* Title & Price */}
      <div className="mt-1">
        <h4 className="text-sm font-bold text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
          {product.name}
        </h4>
        <p className="text-xs text-gray-500">{product.unit}</p>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
        <div>
          <span className="text-base font-extrabold text-gray-900">${product.price.toFixed(2)}</span>
        </div>

        {isInCart ? (
          <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-300 rounded-xl px-2 py-1">
            <button
              onClick={() => onUpdateQuantity(product.id, -1)}
              className="p-1 hover:bg-emerald-200/60 rounded-lg text-emerald-800 transition-colors"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="text-xs font-bold text-emerald-900 px-1">{cartItem.quantity}</span>
            <button
              onClick={() => onUpdateQuantity(product.id, 1)}
              className="p-1 hover:bg-emerald-200/60 rounded-lg text-emerald-800 transition-colors"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => onAddToCart(product)}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        )}
      </div>

      {/* In-cart Substitution preference chip */}
      {isInCart && (
        <div className="mt-2.5 pt-2 border-t border-dashed border-gray-100">
          <label className="text-[10px] text-gray-400 font-medium block mb-1">
            If out of stock:
          </label>
          <div className="grid grid-cols-3 gap-1">
            {(['best_match', 'call_me', 'refund'] as const).map((pref) => {
              const active = cartItem.substitutionPreference === pref;
              const labels = {
                best_match: 'Match',
                call_me: 'Call Me',
                refund: 'Refund',
              };
              return (
                <button
                  key={pref}
                  type="button"
                  onClick={() => onUpdateSubstitution(product.id, pref)}
                  className={`text-[9px] py-1 px-1 rounded-md text-center font-medium transition-all ${
                    active
                      ? 'bg-emerald-700 text-white font-bold'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                  }`}
                >
                  {labels[pref]}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
