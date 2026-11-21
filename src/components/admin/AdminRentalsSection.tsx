'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Car,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  Sparkles,
  RefreshCw,
  Upload,
  Image as ImageIcon,
  DollarSign,
  Pencil,
  Copy,
  ClipboardPaste,
  Eye,
  ExternalLink,
  MessageSquare,
  Users,
  Fuel,
  Gauge,
  Check,
  X,
  AlertCircle,
  HelpCircle,
  Calendar,
  MapPin,
  ChevronRight,
  ShieldCheck,
  Star,
} from 'lucide-react';

export interface RentalPlanInfo {
  price: number;
  km: string;
  description: string;
  popular?: boolean;
  bestValue?: boolean;
}

export interface VehicleTariff {
  title: string;
  subtitle: string;
  tag: string;
  passengers: string;
  image?: string;
  plans: {
    '6hr': RentalPlanInfo;
    '12hr': RentalPlanInfo;
    '24hr': RentalPlanInfo;
  };
}

export interface AllTariffs {
  fiveSeater: VehicleTariff;
  sevenSeater: VehicleTariff;
}

export interface RentalCarItem {
  id: string;
  name: string;
  category: '5-seater' | '7-seater';
  categoryLabel?: string;
  tag?: string;
  tagColor?: string;
  images: string[];
  description?: string;
  specs: {
    seats: string;
    transmission: string;
    fuel: string;
    mileage: string;
  };
  features: string[];
  isAvailable: boolean;
  createdAt: number;
  updatedAt?: number;
}

const DEFAULT_TARIFFS: AllTariffs = {
  fiveSeater: {
    title: 'Any 5 Seater',
    subtitle: 'Maruti Swift • Toyota Etios • Hyundai Venue & more',
    tag: 'Compact SUV & Hatchback',
    passengers: 'Up to 5 Passengers',
    plans: {
      '6hr': { price: 900, km: '120 KM Included', description: 'Local city rides & short errands' },
      '12hr': { price: 1490, km: '200 KM Included', description: 'Day outings & Suryalanka Beach', popular: true },
      '24hr': { price: 2490, km: '400 KM Included', description: 'Full day trips & outstation travel', bestValue: true },
    },
  },
  sevenSeater: {
    title: 'Any 7 Seater',
    subtitle: 'Toyota Innova Crysta • Kia Carens • Maruti Ertiga & more',
    tag: 'Luxury Family MPV',
    passengers: 'Up to 7-8 Passengers',
    plans: {
      '6hr': { price: 1800, km: '120 KM Included', description: 'Family temple visits & functions' },
      '12hr': { price: 2490, km: '200 KM Included', description: 'Full day family outing & Suryalanka', popular: true },
      '24hr': { price: 3490, km: '400 KM Included', description: 'Vijayawada, Hyderabad & outstation', bestValue: true },
    },
  },
};

interface AdminRentalsSectionProps {
  inquiries?: any[];
  onUpdateInquiryStatus?: (id: any, status: any) => Promise<any>;
}

