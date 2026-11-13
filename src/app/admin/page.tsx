'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Car,
  Users,
  ArrowLeft,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  DollarSign,
  AlertTriangle,
  Search,
  Filter,
  Check,
  X,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Sparkles,
  RefreshCw,
  LogOut,
  ShieldCheck,
  TrendingUp,
  Lock,
  Eye,
  EyeOff,
  KeyRound,
  FolderTree,
  Tag,
  Upload,
  Image as ImageIcon,
  ChevronDown,
  Layers,
  MoreVertical,
  Pencil,
  Camera,
  ImageOff,
  RotateCcw,
} from 'lucide-react';

const ADMIN_STORAGE_KEY = 'bemyshopper_admin_auth';

export interface CategoryItem {
  _id: Id<'categories'>;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  bgGradient?: string;
  borderColor?: string;
  displayOrder?: number;
  productCount: number;
  createdAt: number;
}

interface AdminUser {
  id: Id<'users'> | string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin';
}

export default function AdminPage() {
  // Dedicated Admin Auth State (isolated from customer session)
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Admin Login Gate State
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [activeTab, setActiveTab] = useState<'categories' | 'products' | 'orders' | 'rentals' | 'users' | 'settings'>('categories');

  // Password change states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState<string | null>(null);
  const [passwordChangeError, setPasswordChangeError] = useState<string | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Filter states
  const [productCategory, setProductCategory] = useState('all');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [rentalStatusFilter, setRentalStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);

  // New product form
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('groceries');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdOriginalPrice, setNewProdOriginalPrice] = useState('');
  const [newProdWeight, setNewProdWeight] = useState('1 unit');
  const [newProdImage, setNewProdImage] = useState('/images/prod-rice-5kg.png');
  const [newProdInStock, setNewProdInStock] = useState(true);

  // Categories UI State
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>('all');
  const [isCategoriesDropdownOpen, setIsCategoriesDropdownOpen] = useState(true);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatImage, setNewCatImage] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [catActionError, setCatActionError] = useState<string | null>(null);
  const [isCreatingCat, setIsCreatingCat] = useState(false);

  // 1. Edit Category Modal State
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [editName, setEditName] = useState('');
  const [editSlug, setEditSlug] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // 2. Add / Change Photo State
  const [targetPhotoCatId, setTargetPhotoCatId] = useState<Id<'categories'> | null>(null);
  const [isUploadingCatPhoto, setIsUploadingCatPhoto] = useState(false);
  const [catPhotoUploadStatus, setCatPhotoUploadStatus] = useState<string | null>(null);
  const photoInputRef = React.useRef<HTMLInputElement>(null);

  // 3. Dropdown Menu for options
  const [activeMenuCatId, setActiveMenuCatId] = useState<string | null>(null);

  // Convex Queries
  const stats = useQuery(api.orders.getStats);
  const products = useQuery(api.products.list, {
    category: selectedCategorySlug === 'all' ? undefined : selectedCategorySlug,
  });

  const filteredProducts = products?.filter((prod) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      prod.name.toLowerCase().includes(q) ||
      prod.category.toLowerCase().includes(q) ||
      prod.weight.toLowerCase().includes(q)
    );
  });
  const orders = useQuery(api.orders.list, {
    status: orderStatusFilter === 'all' ? undefined : orderStatusFilter,
  });
  const rentals = useQuery(api.rentals.list, {
    status: rentalStatusFilter === 'all' ? undefined : rentalStatusFilter,
  });
  const usersList = useQuery(api.users.listUsers);

  // Categories from Convex
  const categoriesList = useQuery(api.categories.list) as CategoryItem[] | undefined;
  const createCategoryMutation = useMutation(api.categories.create);
  const updateCategoryMutation = useMutation(api.categories.update);
  const updateCategoryPhotoMutation = useMutation(api.categories.updatePhoto);
  const removeCategoryPhotoMutation = useMutation(api.categories.removePhoto);
  const deleteCategoryMutation = useMutation(api.categories.remove);
  const syncWithHomePageMutation = useMutation(api.categories.syncWithHomePage);
  const seedCategoriesMutation = useMutation(api.categories.seedDefaultCategories);

  // Auto-sync with Home Page if old mock categories are detected
  useEffect(() => {
    if (categoriesList && categoriesList.length > 0) {
      const hasOldImages = categoriesList.some((c) =>
        c.image?.includes('prod-rice-5kg') || c.image?.includes('prod-pooja-oil')
      );
      if (hasOldImages) {
        syncWithHomePageMutation({}).catch(console.error);
      }
    }
  }, [categoriesList, syncWithHomePageMutation]);

  // Convex Mutations
  const adminLoginMutation = useMutation(api.adminAuth.adminLogin);
  const changePasswordMutation = useMutation(api.adminAuth.changeAdminPassword);
  const createProduct = useMutation(api.products.create);
  const toggleProductStock = useMutation(api.products.toggleStock);
  const deleteProduct = useMutation(api.products.remove);
  const seedProducts = useMutation(api.products.seedDefaultProducts);
  const updateOrderStatus = useMutation(api.orders.updateStatus);
  const updateRentalStatus = useMutation(api.rentals.updateStatus);

  // Check saved admin session on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(ADMIN_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.role === 'admin' && parsed.email) {
          setAdminUser(parsed);
        } else {
          localStorage.removeItem(ADMIN_STORAGE_KEY);
        }
      }
    } catch {
      localStorage.removeItem(ADMIN_STORAGE_KEY);
    } finally {
      setIsCheckingAuth(false);
    }
  }, []);

  const cleanErrorMessage = (err: unknown): string => {
    if (err instanceof Error) {
      const raw = err.message;
      const uncaughtMatch = raw.match(/Uncaught Error:\s*([^\n]+)/);
      if (uncaughtMatch) return uncaughtMatch[1].trim();
      const serverMatch = raw.match(/Server Error\s*([^\n]+)/);
      if (serverMatch) return serverMatch[1].trim();
      return raw.replace(/\[CONVEX[^\]]*\]/g, '').trim();
    }
    return 'Invalid administrator credentials.';
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);
    try {
      const res = await adminLoginMutation({
        email: adminEmail.trim(),
        password: adminPassword.trim(),
      });
      setAdminUser(res);
      localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(res));
    } catch (err: unknown) {
      setLoginError(cleanErrorMessage(err));
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleAdminLogout = () => {
    setAdminUser(null);
    localStorage.removeItem(ADMIN_STORAGE_KEY);
    setAdminPassword('');
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeSuccess(null);
    setPasswordChangeError(null);

    if (newPassword !== confirmPassword) {
      setPasswordChangeError('New passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordChangeError('New password must be at least 8 characters long.');
      return;
    }

    setIsChangingPassword(true);
    try {
      if (!adminUser) throw new Error('Not authenticated as administrator.');
      const res = await changePasswordMutation({
        email: adminUser.email,
        currentPassword,
        newPassword,
      });
      setPasswordChangeSuccess(res.message);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update admin password.';
      setPasswordChangeError(msg);
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleCatNameChange = (val: string) => {
    setNewCatName(val);
    const derived = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setNewCatSlug(derived);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    setUploadProgress('Uploading to Cloudflare R2...');
    setCatActionError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'categories');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to upload to Cloudflare R2');
      }

      setNewCatImage(data.url);
      setUploadProgress('✓ Image uploaded to Cloudflare R2 (bemyshopper-dev)!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      setCatActionError(msg);
      setUploadProgress(null);
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Helper: Delete image from Cloudflare R2 bucket (bemyshopper-dev)
  const deleteImageFromR2 = async (imageUrl?: string) => {
    if (!imageUrl) return;
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

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    setIsCreatingCat(true);
    setCatActionError(null);

    try {
      // Auto-generate URL slug from category name
      const autoSlug =
        newCatName
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '') || `cat-${Date.now()}`;

      await createCategoryMutation({
        name: newCatName.trim(),
        slug: autoSlug,
        description: newCatDesc.trim() || undefined,
        image: newCatImage.trim() || undefined,
      });

      setIsAddCategoryOpen(false);
      setNewCatName('');
      setNewCatDesc('');
      setNewCatImage('');
      setUploadProgress(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create category';
      setCatActionError(msg);
    } finally {
      setIsCreatingCat(false);
    }
  };

  // 1. Edit Category Modal
  const openEditModal = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setEditName(cat.name);
    setEditSlug(cat.slug);
    setEditDesc(cat.description || '');
    setActiveMenuCatId(null);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editName.trim()) return;

    setIsSavingEdit(true);
    try {
      // Auto-generate slug from name if needed or preserve existing
      const autoSlug =
        editName
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '') || editingCategory.slug;

      await updateCategoryMutation({
        id: editingCategory._id,
        name: editName.trim(),
        slug: autoSlug,
        description: editDesc.trim() || undefined,
      });
      setEditingCategory(null);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to update category');
    } finally {
      setIsSavingEdit(false);
    }
  };

  // 2. Add / Change Photo via Cloudflare R2
  const triggerPhotoUpload = (catId: Id<'categories'>) => {
    setTargetPhotoCatId(catId);
    setActiveMenuCatId(null);
    photoInputRef.current?.click();
  };

  const handlePhotoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !targetPhotoCatId) return;

    setIsUploadingCatPhoto(true);
    setCatPhotoUploadStatus('Uploading to Cloudflare R2 (bemyshopper-dev)...');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'categories');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to upload photo to Cloudflare R2');
      }

      await updateCategoryPhotoMutation({
        id: targetPhotoCatId,
        image: data.url,
      });

      setCatPhotoUploadStatus('✓ Photo uploaded to Cloudflare R2!');
      setTimeout(() => setCatPhotoUploadStatus(null), 3000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Photo upload failed');
      setCatPhotoUploadStatus(null);
    } finally {
      setIsUploadingCatPhoto(false);
      setTargetPhotoCatId(null);
      if (e.target) e.target.value = '';
    }
  };

  // 3. Remove Photo (Clears Convex link & deletes object from Cloudflare R2)
  const handleRemovePhotoFromCategory = async (cat: CategoryItem) => {
    if (!confirm(`Are you sure you want to remove the photo from category "${cat.name}"?`)) {
      return;
    }
    try {
      const oldImage = cat.image;
      await removeCategoryPhotoMutation({ id: cat._id });
      if (oldImage) {
        await deleteImageFromR2(oldImage);
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to remove photo');
    } finally {
      setActiveMenuCatId(null);
    }
  };

  // 4. Remove Category (Deletes Convex document & deletes category image from Cloudflare R2)
  const handleDeleteCategory = async (id: Id<'categories'>, name: string, imageUrl?: string) => {
    if (!confirm(`Are you sure you want to permanently delete category "${name}"?`)) {
      return;
    }

    try {
      await deleteCategoryMutation({ id });
      if (imageUrl) {
        await deleteImageFromR2(imageUrl);
      }
      if (selectedCategorySlug !== 'all') {
        setSelectedCategorySlug('all');
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to delete category');
    } finally {
      setActiveMenuCatId(null);
    }
  };

  // Sync with Home Page (10 exact categories & images)
  const handleSyncWithHomePage = async () => {
    if (
      !confirm(
        'This will reset categories to match the exact 10 categories, images, and colors from the Home Page. Continue?'
      )
    ) {
      return;
    }
    try {
      const res = await syncWithHomePageMutation({});
      alert(res.message);
      setSelectedCategorySlug('all');
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to sync categories');
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice) return;

    await createProduct({
      name: newProdName.trim(),
      category: newProdCategory,
      price: parseFloat(newProdPrice),
      originalPrice: newProdOriginalPrice ? parseFloat(newProdOriginalPrice) : undefined,
      weight: newProdWeight.trim(),
      image: newProdImage.trim() || '/images/prod-rice-5kg.png',
      inStock: newProdInStock,
      isPopular: false,
    });

    setIsAddProductOpen(false);
    setNewProdName('');
    setNewProdPrice('');
    setNewProdOriginalPrice('');
  };

  const handleSeedCatalog = async () => {
    const res = await seedProducts({});
    alert(res.message);
  };

  const handleSeedCategories = async () => {
    try {
      const res = await seedCategoriesMutation({});
      alert(res.message);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to seed categories');
    }
  };

  // 1. Loading State
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#F7F9F5] flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-4 border-[#087D2C]/20 border-t-[#087D2C] rounded-full animate-spin mb-3" />
        <p className="text-xs font-bold text-gray-500">Checking Administrator Session...</p>
      </div>
    );
  }

  // 2. Dedicated Admin Login (Client-Attractive, Modern & Secure)
  if (!adminUser) {
    return (
      <div className="relative min-h-screen bg-[#F7F9F5] flex flex-col justify-between p-4 sm:p-6 font-sans antialiased overflow-hidden selection:bg-[#087D2C]/15 selection:text-[#087D2C]">
        {/* Soft Ambient Glow Gradients (Brand Mesh) */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#087D2C]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 -right-32 w-96 h-96 bg-[#FF6500]/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-[#087D2C]/8 rounded-full blur-3xl pointer-events-none" />

        {/* Subtle Textured Background Pattern */}
        <div
          className="absolute inset-0 opacity-[0.35] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Top Navigation Bar */}
        <div className="relative z-10 max-w-5xl w-full mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-700 hover:text-gray-900 bg-white/90 hover:bg-white backdrop-blur-md px-4 py-2 rounded-full border border-gray-200/80 shadow-xs hover:shadow-sm transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#087D2C]" />
            <span>Back to Store</span>
          </Link>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-gray-200/80 shadow-2xs text-[11px] font-bold text-gray-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Store Operations Live</span>
          </div>
        </div>

        {/* Center Card */}
        <div className="relative z-10 max-w-[440px] w-full mx-auto my-auto bg-white/95 backdrop-blur-xl rounded-[32px] border border-gray-200/80 shadow-[0_24px_70px_-15px_rgba(8,125,44,0.12),0_4px_16px_rgba(0,0,0,0.03)] p-8 sm:p-10 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
          {/* Top Brand Hairline Accent */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#087D2C] via-[#FF6500] to-[#087D2C]" />

          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-5">
              <img
                src="/logo.png"
                alt="Be My Shopper"
                className="h-12 w-auto object-contain"
              />
            </div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Admin Portal</h1>
            <p className="text-xs text-gray-500 mt-1.5 max-w-xs mx-auto">
              Sign in to manage orders, catalog &amp; car rentals
            </p>
          </div>

          {/* Error Alert */}
          {loginError && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50/90 border border-red-200/80 text-red-700 text-xs flex items-center gap-3 animate-in fade-in">
              <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
              <div className="font-semibold text-[12px]">{loginError}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="w-4 h-4 text-gray-400 group-focus-within:text-[#087D2C] absolute left-4 top-1/2 -translate-y-1/2 transition-colors" />
                <input
                  type="email"
                  required
                  autoFocus
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder=""
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200/90 bg-gray-50/50 hover:bg-white focus:bg-white text-sm text-gray-900 focus:outline-none focus:border-[#087D2C] focus:ring-4 focus:ring-[#087D2C]/10 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative group">
                <Lock className="w-4 h-4 text-gray-400 group-focus-within:text-[#087D2C] absolute left-4 top-1/2 -translate-y-1/2 transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder=""
                  className="w-full pl-11 pr-11 py-3 rounded-2xl border border-gray-200/90 bg-gray-50/50 hover:bg-white focus:bg-white text-sm text-gray-900 focus:outline-none focus:border-[#087D2C] focus:ring-4 focus:ring-[#087D2C]/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 cursor-pointer transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full mt-2 py-3.5 rounded-2xl bg-gradient-to-r from-[#087D2C] to-[#0A9635] hover:from-[#066323] hover:to-[#087D2C] active:scale-[0.99] text-white font-bold text-sm shadow-[0_10px_25px_-5px_rgba(8,125,44,0.35)] hover:shadow-[0_15px_30px_-5px_rgba(8,125,44,0.45)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isLoggingIn ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Sign In to Admin Portal</span>
                </>
              )}
            </button>
          </form>

          {/* Module Pills Strip */}
          <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-3 text-[11px] text-gray-500 font-semibold">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Orders
            </span>
            <span className="text-gray-300">•</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6500]" />
              Car Rentals
            </span>
            <span className="text-gray-300">•</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              Products
            </span>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="relative z-10 text-center text-[11px] font-medium text-gray-400 pb-2">
          &copy; {new Date().getFullYear()} Be My Shopper &bull; Bapatla, Andhra Pradesh
        </div>
      </div>
    );
  }

  // 3. Authenticated Admin Dashboard
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Store</span>
            </Link>

            <div className="flex items-center gap-3">
              <Link href="/admin" className="flex items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.png"
                  alt="Be My Shopper"
                  className="h-8 sm:h-9 w-auto object-contain"
                  style={{ maxHeight: '36px' }}
                />
              </Link>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#087D2C] font-black text-[11px] uppercase tracking-wider border border-emerald-200">
                Admin Panel
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Convex Status Pill */}
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Convex Cloud Live</span>
            </div>

            {/* Authenticated Admin Account Info & Sign Out */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-black text-gray-900">{adminUser.name}</div>
                <div className="text-[10px] text-gray-500">{adminUser.email}</div>
              </div>
              <button
                onClick={handleAdminLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-full border border-red-200 transition-colors cursor-pointer"
                title="Sign Out of Admin Portal"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Admin Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout Container: 2 Columns (Left Categories Sidebar + Main Content) */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col md:flex-row gap-6">
        {/* Left Sidebar: Categories Navigation & List */}
        <aside className="w-full md:w-72 lg:w-80 shrink-0 space-y-4">
          {/* Main Navigation Card */}
          <div className="bg-white rounded-3xl border border-gray-200/80 shadow-2xs p-4 space-y-4">
            {/* Section Title */}
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-gray-400">
                Catalog Navigation
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                R2 Ready
              </span>
            </div>

            {/* Categories Primary Pill Button with Dropdown Indicator */}
            <button
              onClick={() => {
                setIsCategoriesDropdownOpen((prev) => !prev);
                if (!isCategoriesDropdownOpen) {
                  setActiveTab('categories');
                  setSelectedCategorySlug('all');
                }
              }}
              className="w-full flex items-center justify-between px-4 py-3 rounded-full transition-all cursor-pointer shadow-sm select-none bg-[#087D2C] hover:bg-[#066323] text-white"
            >
              <div className="flex items-center gap-2.5 font-black text-sm">
                <Layers className="w-4 h-4" />
                <span>Categories</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-800/60 text-white">
                  {categoriesList?.length ?? 0}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-white transition-transform duration-200 ${
                    isCategoriesDropdownOpen ? 'rotate-180' : 'rotate-0'
                  }`}
                />
              </div>
            </button>

            {/* Live Dropdown: All Visible Products, Categories List & Add New Category */}
            {isCategoriesDropdownOpen && (
              <div className="space-y-3 pt-1 animate-in fade-in zoom-in-95 duration-150">
                {/* 1. All Visible Products Row */}
                <button
                  onClick={() => {
                    setActiveTab('categories');
                    setSelectedCategorySlug('all');
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-left ${
                    selectedCategorySlug === 'all' && activeTab === 'categories'
                      ? 'bg-emerald-50 text-[#087D2C] border border-emerald-200 shadow-2xs'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Package className="w-4 h-4 text-[#087D2C] shrink-0" />
                    <span className="truncate">All Visible Products</span>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full shrink-0">
                    {products?.length ?? 0}
                  </span>
                </button>

                {/* 2. Quick Category Select Dropdown */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                    Quick Filter
                  </label>
                  <div className="relative">
                    <select
                      value={selectedCategorySlug}
                      onChange={(e) => {
                        setActiveTab('categories');
                        setSelectedCategorySlug(e.target.value);
                      }}
                      className="w-full text-xs font-bold bg-gray-50 hover:bg-gray-100/80 border border-gray-200 rounded-xl px-3 py-2 pr-8 focus:outline-none focus:border-[#087D2C] text-gray-800 transition-colors cursor-pointer appearance-none"
                    >
                      <option value="all">📁 All Categories ({categoriesList?.length ?? 0})</option>
                      {categoriesList?.map((cat) => (
                        <option key={cat._id} value={cat.slug}>
                          {cat.name} ({cat.productCount})
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* 3. Categories List */}
                <div className="space-y-1 pt-2 border-t border-gray-100">
                  <div className="flex items-center justify-between px-1 mb-1.5">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Categories ({categoriesList?.length ?? 0})
                    </span>
                    <button
                      onClick={handleSyncWithHomePage}
                      className="text-[10px] font-bold text-[#087D2C] hover:underline flex items-center gap-1 cursor-pointer"
                      title="Sync exact 10 categories & images from Home Page"
                    >
                      <RotateCcw className="w-2.5 h-2.5" />
                      <span>Sync (10)</span>
                    </button>
                  </div>

                  {/* Individual Category Rows */}
                  <div className="max-h-[280px] overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                    {categoriesList?.map((cat) => (
                      <div
                        key={cat._id}
                        className={`group flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          selectedCategorySlug === cat.slug && activeTab === 'categories'
                            ? 'bg-emerald-50 text-[#087D2C] border border-emerald-200'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <button
                          onClick={() => {
                            setActiveTab('categories');
                            setSelectedCategorySlug(cat.slug);
                          }}
                          className="flex-1 flex items-center gap-2 truncate text-left cursor-pointer"
                        >
                          <div
                            className={`w-7 h-7 rounded-lg bg-gradient-to-b ${cat.bgGradient || 'from-[#FFF8E7] to-[#FFEEC4]'} border ${cat.borderColor || 'border-amber-200/60'} overflow-hidden shrink-0 flex items-center justify-center p-0.5 shadow-2xs`}
                          >
                            {cat.image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={cat.image}
                                alt={cat.name}
                                className="max-h-[20px] max-w-[22px] object-contain drop-shadow-2xs"
                              />
                            ) : (
                              <ImageIcon className="w-3 h-3 text-gray-400" />
                            )}
                          </div>
                          <span className="truncate text-xs">{cat.name}</span>
                        </button>

                        <div className="flex items-center gap-1 shrink-0 ml-1">
                          <span className="px-1.5 py-0.5 rounded-md bg-gray-100 text-[10px] text-gray-600 font-bold">
                            {cat.productCount}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCategory(cat._id, cat.name, cat.image);
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all cursor-pointer"
                            title={`4. Remove ${cat.name}`}
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Add New Category Button */}
                <button
                  onClick={() => {
                    setCatActionError(null);
                    setUploadProgress(null);
                    setIsAddCategoryOpen(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl bg-[#087D2C] hover:bg-[#066323] text-white text-xs font-bold transition-all shadow-sm hover:shadow cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Category</span>
                </button>
              </div>
            )}
          </div>

          {/* Cloudflare R2 Connection Card */}
          <div className="p-4 rounded-3xl bg-white border border-gray-200/80 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                Cloudflare R2 Storage
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Active
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-200/70 text-orange-600 flex items-center justify-center shrink-0 font-black text-xs">
                R2
              </div>
              <div className="min-w-0">
                <div className="text-xs font-black text-gray-900 truncate">bemyshopper-dev</div>
                <div className="text-[10px] text-gray-500 truncate">Direct Category Uploads</div>
              </div>
            </div>
          </div>

          {/* Admin Security Settings Shortcut */}
          <div className="p-3 bg-white rounded-2xl border border-gray-200/80 flex items-center justify-between">
            <button
              onClick={() => setActiveTab(activeTab === 'settings' ? 'categories' : 'settings')}
              className="w-full flex items-center justify-between text-xs font-bold text-gray-600 hover:text-gray-900 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <KeyRound className="w-3.5 h-3.5 text-gray-400" />
                <span>Admin Password &amp; Security</span>
              </div>
              <span className="text-[10px] text-[#087D2C] font-semibold">
                {activeTab === 'settings' ? 'Close' : 'Manage'}
              </span>
            </button>
          </div>
        </aside>

        {/* Right Main Content Area */}
        <main className="flex-1 min-w-0 space-y-6">
          {/* Global Photo Upload Notification Toast */}
          {catPhotoUploadStatus && (
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between gap-2 shadow-sm animate-in fade-in duration-200">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{catPhotoUploadStatus}</span>
              </div>
            </div>
          )}

          {/* If Categories dropdown is closed by clicking again, close category section beside it */}
          {!isCategoriesDropdownOpen && activeTab === 'categories' && (
            <div className="p-12 text-center bg-white rounded-3xl border border-gray-200/80 shadow-2xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#087D2C] flex items-center justify-center mx-auto">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-gray-900">Category Section Closed</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Click the <strong>Categories</strong> dropdown button in the left sidebar to reopen categories and all visible products.
              </p>
              <button
                onClick={() => setIsCategoriesDropdownOpen(true)}
                className="px-5 py-2.5 rounded-2xl bg-[#087D2C] hover:bg-[#066323] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                Open Categories &amp; Products
              </button>
            </div>
          )}

          {isCategoriesDropdownOpen && activeTab === 'categories' && (
            <>
              {/* View 1: When "All Categories" is Selected */}
              {selectedCategorySlug === 'all' && (
                <div className="space-y-4">
                  {!categoriesList || categoriesList.length === 0 ? (
                    <div className="p-12 text-center bg-white rounded-3xl border border-gray-200 space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#087D2C] flex items-center justify-center mx-auto">
                        <FolderTree className="w-6 h-6" />
                      </div>
                      <h3 className="text-sm font-black text-gray-900">No Categories Found</h3>
                      <p className="text-xs text-gray-500 max-w-sm mx-auto">
                        Click below to instantly sync the 10 categories and images exactly as shown on the home page.
                      </p>
                      <div className="flex items-center justify-center gap-3 pt-2">
                        <button
                          onClick={handleSyncWithHomePage}
                          className="px-4 py-2 rounded-xl bg-[#087D2C] hover:bg-[#066323] text-white text-xs font-bold cursor-pointer flex items-center gap-2"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Sync Home Page Categories</span>
                        </button>
                        <button
                          onClick={() => setIsAddCategoryOpen(true)}
                          className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold cursor-pointer"
                        >
                          Add Custom Category
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Exact Home Page Grid Styling & Dimensions */
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                      {categoriesList.map((cat) => (
                        <div
                          key={cat._id}
                          onClick={() => setSelectedCategorySlug(cat.slug)}
                          className={`group relative rounded-2xl bg-gradient-to-b ${cat.bgGradient || 'from-[#FFF8E7] via-[#FFF3D6] to-[#FFEEC4]'} border ${cat.borderColor || 'border-amber-200/60'} p-2.5 flex flex-col items-center justify-between h-[185px] sm:h-[195px] shadow-2xs hover:shadow-lg transition-all duration-300 cursor-pointer overflow-visible`}
                        >
                          {/* Top Pill Row: Product Count (Left) & 3-Dots Menu (Right) */}
                          <div className="w-full flex items-center justify-between z-10">
                            <span className="px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-xs text-[10px] font-black text-gray-800 shadow-2xs">
                              {cat.productCount} {cat.productCount === 1 ? 'item' : 'items'}
                            </span>

                            {/* 3-Dots Action Menu */}
                            <div className="relative">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveMenuCatId(activeMenuCatId === cat._id ? null : cat._id);
                                }}
                                className="p-1 rounded-full bg-white/80 hover:bg-white text-gray-700 shadow-2xs hover:shadow transition-all cursor-pointer"
                                title="Category Options"
                              >
                                <MoreVertical className="w-3.5 h-3.5" />
                              </button>

                              {/* 4 Options Dropdown */}
                              {activeMenuCatId === cat._id && (
                                <>
                                  <div
                                    className="fixed inset-0 z-30"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActiveMenuCatId(null);
                                    }}
                                  />
                                  <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-2xl shadow-xl border border-gray-100 py-1.5 z-40 text-left animate-in fade-in zoom-in-95 duration-100">
                                    {/* 1. Edit Category */}
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        openEditModal(cat);
                                      }}
                                      className="w-full px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                                    >
                                      <Pencil className="w-3.5 h-3.5 text-emerald-600" />
                                      <span>1. Edit Category</span>
                                    </button>

                                    {/* 2. Add / Change Photo */}
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        triggerPhotoUpload(cat._id);
                                      }}
                                      className="w-full px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                                    >
                                      <Camera className="w-3.5 h-3.5 text-blue-600" />
                                      <span>2. Add Photo</span>
                                    </button>

                                    {/* 3. Remove Photo */}
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemovePhotoFromCategory(cat);
                                      }}
                                      disabled={!cat.image}
                                      className="w-full px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                      <ImageOff className="w-3.5 h-3.5 text-amber-600" />
                                      <span>3. Remove Photo</span>
                                    </button>

                                    <div className="h-px bg-gray-100 my-1" />

                                    {/* 4. Remove Category */}
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteCategory(cat._id, cat.name, cat.image);
                                      }}
                                      className="w-full px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                                    >
                                      <Trash2 className="w-3.5 h-3.5 text-red-600" />
                                      <span>4. Remove Category</span>
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Image Size Exactly as in Home Page */}
                          <div className="w-full h-24 sm:h-26 flex items-center justify-center pt-1">
                            {cat.image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={cat.image}
                                alt={cat.name}
                                className="max-h-[75px] max-w-[85px] object-contain group-hover:scale-108 transition-transform duration-300 select-none drop-shadow-2xs"
                                style={{ maxHeight: '75px', maxWidth: '85px', objectFit: 'contain' }}
                              />
                            ) : (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  triggerPhotoUpload(cat._id);
                                }}
                                className="flex flex-col items-center justify-center text-gray-400 hover:text-[#087D2C] gap-1 p-2 rounded-xl border border-dashed border-gray-300 hover:border-[#087D2C] bg-white/40 cursor-pointer"
                                title="Click to add photo"
                              >
                                <Camera className="w-5 h-5 text-gray-400" />
                                <span className="text-[10px] font-bold">+ Add Photo</span>
                              </button>
                            )}
                          </div>

                          {/* Category Name Exactly as in Home Page */}
                          <div className="w-full pb-1 flex flex-col items-center justify-center text-center">
                            <span className="text-[11px] sm:text-[12px] font-bold text-gray-900 leading-[1.2] text-center whitespace-pre-line tracking-tight line-clamp-1">
                              {cat.name}
                            </span>
                          </div>

                          {/* Quick 4-Options Icon Bar */}
                          <div
                            className="w-full pt-1.5 border-t border-black/5 flex items-center justify-around gap-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              onClick={() => openEditModal(cat)}
                              className="p-1 rounded-md text-gray-600 hover:text-emerald-700 hover:bg-white/80 transition-all cursor-pointer"
                              title="1. Edit Category"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => triggerPhotoUpload(cat._id)}
                              className="p-1 rounded-md text-gray-600 hover:text-blue-700 hover:bg-white/80 transition-all cursor-pointer"
                              title="2. Add / Change Photo"
                            >
                              <Camera className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemovePhotoFromCategory(cat)}
                              disabled={!cat.image}
                              className="p-1 rounded-md text-gray-600 hover:text-amber-700 hover:bg-white/80 transition-all cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed"
                              title="3. Remove Photo"
                            >
                              <ImageOff className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteCategory(cat._id, cat.name, cat.image)}
                              className="p-1 rounded-md text-gray-600 hover:text-red-600 hover:bg-white/80 transition-all cursor-pointer"
                              title="4. Remove Category"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* View 2: When a Specific Category is Selected */}
              {selectedCategorySlug !== 'all' && (
                <div className="space-y-4">
                  {/* Category Details Banner with the 4 Options */}
                  {(() => {
                    const cat = categoriesList?.find((c) => c.slug === selectedCategorySlug);
                    if (!cat) return null;
                    return (
                      <div className="p-5 rounded-3xl bg-white border border-gray-200/80 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          {/* Exact Home Page Category Card Preview */}
                          <div
                            className={`w-24 h-24 rounded-2xl bg-gradient-to-b ${cat.bgGradient || 'from-[#FFF8E7] via-[#FFF3D6] to-[#FFEEC4]'} border ${cat.borderColor || 'border-amber-200/60'} p-2 flex flex-col items-center justify-between shrink-0 shadow-2xs`}
                          >
                            <div className="w-full h-14 flex items-center justify-center">
                              {cat.image ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={cat.image}
                                  alt={cat.name}
                                  className="max-h-[50px] max-w-[60px] object-contain drop-shadow-2xs"
                                />
                              ) : (
                                <ImageIcon className="w-6 h-6 text-gray-400" />
                              )}
                            </div>
                            <span className="text-[10px] font-bold text-gray-900 truncate w-full text-center">
                              {cat.name}
                            </span>
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setSelectedCategorySlug('all')}
                                className="text-xs font-bold text-gray-600 hover:text-gray-900 flex items-center gap-1 cursor-pointer bg-gray-100 hover:bg-gray-200 px-2.5 py-1 rounded-xl transition-colors mr-1"
                                title="Back to All Categories"
                              >
                                <ArrowLeft className="w-3.5 h-3.5" />
                                <span>All Categories</span>
                              </button>
                              <h3 className="text-lg font-black text-gray-900">{cat.name}</h3>
                            </div>
                            <p className="text-xs text-gray-500 mt-1 max-w-md">
                              {cat.description || 'No description provided.'}
                            </p>
                          </div>
                        </div>

                        {/* Category Action Controls: Options 1, 2, 3, 4 */}
                        <div className="flex flex-wrap items-center gap-2 self-end md:self-center">
                          {/* 1. Edit Category */}
                          <button
                            type="button"
                            onClick={() => openEditModal(cat)}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-all cursor-pointer"
                          >
                            <Pencil className="w-3.5 h-3.5 text-emerald-600" />
                            <span>1. Edit</span>
                          </button>

                          {/* 2. Add / Change Photo */}
                          <button
                            type="button"
                            onClick={() => triggerPhotoUpload(cat._id)}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-all cursor-pointer"
                          >
                            <Camera className="w-3.5 h-3.5 text-blue-600" />
                            <span>2. {cat.image ? 'Change Photo' : 'Add Photo'}</span>
                          </button>

                          {/* 3. Remove Photo */}
                          {cat.image && (
                            <button
                              type="button"
                              onClick={() => handleRemovePhotoFromCategory(cat)}
                              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold transition-all cursor-pointer border border-amber-200"
                            >
                              <ImageOff className="w-3.5 h-3.5 text-amber-600" />
                              <span>3. Remove Photo</span>
                            </button>
                          )}

                          {/* 4. Remove Category */}
                          <button
                            type="button"
                            onClick={() => handleDeleteCategory(cat._id, cat.name, cat.image)}
                            className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-red-600 bg-red-50 hover:bg-red-100 text-xs font-bold transition-colors cursor-pointer border border-red-200"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>4. Remove Category</span>
                          </button>

                          {/* Add Product Shortcut */}
                          <button
                            onClick={() => {
                              setNewProdCategory(cat.slug);
                              setIsAddProductOpen(true);
                            }}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#087D2C] hover:bg-[#066323] text-white text-xs font-bold transition-all cursor-pointer shadow-xs ml-1"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Product</span>
                          </button>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Products Grid in this Category */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black uppercase tracking-wider text-gray-500">
                        Products in this Category ({products?.length ?? 0})
                      </h4>
                    </div>

                    {!products || products.length === 0 ? (
                      <div className="p-12 text-center bg-white rounded-3xl border border-gray-200 text-xs text-gray-400 space-y-2">
                        <Package className="w-8 h-8 mx-auto text-gray-300" />
                        <div>No products found in this category.</div>
                        <button
                          onClick={() => {
                            setNewProdCategory(selectedCategorySlug);
                            setIsAddProductOpen(true);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold cursor-pointer mt-2"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add First Product</span>
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {products.map((prod) => (
                          <div
                            key={prod._id}
                            className="p-4 rounded-3xl bg-white border border-gray-200 shadow-2xs flex flex-col justify-between"
                          >
                            <div className="flex gap-3">
                              <div className="w-16 h-16 rounded-2xl bg-gray-50 p-2 border border-gray-100 flex items-center justify-center shrink-0">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={prod.image}
                                  alt={prod.name}
                                  className="max-h-full max-w-full object-contain"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                                  {prod.category}
                                </span>
                                <h4 className="text-xs font-black text-gray-900 truncate">
                                  {prod.name}
                                </h4>
                                <div className="text-[11px] text-gray-500">{prod.weight}</div>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-sm font-black text-gray-900">
                                    ₹{prod.price}
                                  </span>
                                  {prod.originalPrice && (
                                    <span className="text-[11px] text-gray-400 line-through">
                                      ₹{prod.originalPrice}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                              <button
                                onClick={() =>
                                  toggleProductStock({ id: prod._id, inStock: !prod.inStock })
                                }
                                className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                                  prod.inStock
                                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                    : 'bg-red-100 text-red-800 hover:bg-red-200'
                                }`}
                              >
                                {prod.inStock ? '✓ In Stock' : '✕ Out of Stock'}
                              </button>

                              <button
                                onClick={() => {
                                  if (confirm(`Delete ${prod.name}?`)) {
                                    deleteProduct({ id: prod._id });
                                  }
                                }}
                                className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                                title="Delete product"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {/* ================= TAB: ADMIN SECURITY & PASSWORD ================= */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl space-y-6">
              {/* Primary Admin Info Card */}
              <div className="p-6 rounded-3xl bg-white border border-gray-200 shadow-2xs">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#087D2C] text-[11px] font-black uppercase tracking-wider border border-emerald-200">
                      Primary Administrator Account
                    </span>
                    <h3 className="text-lg font-black text-gray-900 mt-2">
                      {adminUser?.name || 'Store Administrator'}
                    </h3>
                    <p className="text-xs text-gray-500">{adminUser?.email}</p>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-[#087D2C] flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-gray-100 text-xs">
                  <div className="p-3 rounded-2xl bg-gray-50">
                    <span className="text-gray-400 block text-[11px]">Database Table</span>
                    <span className="font-bold text-gray-900">admins (Isolated from shoppers)</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-gray-50">
                    <span className="text-gray-400 block text-[11px]">Access Status</span>
                    <span className="font-bold text-emerald-600">Master Admin Privileges</span>
                  </div>
                </div>
              </div>

              {/* Change Password Card */}
              <div className="p-6 rounded-3xl bg-white border border-gray-200 shadow-2xs">
                <h3 className="text-base font-black text-gray-900 mb-1 flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-[#087D2C]" />
                  <span>Change Admin Password</span>
                </h3>
                <p className="text-xs text-gray-500 mb-6">
                  Update your administrator password anytime. It must be at least 8 characters long.
                </p>

                {passwordChangeSuccess && (
                  <div className="mb-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-medium">{passwordChangeSuccess}</span>
                  </div>
                )}

                {passwordChangeError && (
                  <div className="mb-4 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                    <span className="font-medium">{passwordChangeError}</span>
                  </div>
                )}

                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Current Admin Password
                    </label>
                    <input
                      type="password"
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#087D2C] focus:ring-2 focus:ring-[#087D2C]/10 text-gray-900"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        New Admin Password
                      </label>
                      <input
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="At least 8 characters"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#087D2C] focus:ring-2 focus:ring-[#087D2C]/10 text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter new password"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#087D2C] focus:ring-2 focus:ring-[#087D2C]/10 text-gray-900"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isChangingPassword}
                      className="px-6 py-2.5 rounded-full bg-[#087D2C] hover:bg-[#066323] text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isChangingPassword ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Updating Password...</span>
                        </>
                      ) : (
                        <>
                          <KeyRound className="w-3.5 h-3.5" />
                          <span>Update Admin Password</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Add New Category Modal with Cloudflare R2 Upload */}
      {isAddCategoryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-black text-gray-900">Add New Category</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[11px] text-gray-500 font-medium">
                    Images upload directly to Cloudflare R2 (bemyshopper-dev)
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsAddCategoryOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {catActionError && (
              <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                <span>{catActionError}</span>
              </div>
            )}

            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => handleCatNameChange(e.target.value)}
                  placeholder="e.g. Pooja Essentials, Spices & Masalas"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#087D2C] focus:ring-2 focus:ring-[#087D2C]/10 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  rows={2}
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  placeholder="Short description for customer category banners..."
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#087D2C] text-gray-900 resize-none"
                />
              </div>

              {/* Cloudflare R2 Image Upload */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700">
                  Category Banner Image (Cloudflare R2)
                </label>

                {newCatImage ? (
                  <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 p-2 flex items-center gap-3">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-white shrink-0 border border-gray-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={newCatImage}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>Uploaded to Cloudflare R2</span>
                      </div>
                      <div className="text-[10px] text-gray-400 font-mono truncate">{newCatImage}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setNewCatImage('');
                        setUploadProgress(null);
                      }}
                      className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg cursor-pointer"
                      title="Remove image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="relative border-2 border-dashed border-gray-300 hover:border-[#087D2C] rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-gray-50/50 hover:bg-emerald-50/20">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploadingImage}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    {isUploadingImage ? (
                      <div className="flex flex-col items-center gap-2 py-2">
                        <RefreshCw className="w-6 h-6 text-[#087D2C] animate-spin" />
                        <span className="text-xs font-bold text-[#087D2C]">{uploadProgress}</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1.5 py-1">
                        <Upload className="w-6 h-6 text-gray-400" />
                        <span className="text-xs font-bold text-gray-700">
                          Click to browse or drop category banner image
                        </span>
                        <span className="text-[10px] text-gray-400">
                          PNG, JPG, WEBP up to 10MB • Stores in Cloudflare R2 bucket: bemyshopper-dev
                        </span>
                      </div>
                    )}
                  </label>
                )}
              </div>

              <div className="pt-2 flex gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddCategoryOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingCat || isUploadingImage}
                  className="flex-1 py-2.5 rounded-xl bg-[#087D2C] hover:bg-[#066323] text-white text-xs font-bold shadow-sm hover:shadow transition-all cursor-pointer disabled:opacity-50"
                >
                  {isCreatingCat ? 'Creating Category...' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-gray-900">Add New Product</h3>
              <button
                onClick={() => setIsAddProductOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="e.g. Sona Masoori Rice"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#137A2C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#137A2C]"
                  >
                    {categoriesList && categoriesList.length > 0 ? (
                      categoriesList.map((cat) => (
                        <option key={cat._id} value={cat.slug}>
                          {cat.name}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="groceries">Groceries</option>
                        <option value="pooja-items">Pooja Items</option>
                        <option value="cleaning-essentials">Cleaning Essentials</option>
                        <option value="personal-care">Personal Care</option>
                        <option value="snacks-beverages">Snacks &amp; Beverages</option>
                      </>
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Weight / Unit</label>
                  <input
                    type="text"
                    required
                    value={newProdWeight}
                    onChange={(e) => setNewProdWeight(e.target.value)}
                    placeholder="e.g. 1 kg, 500ml"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#137A2C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    placeholder="99"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#137A2C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">MRP / Original (₹)</label>
                  <input
                    type="number"
                    value={newProdOriginalPrice}
                    onChange={(e) => setNewProdOriginalPrice(e.target.value)}
                    placeholder="120"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#137A2C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Image Path / URL</label>
                <input
                  type="text"
                  value={newProdImage}
                  onChange={(e) => setNewProdImage(e.target.value)}
                  placeholder="/images/prod-rice-5kg.png"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#137A2C]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="inStockCheck"
                  checked={newProdInStock}
                  onChange={(e) => setNewProdInStock(e.target.checked)}
                  className="rounded text-[#137A2C] focus:ring-0"
                />
                <label htmlFor="inStockCheck" className="text-xs font-bold text-gray-700">
                  In Stock &amp; Available for Order
                </label>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-[#137A2C] hover:bg-[#0E5C21] text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 1. Edit Category Modal */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                  <Pencil className="w-4 h-4 text-emerald-600" />
                  <span>1. Edit Category</span>
                </h3>
                <p className="text-xs text-gray-500">Update category details and description</p>
              </div>
              <button
                onClick={() => setEditingCategory(null)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => {
                    setEditName(e.target.value);
                    setEditSlug(
                      e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/(^-|-$)/g, '')
                    );
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#087D2C] focus:ring-2 focus:ring-[#087D2C]/10 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Description (Optional)</label>
                <textarea
                  rows={2}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  placeholder="Short description for banners..."
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#087D2C] text-gray-900 resize-none"
                />
              </div>

              <div className="pt-2 flex gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingEdit}
                  className="flex-1 py-2.5 rounded-xl bg-[#087D2C] hover:bg-[#066323] text-white text-xs font-bold shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSavingEdit ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Hidden file input for Option 2: Add / Change Photo via Cloudflare R2 */}
      <input
        type="file"
        ref={photoInputRef}
        accept="image/*"
        onChange={handlePhotoFileChange}
        className="hidden"
      />
    </div>
  );
}

