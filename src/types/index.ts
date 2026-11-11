export interface Product {
  id: string;
  name: string;
  category: 'Produce' | 'Dairy & Bakery' | 'Pantry' | 'Beverages' | 'Pharmacy' | 'Household';
  price: number;
  unit: string;
  store: string;
  image: string;
  popular?: boolean;
  organic?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  substitutionPreference: 'best_match' | 'call_me' | 'refund';
  notes?: string;
}

export interface CustomErrand {
  id: string;
  title: string;
  pickupLocation: string;
  dropoffLocation: string;
  instructions: string;
  estimatedBudget: number;
  urgency: 'Standard (within 2h)' | 'Rush (within 45m)' | 'Flexible';
  status: 'pending' | 'shopper_assigned' | 'in_progress' | 'completed';
}

export interface Shopper {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  completedErrands: number;
  vehicle: string;
  bio: string;
  neighborhood: string;
}

export interface OrderState {
  id: string;
  items: CartItem[];
  customErrands: CustomErrand[];
  status: 'assigned' | 'shopping' | 'checking_out' | 'delivering' | 'delivered';
  shopper: Shopper;
  placedAt: string;
  estimatedArrival: string;
  totalAmount: number;
}
