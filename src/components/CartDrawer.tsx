'use client';

import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, HeartHandshake } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: (tip: number, address: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}) => {
  const [tip, setTip] = useState<number>(4);
  const [address, setAddress] = useState('742 Evergreen Terrace, Apt 3B');
  const [deliveryNote, setDeliveryNote] = useState('');

  if (!isOpen) return null;

  const itemsSubtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shopperFee = itemsSubtotal > 35 ? 2.99 : 5.99;
  const deliveryFee = 2.49;
  const grandTotal = itemsSubtotal + shopperFee + deliveryFee + tip;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-emerald-50/50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-600" />
            <h3 className="font-extrabold text-base text-gray-900">Your Shopping Basket</h3>
            <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
              {items.length} items
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-3xl">
                🛒
              </div>
              <h4 className="font-bold text-gray-800 text-base">Your cart is empty</h4>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                Explore local fresh produce, groceries, and staples to assign to your personal shopper.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-white shadow-2xs hover:border-gray-200 transition-all"
                >
                  <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center text-2xl shrink-0">
                    {item.product.image}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-bold text-gray-900 truncate">{item.product.name}</h5>
                    <p className="text-[10px] text-gray-500 truncate">{item.product.store}</p>
                    <p className="text-xs font-extrabold text-emerald-700 mt-0.5">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-1.5 py-1">
                    <button
                      onClick={() => onUpdateQuantity(item.product.id, -1)}
                      className="p-0.5 hover:bg-gray-200 rounded text-gray-700"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-bold text-gray-900 px-1">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.product.id, 1)}
                      className="p-0.5 hover:bg-gray-200 rounded text-gray-700"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <button
                    onClick={() => onRemoveItem(item.product.id)}
                    className="p-1.5 text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {/* Delivery Address */}
              <div className="pt-2">
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Deliver To
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {/* Instructions for Shopper */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Note for Personal Shopper
                </label>
                <input
                  type="text"
                  placeholder="e.g. Please choose green bananas, ring bell twice"
                  value={deliveryNote}
                  onChange={(e) => setDeliveryNote(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {/* Shopper Tip Selector */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1">
                    <HeartHandshake className="w-3.5 h-3.5 text-rose-500" />
                    Shopper Tip (100% goes to shopper)
                  </label>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[2, 4, 6, 8].map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => setTip(amount)}
                      className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                        tip === amount
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      ${amount}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer / Cost Breakdown */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-gray-100 bg-gray-50/80 space-y-3">
            <div className="space-y-1.5 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-gray-900">${itemsSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Dedicated Personal Shopper Fee</span>
                <span className="font-semibold text-gray-900">${shopperFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Doorstep Delivery</span>
                <span className="font-semibold text-gray-900">${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shopper Tip</span>
                <span className="font-semibold text-emerald-700">${tip.toFixed(2)}</span>
              </div>
              <div className="pt-2 border-t border-gray-200 flex justify-between text-sm font-extrabold text-gray-900">
                <span>Estimated Total</span>
                <span className="text-emerald-700 text-base">${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[10px] text-gray-500 bg-white p-2 rounded-lg border border-gray-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>You pay actual store prices. Receipt photo sent upon checkout.</span>
            </div>

            <button
              onClick={() => onCheckout(tip, address)}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-xl font-bold text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
            >
              <span>Place Order & Dispatch Shopper</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
