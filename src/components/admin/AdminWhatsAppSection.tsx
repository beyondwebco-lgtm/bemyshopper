'use client';

import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Plus,
  Trash2,
  CheckCircle2,
  Check,
  Star,
  Phone,
  ShieldCheck,
  ExternalLink,
  Copy,
  AlertCircle,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';

interface WhatsAppNumberItem {
  _id: Id<'whatsappSettings'>;
  phone: string;
  label: string;
  isActive: boolean;
  createdAt: number;
}

export default function AdminWhatsAppSection() {
  // Convex Queries and Mutations
  const numbersList = useQuery(api.whatsapp.list) as WhatsAppNumberItem[] | undefined;
  const addMutation = useMutation(api.whatsapp.add);
  const removeMutation = useMutation(api.whatsapp.remove);
  const setActiveMutation = useMutation(api.whatsapp.setActive);

  // Form State
  const [newPhone, setNewPhone] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [makeActive, setMakeActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 4000);
  };

  const copyNumber = (phone: string, id: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(phone);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleAddNumber = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanDigits = newPhone.trim().replace(/[^0-9]/g, '');
    if (cleanDigits.length < 10) {
      alert('Please enter a valid 10-digit Indian mobile number');
      return;
    }

    setIsSubmitting(true);
    try {
      await addMutation({
        phone: cleanDigits,
        label: newLabel.trim() || 'Store Order Desk',
        isActive: makeActive,
      });

      // Also backup to API route
      await fetch('/api/whatsapp-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: cleanDigits,
          label: newLabel.trim() || 'Store Order Desk',
          isActive: makeActive,
        }),
      });

      showFeedback(`✓ WhatsApp number +91 ${cleanDigits.slice(-10)} added successfully!`);
      setNewPhone('');
      setNewLabel('');
      setMakeActive(true);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to add WhatsApp number');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteNumber = async (item: WhatsAppNumberItem) => {
    if (!confirm(`Are you sure you want to delete WhatsApp number ${item.phone} (${item.label})?`)) return;

    try {
      await removeMutation({ id: item._id });

      // Also sync deletion to backup API
      await fetch(`/api/whatsapp-settings?id=${encodeURIComponent(item._id)}`, {
        method: 'DELETE',
      }).catch(() => {});

      showFeedback(`✓ Deleted WhatsApp number ${item.phone}`);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to delete number');
    }
  };

  const handleSetActive = async (item: WhatsAppNumberItem) => {
    try {
      await setActiveMutation({ id: item._id });

      // Also sync to backup API
      await fetch('/api/whatsapp-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'setActive', id: item._id }),
      }).catch(() => {});

      showFeedback(`✓ Set ${item.phone} (${item.label}) as the Active order receiver!`);
    } catch (err: any) {
      console.error(err);
      alert('Failed to update active number');
    }
  };

  const activeNumber = numbersList?.find((n) => n.isActive) || numbersList?.[0];

  return (
    <div className="space-y-6">
      {/* ================= 1. SECTION HEADER ================= */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-gray-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#25D366] to-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                WhatsApp Order Numbers
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800">
                {numbersList?.length ?? 1} Configured
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
              Add or delete store WhatsApp numbers where customer cart product orders and rental inquiries are sent.
            </p>
          </div>
        </div>

        {activeNumber && (
          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <div>
              <div className="text-[10px] uppercase font-bold text-emerald-800">Active Order Receiver:</div>
              <div className="font-mono font-black text-emerald-950 text-sm">+{activeNumber.phone}</div>
            </div>
          </div>
        )}
      </div>

      {/* Global Feedback Toast */}
      {feedback && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 shadow-2xs animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* ================= 2. FAST ADD WHATSAPP NUMBER FORM ================= */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-emerald-50/70 via-teal-50/40 to-white border border-emerald-200 shadow-2xs">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-[#25D366]" />
          <h2 className="text-sm font-black text-gray-900">Add New WhatsApp Store Number</h2>
        </div>
        <p className="text-xs text-gray-600 mb-4">
          Enter the WhatsApp phone number that will receive product lists when customers click &quot;Order via WhatsApp&quot; in the cart.
        </p>

        <form onSubmit={handleAddNumber} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-end">
          <div className="lg:col-span-5">
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Mobile Number (10 Digits) *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                +91
              </span>
              <input
                type="tel"
                required
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="e.g. 9876543210 or 8074312214"
                className="w-full pl-12 pr-3.5 py-2.5 text-xs font-mono font-bold rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-[#25D366]"
              />
            </div>
          </div>

          <div className="lg:col-span-4">
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Label / Description *
            </label>
            <input
              type="text"
              required
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="e.g. Main Bapatla Store, Night Shift Orders"
              className="w-full px-3.5 py-2.5 text-xs font-medium rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-[#25D366]"
            />
          </div>

          <div className="lg:col-span-3 flex items-center gap-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmitting ? 'Adding...' : 'Add Number Now'}</span>
            </button>
          </div>
        </form>

        <div className="mt-3 flex items-center gap-2">
          <input
            type="checkbox"
            id="makeActive"
            checked={makeActive}
            onChange={(e) => setMakeActive(e.target.checked)}
            className="w-4 h-4 accent-[#25D366] cursor-pointer rounded"
          />
          <label htmlFor="makeActive" className="text-xs font-medium text-gray-700 cursor-pointer">
            Set as the <strong>Active Default Number</strong> (customer orders will be sent here immediately)
          </label>
        </div>
      </div>

      {/* ================= 3. CONFIGURED NUMBERS LIST ================= */}
      <div className="bg-white rounded-3xl border border-gray-200/80 shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-black text-gray-900 tracking-tight">
              All Configured WhatsApp Order Numbers
            </h2>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Click &quot;Set as Active&quot; to switch which number receives customer orders. Click &quot;Delete&quot; to remove any number.
            </p>
          </div>
        </div>

        {!numbersList || numbersList.length === 0 ? (
          <div className="p-8 text-center text-xs text-gray-500">
            No WhatsApp numbers configured yet. Add one above.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {numbersList.map((item) => {
              const displayDigits = item.phone.startsWith('91') ? item.phone.slice(2) : item.phone;

              return (
                <div
                  key={item._id}
                  className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                    item.isActive ? 'bg-emerald-50/40' : 'hover:bg-gray-50/60'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black shrink-0 ${
                        item.isActive
                          ? 'bg-[#25D366] text-white shadow-sm'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      <Phone className="w-5 h-5" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-base font-black text-gray-900">
                          +91 {displayDigits}
                        </span>
                        {item.isActive ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            ACTIVE RECEIVER
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600">
                            Secondary
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                        <span className="font-bold text-gray-700">{item.label}</span>
                        <span>•</span>
                        <button
                          onClick={() => copyNumber(item.phone, item._id)}
                          className="hover:text-gray-900 flex items-center gap-1 cursor-pointer"
                          title="Copy phone"
                        >
                          {copiedId === item._id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-600">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:self-center">
                    {/* Test on WhatsApp */}
                    <a
                      href={`https://wa.me/${item.phone}?text=${encodeURIComponent(
                        'Hi, this is a test message from BeMyShopper Admin.'
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-all cursor-pointer"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Test Chat</span>
                    </a>

                    {/* Set Active Button */}
                    {!item.isActive && (
                      <button
                        onClick={() => handleSetActive(item)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white transition-all text-xs font-bold border border-emerald-200 cursor-pointer shadow-2xs"
                      >
                        <Star className="w-3 h-3" />
                        <span>Set as Active</span>
                      </button>
                    )}

                    {/* Fast Delete Button */}
                    <button
                      onClick={() => handleDeleteNumber(item)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white transition-all text-xs font-bold cursor-pointer border border-rose-200 shadow-2xs"
                      title="Delete this WhatsApp number"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ================= 4. HOW IT WORKS INFO ================= */}
      <div className="p-4 rounded-3xl bg-blue-50/70 border border-blue-200/80 text-xs text-blue-900 space-y-1.5">
        <div className="font-black flex items-center gap-1.5 text-blue-950">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span>How WhatsApp Order Forwarding Works:</span>
        </div>
        <p className="text-[11px] text-blue-800 leading-relaxed">
          When customers add products to their cart and click <strong>&quot;Order via WhatsApp&quot;</strong>, their entire cart list (items, quantities, prices, total bill, and delivery address) is automatically compiled into a formatted order text and dispatched directly to the <strong>Active Receiver Number</strong> configured above.
        </p>
      </div>
    </div>
  );
}
