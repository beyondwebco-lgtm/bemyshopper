'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useShop } from '../../../context/ShopContext';
import { useAuth } from '../../../context/AuthContext';
import { AuthModal } from '../../../components/AuthModal';
import {
  ArrowLeft,
  ShoppingBag,
  ShoppingCart,
  Heart,
  Plus,
  Minus,
  Check,
  Star,
  Search,
  Filter,
  X,
  Trash2,
  Sparkles,
  ShieldCheck,
  Truck,
  MapPin,
  ChevronRight,
  Package,
  MessageSquare,
} from 'lucide-react';

// Fallback category configurations
const DEFAULT_CATEGORIES = [
  {
    slug: 'groceries',
    name: 'Groceries',
    description: 'Rice, dal, pulses, cooking oils, flours, grains, and kitchen essentials',
    image: '/api/storage/categories/cat-prod-groceries.png',
    bgGradient: 'from-[#FFF8E7] via-[#FFF3D6] to-[#FFEEC4]',
    borderColor: 'border-amber-200/60',
  },
  {
    slug: 'fruits-veg',
    name: 'Fruits & Vegetables',
    description: 'Farm fresh fruits, crisp seasonal vegetables, and daily greens',
    image: '/api/storage/categories/cat-prod-fruits-veg.png',
    bgGradient: 'from-[#EBF7EE] via-[#DCF6E2] to-[#CEF2D6]',
    borderColor: 'border-emerald-200/60',
  },
  {
    slug: 'puja-items',
    name: 'Puja Items',
    description: 'Ghee diyas, camphor, pooja oil, agarbatti, kumkum, and sacred essentials',
    image: '/api/storage/categories/cat-prod-puja-items.png',
    bgGradient: 'from-[#FFF4EA] via-[#FFEAD9] to-[#FFDEC4]',
    borderColor: 'border-orange-200/60',
  },
  {
    slug: 'cleaning',
    name: 'Cleaning Essentials',
    description: 'Detergent powder, dishwash liquids, surface cleaners, and home hygiene',
    image: '/api/storage/categories/cat-prod-cleaning.png',
    bgGradient: 'from-[#EDF6FF] via-[#DBEEFF] to-[#C9E4FF]',
    borderColor: 'border-blue-200/60',
  },
  {
    slug: 'personal-care',
    name: 'Personal Care',
    description: 'Bathing soaps, hair care, shampoos, dental care, and body hygiene',
    image: '/api/storage/categories/cat-prod-personal-care.png',
    bgGradient: 'from-[#F7EFFF] via-[#EFE2FF] to-[#E5D2FF]',
    borderColor: 'border-purple-200/60',
  },
  {
    slug: 'snacks',
    name: 'Snacks & Beverages',
    description: 'Tea, filter coffee, biscuits, roasted snacks, cold drinks, and juices',
    image: '/api/storage/categories/cat-prod-snacks.png',
    bgGradient: 'from-[#FFF8ED] via-[#FFEECF] to-[#FFE3AF]',
    borderColor: 'border-amber-200/60',
  },
  {
    slug: 'home-kitchen',
    name: 'Home & Kitchen',
    description: 'Cookware, utensils, storage containers, kitchen accessories, and dining',
    image: '/api/storage/categories/cat-prod-home-kitchen.png',
    bgGradient: 'from-[#F0F5FF] via-[#E4EDFF] to-[#D5E4FF]',
    borderColor: 'border-blue-200/60',
  },
  {
    slug: 'paper',
    name: 'Paper & Disposables',
    description: 'Tissue papers, paper napkins, disposable plates, cups, and food wraps',
    image: '/api/storage/categories/cat-prod-paper.png',
    bgGradient: 'from-[#F0FDF8] via-[#E1FBF0] to-[#CFF6E5]',
    borderColor: 'border-teal-200/60',
  },
  {
    slug: 'baby-care',
    name: 'Baby Care',
    description: 'Baby diapers, wipes, baby soaps, lotions, baby shampoo, and gentle care',
    image: '/api/storage/categories/cat-prod-baby-care.png',
    bgGradient: 'from-[#FFF1F2] via-[#FFE4E6] to-[#FED2D6]',
    borderColor: 'border-rose-200/60',
  },
];

