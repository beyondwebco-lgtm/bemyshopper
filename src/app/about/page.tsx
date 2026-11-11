'use client';

import React from 'react';
import Link from 'next/link';
import {
  MapPin,
  Search,
  User,
  ShoppingCart,
  Award,
  Quote,
  CheckCircle2,
  ShoppingBag,
  Utensils,
  Flame,
  Car,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Truck,
  Heart,
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-gray-900 flex flex-col font-sans">
      {/* ================= TOP NAVIGATION BAR ================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo Lockup */}
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/logo.png"
                  alt="BeMyShopper"
                  className="h-10 sm:h-11 w-auto object-contain group-hover:scale-105 transition-transform"
                />
              </Link>

              {/* Navigation Links */}
              <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                <Link
                  href="/"
                  className="text-gray-700 hover:text-[#1D7A34] transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/#categories"
                  className="text-gray-700 hover:text-[#1D7A34] transition-colors"
                >
                  Categories
                </Link>
                <Link
                  href="/#diwali-offers"
                  className="text-gray-700 hover:text-[#1D7A34] transition-colors"
                >
                  Offers
                </Link>
                <Link
                  href="/about"
                  className="text-[#1D7A34] font-bold border-b-2 border-[#1D7A34] pb-0.5"
                >
                  About
                </Link>
              </nav>
            </div>

            {/* Right Action Items */}
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#137A2C] hover:bg-[#0F6323] px-4 py-2 rounded-full transition-all shadow-2xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Store</span>
              </Link>

              <Link
                href="/"
                aria-label="Home"
                className="p-2 text-gray-700 hover:text-[#1D7A34] hover:bg-gray-50 rounded-full transition-colors sm:hidden"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ================= HERO STRIP ================= */}
      <div className="bg-gradient-to-r from-[#137A2C] via-[#0E5C21] to-[#083D15] text-white py-10 sm:py-14 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-emerald-200 text-xs font-bold mb-3 border border-white/20 backdrop-blur-xs">
            <Award className="w-3.5 h-3.5" />
            <span>Leadership & Vision</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            About BeMyShopper
          </h1>
          <p className="text-sm sm:text-base text-emerald-100/90 mt-2 max-w-2xl leading-relaxed">
            Building the everyday digital backbone for local businesses, service providers, and families across Bapatla, Andhra Pradesh, and India.
          </p>
        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 w-full">
        {/* Founder Spotlight Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Founder Identity Card */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 border border-[#E3EFE5] shadow-xs flex flex-col justify-between relative overflow-hidden">
            {/* Decorative background glows */}
            <div className="absolute -top-16 -right-16 w-40 h-40 bg-[#137A2C]/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-[#FFEEC4]/40 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10">
              {/* Founder Monogram / Avatar Lockup */}
              <div className="relative inline-block mb-5">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br from-[#137A2C] via-[#0E5C21] to-[#083D15] p-1 shadow-lg shadow-[#137A2C]/20 flex items-center justify-center">
                  <div className="w-full h-full rounded-[22px] bg-gradient-to-br from-[#189136] to-[#0A471A] flex flex-col items-center justify-center text-white border border-white/20">
                    <span className="text-3xl sm:text-4xl font-black tracking-wider text-amber-200 drop-shadow-xs">
                      S
                    </span>
                    <span className="text-[10px] font-bold tracking-widest text-emerald-100 uppercase mt-0.5">
                      Founder
                    </span>
                  </div>
                </div>
                {/* Verified Crown Badge */}
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-amber-400 to-amber-500 text-gray-950 p-1.5 rounded-xl shadow-md border-2 border-white flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
              </div>

              {/* Name & Title */}
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400 block">
                Platform Founder
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mt-0.5">
                Sivaji
              </h2>
              <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-[#137A2C] text-white text-xs font-bold shadow-2xs">
                <span>Founder & CEO</span>
              </div>

              {/* Location Tag */}
              <div className="flex items-center gap-2 mt-4 text-xs font-semibold text-gray-600 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
                <MapPin className="w-4 h-4 text-[#137A2C] shrink-0" />
                <span>Bapatla, Andhra Pradesh, India</span>
              </div>

              {/* Core Commitments */}
              <div className="mt-6 pt-5 border-t border-[#E3EFE5] space-y-2.5">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400">
                  Core Commitments
                </span>
                <div className="grid grid-cols-1 gap-2 text-xs font-bold text-gray-800">
                  <div className="flex items-center gap-2 bg-[#F9FCFA] px-2.5 py-1.5 rounded-lg border border-gray-100">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#137A2C] shrink-0" />
                    <span>Customer Convenience</span>
                  </div>
                  <div className="flex items-center gap-2 bg-[#F9FCFA] px-2.5 py-1.5 rounded-lg border border-gray-100">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#137A2C] shrink-0" />
                    <span>Transparent Pricing</span>
                  </div>
                  <div className="flex items-center gap-2 bg-[#F9FCFA] px-2.5 py-1.5 rounded-lg border border-gray-100">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#137A2C] shrink-0" />
                    <span>Local Business Growth</span>
                  </div>
                  <div className="flex items-center gap-2 bg-[#F9FCFA] px-2.5 py-1.5 rounded-lg border border-gray-100">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#137A2C] shrink-0" />
                    <span>Reliable Doorstep Service</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Tag */}
            <div className="relative z-10 mt-6 pt-4 border-t border-[#E3EFE5] flex items-center justify-between text-[11px] text-gray-500 font-medium">
              <span>Expansion Road</span>
              <span className="font-bold text-[#137A2C]">AP &rarr; Pan-India</span>
            </div>
          </div>

          {/* Right Column: About the Founder & Vision */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-gray-100 shadow-xs flex flex-col justify-between">
            <div>
              {/* Section Title */}
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-1.5 h-7 bg-[#137A2C] rounded-full" />
                <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                  About the Founder
                </h3>
              </div>

              {/* 3 Bio Paragraphs */}
              <div className="space-y-4 text-sm sm:text-base leading-relaxed text-gray-700">
                <p>
                  <strong className="text-gray-900 font-bold">Sivaji</strong> is an entrepreneur from{' '}
                  <span className="font-semibold text-gray-900">Bapatla, Andhra Pradesh</span>, with a vision to build a user-friendly digital platform that connects local businesses, service providers, and customers.
                </p>

                <p>
                  His goal is to make everyday shopping and local services easily accessible through a single online platform. The platform aims to bring groceries, fruits, food delivery, pooja essentials, self-drive car rentals, and various local services under one digital ecosystem.
                </p>

                <p>
                  With a focus on customer convenience, transparent pricing, local business growth, and reliable service, he aims to expand the platform across Andhra Pradesh and eventually throughout India.
                </p>
              </div>

              {/* Vision Box */}
              <div className="mt-8 rounded-2xl bg-gradient-to-r from-[#FFFBEA] via-[#F4FAF5] to-[#EAF7EE] p-5 sm:p-6 border border-[#E0EEDF] relative overflow-hidden">
                <div className="flex items-start gap-3.5 relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-[#137A2C] text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                    <Quote className="w-5 h-5 fill-white" />
                  </div>
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-[#137A2C]">
                      Vision
                    </span>
                    <p className="text-base sm:text-lg font-bold text-gray-900 italic mt-1 leading-snug">
                      &ldquo;To make everyday needs and local services accessible to everyone through one trusted digital platform.&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Ecosystem Scope Cards */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400 block mb-3">
                One Digital Ecosystem Across Everyday Needs
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-[#F0FDF4] hover:border-[#DCF6E2] transition-colors">
                  <ShoppingBag className="w-5 h-5 text-[#137A2C] mb-2" />
                  <div className="text-xs font-bold text-gray-900">Groceries</div>
                  <div className="text-[11px] text-gray-500">Daily staples & pantry</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-[#F0FDF4] hover:border-[#DCF6E2] transition-colors">
                  <Utensils className="w-5 h-5 text-[#137A2C] mb-2" />
                  <div className="text-xs font-bold text-gray-900">Fruits & Food</div>
                  <div className="text-[11px] text-gray-500">Fresh produce & meals</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-[#F0FDF4] hover:border-[#DCF6E2] transition-colors">
                  <Flame className="w-5 h-5 text-[#137A2C] mb-2" />
                  <div className="text-xs font-bold text-gray-900">Pooja Essentials</div>
                  <div className="text-[11px] text-gray-500">Pure devotional items</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-[#F0FDF4] hover:border-[#DCF6E2] transition-colors">
                  <Car className="w-5 h-5 text-[#137A2C] mb-2" />
                  <div className="text-xs font-bold text-gray-900">Cars & Services</div>
                  <div className="text-[11px] text-gray-500">Rentals & local help</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Home CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#137A2C] hover:bg-[#0F6323] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all"
          >
            <span>Explore Products & Start Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      {/* ================= SITE FOOTER ================= */}
      <footer className="bg-white border-t border-gray-100 pt-10 pb-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-gray-100">
            {/* Brand Col */}
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/logo.png"
                  alt="BeMyShopper"
                  className="h-8 w-auto object-contain"
                />
              </div>
              <p className="text-xs sm:text-sm text-gray-500 max-w-md leading-relaxed">
                Your trusted digital ecosystem connecting local businesses, service providers, and everyday shoppers across Bapatla, Andhra Pradesh, and beyond.
              </p>
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 pt-1">
                <MapPin className="w-3.5 h-3.5 text-[#137A2C]" />
                <span>Bapatla, Andhra Pradesh, India</span>
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-3">
                Quick Navigation
              </h4>
              <ul className="space-y-2 text-xs text-gray-600">
                <li>
                  <Link href="/" className="hover:text-[#137A2C] transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/#categories" className="hover:text-[#137A2C] transition-colors">
                    Shop Categories
                  </Link>
                </li>
                <li>
                  <Link href="/#diwali-offers" className="hover:text-[#137A2C] transition-colors">
                    Diwali Offers
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-[#137A2C] transition-colors">
                    About Founder
                  </Link>
                </li>
              </ul>
            </div>

            {/* Leadership */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-3">
                Leadership
              </h4>
              <div className="space-y-1.5 text-xs text-gray-600">
                <p className="font-bold text-gray-900">Sivaji</p>
                <p className="text-gray-500">Founder &amp; CEO</p>
                <p className="text-gray-500">Bapatla, Andhra Pradesh</p>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-3">
            <p>&copy; 2026 BeMyShopper. Founded by Sivaji. All rights reserved.</p>
            <p>Made with passion for Bapatla &amp; Andhra Pradesh</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

