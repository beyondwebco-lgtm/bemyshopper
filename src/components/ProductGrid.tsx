'use client';

import React from 'react';
import { Product, CartItem } from '../types';
import { ProductCard } from './ProductCard';
import { ShoppingBasket, Sparkles } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  cartItems: CartItem[];
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (productId: string, delta: number) => void;
  onUpdateSubstitution: (productId: string, pref: 'best_match' | 'call_me' | 'refund') => void;
  onOpenCustomErrand: () => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  cartItems,
  onAddToCart,
  onUpdateQuantity,
  onUpdateSubstitution,
  onOpenCustomErrand,
}) => {
  const cartMap = new Map<string, CartItem>(cartItems.map((item) => [item.product.id, item]));

  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            <ShoppingBasket className="w-5 h-5 text-emerald-600" />
            Available Essentials & Fresh Picks
          </h2>
          <p className="text-xs text-gray-500">Pick items or ask your personal shopper for anything else you need</p>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <p className="text-sm font-semibold text-gray-600">No items match your filter.</p>
          <p className="text-xs text-gray-400 mt-1 mb-4">Can't find what you're looking for? Let a shopper pick it up custom!</p>
          <button
            onClick={onOpenCustomErrand}
            className="inline-flex items-center gap-2 bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs hover:bg-emerald-700"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Submit Custom Errand Request
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              cartItem={cartMap.get(p.id)}
              onAddToCart={onAddToCart}
              onUpdateQuantity={onUpdateQuantity}
              onUpdateSubstitution={onUpdateSubstitution}
            />
          ))}
        </div>
      )}
    </div>
  );
};
