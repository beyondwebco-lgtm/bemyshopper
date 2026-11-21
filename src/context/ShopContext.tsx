'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';

export interface CartProduct {
  id: string;
  name: string;
  price: string;
  pack?: string;
  img: string;
}

export interface CarPreferences {
  carType: '5-seater' | '7-seater';
  duration: '6hr' | '12hr' | '24hr';
  selected5SeaterPlan: '6hr' | '12hr' | '24hr';
  selected7SeaterPlan: '6hr' | '12hr' | '24hr';
  rentalName: string;
  rentalPhone: string;
  rentalDate: string;
  rentalLocation: string;
}

export interface SavedCarInquiry {
  inquiryNumber: string;
  carType: '5-seater' | '7-seater';
  duration: '6hr' | '12hr' | '24hr';
  planPrice: string;
  customerName: string;
  customerPhone: string;
  travelDate: string;
  pickupLocation: string;
  timestamp: number;
}

interface ShopContextType {
  // Cart
  cartItems: Record<string, number>;
  addToCart: (id: string, name?: string) => void;
  updateCartQuantity: (id: string, delta: number) => void;
  removeCartItem: (id: string) => void;
  clearCart: () => void;
  totalCartCount: number;

  // Wishlist / Favourites
  wishlist: Record<string, boolean>;
  toggleWishlist: (id: string, name?: string) => void;
  totalWishlistCount: number;

  // Car Options & Preferences
  carPreferences: CarPreferences;
  updateCarPreferences: (prefs: Partial<CarPreferences>) => void;
  savedInquiries: SavedCarInquiry[];
  recordCarInquiry: (inquiry: SavedCarInquiry) => void;

  // Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;

  // Product registry lookup
  registerProducts: (products: CartProduct[]) => void;
  getProduct: (id: string) => CartProduct | undefined;
}

