import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ConvexClientProvider } from '../components/ConvexClientProvider';
import { AuthProvider } from '../context/AuthContext';
import { ShopProvider } from '../context/ShopContext';

export const metadata: Metadata = {
  title: 'BeMyShopper - Bapatla Online Shopping & Car Rentals',
  description:
    'Order Groceries, Pooja Essentials, Fresh Fruits & Vegetables, Daily Needs, and Rent 5-Seater & 7-Seater Self-Drive Cars in Bapatla, Andhra Pradesh.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png', sizes: '512x512' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#087D2C',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Preconnect to Convex Cloud backend and image CDNs */}
        <link rel="preconnect" href="https://happy-swan-895.convex.cloud" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://happy-swan-895.convex.cloud" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body className="antialiased bg-white text-gray-900 overflow-x-hidden selection:bg-[#087D2C]/20 selection:text-[#087D2C]">
        <ConvexClientProvider>
          <AuthProvider>
            <ShopProvider>{children}</ShopProvider>
          </AuthProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
