'use client';

import React, { useState } from 'react';
import { X, CheckCircle, Award, DollarSign, Calendar, Bike } from 'lucide-react';

interface BecomeShopperModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BecomeShopperModal: React.FC<BecomeShopperModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [vehicle, setVehicle] = useState('E-Bike / Bicycle');
  const [neighborhood, setNeighborhood] = useState('Downtown');
  const [applied, setApplied] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    setApplied(true);
    setTimeout(() => {
      setApplied(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-gray-100 flex flex-col">
        {/* Header */}
        <div className="bg-emerald-600 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            <div>
              <h3 className="font-extrabold text-base">Become a BeMyShopper Partner</h3>
              <p className="text-xs text-emerald-100">Earn $25-$35/hr with flexible hours</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {applied ? (
          <div className="p-10 text-center space-y-3">
            <CheckCircle className="w-14 h-14 text-emerald-500 mx-auto animate-bounce" />
            <h4 className="text-lg font-bold text-gray-900">Application Received!</h4>
            <p className="text-xs text-gray-600">
              Welcome aboard! Our onboarding team will send your starter kit and background verification instructions to {email}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-3 gap-2 py-2">
              <div className="bg-emerald-50 rounded-xl p-2.5 text-center border border-emerald-100">
                <DollarSign className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                <span className="text-xs font-bold text-gray-900">$25-35</span>
                <span className="text-[10px] text-gray-500 block">per hour</span>
              </div>
              <div className="bg-emerald-50 rounded-xl p-2.5 text-center border border-emerald-100">
                <Calendar className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                <span className="text-xs font-bold text-gray-900">Flexible</span>
                <span className="text-[10px] text-gray-500 block">your schedule</span>
              </div>
              <div className="bg-emerald-50 rounded-xl p-2.5 text-center border border-emerald-100">
                <Bike className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                <span className="text-xs font-bold text-gray-900">Any Mode</span>
                <span className="text-[10px] text-gray-500 block">bike, car, walk</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="jane@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Vehicle / Transit</label>
                <select
                  value={vehicle}
                  onChange={(e) => setVehicle(e.target.value)}
                  className="w-full text-xs px-2.5 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
                >
                  <option value="E-Bike / Bicycle">E-Bike / Bicycle</option>
                  <option value="Electric Scooter">Electric Scooter</option>
                  <option value="Car / EV">Car / EV</option>
                  <option value="Walking / Transit">Walking / Transit</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Preferred Zone</label>
                <input
                  type="text"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-emerald-600/20"
            >
              Submit Application
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