const defaultCarPreferences: CarPreferences = {
  carType: '5-seater',
  duration: '12hr',
  selected5SeaterPlan: '12hr',
  selected7SeaterPlan: '12hr',
  rentalName: '',
  rentalPhone: '',
  rentalDate: '',
  rentalLocation: '',
};

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isLoading: isAuthLoading } = useAuth();

  const [cartItems, setCartItems] = useState<Record<string, number>>({});
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});
  const [carPreferences, setCarPreferences] = useState<CarPreferences>(defaultCarPreferences);
  const [savedInquiries, setSavedInquiries] = useState<SavedCarInquiry[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [productsMap, setProductsMap] = useState<Record<string, CartProduct>>({});

  // Keep references to avoid stale closures during login transitions
  const cartItemsRef = useRef<Record<string, number>>({});
  const wishlistRef = useRef<Record<string, boolean>>({});
  const carPreferencesRef = useRef<CarPreferences>(defaultCarPreferences);
  const userRef = useRef(user);
  const isInitializedRef = useRef(false);
  const prevUserEmailRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    cartItemsRef.current = cartItems;
  }, [cartItems]);

  useEffect(() => {
    wishlistRef.current = wishlist;
  }, [wishlist]);

  useEffect(() => {
    carPreferencesRef.current = carPreferences;
  }, [carPreferences]);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  // Helper key generators scoped per user account
  const getStorageKeys = (userEmail: string | null | undefined) => {
    if (userEmail) {
      const sanitized = encodeURIComponent(userEmail.toLowerCase().trim());
      return {
        cart: `bemyshopper_cart_${sanitized}`,
        wishlist: `bemyshopper_wishlist_${sanitized}`,
        car: `bemyshopper_car_${sanitized}`,
        inquiries: `bemyshopper_inquiries_${sanitized}`,
      };
    }
    return {
      cart: 'bemyshopper_cart_guest',
      wishlist: 'bemyshopper_wishlist_guest',
      car: 'bemyshopper_car_guest',
      inquiries: 'bemyshopper_inquiries_guest',
    };
  };

  // Sync state whenever active user changes (Login, Logout, Initial load)
  useEffect(() => {
    // Wait until auth initialization is settled
    if (isAuthLoading) return;

    // Clean up any legacy unscoped storage from previous sessions
    try {
      localStorage.removeItem('bemyshopper_cart');
      localStorage.removeItem('bemyshopper_wishlist');
      localStorage.removeItem('bemyshopper_car_preferences');
      localStorage.removeItem('bemyshopper_saved_inquiries');
    } catch {
      // Ignore
    }

    const currentUserEmail = user?.email || null;
    const prevUserEmail = prevUserEmailRef.current;
    prevUserEmailRef.current = currentUserEmail;

    // SCENARIO 1: USER LOGGED OUT -> RESET TO FRESH CLEAN "NEW SITE"
    if (prevUserEmail !== undefined && prevUserEmail !== null && currentUserEmail === null) {
      setCartItems({});
      cartItemsRef.current = {};
      setWishlist({});
      wishlistRef.current = {};
      setCarPreferences(defaultCarPreferences);
      carPreferencesRef.current = defaultCarPreferences;
      setSavedInquiries([]);

      // Wipe guest storage so logged-out visitor sees a brand-new empty site
      try {
        localStorage.removeItem('bemyshopper_cart_guest');
        localStorage.removeItem('bemyshopper_wishlist_guest');
        localStorage.removeItem('bemyshopper_car_guest');
        localStorage.removeItem('bemyshopper_inquiries_guest');
      } catch {
        // Ignore
      }
      isInitializedRef.current = true;
      return;
    }

    // SCENARIO 2: USER LOGGED IN (TRANSITION FROM GUEST TO USER) -> MERGE GUEST CART INTO USER ACCOUNT!
    if (prevUserEmail === null && currentUserEmail !== null) {
      const userKeys = getStorageKeys(currentUserEmail);

      // Collect any guest cart items (from localStorage and from memory)
      let guestCart: Record<string, number> = {};
      try {
        const rawGuest = localStorage.getItem('bemyshopper_cart_guest');
        if (rawGuest) guestCart = JSON.parse(rawGuest);
      } catch {}
      for (const [id, qty] of Object.entries(cartItemsRef.current || {})) {
        if (qty > 0) {
          guestCart[id] = Math.max(guestCart[id] || 0, qty);
        }
      }

      // Read user's existing saved cart
      let userCart: Record<string, number> = {};
      try {
        const rawUser = localStorage.getItem(userKeys.cart);
        if (rawUser) userCart = JSON.parse(rawUser);
      } catch {}

      // Seamlessly merge guest items into user cart so nothing is lost!
      const mergedCart: Record<string, number> = { ...userCart };
      for (const [id, qty] of Object.entries(guestCart)) {
        if (qty > 0) {
          mergedCart[id] = (mergedCart[id] || 0) + qty;
        }
      }

      setCartItems(mergedCart);
      cartItemsRef.current = mergedCart;
      try {
        localStorage.setItem(userKeys.cart, JSON.stringify(mergedCart));
        localStorage.removeItem('bemyshopper_cart_guest');
      } catch {}

      // Merge Wishlist
      let guestWish: Record<string, boolean> = {};
      try {
        const rawGuestWish = localStorage.getItem('bemyshopper_wishlist_guest');
        if (rawGuestWish) guestWish = JSON.parse(rawGuestWish);
      } catch {}
      for (const [id, val] of Object.entries(wishlistRef.current || {})) {
        if (val) guestWish[id] = true;
      }
      let userWish: Record<string, boolean> = {};
      try {
        const rawUserWish = localStorage.getItem(userKeys.wishlist);
        if (rawUserWish) userWish = JSON.parse(rawUserWish);
      } catch {}
      const mergedWish = { ...userWish, ...guestWish };
      setWishlist(mergedWish);
      wishlistRef.current = mergedWish;
      try {
        localStorage.setItem(userKeys.wishlist, JSON.stringify(mergedWish));
        localStorage.removeItem('bemyshopper_wishlist_guest');
      } catch {}

      // Car preferences
      let userCar = {};
      try {
        const rawUserCar = localStorage.getItem(userKeys.car);
        if (rawUserCar) userCar = JSON.parse(rawUserCar);
      } catch {}
      const mergedCar = {
        ...defaultCarPreferences,
        ...carPreferencesRef.current,
        rentalName: user?.name || '',
        rentalPhone: user?.phone || '',
        rentalLocation: user?.address || '',
        ...userCar,
      };
      setCarPreferences(mergedCar);
      carPreferencesRef.current = mergedCar;

      isInitializedRef.current = true;
      return;
    }

    // SCENARIO 3: INITIAL PAGE LOAD
    const keys = getStorageKeys(currentUserEmail);
    try {
      if (currentUserEmail) {
        // User already logged in on initial load
        // Also check if any guest cart lingered before session restore and merge it
        let guestCart: Record<string, number> = {};
        try {
          const rawGuest = localStorage.getItem('bemyshopper_cart_guest');
          if (rawGuest) guestCart = JSON.parse(rawGuest);
        } catch {}

        let userCart: Record<string, number> = {};
        const savedCart = localStorage.getItem(keys.cart);
        if (savedCart) userCart = JSON.parse(savedCart);

        const mergedCart = { ...userCart };
        for (const [id, qty] of Object.entries(guestCart)) {
          if (qty > 0) mergedCart[id] = (mergedCart[id] || 0) + qty;
        }

        setCartItems(mergedCart);
        cartItemsRef.current = mergedCart;
        if (Object.keys(guestCart).length > 0) {
          try {
            localStorage.setItem(keys.cart, JSON.stringify(mergedCart));
            localStorage.removeItem('bemyshopper_cart_guest');
          } catch {}
        }

        const savedWishlist = localStorage.getItem(keys.wishlist);
        setWishlist(savedWishlist ? JSON.parse(savedWishlist) : {});

        const savedCar = localStorage.getItem(keys.car);
        const parsedCar = savedCar ? JSON.parse(savedCar) : {};
        setCarPreferences({
          ...defaultCarPreferences,
          rentalName: user?.name || '',
          rentalPhone: user?.phone || '',
          rentalLocation: user?.address || '',
          ...parsedCar,
        });

        const savedInquiries = localStorage.getItem(keys.inquiries);
        setSavedInquiries(savedInquiries ? JSON.parse(savedInquiries) : []);
      } else {
        // Guest user on initial load: Load saved guest cart so items persist across reloads
        const savedGuestCart = localStorage.getItem('bemyshopper_cart_guest');
        const parsedGuestCart = savedGuestCart ? JSON.parse(savedGuestCart) : {};
        setCartItems(parsedGuestCart);
        cartItemsRef.current = parsedGuestCart;

        const savedGuestWish = localStorage.getItem('bemyshopper_wishlist_guest');
        setWishlist(savedGuestWish ? JSON.parse(savedGuestWish) : {});

        const savedGuestCar = localStorage.getItem('bemyshopper_car_guest');
        setCarPreferences(savedGuestCar ? JSON.parse(savedGuestCar) : defaultCarPreferences);
      }
    } catch (e) {
      console.warn('Error loading scoped shop data', e);
    }
    isInitializedRef.current = true;
  }, [user, isAuthLoading]);

  // Persist Cart to user-specific or guest key whenever cartItems changes
  useEffect(() => {
    if (!isInitializedRef.current) return;
    const keys = getStorageKeys(userRef.current?.email);
    try {
      localStorage.setItem(keys.cart, JSON.stringify(cartItems));
    } catch {
      // Ignore
    }
  }, [cartItems]);

  // Persist Wishlist to user-specific or guest key whenever wishlist changes
  useEffect(() => {
    if (!isInitializedRef.current) return;
    const keys = getStorageKeys(userRef.current?.email);
    try {
      localStorage.setItem(keys.wishlist, JSON.stringify(wishlist));
    } catch {
      // Ignore
    }
  }, [wishlist]);

  // Persist Car preferences
  useEffect(() => {
    if (!isInitializedRef.current) return;
    const keys = getStorageKeys(userRef.current?.email);
    try {
      localStorage.setItem(keys.car, JSON.stringify(carPreferences));
    } catch {
      // Ignore
    }
  }, [carPreferences]);

  // Persist Inquiries
  useEffect(() => {
    if (prevUserEmailRef.current === undefined) return;
    const keys = getStorageKeys(user?.email);
    try {
      localStorage.setItem(keys.inquiries, JSON.stringify(savedInquiries));
    } catch {
      // Ignore
    }
  }, [savedInquiries, user?.email]);

  // Toast Notification
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur));
    }, 2500);
  }, []);

  // Product registry
  const registerProducts = useCallback((items: CartProduct[]) => {
    setProductsMap((prev) => {
      let changed = false;
      const updated = { ...prev };
      for (const item of items) {
        if (!updated[item.id] || updated[item.id].price !== item.price || updated[item.id].name !== item.name) {
          updated[item.id] = item;
          changed = true;
        }
      }
      return changed ? updated : prev;
    });
  }, []);

  const getProduct = useCallback(
    (id: string) => {
      return productsMap[id];
    },
    [productsMap]
  );

  // Cart actions
  const addToCart = useCallback(
    (id: string, name?: string) => {
      setCartItems((prev) => ({
        ...prev,
        [id]: (prev[id] || 0) + 1,
      }));
      showToast(`Added ${name || 'item'} to cart 🛒`);
    },
    [showToast]
  );

  const updateCartQuantity = useCallback((id: string, delta: number) => {
    setCartItems((prev) => {
      const current = prev[id] || 0;
      const next = current + delta;
      if (next <= 0) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: next };
    });
  }, []);

  const removeCartItem = useCallback(
    (id: string) => {
      setCartItems((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
      showToast('Item removed from cart');
    },
    [showToast]
  );

  const clearCart = useCallback(() => {
    setCartItems({});
  }, []);

  const totalCartCount = Object.values(cartItems).reduce((sum, q) => sum + q, 0);

  // Wishlist actions
  const toggleWishlist = useCallback(
    (id: string, name?: string) => {
      setWishlist((prev) => {
        const willLike = !prev[id];
        showToast(
          willLike
            ? `Saved ${name || 'item'} to favorites ❤️`
            : `Removed from favorites`
        );
        return { ...prev, [id]: willLike };
      });
    },
    [showToast]
  );

  const totalWishlistCount = Object.values(wishlist).filter(Boolean).length;

  // Car Preferences actions
  const updateCarPreferences = useCallback((prefs: Partial<CarPreferences>) => {
    setCarPreferences((prev) => ({
      ...prev,
      ...prefs,
    }));
  }, []);

  const recordCarInquiry = useCallback(
    (inquiry: SavedCarInquiry) => {
      setSavedInquiries((prev) => [inquiry, ...prev]);
      setCarPreferences((prev) => ({
        ...prev,
        rentalName: inquiry.customerName,
        rentalPhone: inquiry.customerPhone,
        rentalLocation: inquiry.pickupLocation,
        rentalDate: inquiry.travelDate,
        carType: inquiry.carType,
        duration: inquiry.duration,
      }));
    },
    []
  );

  return (
    <ShopContext.Provider
      value={{
        cartItems,
        addToCart,
        updateCartQuantity,
        removeCartItem,
        clearCart,
        totalCartCount,

        wishlist,
        toggleWishlist,
        totalWishlistCount,

        carPreferences,
        updateCarPreferences,
        savedInquiries,
        recordCarInquiry,

        toastMessage,
        showToast,

        registerProducts,
        getProduct,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