export default function AdminRentalsSection({
  inquiries = [],
  onUpdateInquiryStatus,
}: AdminRentalsSectionProps) {
  // Main sub-tabs: 'tariffs' (Pricing) | 'fleet' (Car Fleet with Multiple Photos) | 'inquiries' (Customer Leads)
  const [activeSubTab, setActiveSubTab] = useState<'tariffs' | 'fleet' | 'inquiries'>('tariffs');

  // ================= TARIFFS STATE =================
  const [tariffs, setTariffs] = useState<AllTariffs>(DEFAULT_TARIFFS);
  const [isSavingTariffs, setIsSavingTariffs] = useState(false);
  const [tariffsStatusMessage, setTariffsStatusMessage] = useState<string | null>(null);

  // ================= FLEET STATE =================
  const [cars, setCars] = useState<RentalCarItem[]>([]);
  const [isLoadingCars, setIsLoadingCars] = useState(true);
  const [fleetFilter, setFleetFilter] = useState<'all' | '5-seater' | '7-seater'>('all');

  // Add / Edit Modal State
  const [isCarModalOpen, setIsCarModalOpen] = useState(false);
  const [editingCarId, setEditingCarId] = useState<string | null>(null);
  const [carForm, setCarForm] = useState({
    name: '',
    category: '5-seater' as '5-seater' | '7-seater',
    categoryLabel: 'Compact SUV & Hatchback',
    tag: 'Suryalanka Beach Special',
    tagColor: 'orange',
    description: '',
    seats: '5 Passengers',
    transmission: 'Manual & Automatic',
    fuel: 'Petrol / Diesel',
    mileage: '16-18 km/l',
    featuresText: 'High ground clearance ideal for beach rides\nChilling AC & Bluetooth audio system\nClean sanitized interior with doorstep handover',
    isAvailable: true,
  });
  const [carImages, setCarImages] = useState<string[]>([]);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);
  const [isSavingCar, setIsSavingCar] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const pasteCatcherRef = useRef<HTMLInputElement | null>(null);

  // ================= 1. LOAD TARIFFS ON MOUNT =================
  useEffect(() => {
    async function loadTariffs() {
      try {
        const res = await fetch('/api/tariffs');
        if (res.ok) {
          const data = await res.json();
          if (data && data.fiveSeater && data.sevenSeater) {
            setTariffs(data);
          }
        }
      } catch (err) {
        console.error('Failed to load tariffs:', err);
      }
    }
    loadTariffs();
  }, []);

  // ================= 2. LOAD CARS ON MOUNT =================
  const fetchCars = async () => {
    setIsLoadingCars(true);
    try {
      const res = await fetch('/api/cars');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setCars(data);
        }
      }
    } catch (err) {
      console.error('Failed to fetch cars:', err);
    } finally {
      setIsLoadingCars(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  // ================= 3. SAVE TARIFFS =================
  const handleSaveTariffs = async () => {
    setIsSavingTariffs(true);
    setTariffsStatusMessage(null);
    try {
      const res = await fetch('/api/tariffs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tariffs),
      });

      if (!res.ok) throw new Error('Failed to save tariffs');
      
      // Also cache to localStorage for instant client hydration
      if (typeof window !== 'undefined') {
        localStorage.setItem('bemyshopper_rental_tariffs', JSON.stringify(tariffs));
      }

      setTariffsStatusMessage('✓ Tariff prices updated successfully! Visible on the Home page immediately.');
      setTimeout(() => setTariffsStatusMessage(null), 5000);
    } catch (err) {
      setTariffsStatusMessage('❌ Error saving prices. Please try again.');
    } finally {
      setIsSavingTariffs(false);
    }
  };

  const handleResetTariffsToDefault = () => {
    if (confirm('Reset rental prices to brochure defaults (₹900, ₹1,490, ₹2,490 / ₹1,800, ₹2,490, ₹3,490)?')) {
      setTariffs(DEFAULT_TARIFFS);
    }
  };

  // ================= 4. MULTIPLE PHOTOS LOGIC =================
  // Helper to upload File to /api/upload
  const uploadImageFile = async (file: File) => {
    setIsUploadingPhoto(true);
    setUploadFeedback(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'cars');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setCarImages((prev) => [...prev, data.url]);
        setUploadFeedback(`✓ Uploaded "${file.name}" to cloud storage`);
      } else {
        // Fallback to base64 if R2 fails
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            setCarImages((prev) => [...prev, reader.result as string]);
            setUploadFeedback(`✓ Added "${file.name}"`);
          }
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.error('Upload error:', err);
      // Fallback: read as base64
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setCarImages((prev) => [...prev, reader.result as string]);
          setUploadFeedback(`✓ Added "${file.name}"`);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // Helper to upload image URL or base64 data to Cloudflare R2
  const uploadUrlOrDataToR2 = async (text: string) => {
    if (!text) return false;
    if (text.startsWith('/api/storage/')) {
      setCarImages((prev) => [...prev, text]);
      setUploadFeedback('✓ Added image');
      return true;
    }
    setIsUploadingPhoto(true);
    setUploadFeedback('Uploading image to cloud storage...');
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dataUrl: text.startsWith('data:image/') ? text : undefined,
          url: !text.startsWith('data:image/') ? text : undefined,
          folder: 'cars',
        }),
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setCarImages((prev) => [...prev, data.url]);
        setUploadFeedback('✓ Uploaded image to cloud storage');
        return true;
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (err) {
      console.warn('R2 upload failed, adding directly:', err);
      setCarImages((prev) => [...prev, text]);
      setUploadFeedback('✓ Added copied image');
      return true;
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // Helper: Delete image from Cloudflare R2 bucket (bemyshopper-dev)
  const deleteImageFromR2 = async (imageUrl?: string) => {
    if (!imageUrl || imageUrl.startsWith('data:') || imageUrl.startsWith('/images/')) return;
    try {
      await fetch('/api/upload', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: imageUrl }),
      });
    } catch (e) {
      console.warn('Could not delete image from Cloudflare R2:', e);
    }
  };

  // Multiple files selected from file picker
  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      await uploadImageFile(files[i]);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Robust clipboard processor for files, blobs, dataUrls, and text
  const processClipboardData = async (clipboardData: DataTransfer | null): Promise<boolean> => {
    if (!clipboardData) return false;

    // 1. Check for files directly (e.g. copied image file from Mac Finder, Windows Explorer, or browser)
    const files = clipboardData.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        if (files[i].type.startsWith('image/')) {
          await uploadImageFile(files[i]);
          return true;
        }
      }
    }

    // 2. Check for clipboard items (e.g. copied screenshot, web image)
    const items = clipboardData.items;
    if (items && items.length > 0) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            await uploadImageFile(file);
            return true;
          }
        }
      }
    }

    // 3. Check for text (e.g. image link, data:image URI)
    const text = clipboardData.getData('text')?.trim();
    if (text) {
      if (text.startsWith('data:image/') || text.startsWith('http://') || text.startsWith('https://') || text.startsWith('/')) {
        await uploadUrlOrDataToR2(text);
        return true;
      }
    }

    return false;
  };

  // Window-level paste listener active whenever the modal is open
  useEffect(() => {
    if (!isCarModalOpen) return;

    const handleWindowPaste = async (e: ClipboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isTextEditor = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') && target !== pasteCatcherRef.current;

      const hasImageFile =
        (e.clipboardData?.files && Array.from(e.clipboardData.files).some((f) => f.type.startsWith('image/'))) ||
        (e.clipboardData?.items && Array.from(e.clipboardData.items).some((i) => i.type.startsWith('image/')));

      if (!isTextEditor || hasImageFile) {
        const handled = await processClipboardData(e.clipboardData);
        if (handled) {
          e.preventDefault();
        }
      }
    };

    window.addEventListener('paste', handleWindowPaste);
    return () => {
      window.removeEventListener('paste', handleWindowPaste);
    };
  }, [isCarModalOpen]);

  // Click handler for Paste Card
  const handlePasteFromClipboard = async () => {
    // Focus the paste catcher so that pressing Cmd+V or right-click paste works immediately
    pasteCatcherRef.current?.focus();

    // 1. Try reading rich image files via modern navigator.clipboard (silently catching permissions blocks)
    if (typeof navigator !== 'undefined' && navigator.clipboard?.read) {
      try {
        const items = await navigator.clipboard.read();
        for (const item of items) {
          const imgType = item.types.find((t) => t.startsWith('image/'));
          if (imgType) {
            const blob = await item.getType(imgType);
            const ext = imgType.split('/')[1]?.replace('+xml', '') || 'png';
            const file = new File([blob], `pasted-${Date.now()}.${ext}`, { type: imgType });
            await uploadImageFile(file);
            return;
          }
        }
      } catch {
        // Silently catch NotAllowedError (browser security restriction on programmatic clipboard.read)
      }
    }

    // 2. Try reading clipboard text via navigator.clipboard.readText
    if (typeof navigator !== 'undefined' && navigator.clipboard?.readText) {
      try {
        const text = (await navigator.clipboard.readText())?.trim();
        if (text && (text.startsWith('http://') || text.startsWith('https://') || text.startsWith('data:image/'))) {
          await uploadUrlOrDataToR2(text);
          return;
        }
      } catch {
        // Silently catch NotAllowedError
      }
    }

    // 3. If programmatic access was blocked by browser security permissions, guide user smoothly
    setUploadFeedback('📋 Browser security blocked direct read. Please press Cmd+V (or Ctrl+V) to paste!');
  };

  // Modal onPaste handler
  const handleModalPaste = async (e: React.ClipboardEvent) => {
    const handled = await processClipboardData(e.clipboardData);
    if (handled) {
      e.preventDefault();
    }
  };

  // Reorder / Set Cover Photo
  const handleSetCoverPhoto = (index: number) => {
    if (index === 0) return;
    setCarImages((prev) => {
      const copy = [...prev];
      const [selected] = copy.splice(index, 1);
      return [selected, ...copy];
    });
  };

  const handleRemovePhoto = async (index: number) => {
    const photoToRemove = carImages[index];
    setCarImages((prev) => prev.filter((_, i) => i !== index));
    if (photoToRemove) {
      await deleteImageFromR2(photoToRemove);
    }
  };

  // ================= 5. OPEN / SAVE CAR MODAL =================
  const handleOpenAddCarModal = () => {
    setEditingCarId(null);
    setCarForm({
      name: '',
      category: '5-seater',
      categoryLabel: 'Compact SUV & Hatchback',
      tag: 'Suryalanka Beach Special',
      tagColor: 'orange',
      description: 'Well-maintained, fully sanitized, chilled AC with doorstep delivery in Bapatla.',
      seats: '5 Passengers',
      transmission: 'Manual & Automatic',
      fuel: 'Petrol / Diesel',
      mileage: '16-18 km/l',
      featuresText: 'High ground clearance ideal for beach rides\nChilling AC & Bluetooth audio system\nClean sanitized interior with doorstep handover',
      isAvailable: true,
    });
    setCarImages([]);
    setUploadFeedback(null);
    setIsCarModalOpen(true);
  };

  const handleOpenEditCarModal = (car: RentalCarItem) => {
    setEditingCarId(car.id);
    setCarForm({
      name: car.name,
      category: car.category,
      categoryLabel: car.categoryLabel || (car.category === '5-seater' ? 'Compact SUV & Hatchback' : 'Luxury Family MPV'),
      tag: car.tag || 'Popular Choice',
      tagColor: car.tagColor || 'orange',
      description: car.description || '',
      seats: car.specs.seats,
      transmission: car.specs.transmission,
      fuel: car.specs.fuel,
      mileage: car.specs.mileage,
      featuresText: car.features.join('\n'),
      isAvailable: car.isAvailable,
    });
    setCarImages(car.images || []);
    setUploadFeedback(null);
    setIsCarModalOpen(true);
  };

  const handleSaveCar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!carForm.name.trim()) {
      alert('Please enter a car name');
      return;
    }
    if (carImages.length === 0) {
      if (!confirm('You have not added any photos for this car. Do you want to save it with a placeholder image?')) {
        return;
      }
    }

    setIsSavingCar(true);
    try {
      const features = carForm.featuresText
        .split('\n')
        .map((f) => f.trim())
        .filter((f) => f.length > 0);

      const payload = {
        id: editingCarId || undefined,
        name: carForm.name.trim(),
        category: carForm.category,
        categoryLabel: carForm.categoryLabel.trim(),
        tag: carForm.tag.trim(),
        tagColor: carForm.tagColor,
        images: carImages.length > 0 ? carImages : ['/images/cars/placeholder.png'],
        description: carForm.description.trim(),
        specs: {
          seats: carForm.seats.trim(),
          transmission: carForm.transmission.trim(),
          fuel: carForm.fuel.trim(),
          mileage: carForm.mileage.trim(),
        },
        features,
        isAvailable: carForm.isAvailable,
      };

      const res = await fetch('/api/cars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to save car');

      await fetchCars();
      setIsCarModalOpen(false);
    } catch (err) {
      console.error('Error saving car:', err);
      alert('Failed to save car. Please check inputs and try again.');
    } finally {
      setIsSavingCar(false);
    }
  };

  const handleDeleteCar = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}" from car rentals?`)) return;
    try {
      const carToDelete = cars.find((c) => c.id === id);
      const res = await fetch(`/api/cars?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setCars((prev) => prev.filter((c) => c.id !== id));
        // Delete images associated with this car from Cloudflare R2
        if (carToDelete && Array.isArray(carToDelete.images)) {
          for (const img of carToDelete.images) {
            await deleteImageFromR2(img);
          }
        }
      } else {
        alert('Failed to delete car');
      }
    } catch (err) {
      console.error('Error deleting car:', err);
      alert('Error deleting car');
    }
  };

  const handleToggleCarAvailability = async (car: RentalCarItem) => {
    try {
      const updatedCar = { ...car, isAvailable: !car.isAvailable };
      const res = await fetch('/api/cars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCar),
      });
      if (res.ok) {
        setCars((prev) => prev.map((c) => (c.id === car.id ? updatedCar : c)));
      }
    } catch (err) {
      console.error('Error updating availability:', err);
    }
  };

  const filteredCars = cars.filter((car) => {
    if (fleetFilter === 'all') return true;
    return car.category === fleetFilter;
  });

  return (
    <div className="space-y-6">
      {/* ================= 1. SECTION HEADER ================= */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-gray-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Car className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-gray-900 flex items-center gap-2">
              <span>Car Rental Management</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-orange-100 text-orange-800">
                Bapatla Cars
              </span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Change rental prices, add individual cars with multiple photos, and review booking inquiries.
            </p>
          </div>
        </div>

        {/* Sub-tab Navigation Pills */}
        <div className="flex items-center p-1 rounded-2xl bg-gray-100/80 border border-gray-200 self-start md:self-auto">
          <button
            onClick={() => setActiveSubTab('tariffs')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'tariffs'
                ? 'bg-white text-orange-700 shadow-xs border border-gray-200/60'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <DollarSign className="w-4 h-4 text-orange-600" />
            <span>Rental Tariffs &amp; Pricing</span>
          </button>

          <button
            onClick={() => setActiveSubTab('fleet')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'fleet'
                ? 'bg-white text-orange-700 shadow-xs border border-gray-200/60'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Car className="w-4 h-4 text-orange-600" />
            <span>Cars &amp; Photos ({cars.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('inquiries')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'inquiries'
                ? 'bg-white text-orange-700 shadow-xs border border-gray-200/60'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-orange-600" />
            <span>Inquiries ({inquiries.length})</span>
          </button>
        </div>
      </div>

      {/* ================= 2. SUB-TAB: RENTAL TARIFFS & PRICING ================= */}
      {activeSubTab === 'tariffs' && (
        <div className="space-y-6">
          {/* Status Message Notification */}
          {tariffsStatusMessage && (
            <div className={`p-4 rounded-2xl text-xs font-bold flex items-center justify-between gap-3 shadow-sm ${
              tariffsStatusMessage.includes('✓')
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{tariffsStatusMessage}</span>
              </div>
            </div>
          )}

          {/* Quick Notice Banner */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-amber-900 text-xs flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Live Price Synchronizer:</span> Changing these prices instantly updates the 6-Hour, 12-Hour, and 24-Hour tariff cards on the customer Home page and Available Cars page.
            </div>
          </div>

          {/* 2 Main Vehicle Cards Editor (5 Seater & 7 Seater) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* ================= CARD 1: 5-SEATER TARIFF EDITOR ================= */}
            <div className="bg-white rounded-3xl border border-orange-200 shadow-sm overflow-hidden flex flex-col justify-between">
              {/* Header */}
              <div className="p-6 bg-gradient-to-r from-orange-50 via-white to-amber-50/40 border-b border-orange-100">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-950 border border-orange-200 text-xs font-black">
                    5-Seater Category
                  </span>
                  <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-orange-600" />
                    Up to 5 Passengers
                  </span>
                </div>
                <h3 className="text-xl font-black text-gray-900">Any 5 Seater Plans</h3>
                <input
                  type="text"
                  value={tariffs.fiveSeater.subtitle}
                  onChange={(e) =>
                    setTariffs({
                      ...tariffs,
                      fiveSeater: { ...tariffs.fiveSeater, subtitle: e.target.value },
                    })
                  }
                  className="mt-1 text-xs text-gray-600 w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1 font-medium focus:border-orange-500 focus:outline-none"
                  placeholder="e.g. Maruti Swift • Toyota Etios • Hyundai Venue & more"
                />
              </div>

              {/* 3 Duration Plans */}
              <div className="p-6 space-y-4">
                {/* 6 Hours */}
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-black text-sm text-gray-900">
                      <Clock className="w-4 h-4 text-orange-600" />
                      <span>6 Hours Plan</span>
                    </div>
                    <span className="text-[11px] font-bold text-gray-500">Short Errands &amp; City</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
                        Price (₹)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-500">₹</span>
                        <input
                          type="number"
                          value={tariffs.fiveSeater.plans['6hr'].price}
                          onChange={(e) =>
                            setTariffs({
                              ...tariffs,
                              fiveSeater: {
                                ...tariffs.fiveSeater,
                                plans: {
                                  ...tariffs.fiveSeater.plans,
                                  '6hr': { ...tariffs.fiveSeater.plans['6hr'], price: Number(e.target.value) },
                                },
                              },
                            })
                          }
                          className="w-full bg-white border border-gray-200 rounded-xl pl-7 pr-3 py-2 text-sm font-black text-gray-900 focus:border-orange-500 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
                        Included KM
                      </label>
                      <input
                        type="text"
                        value={tariffs.fiveSeater.plans['6hr'].km}
                        onChange={(e) =>
                          setTariffs({
                            ...tariffs,
                            fiveSeater: {
                              ...tariffs.fiveSeater,
                              plans: {
                                ...tariffs.fiveSeater.plans,
                                '6hr': { ...tariffs.fiveSeater.plans['6hr'], km: e.target.value },
                              },
                            },
                          })
                        }
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
                      Subtext Description
                    </label>
                    <input
                      type="text"
                      value={tariffs.fiveSeater.plans['6hr'].description}
                      onChange={(e) =>
                        setTariffs({
                          ...tariffs,
                          fiveSeater: {
                            ...tariffs.fiveSeater,
                            plans: {
                              ...tariffs.fiveSeater.plans,
                              '6hr': { ...tariffs.fiveSeater.plans['6hr'], description: e.target.value },
                            },
                          },
                        })
                      }
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-700 focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* 12 Hours (Most Popular) */}
                <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-200 space-y-3 relative">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-black text-sm text-orange-950">
                      <Clock className="w-4 h-4 text-orange-600" />
                      <span>12 Hours Plan</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-500 text-white shadow-2xs">
                      Most Popular
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
                        Price (₹)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-500">₹</span>
                        <input
                          type="number"
                          value={tariffs.fiveSeater.plans['12hr'].price}
                          onChange={(e) =>
                            setTariffs({
                              ...tariffs,
                              fiveSeater: {
                                ...tariffs.fiveSeater,
                                plans: {
                                  ...tariffs.fiveSeater.plans,
                                  '12hr': { ...tariffs.fiveSeater.plans['12hr'], price: Number(e.target.value) },
                                },
                              },
                            })
                          }
                          className="w-full bg-white border border-orange-300 rounded-xl pl-7 pr-3 py-2 text-sm font-black text-orange-950 focus:border-orange-500 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
                        Included KM
                      </label>
                      <input
                        type="text"
                        value={tariffs.fiveSeater.plans['12hr'].km}
                        onChange={(e) =>
                          setTariffs({
                            ...tariffs,
                            fiveSeater: {
                              ...tariffs.fiveSeater,
                              plans: {
                                ...tariffs.fiveSeater.plans,
                                '12hr': { ...tariffs.fiveSeater.plans['12hr'], km: e.target.value },
                              },
                            },
                          })
                        }
                        className="w-full bg-white border border-orange-300 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
                      Subtext Description
                    </label>
                    <input
                      type="text"
                      value={tariffs.fiveSeater.plans['12hr'].description}
                      onChange={(e) =>
                        setTariffs({
                          ...tariffs,
                          fiveSeater: {
                            ...tariffs.fiveSeater,
                            plans: {
                              ...tariffs.fiveSeater.plans,
                              '12hr': { ...tariffs.fiveSeater.plans['12hr'], description: e.target.value },
                            },
                          },
                        })
                      }
                      className="w-full bg-white border border-orange-200 rounded-xl px-3 py-1.5 text-xs text-gray-700 focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* 24 Hours (Best Value) */}
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-black text-sm text-gray-900">
                      <Clock className="w-4 h-4 text-orange-600" />
                      <span>24 Hours Plan</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500 text-white shadow-2xs">
                      Best Value
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
                        Price (₹)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-500">₹</span>
                        <input
                          type="number"
                          value={tariffs.fiveSeater.plans['24hr'].price}
                          onChange={(e) =>
                            setTariffs({
                              ...tariffs,
                              fiveSeater: {
                                ...tariffs.fiveSeater,
                                plans: {
                                  ...tariffs.fiveSeater.plans,
                                  '24hr': { ...tariffs.fiveSeater.plans['24hr'], price: Number(e.target.value) },
                                },
                              },
                            })
                          }
                          className="w-full bg-white border border-gray-200 rounded-xl pl-7 pr-3 py-2 text-sm font-black text-gray-900 focus:border-orange-500 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
                        Included KM
                      </label>
                      <input
                        type="text"
                        value={tariffs.fiveSeater.plans['24hr'].km}
                        onChange={(e) =>
                          setTariffs({
                            ...tariffs,
                            fiveSeater: {
                              ...tariffs.fiveSeater,
                              plans: {
                                ...tariffs.fiveSeater.plans,
                                '24hr': { ...tariffs.fiveSeater.plans['24hr'], km: e.target.value },
                              },
                            },
                          })
                        }
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
                      Subtext Description
                    </label>
                    <input
                      type="text"
                      value={tariffs.fiveSeater.plans['24hr'].description}
                      onChange={(e) =>
                        setTariffs({
                          ...tariffs,
                          fiveSeater: {
                            ...tariffs.fiveSeater,
                            plans: {
                              ...tariffs.fiveSeater.plans,
                              '24hr': { ...tariffs.fiveSeater.plans['24hr'], description: e.target.value },
                            },
                          },
                        })
                      }
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-700 focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ================= CARD 2: 7-SEATER TARIFF EDITOR ================= */}
            <div className="bg-white rounded-3xl border border-amber-200 shadow-sm overflow-hidden flex flex-col justify-between">
              {/* Header */}
              <div className="p-6 bg-gradient-to-r from-amber-50 via-white to-orange-50/40 border-b border-amber-100">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-950 border border-amber-200 text-xs font-black">
                    7-Seater Category
                  </span>
                  <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-amber-700" />
                    Up to 7-8 Passengers
                  </span>
                </div>
                <h3 className="text-xl font-black text-gray-900">Any 7 Seater Plans</h3>
                <input
                  type="text"
                  value={tariffs.sevenSeater.subtitle}
                  onChange={(e) =>
                    setTariffs({
                      ...tariffs,
                      sevenSeater: { ...tariffs.sevenSeater, subtitle: e.target.value },
                    })
                  }
                  className="mt-1 text-xs text-gray-600 w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1 font-medium focus:border-amber-500 focus:outline-none"
                  placeholder="e.g. Toyota Innova Crysta • Kia Carens • Maruti Ertiga & more"
                />
              </div>

              {/* 3 Duration Plans */}
              <div className="p-6 space-y-4">
                {/* 6 Hours */}
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-black text-sm text-gray-900">
                      <Clock className="w-4 h-4 text-amber-700" />
                      <span>6 Hours Plan</span>
                    </div>
                    <span className="text-[11px] font-bold text-gray-500">Temple Visits &amp; Functions</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
                        Price (₹)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-500">₹</span>
                        <input
                          type="number"
                          value={tariffs.sevenSeater.plans['6hr'].price}
                          onChange={(e) =>
                            setTariffs({
                              ...tariffs,
                              sevenSeater: {
                                ...tariffs.sevenSeater,
                                plans: {
                                  ...tariffs.sevenSeater.plans,
                                  '6hr': { ...tariffs.sevenSeater.plans['6hr'], price: Number(e.target.value) },
                                },
                              },
                            })
                          }
                          className="w-full bg-white border border-gray-200 rounded-xl pl-7 pr-3 py-2 text-sm font-black text-gray-900 focus:border-amber-500 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
                        Included KM
                      </label>
                      <input
                        type="text"
                        value={tariffs.sevenSeater.plans['6hr'].km}
                        onChange={(e) =>
                          setTariffs({
                            ...tariffs,
                            sevenSeater: {
                              ...tariffs.sevenSeater,
                              plans: {
                                ...tariffs.sevenSeater.plans,
                                '6hr': { ...tariffs.sevenSeater.plans['6hr'], km: e.target.value },
                              },
                            },
                          })
                        }
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
                      Subtext Description
                    </label>
                    <input
                      type="text"
                      value={tariffs.sevenSeater.plans['6hr'].description}
                      onChange={(e) =>
                        setTariffs({
                          ...tariffs,
                          sevenSeater: {
                            ...tariffs.sevenSeater,
                            plans: {
                              ...tariffs.sevenSeater.plans,
                              '6hr': { ...tariffs.sevenSeater.plans['6hr'], description: e.target.value },
                            },
                          },
                        })
                      }
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-700 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* 12 Hours (Most Popular) */}
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3 relative">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-black text-sm text-amber-950">
                      <Clock className="w-4 h-4 text-amber-700" />
                      <span>12 Hours Plan</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-600 text-white shadow-2xs">
                      Most Popular
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
                        Price (₹)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-500">₹</span>
                        <input
                          type="number"
                          value={tariffs.sevenSeater.plans['12hr'].price}
                          onChange={(e) =>
                            setTariffs({
                              ...tariffs,
                              sevenSeater: {
                                ...tariffs.sevenSeater,
                                plans: {
                                  ...tariffs.sevenSeater.plans,
                                  '12hr': { ...tariffs.sevenSeater.plans['12hr'], price: Number(e.target.value) },
                                },
                              },
                            })
                          }
                          className="w-full bg-white border border-amber-300 rounded-xl pl-7 pr-3 py-2 text-sm font-black text-amber-950 focus:border-amber-500 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
                        Included KM
                      </label>
                      <input
                        type="text"
                        value={tariffs.sevenSeater.plans['12hr'].km}
                        onChange={(e) =>
                          setTariffs({
                            ...tariffs,
                            sevenSeater: {
                              ...tariffs.sevenSeater,
                              plans: {
                                ...tariffs.sevenSeater.plans,
                                '12hr': { ...tariffs.sevenSeater.plans['12hr'], km: e.target.value },
                              },
                            },
                          })
                        }
                        className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
                      Subtext Description
                    </label>
                    <input
                      type="text"
                      value={tariffs.sevenSeater.plans['12hr'].description}
                      onChange={(e) =>
                        setTariffs({
                          ...tariffs,
                          sevenSeater: {
                            ...tariffs.sevenSeater,
                            plans: {
                              ...tariffs.sevenSeater.plans,
                              '12hr': { ...tariffs.sevenSeater.plans['12hr'], description: e.target.value },
                            },
                          },
                        })
                      }
                      className="w-full bg-white border border-amber-200 rounded-xl px-3 py-1.5 text-xs text-gray-700 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* 24 Hours (Best Value) */}
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-black text-sm text-gray-900">
                      <Clock className="w-4 h-4 text-amber-700" />
                      <span>24 Hours Plan</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-600 text-white shadow-2xs">
                      Best Value
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
                        Price (₹)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-500">₹</span>
                        <input
                          type="number"
                          value={tariffs.sevenSeater.plans['24hr'].price}
                          onChange={(e) =>
                            setTariffs({
                              ...tariffs,
                              sevenSeater: {
                                ...tariffs.sevenSeater,
                                plans: {
                                  ...tariffs.sevenSeater.plans,
                                  '24hr': { ...tariffs.sevenSeater.plans['24hr'], price: Number(e.target.value) },
                                },
                              },
                            })
                          }
                          className="w-full bg-white border border-gray-200 rounded-xl pl-7 pr-3 py-2 text-sm font-black text-gray-900 focus:border-amber-500 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
                        Included KM
                      </label>
                      <input
                        type="text"
                        value={tariffs.sevenSeater.plans['24hr'].km}
                        onChange={(e) =>
                          setTariffs({
                            ...tariffs,
                            sevenSeater: {
                              ...tariffs.sevenSeater,
                              plans: {
                                ...tariffs.sevenSeater.plans,
                                '24hr': { ...tariffs.sevenSeater.plans['24hr'], km: e.target.value },
                              },
                            },
                          })
                        }
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
                      Subtext Description
                    </label>
                    <input
                      type="text"
                      value={tariffs.sevenSeater.plans['24hr'].description}
                      onChange={(e) =>
                        setTariffs({
                          ...tariffs,
                          sevenSeater: {
                            ...tariffs.sevenSeater,
                            plans: {
                              ...tariffs.sevenSeater.plans,
                              '24hr': { ...tariffs.sevenSeater.plans['24hr'], description: e.target.value },
                            },
                          },
                        })
                      }
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-700 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="p-4 rounded-3xl bg-white border border-gray-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={handleResetTariffsToDefault}
              type="button"
              className="text-xs font-bold text-gray-500 hover:text-gray-800 px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Reset to Defaults
            </button>

            <button
              onClick={handleSaveTariffs}
              disabled={isSavingTariffs}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition-all active:scale-98 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSavingTariffs ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Saving Tariffs...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Save Pricing Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ================= 3. SUB-TAB: CAR FLEET & MULTIPLE PHOTOS ================= */}
      {activeSubTab === 'fleet' && (
        <div className="space-y-6">
          {/* Header & Controls */}
          <div className="p-4 rounded-3xl bg-white border border-gray-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Filter Tabs */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              {(['all', '5-seater', '7-seater'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setFleetFilter(filter)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer ${
                    fleetFilter === filter
                      ? 'bg-orange-600 text-white shadow-xs'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {filter === 'all'
                    ? `All Cars (${cars.length})`
                    : filter === '5-seater'
                    ? `5-Seater (${cars.filter((c) => c.category === '5-seater').length})`
                    : `7-Seater (${cars.filter((c) => c.category === '7-seater').length})`}
                </button>
              ))}
            </div>

            {/* Add New Car Button */}
            <button
              onClick={handleOpenAddCarModal}
              className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white text-xs font-black shadow-sm hover:shadow flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Car</span>
            </button>
          </div>

          {/* Cars List */}
          {isLoadingCars ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-gray-200">
              <RefreshCw className="w-6 h-6 animate-spin text-orange-600 mx-auto mb-2" />
              <p className="text-xs font-bold text-gray-500">Loading rental cars...</p>
            </div>
          ) : filteredCars.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-gray-300 space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-orange-50 text-orange-500 flex items-center justify-center mx-auto">
                <Car className="w-8 h-8 text-orange-600" />
              </div>
              <div>
                <h3 className="text-base font-black text-gray-900">No cars in this section yet</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
                  Upload photos and descriptions for individual 5-Seater and 7-Seater cars.
                </p>
              </div>
              <button
                onClick={handleOpenAddCarModal}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-orange-600 text-white text-xs font-black hover:bg-orange-700 transition-colors cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Upload First Car with Photos</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCars.map((car) => {
                const coverImage = car.images && car.images.length > 0 ? car.images[0] : '/images/cars/placeholder.png';
                return (
                  <div
                    key={car.id}
                    className="bg-white rounded-3xl border border-gray-200/90 shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
                  >
                    <div>
                      {/* Photo Header & Multi-photo Badges */}
                      <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={coverImage}
                          alt={car.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              car.category === '5-seater'
                                ? 'bg-orange-600 text-white'
                                : 'bg-amber-600 text-white'
                            }`}
                          >
                            {car.category === '5-seater' ? '5 Seater' : '7 Seater'}
                          </span>

                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black bg-black/60 text-white backdrop-blur-md">
                            <ImageIcon className="w-3 h-3 text-amber-300" />
                            <span>{car.images?.length || 0} Photos</span>
                          </span>
                        </div>

                        {/* Bottom Tag */}
                        <div className="absolute bottom-3 left-3">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/90 text-gray-900 backdrop-blur-xs">
                            {car.tag || car.categoryLabel}
                          </span>
                        </div>
                      </div>

                      {/* Photo Thumbnail Strip (Preview of multiple photos) */}
                      {car.images && car.images.length > 1 && (
                        <div className="px-4 py-2 bg-gray-50/80 border-b border-gray-100 flex items-center gap-1.5 overflow-x-auto">
                          {car.images.slice(0, 5).map((img, idx) => (
                            <div
                              key={idx}
                              className={`w-10 h-8 rounded-lg overflow-hidden shrink-0 border ${
                                idx === 0 ? 'border-orange-500 shadow-2xs' : 'border-gray-200'
                              }`}
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={img} alt="thumb" className="w-full h-full object-cover" />
                            </div>
                          ))}
                          {car.images.length > 5 && (
                            <span className="text-[10px] font-bold text-gray-500 px-1">
                              +{car.images.length - 5}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Content Details */}
                      <div className="p-5 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="text-base font-black text-gray-900">{car.name}</h3>
                            <p className="text-xs text-gray-500">{car.categoryLabel}</p>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black shrink-0 ${
                              car.isAvailable
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {car.isAvailable ? 'Available' : 'Booked'}
                          </span>
                        </div>

                        {/* Specs Pills */}
                        <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-600 font-semibold pt-1">
                          <div className="flex items-center gap-1.5 bg-gray-50 p-2 rounded-xl">
                            <Users className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                            <span className="truncate">{car.specs?.seats || '5 Seats'}</span>
                          </div>
                          <div className="flex items-center gap-1.5 bg-gray-50 p-2 rounded-xl">
                            <Gauge className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                            <span className="truncate">{car.specs?.transmission || 'Manual'}</span>
                          </div>
                          <div className="flex items-center gap-1.5 bg-gray-50 p-2 rounded-xl">
                            <Fuel className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                            <span className="truncate">{car.specs?.fuel || 'Petrol'}</span>
                          </div>
                          <div className="flex items-center gap-1.5 bg-gray-50 p-2 rounded-xl">
                            <Sparkles className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                            <span className="truncate">{car.specs?.mileage || '16-18 km/l'}</span>
                          </div>
                        </div>

                        {car.description && (
                          <p className="text-xs text-gray-600 line-clamp-2 pt-1">{car.description}</p>
                        )}
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="p-4 pt-0 border-t border-gray-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleToggleCarAvailability(car)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                          car.isAvailable
                            ? 'text-gray-600 border-gray-200 hover:bg-gray-100'
                            : 'text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100'
                        }`}
                      >
                        {car.isAvailable ? 'Mark Booked' : 'Mark Available'}
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEditCarModal(car)}
                          className="p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
                          title="Edit Car & Photos"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCar(car.id, car.name)}
                          className="p-2 rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Delete Car"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ================= 4. SUB-TAB: CUSTOMER INQUIRIES ================= */}
      {activeSubTab === 'inquiries' && (
        <div className="space-y-4">
          <div className="p-4 rounded-3xl bg-white border border-gray-200 shadow-2xs">
            <h3 className="text-sm font-black text-gray-900 mb-1">Customer Rental Bookings</h3>
            <p className="text-xs text-gray-500">
              Live inquiries submitted through the website booking form. Reach out directly on WhatsApp.
            </p>
          </div>

          {inquiries.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-gray-200">
              <MessageSquare className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-xs font-bold text-gray-500">No rental inquiries recorded yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {inquiries.map((inq: any) => (
                <div
                  key={inq._id}
                  className="p-5 rounded-3xl bg-white border border-gray-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-gray-400">
                        {inq.inquiryNumber}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          inq.status === 'new'
                            ? 'bg-blue-100 text-blue-800'
                            : inq.status === 'confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {inq.status}
                      </span>
                    </div>

                    <h4 className="text-base font-black text-gray-900">
                      {inq.customerName} &bull; {inq.customerPhone}
                    </h4>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
                      <span className="font-bold text-orange-600">
                        {inq.carType === '5-seater' ? '5-Seater' : '7-Seater'} ({inq.duration})
                      </span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        {inq.travelDate}
                      </span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        {inq.pickupLocation}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <a
                      href={`https://wa.me/91${inq.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                        `Hi ${inq.customerName}, regarding your car rental booking inquiry ${inq.inquiryNumber} in Bapatla for a ${inq.carType} on ${inq.travelDate}...`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>

                    {onUpdateInquiryStatus && (
                      <select
                        value={inq.status}
                        onChange={(e) => onUpdateInquiryStatus(inq._id, e.target.value)}
                        className="text-xs font-bold bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-700 cursor-pointer focus:outline-none"
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= 5. ADD / EDIT CAR MODAL (WITH MULTIPLE PHOTOS SYSTEM) ================= */}
      {isCarModalOpen && (
        <div
          onPaste={handleModalPaste}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
        >
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 shadow-2xl p-6 sm:p-8 space-y-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
                  <Car className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900">
                    {editingCarId ? 'Edit Rental Car' : 'Add New Rental Car'}
                  </h3>
                  <p className="text-xs text-gray-500">Upload multiple photos and configure vehicle specifications</p>
                </div>
              </div>
              <button
                onClick={() => setIsCarModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveCar} className="space-y-5">
              {/* Basic Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Car Model Name *</label>
                  <input
                    type="text"
                    required
                    value={carForm.name}
                    onChange={(e) => setCarForm({ ...carForm, name: e.target.value })}
                    placeholder="e.g. Mahindra Thar 4x4, Creta, Swift"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-gray-900 focus:bg-white focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Category *</label>
                  <select
                    value={carForm.category}
                    onChange={(e) => {
                      const cat = e.target.value as '5-seater' | '7-seater';
                      setCarForm({
                        ...carForm,
                        category: cat,
                        seats: cat === '5-seater' ? '5 Passengers' : '7 Passengers',
                        categoryLabel: cat === '5-seater' ? 'Compact SUV & Hatchback' : 'Luxury Family MPV',
                      });
                    }}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-gray-900 focus:bg-white focus:border-orange-500 focus:outline-none cursor-pointer"
                  >
                    <option value="5-seater">5-Seater Vehicle</option>
                    <option value="7-seater">7-Seater Vehicle</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Subtitle / Category Label</label>
                  <input
                    type="text"
                    value={carForm.categoryLabel}
                    onChange={(e) => setCarForm({ ...carForm, categoryLabel: e.target.value })}
                    placeholder="e.g. Compact SUV &amp; Beach Special"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:bg-white focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Badge Tag</label>
                  <input
                    type="text"
                    value={carForm.tag}
                    onChange={(e) => setCarForm({ ...carForm, tag: e.target.value })}
                    placeholder="e.g. Suryalanka Beach Special, Best Seller"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:bg-white focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* ================= MULTIPLE PHOTOS SECTION ================= */}
              <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-200/90 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-orange-600" />
                    <span className="text-xs font-black text-gray-900 uppercase tracking-wider">
                      Vehicle Photos Gallery ({carImages.length} Added)
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-orange-700">
                    Upload &amp; Copy-Paste Enabled
                  </span>
                </div>

                {/* Upload Status / Feedback */}
                {uploadFeedback && (
                  <div className="p-2.5 rounded-xl bg-emerald-100/80 text-emerald-900 text-xs font-bold flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{uploadFeedback}</span>
                  </div>
                )}

                {/* Minimal Photo Actions: Upload & Paste from Clipboard */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Upload Card */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-orange-300 hover:border-orange-500 rounded-2xl p-5 text-center cursor-pointer bg-white transition-all group flex flex-col items-center justify-center hover:bg-orange-50/40 shadow-2xs"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileInputChange}
                      className="hidden"
                    />
                    <Upload className="w-6 h-6 text-orange-500 mb-1.5 group-hover:scale-110 transition-transform" />
                    <div className="text-xs font-black text-gray-900">
                      {isUploadingPhoto ? 'Uploading Photo...' : 'Upload Photos'}
                    </div>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      Click to browse or drag &amp; drop images
                    </p>
                  </div>

                  {/* Clipboard Paste Card */}
                  <div
                    onClick={handlePasteFromClipboard}
                    className="border-2 border-dashed border-amber-300 hover:border-amber-500 rounded-2xl p-5 text-center cursor-pointer bg-white transition-all group flex flex-col items-center justify-center hover:bg-amber-50/40 shadow-2xs relative"
                  >
                    <input
                      ref={pasteCatcherRef}
                      type="text"
                      aria-label="Paste catcher"
                      onPaste={async (e) => {
                        const handled = await processClipboardData(e.clipboardData);
                        if (handled) e.preventDefault();
                      }}
                      className="opacity-0 absolute inset-0 w-full h-full cursor-pointer pointer-events-auto"
                    />
                    <ClipboardPaste className="w-6 h-6 text-amber-600 mb-1.5 group-hover:scale-110 transition-transform pointer-events-none" />
                    <div className="text-xs font-black text-gray-900 pointer-events-none">
                      Paste from Clipboard
                    </div>
                    <p className="text-[10px] text-gray-500 mt-0.5 pointer-events-none">
                      Click here or press <kbd className="px-1 py-0.5 rounded bg-gray-100 text-gray-700 font-mono text-[9px] border border-gray-200">Cmd+V</kbd> to paste
                    </p>
                  </div>
                </div>

                {/* Preview Gallery of Added Photos */}
                {carImages.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-orange-200">
                    <div className="text-[11px] font-bold text-gray-700">
                      Uploaded Photos ({carImages.length}) &bull; First photo is the primary cover
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {carImages.map((img, idx) => (
                        <div
                          key={idx}
                          className={`relative rounded-xl overflow-hidden border-2 bg-gray-100 group ${
                            idx === 0 ? 'border-orange-500 shadow-sm' : 'border-gray-200'
                          }`}
                        >
                          <div className="aspect-4/3 w-full">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={img} alt={`car-${idx}`} className="w-full h-full object-cover" />
                          </div>

                          {/* Primary Cover Badge */}
                          {idx === 0 ? (
                            <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-orange-600 text-white font-black text-[9px] flex items-center gap-1 shadow-xs">
                              <Star className="w-2.5 h-2.5 fill-white" />
                              Cover
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSetCoverPhoto(idx)}
                              className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-black/70 hover:bg-black text-white font-bold text-[9px] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            >
                              Set as Cover
                            </button>
                          )}

                          {/* Remove Button */}
                          <button
                            type="button"
                            onClick={() => handleRemovePhoto(idx)}
                            className="absolute top-1.5 right-1.5 w-6 h-6 rounded-md bg-red-600/90 hover:bg-red-700 text-white flex items-center justify-center transition-colors cursor-pointer"
                            title="Remove photo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Specifications Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-600 block mb-1">Seats</label>
                  <input
                    type="text"
                    value={carForm.seats}
                    onChange={(e) => setCarForm({ ...carForm, seats: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-600 block mb-1">Transmission</label>
                  <input
                    type="text"
                    value={carForm.transmission}
                    onChange={(e) => setCarForm({ ...carForm, transmission: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-600 block mb-1">Fuel</label>
                  <input
                    type="text"
                    value={carForm.fuel}
                    onChange={(e) => setCarForm({ ...carForm, fuel: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-600 block mb-1">Mileage</label>
                  <input
                    type="text"
                    value={carForm.mileage}
                    onChange={(e) => setCarForm({ ...carForm, mileage: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Vehicle Description</label>
                <textarea
                  rows={2}
                  value={carForm.description}
                  onChange={(e) => setCarForm({ ...carForm, description: e.target.value })}
                  placeholder="Describe the car's condition, special highlights, beach suitability..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-900 focus:bg-white focus:border-orange-500 focus:outline-none"
                />
              </div>

              {/* Key Features (One per line) */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Key Features (One per line)</label>
                <textarea
                  rows={3}
                  value={carForm.featuresText}
                  onChange={(e) => setCarForm({ ...carForm, featuresText: e.target.value })}
                  placeholder="e.g. Chilling AC & Bluetooth audio&#10;High ground clearance&#10;Clean sanitized interior"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-mono text-gray-900 focus:bg-white focus:border-orange-500 focus:outline-none"
                />
              </div>

              {/* Availability Toggle */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="carAvailable"
                  checked={carForm.isAvailable}
                  onChange={(e) => setCarForm({ ...carForm, isAvailable: e.target.checked })}
                  className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 cursor-pointer"
                />
                <label htmlFor="carAvailable" className="text-xs font-bold text-gray-800 cursor-pointer">
                  Car is currently available for customer booking
                </label>
              </div>

              {/* Footer Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsCarModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSavingCar}
                  className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-black shadow-sm hover:shadow flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSavingCar ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving Car...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>{editingCarId ? 'Save Changes' : 'Add Car'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
