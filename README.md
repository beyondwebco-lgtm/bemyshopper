# BeMyShopper 🛒

**BeMyShopper** is a modern on-demand grocery shopping & errand concierge web application built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS**.

---

## 🌟 Key Features

1. **Local Supermarket & Store Catalog**:
   - Browse partner stores (Organic Market, City Grocer, Metro Pharmacy, Artisan Bakery, Pet Depot).
   - Filter items by category (Fresh Produce, Dairy & Bakery, Pantry & Staples, Beverages, Pharmacy, Household).
   - Real-time product search with keyword highlighting.

2. **Smart Shopping Cart & Substitution Control**:
   - Add/remove items with instant subtotal and tax calculation.
   - Choose item replacement preferences (*Best Match*, *Call Me*, or *Refund*).
   - Dedicated shopper tip selector ($2, $4, $6, $8) and custom delivery notes.
   - Transparent pricing: zero hidden markups with original store receipt photos.

3. **Custom Errand Request Concierge**:
   - Form for any custom errand (e.g., picking up dry cleaning, package drops, specialty pharmacy runs).
   - Location inputs (pickup & drop-off), budget allowances, and rush dispatch options.

4. **Live Shopper Tracking & In-Aisle Chat Simulator**:
   - Multi-stage order timeline (*Shopper Assigned* → *Shopping in Store* → *Cashier & Receipt* → *En Route* → *Delivered*).
   - Interactive demo stage advancer.
   - Direct messaging with the assigned personal shopper.

5. **Community Shopper Recruitment**:
   - "Become a Shopper" partner application modal.
   - Vehicle selection (E-bike, car, scooter, walking) and neighborhood zones.

---

## 🚀 Getting Started

### 1. Start the Development Server
```bash
cd ~/Documents/bemyshopper
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Build for Production
```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
bemyshopper/
├── bemyshopper                 # Project manifest & metadata file
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with Geist font & metadata
│   │   ├── page.tsx            # Main stateful home page & interactive orchestration
│   │   └── globals.css         # Tailwind CSS styling
│   ├── components/
│   │   ├── Navbar.tsx          # Top bar, location picker, search, errand trigger & cart count
│   │   ├── Hero.tsx            # Hero banner, instant search, and feature highlights
│   │   ├── StoreSelector.tsx   # Local store filter chips
│   │   ├── ProductCard.tsx     # Item card with substitution controls
│   │   ├── ProductGrid.tsx     # Responsive item layout & empty state
│   │   ├── CustomErrandForm.tsx# Custom errand request modal
│   │   ├── ShopperProfiles.tsx # Community shopper ratings & badges
│   │   ├── CartDrawer.tsx      # Slide-out basket & checkout breakdown
│   │   ├── OrderTrackingModal.tsx# Simulated real-time shopper status & in-aisle chat
│   │   ├── BecomeShopperModal.tsx# Shopper partner onboarding modal
│   │   └── Footer.tsx          # Navigation links and receipt guarantee
│   ├── data/
│   │   └── mockData.ts         # Stores, grocery items, and shoppers
│   └── types/
│       └── index.ts            # TypeScript interfaces
├── package.json
└── tsconfig.json
```
