'use client';

import React, { useState } from 'react';
import { X, CheckCircle, Clock, MapPin, Bike, MessageSquare, Phone, Send, Sparkles } from 'lucide-react';
import { OrderState } from '../types';

interface OrderTrackingModalProps {
  order: OrderState;
  isOpen: boolean;
  onClose: () => void;
  onAdvanceStage: () => void;
  onResetOrder: () => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  order,
  isOpen,
  onClose,
  onAdvanceStage,
  onResetOrder,
}) => {
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'shopper' | 'user'; text: string; time: string }>>([
    {
      sender: 'shopper',
      text: "Hi there! I'm heading into the store now. I'll make sure to pick the freshest items for you!",
      time: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');

  if (!isOpen) return null;

  const steps = [
    { key: 'assigned', label: 'Shopper Assigned', desc: 'Matched with Elena' },
    { key: 'shopping', label: 'Shopping in Store', desc: 'Carefully picking items' },
    { key: 'checking_out', label: 'Cashier & Receipt', desc: 'Uploading real receipt' },
    { key: 'delivering', label: 'En Route', desc: 'Arriving via e-bike' },
    { key: 'delivered', label: 'Delivered', desc: 'Handed over at doorstep' },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === order.status);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setChatMessages((prev) => [
      ...prev,
      { sender: 'user', text: inputText.trim(), time: 'Just now' },
    ]);
    setInputText('');

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'shopper',
          text: 'Got it! I found the freshest batch right near the front display.',
          time: 'Just now',
        },
      ]);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-emerald-700 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl">
              {order.shopper.avatar}
            </div>
            <div>
              <h3 className="font-extrabold text-base">Live Order & Shopper Status</h3>
              <p className="text-xs text-emerald-200">
                Order #{order.id} • ETA: {order.estimatedArrival}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status progress bar */}
        <div className="p-4 sm:p-6 bg-gray-50 border-b border-gray-200 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[380px]">
            {steps.map((step, idx) => {
              const isPastOrCurrent = idx <= currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              return (
                <div key={step.key} className="flex-1 flex flex-col items-center relative text-center">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all z-10 ${
                      isCurrent
                        ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 animate-pulse'
                        : isPastOrCurrent
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {isPastOrCurrent ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                  </div>
                  <span className={`text-[11px] font-bold mt-1.5 ${isCurrent ? 'text-emerald-700' : 'text-gray-700'}`}>
                    {step.label}
                  </span>
                  <span className="text-[9px] text-gray-400">{step.desc}</span>
                </div>
              );
            })}
          </div>

          {/* Advance Simulation Step Button */}
          <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-200/80">
            <span className="text-xs text-gray-500 font-medium">Interactive Demo Control:</span>
            <button
              onClick={onAdvanceStage}
              className="px-3 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Advance Status ({steps[currentStepIndex]?.label})</span>
            </button>
          </div>
        </div>

        {/* Shopper Card & In-Aisle Live Chat */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {/* Shopper Card */}
          <div className="flex items-center justify-between bg-emerald-50/70 border border-emerald-100 p-3 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-2xl shadow-xs">
                {order.shopper.avatar}
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">{order.shopper.name}</h4>
                <p className="text-[11px] text-gray-500 flex items-center gap-1">
                  <Bike className="w-3 h-3 text-emerald-600" />
                  {order.shopper.vehicle} • ★ {order.shopper.rating}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="p-2 bg-white hover:bg-gray-100 rounded-xl border border-gray-200 text-emerald-700 transition-colors shadow-2xs">
                <Phone className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* In-aisle chat stream */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                Live In-Aisle Communication
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                Active
              </span>
            </div>

            <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100 h-44 overflow-y-auto space-y-2.5">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-xs ${
                      msg.sender === 'user'
                        ? 'bg-emerald-600 text-white rounded-br-none'
                        : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-2xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-gray-400 mt-0.5 px-1">{msg.time}</span>
                </div>
              ))}
            </div>

            {/* Chat input */}
            <form onSubmit={handleSendMessage} className="mt-2 flex gap-2">
              <input
                type="text"
                placeholder="Reply to shopper or ask about replacements..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 text-xs px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Footer controls */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <button
            onClick={onResetOrder}
            className="text-xs text-red-600 hover:text-red-700 font-semibold underline"
          >
            Cancel / Clear Demo Order
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-xl text-xs font-bold"
          >
            Keep in Background
          </button>
        </div>
      </div>
    </div>
  );
};