// Fallback catalog products for when database is empty
const DEFAULT_PRODUCTS = [
  {
    id: 'prod-surf-excel',
    name: 'Surf Excel Detergent Powder',
    category: 'cleaning',
    price: 349,
    originalPrice: 399,
    weight: '1 kg',
    image: '/api/storage/products/prod-surf-excel.png',
    badgeText: 'Bestseller',
    badgeIcon: '👑',
    badgeColor: 'bg-[#48BB78] text-white',
    discount: 'Save 13%',
  },
  {
    id: 'prod-vim-dishwash',
    name: 'Vim Dishwash Liquid',
    category: 'cleaning',
    price: 135,
    originalPrice: 145,
    weight: '750 ml',
    image: '/api/storage/products/prod-vim-dishwash.png',
    badgeText: '',
    badgeIcon: '',
    badgeColor: '',
    discount: 'Save 7%',
  },
  {
    id: 'prod-ambica-agarbatti',
    name: 'Ambica Durbar Bathi (Agarbathi)',
    category: 'puja-items',
    price: 89,
    originalPrice: 99,
    weight: 'Pack of 5',
    image: '/api/storage/products/prod-ambica-agarbatti.png',
    badgeText: 'Devotional',
    badgeIcon: '🪔',
    badgeColor: 'bg-amber-500 text-white',
    discount: 'Save 10%',
  },
  {
    id: 'prod-rice-5kg',
    name: 'Sona Masoori Rice',
    category: 'groceries',
    price: 329,
    originalPrice: 349,
    weight: '5 kg',
    image: '/api/storage/products/prod-rice-5kg.png',
    badgeText: 'Daily Staple',
    badgeIcon: '🍚',
    badgeColor: 'bg-emerald-600 text-white',
    discount: 'Save 6%',
  },
  {
    id: 'prod-toilet-tissue',
    name: 'Toilet Tissue Roll (3 Ply)',
    category: 'paper',
    price: 149,
    originalPrice: 165,
    weight: 'Pack of 4',
    image: '/api/storage/products/prod-toilet-tissue.png',
    badgeText: '',
    badgeIcon: '',
    badgeColor: '',
    discount: 'Save 10%',
  },
  {
    id: 'prod-nandini-ghee',
    name: 'Nandini Pure Cow Ghee',
    category: 'puja-items',
    price: 289,
    originalPrice: 310,
    weight: '500 ml',
    image: '/api/storage/products/prod-nandini-ghee.png',
    badgeText: 'Pure Cow Ghee',
    badgeIcon: '🪔',
    badgeColor: 'bg-amber-600 text-white',
    discount: 'Save 7%',
  },
  {
    id: 'prod-red-label',
    name: 'Brooke Bond Red Label Tea',
    category: 'groceries',
    price: 165,
    originalPrice: 180,
    weight: '500 g',
    image: '/api/storage/products/prod-red-label.png',
    badgeText: 'Trending',
    badgeIcon: '🔥',
    badgeColor: 'bg-[#FED7AA] text-[#C2410C]',
    discount: 'Save 8%',
  },
  {
    id: 'prod-maggi',
    name: 'Maggi 2-Minute Masala Noodles',
    category: 'snacks',
    price: 96,
    originalPrice: 104,
    weight: 'Pack of 8',
    image: '/api/storage/products/prod-maggi.png',
    badgeText: 'Quick Snack',
    badgeIcon: '⚡',
    badgeColor: 'bg-amber-500 text-white',
    discount: 'Save 8%',
  },
  {
    id: 'prod-horlicks',
    name: 'Horlicks Classic Malt Drink',
    category: 'groceries',
    price: 245,
    originalPrice: 270,
    weight: '500 g Refill',
    image: '/api/storage/products/prod-horlicks.png',
    badgeText: '',
    badgeIcon: '',
    badgeColor: '',
    discount: 'Save 9%',
  },
  {
    id: 'prod-dove-soap',
    name: 'Dove Cream Beauty Bathing Bar',
    category: 'personal-care',
    price: 175,
    originalPrice: 195,
    weight: 'Pack of 3 (100g each)',
    image: '/api/storage/products/prod-dove-soap.png',
    badgeText: 'Gentle Care',
    badgeIcon: '✨',
    badgeColor: 'bg-sky-600 text-white',
    discount: 'Save 10%',
  },
  {
    id: 'prod-colgate',
    name: 'Colgate Strong Teeth Toothpaste',
    category: 'personal-care',
    price: 125,
    originalPrice: 140,
    weight: '150 g',
    image: '/api/storage/products/prod-colgate.png',
    badgeText: '',
    badgeIcon: '',
    badgeColor: '',
    discount: 'Save 11%',
  },
  {
    id: 'prod-harpic',
    name: 'Harpic Power Plus Toilet Cleaner',
    category: 'cleaning',
    price: 189,
    originalPrice: 210,
    weight: '1 L',
    image: '/api/storage/products/prod-harpic.png',
    badgeText: 'Trending',
    badgeIcon: '🔥',
    badgeColor: 'bg-[#FED7AA] text-[#C2410C]',
    discount: 'Save 10%',
  },
];

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const slug = typeof params?.slug === 'string' ? decodeURIComponent(params.slug) : '';

  const {
    cartItems,
    addToCart,
    updateCartQuantity,
    removeCartItem,
    totalCartCount,
    wishlist,
    toggleWishlist,
    totalWishlistCount,
  } = useShop();

  const { user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  // Checkout modal
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [customerAddress, setCustomerAddress] = useState(user?.address || '');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);

  // Convex Data
  const convexCategories = useQuery(api.categories.list);
  const convexProducts = useQuery(api.products.list, {
    category: slug !== 'all' ? slug : undefined,
  });
  const createOrderMutation = useMutation(api.orders.createOrder);
  const activeWhatsAppQuery = useQuery(api.whatsapp.getActive);
  const activeStoreWhatsApp = activeWhatsAppQuery || '919999999999';

  // Active Category metadata
  const currentCategory = useMemo(() => {
    // 1. Check Convex categories
    const foundInConvex = convexCategories?.find(
      (c) => c.slug.toLowerCase() === slug.toLowerCase() || c.name.toLowerCase() === slug.toLowerCase()
    );
    if (foundInConvex) {
      return {
        slug: foundInConvex.slug,
        name: foundInConvex.name,
        description: foundInConvex.description || 'Explore products in this category',
        image: foundInConvex.image || '',
        bgGradient: foundInConvex.bgGradient || 'from-[#EBF7EE] via-[#DCF6E2] to-[#CEF2D6]',
        borderColor: foundInConvex.borderColor || 'border-emerald-200/60',
      };
    }

    // 2. Fallback category config
    const foundDefault = DEFAULT_CATEGORIES.find(
      (c) => c.slug.toLowerCase() === slug.toLowerCase()
    );
    if (foundDefault) return foundDefault;

    // 3. Fallback generic
    const formattedName = slug
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
    return {
      slug,
      name: formattedName || 'Category',
      description: `Browse all items in ${formattedName || 'this category'}`,
      image: '',
      bgGradient: 'from-[#F7F9F5] via-[#EFF5EE] to-[#E2EFE1]',
      borderColor: 'border-emerald-200/60',
    };
  }, [convexCategories, slug]);

  // All available categories list for pill bar
  const allCategoriesList = useMemo(() => {
    if (convexCategories && convexCategories.length > 0) {
      return convexCategories.map((c) => ({
        slug: c.slug,
        name: c.name,
      }));
    }
    return DEFAULT_CATEGORIES.map((c) => ({
      slug: c.slug,
      name: c.name,
    }));
  }, [convexCategories]);

  // Related products for this category
  const categoryProducts = useMemo(() => {
    let list: Array<{
      id: string;
      name: string;
      category: string;
      price: number;
      originalPrice?: number;
      weight: string;
      image: string;
      badgeText?: string;
      badgeIcon?: string;
      badgeColor?: string;
      discount?: string;
      inStock?: boolean;
    }> = [];

    // 1. From Convex
    if (convexProducts && convexProducts.length > 0) {
      list = convexProducts.map((p) => ({
        id: p._id,
        name: p.name,
        category: p.category,
        price: p.price,
        originalPrice: p.originalPrice,
        weight: p.weight,
        image: p.image,
        badgeText: p.badgeText,
        badgeIcon: p.badgeIcon,
        badgeColor: p.badgeColor,
        discount: p.discount,
        inStock: p.inStock,
      }));
    } else {
      // 2. From fallback catalog matching slug
      const matched = DEFAULT_PRODUCTS.filter(
        (p) =>
          p.category.toLowerCase() === slug.toLowerCase() ||
          p.category.toLowerCase().includes(slug.toLowerCase()) ||
          slug.toLowerCase().includes(p.category.toLowerCase())
      );
      list = matched;
    }

    // Apply search filter if user types in search
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }

    return list;
  }, [convexProducts, slug, searchFilter]);

  // Cart total calculations
  const cartProductList = useMemo(() => {
    const items: Array<{
      id: string;
      name: string;
      price: number;
      weight: string;
      image: string;
      qty: number;
    }> = [];

    for (const [id, qty] of Object.entries(cartItems)) {
      if (qty <= 0) continue;
      const foundInCat = categoryProducts.find((p) => p.id === id);
      const foundInDefault = DEFAULT_PRODUCTS.find((p) => p.id === id);
      const item = foundInCat || foundInDefault;
      if (item) {
        items.push({
          id,
          name: item.name,
          price: item.price,
          weight: item.weight,
          image: item.image,
          qty,
        });
      }
    }
    return items;
  }, [cartItems, categoryProducts]);

  const cartSubtotal = cartProductList.reduce((sum, item) => sum + item.price * item.qty, 0);
  const cartTotal = cartSubtotal;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartProductList.length === 0) return;

    setIsPlacingOrder(true);
    try {
      const res = await createOrderMutation({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: user?.email || 'guest@bemyshopper.com',
        deliveryAddress: customerAddress.trim() || 'Bapatla, AP',
        items: cartProductList.map((item) => ({
          name: item.name,
          price: item.price,
          quantity: item.qty,
          weight: item.weight,
          image: item.image,
        })),
        totalAmount: cartTotal,
        paymentMethod: 'Cash on Delivery / UPI',
      });

      // Send order to store WhatsApp
      const itemsText = cartProductList
        .map(
          (it, idx) =>
            `${idx + 1}. *${it.name}* (${it.weight})\n   ↳ Qty: ${it.qty} × ₹${it.price} = *₹${it.price * it.qty}*`
        )
        .join('\n');

      const orderMessage = `🛍️ *NEW ORDER - BeMyShopper Bapatla*
━━━━━━━━━━━━━━━━━━━━━━
👤 *Customer:* ${customerName.trim() || 'Customer'}
📞 *Phone:* ${customerPhone.trim() || 'Not specified'}
📍 *Delivery Address:* ${customerAddress.trim() || 'Bapatla, AP'}
🆔 *Order #:* ${res?.orderNumber || 'New Order'}

📦 *ORDERED PRODUCTS (${cartProductList.length} item${cartProductList.length > 1 ? 's' : ''}):*
${itemsText}

━━━━━━━━━━━━━━━━━━━━━━
💰 *Total Amount (COD):* *₹${cartTotal}*
━━━━━━━━━━━━━━━━━━━━━━
Please confirm my order and share delivery timing. Thank you!`;

      const cleanPhone = (activeStoreWhatsApp || '919999999999').replace(/[^0-9]/g, '');
      const targetPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

      window.open(`https://wa.me/${targetPhone}?text=${encodeURIComponent(orderMessage)}`, '_blank');

      setOrderSuccess(res?.orderNumber || `BMS-${Date.now().toString().slice(-6)}`);
      setIsCheckoutOpen(false);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to place order');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF9] flex flex-col text-gray-900">
      {/* ================= 1. TOP HEADER NAVIGATION ================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & Back button */}
          <div className="flex items-center gap-3">
            <Link
              href="/#categories"
              className="p-2 rounded-xl text-gray-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors flex items-center gap-1.5 text-xs font-bold"
              title="Back to All Categories"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">All Categories</span>
            </Link>

            <div className="h-5 w-px bg-gray-200 hidden sm:block" />

            <Link href="/" className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/logo.png" alt="Be My Shopper" className="h-8 w-auto object-contain" />
              <span className="font-black text-lg text-emerald-800 tracking-tight hidden md:inline">
                BeMyShopper
              </span>
            </Link>
          </div>

          {/* Search in this category */}
          <div className="flex-1 max-w-md relative">
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder={`Search in ${currentCategory.name}...`}
              className="w-full pl-9 pr-4 py-2 rounded-full border border-gray-200 text-xs focus:outline-none focus:border-[#087D2C] focus:ring-1 focus:ring-[#087D2C] bg-gray-50 focus:bg-white text-gray-900"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            {searchFilter && (
              <button
                onClick={() => setSearchFilter('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Right Action Icons: Wishlist & Cart */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Wishlist button */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="relative p-2 rounded-full text-gray-700 hover:text-red-500 hover:bg-rose-50 transition-colors cursor-pointer"
              title="Favourites"
            >
              <Heart
                className={`w-5 h-5 ${totalWishlistCount > 0 ? 'fill-red-500 text-red-500' : ''}`}
              />
              {totalWishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {totalWishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#087D2C] hover:bg-[#066323] text-white text-xs font-bold transition-all shadow-sm hover:shadow cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              <span className="w-5 h-5 rounded-full bg-white text-[#087D2C] text-[11px] font-black flex items-center justify-center">
                {totalCartCount}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ================= 2. CATEGORY PILLS BAR ================= */}
      <div className="bg-white border-b border-gray-100 overflow-x-auto scrollbar-none py-2.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          {allCategoriesList.map((cat) => {
            const isActive = cat.slug.toLowerCase() === slug.toLowerCase();
            return (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#087D2C] text-white shadow-xs'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <span>{cat.name.replace('\n', ' ')}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ================= 3. HERO BANNER FOR THIS CATEGORY ================= */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full space-y-6">
        {/* ================= 3. HERO BANNER FOR THIS CATEGORY ================= */}
        <div className={`rounded-3xl bg-gradient-to-r ${currentCategory.bgGradient} p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs`}>
          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-[11px] font-semibold text-gray-400">
              <Link href="/#categories" className="hover:text-emerald-700 transition-colors">
                Categories
              </Link>
              <span>/</span>
              <span className="text-emerald-700 font-bold">{currentCategory.name.replace('\n', ' ')}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              {currentCategory.name.replace('\n', ' ')}
            </h1>

            <p className="text-xs sm:text-sm text-gray-500 max-w-xl font-normal leading-relaxed">
              {currentCategory.description}
            </p>

            <div className="pt-1 flex items-center justify-center sm:justify-start gap-3 text-xs text-gray-500">
              <span className="font-semibold text-gray-700">
                {categoryProducts.length} {categoryProducts.length === 1 ? 'item' : 'items'} available
              </span>
              <span>•</span>
              <span className="text-emerald-700 font-medium flex items-center gap-1">
                <Truck className="w-3.5 h-3.5" />
                <span>Fast Bapatla Delivery</span>
              </span>
            </div>
          </div>

          {currentCategory.image && (
            <div className="w-28 h-28 sm:w-36 sm:h-36 shrink-0 flex items-center justify-center bg-transparent">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentCategory.image}
                alt={currentCategory.name}
                className="max-h-full max-w-full object-contain mix-blend-multiply select-none transition-transform hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
        </div>

        {/* ================= 4. RELATED PRODUCTS GRID ================= */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
              <span>All Products in {currentCategory.name.replace('\n', ' ')}</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-[#087D2C]">
                {categoryProducts.length}
              </span>
            </h2>
          </div>

          {categoryProducts.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-3xl border border-gray-200 p-8 space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <Package className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-gray-900">
                No products found in {currentCategory.name}
              </h3>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                Products for this category haven&apos;t been added yet or match your search. Check back
                soon or explore other categories.
              </p>
              <div className="pt-2">
                <Link
                  href="/#categories"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#087D2C] hover:bg-[#066323] text-white text-xs font-bold cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Browse Other Categories</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {categoryProducts.map((prod) => {
                const qty = cartItems[prod.id] || 0;
                const isLiked = !!wishlist[prod.id];

                return (
                  <div
                    key={prod.id}
                    className="bg-white rounded-2xl border border-gray-100 hover:border-gray-200/90 shadow-2xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-3 sm:p-3.5 flex flex-col justify-between relative group"
                  >
                    {/* Top Row: Badge & Wishlist Heart */}
                    <div className="flex items-center justify-between h-5 mb-1">
                      {prod.badgeText ? (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md inline-flex items-center gap-1 leading-none shadow-2xs ${
                            prod.badgeColor || 'bg-emerald-600 text-white'
                          }`}
                        >
                          {prod.badgeIcon && <span>{prod.badgeIcon}</span>}
                          <span>{prod.badgeText}</span>
                        </span>
                      ) : (
                        <div />
                      )}

                      <button
                        onClick={() => toggleWishlist(prod.id, prod.name)}
                        aria-label="Save to Wishlist"
                        className="p-1 text-gray-300 hover:text-red-500 transition-colors cursor-pointer"
                      >
                        <Heart
                          className={`w-4 h-4 transition-transform duration-200 hover:scale-110 ${
                            isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'
                          }`}
                          strokeWidth={2}
                        />
                      </button>
                    </div>

                    {/* Product Image */}
                    <div className="w-full h-28 sm:h-32 flex items-center justify-center p-2 mb-2 bg-gray-50/50 rounded-xl overflow-hidden relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className={`max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 select-none drop-shadow-2xs ${
                          prod.inStock === false ? 'opacity-40 grayscale' : ''
                        }`}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/prod-rice-5kg.png';
                        }}
                      />
                      {prod.inStock === false && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="px-2 py-0.5 rounded-md bg-red-600/90 text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
                            Out of Stock
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Details: Name & Weight */}
                    <div className="flex-1 flex flex-col justify-between mb-2.5">
                      <div>
                        <h3 className="text-xs sm:text-[13px] font-bold text-gray-900 leading-snug line-clamp-2">
                          {prod.name}
                        </h3>
                        <p className="text-[11px] text-gray-400 font-medium mt-0.5">{prod.weight}</p>
                      </div>

                      {/* Pricing */}
                      <div className="mt-2 flex items-baseline gap-1.5 flex-wrap">
                        <span className="text-sm sm:text-base font-black text-gray-900">
                          ₹{prod.price}
                        </span>
                        {prod.originalPrice && prod.originalPrice > prod.price && (
                          <span className="text-[11px] text-gray-400 line-through">
                            ₹{prod.originalPrice}
                          </span>
                        )}
                        {prod.discount && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                            {prod.discount}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Add to Cart / Quantity controls */}
                    <div>
                      {prod.inStock === false ? (
                        <button
                          disabled
                          className="w-full py-2 rounded-xl bg-gray-100 text-gray-400 text-xs font-bold cursor-not-allowed text-center"
                        >
                          Out of Stock
                        </button>
                      ) : qty > 0 ? (
                        <div className="flex items-center justify-between bg-[#087D2C] text-white rounded-xl px-2 py-1.5 shadow-sm">
                          <button
                            onClick={() => updateCartQuantity(prod.id, -1)}
                            className="p-1 hover:bg-white/20 rounded-lg cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-black">{qty}</span>
                          <button
                            onClick={() => updateCartQuantity(prod.id, 1)}
                            className="p-1 hover:bg-white/20 rounded-lg cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(prod.id, prod.name)}
                          className="w-full py-2 rounded-xl border border-[#087D2C] text-[#087D2C] hover:bg-[#087D2C] hover:text-white text-xs font-bold transition-all shadow-2xs hover:shadow cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* ================= 5. CART SLIDE-OVER DRAWER ================= */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsCartOpen(false)}
          />

          <div className="relative z-50 w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-250">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-[#087D2C]" />
                <h3 className="text-base font-bold text-gray-900">
                  Your Cart ({totalCartCount})
                </h3>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
              {cartProductList.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12 text-gray-400">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-3 text-emerald-400">
                    <ShoppingCart className="w-8 h-8" />
                  </div>
                  <p className="text-base font-semibold text-gray-800">Your cart is empty</p>
                  <p className="text-xs text-gray-500 mt-1 max-w-xs">
                    Add fresh groceries &amp; daily essentials from {currentCategory.name}.
                  </p>
                </div>
              ) : (
                cartProductList.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 rounded-2xl border border-gray-100 bg-[#FAFAFA]"
                  >
                    <div className="w-14 h-14 bg-white rounded-xl border border-gray-100 p-1 flex items-center justify-center shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.image}
                        alt={item.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-gray-900 truncate">{item.name}</h4>
                      <p className="text-[11px] text-gray-400">{item.weight}</p>
                      <span className="text-xs font-extrabold text-gray-900 mt-1 inline-block">
                        ₹{item.price * item.qty}
                      </span>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg px-2 py-1">
                      <button
                        onClick={() => updateCartQuantity(item.id, -1)}
                        className="text-gray-500 hover:text-emerald-700 cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold px-1">{item.qty}</span>
                      <button
                        onClick={() => updateCartQuantity(item.id, 1)}
                        className="text-gray-500 hover:text-emerald-700 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeCartItem(item.id)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary */}
            {cartProductList.length > 0 && (
              <div className="p-4 sm:p-5 border-t border-gray-100 bg-white space-y-3">
                <div className="space-y-1.5 text-xs text-gray-600">
                  <div className="flex justify-between text-sm font-black text-gray-900 pt-1">
                    <span>Total Amount</span>
                    <span className="text-[#087D2C]">₹{cartTotal}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-1">
                  <button
                    onClick={() => {
                      if (!user) {
                        setIsAuthModalOpen(true);
                        return;
                      }
                      if (cartProductList.length === 0) return;
                      const itemsText = cartProductList
                        .map(
                          (it, idx) =>
                            `${idx + 1}. *${it.name}* (${it.weight})\n   ↳ Qty: ${it.qty} × ₹${it.price} = *₹${it.price * it.qty}*`
                        )
                        .join('\n');

                      const orderMessage = `🛍️ *NEW ORDER - BeMyShopper Bapatla*
━━━━━━━━━━━━━━━━━━━━━━
👤 *Customer:* ${customerName.trim() || user?.name || 'Customer'}
📞 *Phone:* ${customerPhone.trim() || user?.phone || 'Not specified'}
📍 *Delivery Address:* ${customerAddress.trim() || user?.address || 'Bapatla, AP'}
🗓️ *Date:* ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}, ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}

📦 *ORDERED PRODUCTS (${cartProductList.length} item${cartProductList.length > 1 ? 's' : ''}):*
${itemsText}

━━━━━━━━━━━━━━━━━━━━━━
💰 *Total Amount (COD):* *₹${cartTotal}*
━━━━━━━━━━━━━━━━━━━━━━
Please confirm my order and share delivery timing. Thank you!`;

                      const cleanPhone = (activeStoreWhatsApp || '919999999999').replace(/[^0-9]/g, '');
                      const targetPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

                      window.open(
                        `https://wa.me/${targetPhone}?text=${encodeURIComponent(orderMessage)}`,
                        '_blank'
                      );
                    }}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#1EBE5D] hover:to-[#0F7569] text-white text-xs sm:text-sm font-black shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4 fill-white" />
                    <span>Order via WhatsApp</span>
                  </button>

                  <button
                    onClick={() => {
                      if (!user) {
                        setIsAuthModalOpen(true);
                        return;
                      }
                      setIsCheckoutOpen(true);
                    }}
                    className="w-full py-2.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Delivery Details Checkout</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= 6. WISHLIST DRAWER ================= */}
      {isWishlistOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsWishlistOpen(false)}
          />

          <div className="relative z-50 w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-250">
            <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                <h3 className="text-base font-bold text-gray-900">
                  Favourites ({totalWishlistCount})
                </h3>
              </div>
              <button
                onClick={() => setIsWishlistOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
              {totalWishlistCount === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12 text-gray-400">
                  <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center mb-3 text-rose-300">
                    <Heart className="w-8 h-8" />
                  </div>
                  <p className="text-base font-semibold text-gray-800">No favourites yet</p>
                  <p className="text-xs text-gray-500 mt-1 max-w-xs">
                    Click the heart icon on any item to save it here.
                  </p>
                </div>
              ) : (
                Object.keys(wishlist)
                  .filter((id) => wishlist[id])
                  .map((id) => {
                    const item =
                      categoryProducts.find((p) => p.id === id) ||
                      DEFAULT_PRODUCTS.find((p) => p.id === id);
                    if (!item) return null;

                    return (
                      <div
                        key={id}
                        className="flex items-center gap-3 p-3 rounded-2xl border border-gray-100 bg-[#FAFAFA]"
                      >
                        <div className="w-14 h-14 bg-white rounded-xl border border-gray-100 p-1 flex items-center justify-center shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.image}
                            alt={item.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-gray-900 truncate">{item.name}</h4>
                          <p className="text-[11px] text-gray-400">{item.weight}</p>
                          <span className="text-xs font-extrabold text-gray-900 mt-1 inline-block">
                            ₹{item.price}
                          </span>
                        </div>

                        <button
                          onClick={() => addToCart(id, item.name)}
                          className="px-3 py-1.5 rounded-lg bg-[#087D2C] text-white text-xs font-bold hover:bg-[#066323] transition-colors shrink-0 cursor-pointer"
                        >
                          Add
                        </button>

                        <button
                          onClick={() => toggleWishlist(id, item.name)}
                          className="p-1 text-red-500 hover:text-gray-400 transition-colors cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= 7. CHECKOUT MODAL ================= */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                <Truck className="w-5 h-5 text-emerald-600" />
                <span>Bapatla Home Delivery Checkout</span>
              </h3>
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePlaceOrder} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#087D2C] text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Phone Number (WhatsApp) *
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#087D2C] text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Delivery Address in Bapatla *
                </label>
                <textarea
                  rows={2}
                  required
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="House/Door No, Street, Landmark, Bapatla"
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#087D2C] text-gray-900 resize-none"
                />
              </div>

              {/* Order total info */}
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-emerald-900">Cash on Delivery / UPI</div>
                  <div className="text-[11px] text-emerald-700">Pay when order arrives</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-gray-500">Total</div>
                  <div className="text-base font-black text-[#087D2C]">₹{cartTotal}</div>
                </div>
              </div>

              <div className="pt-2 flex gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsCheckoutOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPlacingOrder}
                  className="flex-1 py-2.5 rounded-xl bg-[#087D2C] hover:bg-[#066323] text-white text-xs font-bold shadow-sm hover:shadow transition-all cursor-pointer disabled:opacity-50"
                >
                  {isPlacingOrder ? 'Placing Order...' : 'Confirm Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= 8. ORDER SUCCESS POPUP ================= */}
      {orderSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-gray-900">Order Placed Successfully!</h3>
            <p className="text-xs text-gray-500">
              Your order number is <span className="font-bold text-gray-800">{orderSuccess}</span>.
              We will deliver your items fresh to your address in Bapatla.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setOrderSuccess(null)}
                className="w-full py-2.5 rounded-xl bg-[#087D2C] hover:bg-[#066323] text-white text-xs font-bold cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= 9. FOOTER ================= */}
      <footer className="bg-white border-t border-gray-100 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-gray-400 space-y-2">
          <p>© 2026 BeMyShopper. Bapatla Online Shopping &amp; Car Rentals.</p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/" className="hover:text-emerald-700">
              Home
            </Link>
            <Link href="/#categories" className="hover:text-emerald-700">
              Categories
            </Link>
            <Link href="/about" className="hover:text-emerald-700">
              About
            </Link>
          </div>
        </div>
      </footer>

      {/* ================= AUTH MODAL (LOGIN / SIGNUP) ================= */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}
