import type { Metadata } from 'next';
import './globals.css';
import { ConvexClientProvider } from '../components/ConvexClientProvider';
import { AuthProvider } from '../context/AuthContext';
import { ShopProvider } from '../context/ShopContext';

export const metadata: Metadata = {
  title: 'BeMyShopper - Bapatla Online Shopping & Car Rentals',
  description:
    'Order Groceries, Pooja Essentials, Fresh Fruits & Vegetables, Daily Needs, and Rent 5-Seater & 7-Seater Self-Drive Cars in Bapatla, Andhra Pradesh.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-white text-gray-900">
        <ConvexClientProvider>
          <AuthProvider>
            <ShopProvider>{children}</ShopProvider>
          </AuthProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
