'use client';

import React, { useState } from 'react';
import { X, Sparkles, MapPin, Clock, DollarSign, CheckCircle2, AlertCircle } from 'lucide-react';
import { CustomErrand } from '../types';

interface CustomErrandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitErrand: (errand: CustomErrand) => void;
}

export const CustomErrandModal: React.FC<CustomErrandModalProps> = ({
  isOpen,
  onClose,
  onSubmitErrand,
}) => {
  const [title, setTitle] = useState('');
  const [pickupLocation, setPickupLocation] = useState('Trader Joe\'s, 721 Broadway');
  const [dropoffLocation, setDropoffLocation] = useState('My Address: Downtown, Apt 4B');
  const [instructions, setInstructions] = useState('');
  const [estimatedBudget, setEstimatedBudget] = useState('40');
  const [urgency, setUrgency] = useState<'Standard (within 2h)' | 'Rush (within 45m)' | 'Flexible'>('Standard (within 2h)');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const baseShopperFee = urgency === 'Rush (within 45m)' ? 14.99 : 9.99;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !instructions.trim()) return;

    const newErrand: CustomErrand = {
      id: 'errand-' + Date.now(),
      title,
      pickupLocation,
      dropoffLocation,
      instructions,
      estimatedBudget: parseFloat(estimatedBudget) || 30,
      urgency,
      status: 'shopper_assigned',
    };

    onSubmitErrand(newErrand);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Request Any Custom Errand or Item</h3>
              <p className="text-xs text-emerald-100">Your personal shopper will visit any store or run any errand</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-10 text-center space-y-3">
            <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto animate-bounce" />
            <h4 className="text-lg font-bold text-gray-900">Custom Errand Dispatched!</h4>
            <p className="text-sm text-gray-600">Matching you with the nearest active neighborhood shopper...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Errand / Shopping Summary
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Pick up dry cleaning & buy specific spices at Asian Mart"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800"
              />
            </div>

            {/* Pickup & Dropoff */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Pickup Store / Spot
                </label>
                <input
                  type="text"
                  required
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" /> Delivery Address
                </label>
                <input
                  type="text"
                  required
                  value={dropoffLocation}
                  onChange={(e) => setDropoffLocation(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Detailed Instructions */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Specific Shopping List & Notes
              </label>
              <textarea
                required
                rows={3}
                placeholder="List exact items, preferred brands, sizes, or pickup ticket numbers. Shopper will call from the store if there are questions."
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="w-full text-xs px-3.5 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800"
              />
            </div>

            {/* Estimated Budget & Speed */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> Max Item Budget ($)
                </label>
                <input
                  type="number"
                  min="5"
                  max="1000"
                  value={estimatedBudget}
                  onChange={(e) => setEstimatedBudget(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <span className="text-[10px] text-gray-400">Shopper uploads actual store receipt</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-600" /> Delivery Urgency
                </label>
                <select
                  value={urgency}
                  onChange={(e: any) => setUrgency(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
                >
                  <option value="Standard (within 2h)">Standard (within 2h)</option>
                  <option value="Rush (within 45m)">⚡ Rush (within 45m)</option>
                  <option value="Flexible">Flexible (Today)</option>
                </select>
              </div>
            </div>

            {/* Fee summary banner */}
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-emerald-600" />
                <span className="text-xs text-emerald-900 font-medium">Personal Shopper Service Fee</span>
              </div>
              <span className="text-sm font-extrabold text-emerald-900">${baseShopperFee.toFixed(2)}</span>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-xl font-bold text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Confirm & Dispatch Personal Shopper</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
