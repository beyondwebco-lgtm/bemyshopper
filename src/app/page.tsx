'use client';

import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { StoreSelector } from '../components/StoreSelector';
import { ProductGrid } from '../components/ProductGrid';
import { ShopperProfiles } from '../components/ShopperProfiles';
import { CartDrawer } from '../components/CartDrawer';
import { CustomErrandModal } from '../components/CustomErrandForm';
import { OrderTrackingModal } from '../components/OrderTrackingModal';
import { BecomeShopperModal } from '../components/BecomeShopperModal';
import { Footer } from '../components/Footer';
import { PRODUCTS, FEATURED_SHOPPERS, STORES } from '../data/mockData';
import { CartItem, Product, CustomErrand, OrderState } from '../types';

export default function Home() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      product: PRODUCTS[0], // Organic Avocados
      quantity: 1,
      substitutionPreference: 'best_match',
    },
    {
      product: PRODUCTS[3], // Sourdough Batard
      quantity: 1,
      substitutionPreference: 'call_me',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStore, setSelectedStore] = useState('all');

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCustomErrandOpen, setIsCustomErrandOpen] = useState(false);
  const [isShopperSignupOpen, setIsShopperSignupOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);

  const [activeOrder, setActiveOrder] = useState<OrderState | null>(null);

  // Filter products
  const filteredProducts = PRODUCTS.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesStore =
      selectedStore === 'all' ||
      (() => {
        const storeObj = STORES.find((s) => s.id === selectedStore);
        return storeObj ? p.store.toLowerCase().includes(storeObj.name.toLowerCase().split(' ')[0]) : true;
      })();
    const matchesQuery =
      !searchQuery.trim() ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.store.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesStore && matchesQuery;
  });

  // Cart operations
  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1, substitutionPreference: 'best_match' }];
    });
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleUpdateSubstitution = (
    productId: string,
    pref: 'best_match' | 'call_me' | 'refund'
  ) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, substitutionPreference: pref } : item
      )
    );
  };

  // Checkout to create live order
  const handleCheckout = (tip: number, address: string) => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const newOrder: OrderState = {
      id: 'BMS-' + Math.floor(100000 + Math.random() * 900000),
      items: [...cartItems],
      customErrands: [],
      status: 'assigned',
      shopper: FEATURED_SHOPPERS[0],
      placedAt: 'Just now',
      estimatedArrival: '25-35 mins',
      totalAmount: subtotal + 5.99 + 2.49 + tip,
    };

    setActiveOrder(newOrder);
    setCartItems([]);
    setIsCartOpen(false);
    setIsTrackingOpen(true);
  };

  // Handle custom errand submission
  const handleCustomErrandSubmit = (errand: CustomErrand) => {
    const newOrder: OrderState = {
      id: 'BMS-ERR-' + Math.floor(10000 + Math.random() * 90000),
      items: [],
      customErrands: [errand],
      status: 'assigned',
      shopper: FEATURED_SHOPPERS[1],
      placedAt: 'Just now',
      estimatedArrival: errand.urgency.includes('Rush') ? '20-30 mins' : '45-60 mins',
      totalAmount: errand.estimatedBudget + (errand.urgency.includes('Rush') ? 14.99 : 9.99),
    };

    setActiveOrder(newOrder);
    setIsTrackingOpen(true);
  };

  // Advance simulation stage
  const handleAdvanceStage = () => {
    if (!activeOrder) return;
    const stages: OrderState['status'][] = ['assigned', 'shopping', 'checking_out', 'delivering', 'delivered'];
    const currentIndex = stages.indexOf(activeOrder.status);
    const nextIndex = (currentIndex + 1) % stages.length;
    setActiveOrder({ ...activeOrder, status: stages[nextIndex] });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans">
      <Navbar
        cartItems={cartItems}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenErrandModal={() => setIsCustomErrandOpen(true)}
        onOpenShopperSignup={() => setIsShopperSignupOpen(true)}
        activeOrder={activeOrder}
        onOpenTracking={() => setIsTrackingOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <main className="flex-1">
        <Hero
          onQuickSearch={(query) => {
            setSearchQuery(query);
            window.scrollTo({ top: 500, behavior: 'smooth' });
          }}
          onOpenErrandModal={() => setIsCustomErrandOpen(true)}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
          selectedCategory={selectedCategory}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <StoreSelector
            selectedStore={selectedStore}
            onSelectStore={(sId) => setSelectedStore(sId)}
          />

          <ProductGrid
            products={filteredProducts}
            cartItems={cartItems}
            onAddToCart={handleAddToCart}
            onUpdateQuantity={handleUpdateQuantity}
            onUpdateSubstitution={handleUpdateSubstitution}
            onOpenCustomErrand={() => setIsCustomErrandOpen(true)}
          />
        </div>

        <ShopperProfiles />
      </main>

      <Footer />

      {/* Modals & Drawers */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />

      <CustomErrandModal
        isOpen={isCustomErrandOpen}
        onClose={() => setIsCustomErrandOpen(false)}
        onSubmitErrand={handleCustomErrandSubmit}
      />

      {activeOrder && (
        <OrderTrackingModal
          order={activeOrder}
          isOpen={isTrackingOpen}
          onClose={() => setIsTrackingOpen(false)}
          onAdvanceStage={handleAdvanceStage}
          onResetOrder={() => {
            setActiveOrder(null);
            setIsTrackingOpen(false);
          }}
        />
      )}

      <BecomeShopperModal
        isOpen={isShopperSignupOpen}
        onClose={() => setIsShopperSignupOpen(false)}
      />
    </div>
  );
}
