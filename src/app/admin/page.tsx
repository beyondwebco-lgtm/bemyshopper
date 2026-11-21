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
  ClipboardPaste,
  Flame,
  MessageSquare,
  ExternalLink,
} from 'lucide-react';
import AdminRentalsSection from '@/components/admin/AdminRentalsSection';
import AdminCustomersSection from '@/components/admin/AdminCustomersSection';
import AdminWhatsAppSection from '@/components/admin/AdminWhatsAppSection';

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

  const [activeTab, setActiveTab] = useState<'categories' | 'products' | 'orders' | 'rentals' | 'users' | 'settings' | 'essentials' | 'offers' | 'whatsapp'>('categories');

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
  const [newProdImage, setNewProdImage] = useState('');
  const [isUploadingProdImage, setIsUploadingProdImage] = useState(false);
  const [prodUploadProgress, setProdUploadProgress] = useState<string | null>(null);
  const [newProdInStock, setNewProdInStock] = useState(true);
  const [newProdIsTopEssential, setNewProdIsTopEssential] = useState(false);
  const [newProdIsOffer, setNewProdIsOffer] = useState(false);
  const [newProdBadgeText, setNewProdBadgeText] = useState('');
  const [newProdDiscount, setNewProdDiscount] = useState('');

  // Categories UI State
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>('all');
  const [isCategoriesDropdownOpen, setIsCategoriesDropdownOpen] = useState(true);
  const [isEssentialsDropdownOpen, setIsEssentialsDropdownOpen] = useState(false);
  const [isOffersDropdownOpen, setIsOffersDropdownOpen] = useState(false);
  const [isRentalsDropdownOpen, setIsRentalsDropdownOpen] = useState(false);
  const [isCustomersDropdownOpen, setIsCustomersDropdownOpen] = useState(false);
  const [isWhatsAppDropdownOpen, setIsWhatsAppDropdownOpen] = useState(false);
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

  // Top Essentials UI & Modal State
  const topEssentials = useQuery(api.products.listTopEssentials);
  const syncTopEssentialsMutation = useMutation(api.products.syncTopEssentials);
  const updateProductPhotoMutation = useMutation(api.products.updatePhoto);
  const removeProductPhotoMutation = useMutation(api.products.removePhoto);
  const updateProductMutation = useMutation(api.products.update);
  const deleteProductMutation = useMutation(api.products.remove);

  const [isAddEssentialOpen, setIsAddEssentialOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editingEssential, setEditingEssential] = useState<any | null>(null);
  const [activeMenuEssentialId, setActiveMenuEssentialId] = useState<string | null>(null);
  const [essentialPhotoStatus, setEssentialPhotoStatus] = useState<string | null>(null);
  const [isUploadingEssentialPhoto, setIsUploadingEssentialPhoto] = useState(false);
  const [targetPhotoEssentialId, setTargetPhotoEssentialId] = useState<Id<'products'> | null>(null);
  const essentialPhotoInputRef = React.useRef<HTMLInputElement>(null);

  // Form Fields for Add/Edit Top Essential
  const [essName, setEssName] = useState('');
  const [essCategory, setEssCategory] = useState('cleaning');
  const [essPrice, setEssPrice] = useState('');
  const [essOriginalPrice, setEssOriginalPrice] = useState('');
  const [essWeight, setEssWeight] = useState('');
  const [essDiscount, setEssDiscount] = useState('');
  const [essBadgeText, setEssBadgeText] = useState('');
  const [essBadgeIcon, setEssBadgeIcon] = useState('🔥');
  const [essBadgeColor, setEssBadgeColor] = useState('bg-[#FED7AA] text-[#C2410C]');
  const [essImage, setEssImage] = useState('');
  const [isUploadingNewEssImage, setIsUploadingNewEssImage] = useState(false);

  // Offer Banner & Offers Management State
  const [offerBadgeText, setOfferBadgeText] = useState('Diwali Mahotsav Dhamaka Deals');
  const [offerTitle, setOfferTitle] = useState('Shop Diwali Deals & Save Up to 30% OFF');
  const [offerSubtitle, setOfferSubtitle] = useState(
    'Handpicked festive groceries, pure pooja ghee, fragrant agarbathi, and home cleaning essentials at guaranteed festival prices for Bapatla!'
  );
  const [offerBannerImg, setOfferBannerImg] = useState('/images/diwali-offer-products.png');
  const [offerBannerSaved, setOfferBannerSaved] = useState(false);
  const [isUploadingOfferBanner, setIsUploadingOfferBanner] = useState(false);
  const [offerBannerProgress, setOfferBannerProgress] = useState<string | null>(null);
  const offerBannerInputRef = React.useRef<HTMLInputElement>(null);

  // Edit Price in Offers state
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editingPriceProd, setEditingPriceProd] = useState<any | null>(null);
  const [editPriceVal, setEditPriceVal] = useState('');
  const [editOrigPriceVal, setEditOrigPriceVal] = useState('');
  const [isSavingPrice, setIsSavingPrice] = useState(false);

  // Convex Queries
  const stats = useQuery(api.orders.getStats);
  const products = useQuery(api.products.list, {
    category: selectedCategorySlug === 'all' ? undefined : selectedCategorySlug,
  });
  const allProductsList = useQuery(api.products.list, {});

  const offerProducts = (allProductsList || []).filter(
    (p) =>
      p.badgeText === 'Special Offer' ||
      (p.isPopular === true && (p.displayOrder === undefined || p.displayOrder === null))
  );

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
      if (/incorrect.*password|password.*incorrect/i.test(raw)) {
        return 'Incorrect administrator password. Please try again.';
      }
      if (/access denied|privileges/i.test(raw)) {
        return 'Access Denied: Only the Store Administrator has access.';
      }
      if (/no administrator account|account not found/i.test(raw)) {
        return 'No administrator account found with this email.';
      }
      const uncaughtMatch = raw.match(/Uncaught Error:\s*([^\n]+)/);
      if (uncaughtMatch) {
        return uncaughtMatch[1].replace(/at\s+handler.*$/i, '').replace(/\[.*?\]/g, '').trim();
      }
      const serverMatch = raw.match(/Server Error\s*([^\n]+)/);
      if (serverMatch) {
        return serverMatch[1].replace(/at\s+handler.*$/i, '').replace(/\[.*?\]/g, '').trim();
      }
      return raw.replace(/\[CONVEX[^\]]*\]/g, '').replace(/\[Request ID:[^\]]*\]/g, '').trim();
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

  const uploadCategoryFileToR2 = async (file: File) => {
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
      setUploadProgress('✓ Image uploaded to Cloudflare R2!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      setCatActionError(msg);
      setUploadProgress(null);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const uploadCategoryUrlOrDataToR2 = async (urlOrData: string) => {
    setIsUploadingImage(true);
    setUploadProgress('Uploading to Cloudflare R2...');
    setCatActionError(null);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: urlOrData.startsWith('http') ? urlOrData : undefined,
          dataUrl: urlOrData.startsWith('data:image') ? urlOrData : undefined,
          folder: 'categories',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to upload image');
      }

      setNewCatImage(data.url);
      setUploadProgress('✓ Image uploaded to Cloudflare R2!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      setCatActionError(msg);
      setUploadProgress(null);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadCategoryFileToR2(file);
  };

  const handlePasteFromClipboard = async () => {
    setCatActionError(null);
    setIsUploadingImage(true);
    setUploadProgress('Reading clipboard...');

    // 1. Try reading rich image files
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.read) {
        const items = await navigator.clipboard.read();
        for (const item of items) {
          const imgType = item.types.find((t) => t.startsWith('image/'));
          if (imgType) {
            const blob = await item.getType(imgType);
            const ext = imgType.split('/')[1]?.replace('+xml', '') || 'png';
            const file = new File([blob], `pasted-${Date.now()}.${ext}`, { type: imgType });
            await uploadCategoryFileToR2(file);
            return;
          }
        }
      }
    } catch {
      // fallback
    }

    // 2. Try reading clipboard text (e.g. image link, web URL, data:image)
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.readText) {
        const text = (await navigator.clipboard.readText()).trim();
        if (text) {
          if (text.startsWith('http://') || text.startsWith('https://') || text.startsWith('data:image/')) {
            await uploadCategoryUrlOrDataToR2(text);
            return;
          } else if (text.startsWith('/')) {
            setNewCatImage(text);
            setUploadProgress('✓ Image applied!');
            setIsUploadingImage(false);
            return;
          }
        }
      }
    } catch {
      // ignore
    }

    setIsUploadingImage(false);
    setCatActionError('Press Ctrl+V / Cmd+V directly to paste your copied image.');
  };

  const handleCategoryModalPaste = async (e: React.ClipboardEvent | ClipboardEvent) => {
    const target = (e.target || (e as unknown as { srcElement: HTMLElement }).srcElement) as HTMLElement;
    const isTextInput =
      target &&
      ((target.tagName === 'INPUT' && (target as HTMLInputElement).type === 'text') ||
        target.tagName === 'TEXTAREA');

    const files = e.clipboardData?.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        if (files[i].type.startsWith('image/')) {
          e.preventDefault();
          await uploadCategoryFileToR2(files[i]);
          return;
        }
      }
    }

    const items = e.clipboardData?.items;
    if (items && items.length > 0) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          e.preventDefault();
          const file = items[i].getAsFile();
          if (file) {
            await uploadCategoryFileToR2(file);
            return;
          }
        }
      }
    }

    if (!isTextInput) {
      const text = e.clipboardData?.getData('text')?.trim();
      if (text && (text.startsWith('http://') || text.startsWith('https://') || text.startsWith('data:image/'))) {
        e.preventDefault();
        await uploadCategoryUrlOrDataToR2(text);
      }
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

  const uploadProductFileToR2 = async (file: File) => {
    setIsUploadingProdImage(true);
    setProdUploadProgress('Uploading image to Cloudflare R2...');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'products');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to upload product image');
      }

      setNewProdImage(data.url);
      setProdUploadProgress('✓ Image uploaded to Cloudflare R2!');
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Product upload failed');
      setProdUploadProgress(null);
    } finally {
      setIsUploadingProdImage(false);
    }
  };

  const uploadProductUrlOrDataToR2 = async (urlOrData: string) => {
    setIsUploadingProdImage(true);
    setProdUploadProgress('Uploading image to Cloudflare R2...');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: urlOrData.startsWith('http') ? urlOrData : undefined,
          dataUrl: urlOrData.startsWith('data:image') ? urlOrData : undefined,
          folder: 'products',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to upload image');
      }

      setNewProdImage(data.url);
      setProdUploadProgress('✓ Image uploaded to Cloudflare R2!');
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Image upload failed');
      setProdUploadProgress(null);
    } finally {
      setIsUploadingProdImage(false);
    }
  };

  const handleProductImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadProductFileToR2(file);
  };

  const handleProductPasteFromClipboard = async () => {
    setIsUploadingProdImage(true);
    setProdUploadProgress('Reading clipboard...');

    // 1. Check for image files in clipboard
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.read) {
        const items = await navigator.clipboard.read();
        for (const item of items) {
          const imgType = item.types.find((t) => t.startsWith('image/'));
          if (imgType) {
            const blob = await item.getType(imgType);
            const ext = imgType.split('/')[1]?.replace('+xml', '') || 'png';
            const file = new File([blob], `pasted-${Date.now()}.${ext}`, { type: imgType });
            await uploadProductFileToR2(file);
            return;
          }
        }
      }
    } catch {
      // fallback to readText
    }

    // 2. Check for copied image URL or base64 in clipboard
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.readText) {
        const text = (await navigator.clipboard.readText()).trim();
        if (text) {
          if (text.startsWith('http://') || text.startsWith('https://') || text.startsWith('data:image/')) {
            await uploadProductUrlOrDataToR2(text);
            return;
          } else if (text.startsWith('/')) {
            setNewProdImage(text);
            setProdUploadProgress('✓ Image applied!');
            setIsUploadingProdImage(false);
            return;
          }
        }
      }
    } catch {
      // ignore
    }

    setIsUploadingProdImage(false);
    setProdUploadProgress('Press Ctrl+V / Cmd+V directly to paste your copied image');
  };

  const handleProductModalPaste = async (e: React.ClipboardEvent | ClipboardEvent) => {
    const target = (e.target || (e as unknown as { srcElement: HTMLElement }).srcElement) as HTMLElement;
    const isTextInput =
      target &&
      ((target.tagName === 'INPUT' && (target as HTMLInputElement).type === 'text') ||
        target.tagName === 'TEXTAREA');

    // Check files
    const files = e.clipboardData?.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        if (files[i].type.startsWith('image/')) {
          e.preventDefault();
          await uploadProductFileToR2(files[i]);
          return;
        }
      }
    }

    // Check items
    const items = e.clipboardData?.items;
    if (items && items.length > 0) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          e.preventDefault();
          const file = items[i].getAsFile();
          if (file) {
            await uploadProductFileToR2(file);
            return;
          }
        }
      }
    }

    // Check URL or dataUrl
    if (!isTextInput) {
      const text = e.clipboardData?.getData('text')?.trim();
      if (text && (text.startsWith('http://') || text.startsWith('https://') || text.startsWith('data:image/'))) {
        e.preventDefault();
        await uploadProductUrlOrDataToR2(text);
      }
    }
  };

  useEffect(() => {
    if (!isAddProductOpen) return;
    const handleGlobalPaste = (e: ClipboardEvent) => {
      handleProductModalPaste(e);
    };
    window.addEventListener('paste', handleGlobalPaste);
    return () => window.removeEventListener('paste', handleGlobalPaste);
  }, [isAddProductOpen]);

  useEffect(() => {
    if (!isAddCategoryOpen) return;
    const handleGlobalCategoryPaste = (e: ClipboardEvent) => {
      handleCategoryModalPaste(e as unknown as React.ClipboardEvent);
    };
    window.addEventListener('paste', handleGlobalCategoryPaste);
    return () => window.removeEventListener('paste', handleGlobalCategoryPaste);
  }, [isAddCategoryOpen]);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice) return;

    let badgeIcon: string | undefined;
    let badgeColor: string | undefined;
    if (newProdBadgeText === 'Bestseller') {
      badgeIcon = '👑';
      badgeColor = 'bg-[#48BB78] text-white';
    } else if (newProdBadgeText === 'Trending') {
      badgeIcon = '🔥';
      badgeColor = 'bg-[#FED7AA] text-[#C2410C]';
    } else if (newProdBadgeText === 'Pure & Fresh') {
      badgeIcon = '🌿';
      badgeColor = 'bg-emerald-600 text-white';
    } else if (newProdBadgeText === 'Special Offer') {
      badgeIcon = '⚡';
      badgeColor = 'bg-amber-500 text-white';
    }

    const calculatedDiscount =
      newProdOriginalPrice && parseFloat(newProdOriginalPrice) > parseFloat(newProdPrice)
        ? `Save ${Math.round(((parseFloat(newProdOriginalPrice) - parseFloat(newProdPrice)) / parseFloat(newProdOriginalPrice)) * 100)}%`
        : undefined;

    await createProduct({
      name: newProdName.trim(),
      category: newProdCategory,
      price: parseFloat(newProdPrice),
      originalPrice: newProdOriginalPrice ? parseFloat(newProdOriginalPrice) : undefined,
      weight: newProdWeight.trim(),
      image: newProdImage.trim() || '/images/prod-rice-5kg.png',
      inStock: newProdInStock,
      isPopular: newProdIsOffer,
      isTopEssential: newProdIsTopEssential,
      badgeText: newProdIsTopEssential && newProdBadgeText ? newProdBadgeText : (newProdIsOffer ? 'Special Offer' : undefined),
      badgeIcon: newProdIsTopEssential && newProdBadgeText ? badgeIcon : (newProdIsOffer ? '⚡' : undefined),
      badgeColor: newProdIsTopEssential && newProdBadgeText ? badgeColor : (newProdIsOffer ? 'bg-amber-500 text-white' : undefined),
      discount: newProdIsTopEssential && newProdDiscount ? newProdDiscount.trim() : (newProdIsOffer ? calculatedDiscount : undefined),
    });

    setIsAddProductOpen(false);
    setNewProdName('');
    setNewProdPrice('');
    setNewProdOriginalPrice('');
    setNewProdWeight('1 unit');
    setNewProdImage('');
    setNewProdInStock(true);
    setNewProdIsTopEssential(false);
    setNewProdIsOffer(false);
    setNewProdBadgeText('');
    setNewProdDiscount('');
    setProdUploadProgress(null);
  };

  // Load saved offer banner on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('bemyshopper_offer_banner');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.badge) setOfferBadgeText(parsed.badge);
        if (parsed.title) setOfferTitle(parsed.title);
        if (parsed.subtitle) setOfferSubtitle(parsed.subtitle);
        if (parsed.image) setOfferBannerImg(parsed.image);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleSaveOfferBanner = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      badge: offerBadgeText.trim(),
      title: offerTitle.trim(),
      subtitle: offerSubtitle.trim(),
      image: offerBannerImg.trim() || '/images/diwali-offer-products.png',
    };
    localStorage.setItem('bemyshopper_offer_banner', JSON.stringify(data));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('bemyshopper_offer_banner_updated', { detail: data }));
    }
    setOfferBannerSaved(true);
    setTimeout(() => setOfferBannerSaved(false), 2500);
  };

  const uploadOfferBannerFileToR2 = async (file: File) => {
    setIsUploadingOfferBanner(true);
    setOfferBannerProgress('Uploading banner to Cloudflare R2...');
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'offers');
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to upload banner');
      setOfferBannerImg(data.url);
      setOfferBannerProgress('✓ Banner uploaded to Cloudflare R2!');
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Upload failed');
      setOfferBannerProgress(null);
    } finally {
      setIsUploadingOfferBanner(false);
    }
  };

  const uploadOfferBannerUrlOrDataToR2 = async (urlOrData: string) => {
    setIsUploadingOfferBanner(true);
    setOfferBannerProgress('Uploading banner to Cloudflare R2...');
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: urlOrData.startsWith('http') ? urlOrData : undefined,
          dataUrl: urlOrData.startsWith('data:image') ? urlOrData : undefined,
          folder: 'offers',
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to upload banner');
      setOfferBannerImg(data.url);
      setOfferBannerProgress('✓ Banner uploaded to Cloudflare R2!');
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Upload failed');
      setOfferBannerProgress(null);
    } finally {
      setIsUploadingOfferBanner(false);
    }
  };

  const handleOfferBannerPasteFromClipboard = async () => {
    setIsUploadingOfferBanner(true);
    setOfferBannerProgress('Reading clipboard...');
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.read) {
        const items = await navigator.clipboard.read();
        for (const item of items) {
          const imgType = item.types.find((t) => t.startsWith('image/'));
          if (imgType) {
            const blob = await item.getType(imgType);
            const ext = imgType.split('/')[1]?.replace('+xml', '') || 'png';
            const file = new File([blob], `banner-${Date.now()}.${ext}`, { type: imgType });
            await uploadOfferBannerFileToR2(file);
            return;
          }
        }
      }
    } catch {
      // fallback to readText
    }

    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.readText) {
        const text = (await navigator.clipboard.readText()).trim();
        if (text) {
          if (text.startsWith('http://') || text.startsWith('https://') || text.startsWith('data:image/')) {
            await uploadOfferBannerUrlOrDataToR2(text);
            return;
          }
        }
      }
    } catch {
      // ignore
    }

    setIsUploadingOfferBanner(false);
    setOfferBannerProgress(null);
    alert('No image found in clipboard. Please copy an image or image link first.');
  };

  const handleUploadOfferBanner = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadOfferBannerFileToR2(file);
  };

  useEffect(() => {
    if (activeTab !== 'offers') return;
    const handleGlobalOfferPaste = async (e: ClipboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isTextInput =
        target &&
        ((target.tagName === 'INPUT' && (target as HTMLInputElement).type === 'text') ||
          target.tagName === 'TEXTAREA');

      const files = e.clipboardData?.files;
      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          if (files[i].type.startsWith('image/')) {
            e.preventDefault();
            await uploadOfferBannerFileToR2(files[i]);
            return;
          }
        }
      }

      if (!isTextInput) {
        const text = e.clipboardData?.getData('text')?.trim();
        if (text && (text.startsWith('http://') || text.startsWith('https://') || text.startsWith('data:image/'))) {
          e.preventDefault();
          await uploadOfferBannerUrlOrDataToR2(text);
        }
      }
    };

    window.addEventListener('paste', handleGlobalOfferPaste);
    return () => window.removeEventListener('paste', handleGlobalOfferPaste);
  }, [activeTab]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const openPriceModal = (prod: any) => {
    setEditingPriceProd(prod);
    setEditPriceVal(String(prod.price ?? ''));
    setEditOrigPriceVal(String(prod.originalPrice ?? ''));
  };

  const handleSavePrice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPriceProd || !editPriceVal) return;
    setIsSavingPrice(true);
    try {
      const priceNum = Number(editPriceVal);
      const origPriceNum = editOrigPriceVal ? Number(editOrigPriceVal) : undefined;
      const calculatedDiscount =
        origPriceNum && origPriceNum > priceNum
          ? `Save ${Math.round(((origPriceNum - priceNum) / origPriceNum) * 100)}%`
          : undefined;

      await updateProductMutation({
        id: editingPriceProd._id,
        price: priceNum,
        originalPrice: origPriceNum,
        discount: calculatedDiscount,
      });
      setEditingPriceProd(null);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to update pricing');
    } finally {
      setIsSavingPrice(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleRemoveFromOffers = async (prod: any) => {
    if (confirm(`Remove "${prod.name}" from festival offers?`)) {
      await updateProductMutation({
        id: prod._id,
        isPopular: false,
        badgeText: prod.badgeText === 'Special Offer' ? undefined : prod.badgeText,
      });
    }
  };

  // Top Essentials Handlers
  const handleSyncTopEssentials = async () => {
    if (
      !confirm(
        'This will sync/reset the 12 Top Essentials with their correct categories and live Cloudflare R2 photos. Continue?'
      )
    ) {
      return;
    }
    try {
      const res = await syncTopEssentialsMutation({});
      alert(res.message);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to sync Top Essentials');
    }
  };

  const handleUploadEssentialPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !targetPhotoEssentialId) return;

    setIsUploadingEssentialPhoto(true);
    setEssentialPhotoStatus('Uploading to Cloudflare R2...');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'products');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to upload photo to Cloudflare R2');
      }

      await updateProductPhotoMutation({
        id: targetPhotoEssentialId,
        image: data.url,
      });

      setEssentialPhotoStatus('✓ Photo updated in Cloudflare R2!');
      setTimeout(() => setEssentialPhotoStatus(null), 3000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Photo upload failed');
      setEssentialPhotoStatus(null);
    } finally {
      setIsUploadingEssentialPhoto(false);
      setTargetPhotoEssentialId(null);
      if (e.target) e.target.value = '';
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleRemovePhotoFromEssential = async (item: any) => {
    if (!confirm(`Are you sure you want to remove the photo from "${item.name}"?`)) {
      return;
    }
    try {
      const oldImage = item.image;
      await removeProductPhotoMutation({ id: item._id });
      if (oldImage) {
        await deleteImageFromR2(oldImage);
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to remove photo');
    } finally {
      setActiveMenuEssentialId(null);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDeleteEssential = async (item: any) => {
    if (!confirm(`Are you sure you want to permanently delete "${item.name}"?`)) {
      return;
    }
    try {
      await deleteProductMutation({ id: item._id });
      if (item.image) {
        await deleteImageFromR2(item.image);
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to delete essential');
    } finally {
      setActiveMenuEssentialId(null);
    }
  };

  const resetEssentialForm = () => {
    setEssName('');
    setEssCategory('cleaning');
    setEssPrice('');
    setEssOriginalPrice('');
    setEssWeight('');
    setEssDiscount('');
    setEssBadgeText('');
    setEssBadgeIcon('🔥');
    setEssBadgeColor('bg-[#FED7AA] text-[#C2410C]');
    setEssImage('');
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const openEditEssentialModal = (item: any) => {
    setEditingEssential(item);
    setEssName(item.name);
    setEssCategory(item.category);
    setEssPrice(item.price.toString());
    setEssOriginalPrice(item.originalPrice ? item.originalPrice.toString() : '');
    setEssWeight(item.weight);
    setEssDiscount(item.discount || '');
    setEssBadgeText(item.badgeText || '');
    setEssBadgeIcon(item.badgeIcon || '🔥');
    setEssBadgeColor(item.badgeColor || 'bg-[#FED7AA] text-[#C2410C]');
    setEssImage(item.image || '');
  };

  const handleCreateTopEssential = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!essName.trim() || !essPrice || !essWeight.trim()) {
      alert('Please enter Name, Price, and Pack/Weight.');
      return;
    }

    try {
      await createProduct({
        name: essName.trim(),
        category: essCategory,
        price: Number(essPrice),
        originalPrice: essOriginalPrice ? Number(essOriginalPrice) : undefined,
        weight: essWeight.trim(),
        image: essImage.trim() || '/images/prod-surf-excel.png',
        inStock: true,
        isPopular: true,
        isTopEssential: true,
        badgeText: essBadgeText.trim() || undefined,
        badgeIcon: essBadgeText.trim() ? essBadgeIcon : undefined,
        badgeColor: essBadgeText.trim() ? essBadgeColor : undefined,
        discount: essDiscount.trim() || undefined,
        displayOrder: (topEssentials?.length ?? 0) + 1,
      });

      setIsAddEssentialOpen(false);
      resetEssentialForm();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to create top essential');
    }
  };

  const handleUpdateTopEssential = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEssential) return;

    try {
      await updateProductMutation({
        id: editingEssential._id,
        name: essName.trim(),
        category: essCategory,
        price: Number(essPrice),
        originalPrice: essOriginalPrice ? Number(essOriginalPrice) : undefined,
        weight: essWeight.trim(),
        image: essImage.trim() || editingEssential.image,
        badgeText: essBadgeText.trim() || undefined,
        badgeIcon: essBadgeText.trim() ? essBadgeIcon : undefined,
        badgeColor: essBadgeText.trim() ? essBadgeColor : undefined,
        discount: essDiscount.trim() || undefined,
      });

      setEditingEssential(null);
      resetEssentialForm();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to update top essential');
    }
  };

  const getCategoryName = (slug: string) => {
    const cat = categoriesList?.find((c) => c.slug === slug);
    if (cat) return cat.name;
    switch (slug) {
      case 'cleaning':
        return 'Cleaning Essentials';
      case 'puja-items':
        return 'Puja Items';
      case 'groceries':
        return 'Groceries';
      case 'paper':
        return 'Paper & Disposables';
      case 'home-kitchen':
        return 'Home & Kitchen';
      case 'personal-care':
        return 'Personal Care';
      case 'snacks':
        return 'Snacks & Beverages';
      case 'fruits-veg':
        return 'Fruits & Vegetables';
      case 'baby-care':
        return 'Baby Care';
      case 'more':
        return 'More';
      default:
        return slug;
    }
  };

  const getCategoryBadgeStyle = (slug: string) => {
    switch (slug) {
      case 'cleaning':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'puja-items':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'groceries':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'paper':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'home-kitchen':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'personal-care':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
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
                const willOpen = !isCategoriesDropdownOpen;
                setIsCategoriesDropdownOpen(willOpen);
                if (willOpen) {
                  setActiveTab('categories');
                  setSelectedCategorySlug('all');
                  setIsEssentialsDropdownOpen(false);
                  setIsOffersDropdownOpen(false);
                  setIsRentalsDropdownOpen(false);
                  setIsCustomersDropdownOpen(false);
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
                  {categoriesList?.length ?? 10}
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
                      <option value="all">📁 All Categories ({categoriesList?.length ?? 10})</option>
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
                      Categories ({categoriesList?.length ?? 10})
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
                    {categoriesList === undefined ? (
                      <div className="space-y-1.5 py-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div key={i} className="h-7 bg-gray-100/80 rounded-xl animate-pulse" />
                        ))}
                      </div>
                    ) : (
                      categoriesList.map((cat) => (
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
                      ))
                    )}
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

            {/* Top Essentials Primary Pill Button with Dropdown Indicator (Down to Categories) */}
            <div className="pt-2 border-t border-gray-100">
              <button
                onClick={() => {
                  const willOpen = !isEssentialsDropdownOpen;
                  setIsEssentialsDropdownOpen(willOpen);
                  if (willOpen) {
                    setActiveTab('essentials');
                    setIsCategoriesDropdownOpen(false);
                    setIsOffersDropdownOpen(false);
                    setIsRentalsDropdownOpen(false);
                    setIsCustomersDropdownOpen(false);
                  }
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-full transition-all cursor-pointer shadow-sm select-none ${
                  isEssentialsDropdownOpen
                    ? 'bg-[#087D2C] text-white'
                    : 'bg-white border border-gray-200 text-gray-800 hover:bg-emerald-50'
                }`}
              >
                <div className="flex items-center gap-2.5 font-black text-sm">
                  <Sparkles className={`w-4 h-4 ${isEssentialsDropdownOpen ? 'text-amber-300' : 'text-amber-500'}`} />
                  <span>Top Essentials</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                    isEssentialsDropdownOpen
                      ? 'bg-emerald-800/60 text-white'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {topEssentials?.length ?? 12}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isEssentialsDropdownOpen ? 'rotate-180' : 'rotate-0'
                    } ${isEssentialsDropdownOpen ? 'text-white' : 'text-gray-500'}`}
                  />
                </div>
              </button>
            </div>

            {/* Festival Offers Primary Button with Dropdown Indicator */}
            <div className="pt-2 border-t border-gray-100">
              <button
                onClick={() => {
                  const willOpen = !isOffersDropdownOpen;
                  setIsOffersDropdownOpen(willOpen);
                  if (willOpen) {
                    setActiveTab('offers');
                    setIsCategoriesDropdownOpen(false);
                    setIsEssentialsDropdownOpen(false);
                    setIsRentalsDropdownOpen(false);
                    setIsCustomersDropdownOpen(false);
                  }
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-full transition-all cursor-pointer shadow-sm select-none ${
                  isOffersDropdownOpen
                    ? 'bg-gradient-to-r from-purple-900 via-[#3C0764] to-[#58158C] text-white shadow-md'
                    : 'bg-white border border-gray-200 text-gray-800 hover:bg-purple-50'
                }`}
              >
                <div className="flex items-center gap-2.5 font-black text-sm">
                  <Flame className={`w-4 h-4 ${isOffersDropdownOpen ? 'text-amber-300 fill-amber-300' : 'text-orange-500'}`} />
                  <span>Festival Offers</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                    isOffersDropdownOpen
                      ? 'bg-white/20 text-amber-200'
                      : 'bg-orange-100 text-orange-800'
                  }`}>
                    {offerProducts.length}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isOffersDropdownOpen ? 'rotate-180' : 'rotate-0'
                    } ${isOffersDropdownOpen ? 'text-white' : 'text-gray-500'}`}
                  />
                </div>
              </button>
            </div>

            {/* Car Rental Primary Button with Dropdown Indicator */}
            <div className="pt-2 border-t border-gray-100">
              <button
                onClick={() => {
                  const willOpen = !isRentalsDropdownOpen;
                  setIsRentalsDropdownOpen(willOpen);
                  if (willOpen) {
                    setActiveTab('rentals');
                    setIsCategoriesDropdownOpen(false);
                    setIsEssentialsDropdownOpen(false);
                    setIsOffersDropdownOpen(false);
                    setIsCustomersDropdownOpen(false);
                  }
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-full transition-all cursor-pointer shadow-sm select-none ${
                  isRentalsDropdownOpen
                    ? 'bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white shadow-md'
                    : 'bg-white border border-gray-200 text-gray-800 hover:bg-orange-50'
                }`}
              >
                <div className="flex items-center gap-2.5 font-black text-sm">
                  <Car className={`w-4 h-4 ${isRentalsDropdownOpen ? 'text-white' : 'text-orange-600'}`} />
                  <span>Car Rental</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                    isRentalsDropdownOpen
                      ? 'bg-white/20 text-white'
                      : 'bg-orange-100 text-orange-800'
                  }`}>
                    {rentals?.length ?? 0}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isRentalsDropdownOpen ? 'rotate-180' : 'rotate-0'
                    } ${isRentalsDropdownOpen ? 'text-white' : 'text-gray-500'}`}
                  />
                </div>
              </button>
            </div>

            {/* Customers & Logins Primary Button with Dropdown Indicator */}
            <div className="pt-2 border-t border-gray-100">
              <button
                onClick={() => {
                  const willOpen = !isCustomersDropdownOpen;
                  setIsCustomersDropdownOpen(willOpen);
                  if (willOpen) {
                    setActiveTab('users');
                    setIsCategoriesDropdownOpen(false);
                    setIsEssentialsDropdownOpen(false);
                    setIsOffersDropdownOpen(false);
                    setIsRentalsDropdownOpen(false);
                    setIsWhatsAppDropdownOpen(false);
                  }
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-full transition-all cursor-pointer shadow-sm select-none ${
                  isCustomersDropdownOpen
                    ? 'bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white shadow-md'
                    : 'bg-white border border-gray-200 text-gray-800 hover:bg-blue-50'
                }`}
              >
                <div className="flex items-center gap-2.5 font-black text-sm">
                  <Users className={`w-4 h-4 ${isCustomersDropdownOpen ? 'text-white' : 'text-blue-600'}`} />
                  <span>Customer Logins</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                    isCustomersDropdownOpen
                      ? 'bg-white/20 text-white'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {usersList?.length ?? 0}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isCustomersDropdownOpen ? 'rotate-180' : 'rotate-0'
                    } ${isCustomersDropdownOpen ? 'text-white' : 'text-gray-500'}`}
                  />
                </div>
              </button>
            </div>

            {/* WhatsApp Orders Number Button with Dropdown Indicator */}
            <div className="pt-2 border-t border-gray-100">
              <button
                onClick={() => {
                  const willOpen = !isWhatsAppDropdownOpen;
                  setIsWhatsAppDropdownOpen(willOpen);
                  if (willOpen) {
                    setActiveTab('whatsapp');
                    setIsCategoriesDropdownOpen(false);
                    setIsEssentialsDropdownOpen(false);
                    setIsOffersDropdownOpen(false);
                    setIsRentalsDropdownOpen(false);
                    setIsCustomersDropdownOpen(false);
                  }
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-full transition-all cursor-pointer shadow-sm select-none ${
                  isWhatsAppDropdownOpen
                    ? 'bg-gradient-to-r from-[#25D366] via-emerald-600 to-[#1EBE5D] text-white shadow-md'
                    : 'bg-white border border-gray-200 text-gray-800 hover:bg-emerald-50'
                }`}
              >
                <div className="flex items-center gap-2.5 font-black text-sm">
                  <MessageSquare className={`w-4 h-4 ${isWhatsAppDropdownOpen ? 'text-white' : 'text-[#25D366]'}`} />
                  <span>WhatsApp Numbers</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                    isWhatsAppDropdownOpen
                      ? 'bg-white/20 text-white'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    Orders
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isWhatsAppDropdownOpen ? 'rotate-180' : 'rotate-0'
                    } ${isWhatsAppDropdownOpen ? 'text-white' : 'text-gray-500'}`}
                  />
                </div>
              </button>
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
          {(catPhotoUploadStatus || essentialPhotoStatus) && (
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between gap-2 shadow-sm animate-in fade-in duration-200">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{catPhotoUploadStatus || essentialPhotoStatus}</span>
              </div>
            </div>
          )}

          {isCategoriesDropdownOpen && activeTab === 'categories' && (
            <>
              {/* View 1: When "All Categories" is Selected */}
              {selectedCategorySlug === 'all' && (
                <div className="space-y-4">
                  {categoriesList === undefined ? (
                    /* Loading Skeleton: Exact 10 Cards with zero layout shift, eliminating flash on reload */
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 animate-in fade-in duration-150">
                      {Array.from({ length: 10 }).map((_, idx) => (
                        <div
                          key={idx}
                          className="rounded-2xl bg-white border border-gray-100 p-2.5 flex flex-col items-center justify-between h-[185px] sm:h-[195px] shadow-2xs animate-pulse"
                        >
                          <div className="w-full flex items-center justify-between">
                            <div className="h-4 w-12 bg-gray-100 rounded-full" />
                            <div className="h-4 w-4 bg-gray-100 rounded-full" />
                          </div>
                          <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center">
                            <div className="w-14 h-14 rounded-full bg-gray-200/50" />
                          </div>
                          <div className="w-full flex flex-col items-center gap-1.5 pb-1">
                            <div className="h-3.5 w-24 bg-gray-200/70 rounded-full" />
                            <div className="h-2.5 w-16 bg-gray-100 rounded-full" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : categoriesList.length === 0 ? (
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
                    if (!cat) {
                      if (categoriesList === undefined) {
                        return <div className="h-28 rounded-3xl bg-white border border-gray-100 shadow-2xs animate-pulse" />;
                      }
                      return null;
                    }
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
                              setNewProdImage('');
                              setNewProdIsOffer(false);
                              setProdUploadProgress(null);
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

                    {products === undefined ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="h-32 rounded-3xl bg-white border border-gray-100 shadow-2xs animate-pulse" />
                        ))}
                      </div>
                    ) : products.length === 0 ? (
                      <div className="p-12 text-center bg-white rounded-3xl border border-gray-200 text-xs text-gray-400 space-y-2">
                        <Package className="w-8 h-8 mx-auto text-gray-300" />
                        <div>No products found in this category.</div>
                        <button
                          onClick={() => {
                            setNewProdCategory(selectedCategorySlug);
                            setNewProdImage('');
                            setNewProdIsOffer(false);
                            setProdUploadProgress(null);
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

                            <div className="mt-4 pt-3 border-t border-gray-100 space-y-2.5">
                              {/* Row 1: Stock Status & Delete */}
                              <div className="flex items-center justify-between">
                                <button
                                  type="button"
                                  onClick={() =>
                                    toggleProductStock({ id: prod._id, inStock: !(prod.inStock !== false) })
                                  }
                                  className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                                    prod.inStock !== false
                                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                      : 'bg-red-100 text-red-800 hover:bg-red-200'
                                  }`}
                                >
                                  {prod.inStock !== false ? '✓ In Stock' : '✕ Out of Stock'}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    if (confirm(`Delete ${prod.name}?`)) {
                                      deleteProduct({ id: prod._id });
                                    }
                                  }}
                                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                  title="Delete product"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>

                              {/* Row 2: Offer & Essential Action Pills */}
                              <div className="grid grid-cols-2 gap-2 pt-0.5">
                                {/* Toggle Add to Offers */}
                                {prod.badgeText === 'Special Offer' || (prod.isPopular && prod.displayOrder === undefined) ? (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      updateProductMutation({
                                        id: prod._id,
                                        isPopular: false,
                                        badgeText: prod.badgeText === 'Special Offer' ? undefined : prod.badgeText,
                                      });
                                    }}
                                    className="w-full flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl text-[11px] font-bold bg-orange-100 text-orange-900 border border-orange-300 hover:bg-orange-200 transition-colors cursor-pointer"
                                    title="Product is active in Offers page (click to remove)"
                                  >
                                    <span>🔥 In Offer</span>
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      updateProductMutation({
                                        id: prod._id,
                                        isPopular: true,
                                        badgeText: 'Special Offer',
                                        badgeIcon: '⚡',
                                        badgeColor: 'bg-amber-500 text-white',
                                      });
                                    }}
                                    className="w-full flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl text-[11px] font-bold bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200 transition-colors cursor-pointer"
                                    title="Add product to Offers page"
                                  >
                                    <span>+ Add to Offer</span>
                                  </button>
                                )}

                                {/* Toggle Top Essential */}
                                {prod.isTopEssential ? (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (confirm(`Remove "${prod.name}" from Top Essentials?`)) {
                                        updateProductMutation({ id: prod._id, isTopEssential: false });
                                      }
                                    }}
                                    className="w-full flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-colors cursor-pointer"
                                    title="Featured in Top Essentials (click to remove)"
                                  >
                                    <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" />
                                    <span className="truncate">Top Essential</span>
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      updateProductMutation({ id: prod._id, isTopEssential: true });
                                    }}
                                    className="w-full flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl text-[11px] font-bold bg-emerald-50 text-[#087D2C] hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer"
                                    title="Add to Top Essentials section on Home Page"
                                  >
                                    <Sparkles className="w-3 h-3 text-emerald-600" />
                                    <span className="truncate">+ Essential</span>
                                  </button>
                                )}
                              </div>
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

          {/* ================= TAB: TOP ESSENTIALS ================= */}
          {isEssentialsDropdownOpen && activeTab === 'essentials' && (
            <div className="space-y-4">
              {/* Header Banner */}
              <div className="p-5 rounded-3xl bg-white border border-gray-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
                    <Sparkles className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-black text-gray-900">Top Essentials</h2>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#087D2C] text-xs font-black border border-emerald-200">
                        {topEssentials?.length ?? 12} Products
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Handpicked store essentials shown prominently on the home page. Photos stored in Cloudflare R2.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <button
                    onClick={handleSyncTopEssentials}
                    className="px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                    title="Reset/sync the 12 default essentials with correct categories & R2 images"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Sync (12)</span>
                  </button>
                </div>
              </div>

              {/* Top Essentials Grid */}
              {topEssentials === undefined ? (
                /* Loading Skeleton: 12 cards matching exact layout */
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-in fade-in duration-150">
                  {Array.from({ length: 12 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl bg-white border border-gray-100 p-4 shadow-2xs h-72 animate-pulse flex flex-col justify-between"
                    >
                      <div className="flex justify-between items-center">
                        <div className="h-4 w-20 bg-gray-100 rounded-full" />
                        <div className="h-4 w-4 bg-gray-100 rounded-full" />
                      </div>
                      <div className="w-24 h-24 mx-auto bg-gray-50 rounded-2xl" />
                      <div className="space-y-2">
                        <div className="h-4 w-full bg-gray-100 rounded" />
                        <div className="h-3 w-1/2 bg-gray-100 rounded" />
                        <div className="h-4 w-1/3 bg-gray-200 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : topEssentials.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-3xl border border-gray-200 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-black text-gray-900">No Top Essentials Found</h3>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto">
                    Click below to sync the 12 handpicked essentials mapped to their respective categories.
                  </p>
                  <button
                    onClick={handleSyncTopEssentials}
                    className="px-4 py-2 rounded-xl bg-[#087D2C] hover:bg-[#066323] text-white text-xs font-bold cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Sync 12 Top Essentials</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {topEssentials.map((item) => (
                    <div
                      key={item._id}
                      className="group relative rounded-2xl bg-white border border-gray-200/90 hover:border-gray-300 shadow-2xs hover:shadow-lg transition-all duration-200 p-3.5 flex flex-col justify-between"
                    >
                      {/* Top Row: Category Tag, Badge & 3-Dots Menu */}
                      <div className="flex items-center justify-between gap-1.5 mb-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getCategoryBadgeStyle(item.category)}`}>
                          {getCategoryName(item.category)}
                        </span>

                        <div className="flex items-center gap-1.5">
                          {item.badgeText && (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${item.badgeColor || 'bg-[#FED7AA] text-[#C2410C]'}`}>
                              {item.badgeIcon} {item.badgeText}
                            </span>
                          )}

                          {/* 3-Dots Menu */}
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenuEssentialId(activeMenuEssentialId === item._id ? null : item._id);
                              }}
                              className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                              title="Essential Actions"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {/* Dropdown Options */}
                            {activeMenuEssentialId === item._id && (
                              <div
                                onClick={(e) => e.stopPropagation()}
                                className="absolute right-0 top-full mt-1.5 w-48 bg-white rounded-2xl border border-gray-200 shadow-xl py-1.5 z-40 text-xs font-bold animate-in fade-in zoom-in-95 duration-100"
                              >
                                <button
                                  onClick={() => {
                                    openEditEssentialModal(item);
                                    setActiveMenuEssentialId(null);
                                  }}
                                  className="w-full px-3 py-2 text-left text-gray-700 hover:bg-emerald-50 hover:text-[#087D2C] flex items-center gap-2 cursor-pointer"
                                >
                                  <Pencil className="w-3.5 h-3.5 text-[#087D2C]" />
                                  <span>1. Edit Essential</span>
                                </button>
                                <button
                                  onClick={() => {
                                    setTargetPhotoEssentialId(item._id);
                                    setActiveMenuEssentialId(null);
                                    setTimeout(() => essentialPhotoInputRef.current?.click(), 50);
                                  }}
                                  className="w-full px-3 py-2 text-left text-gray-700 hover:bg-emerald-50 hover:text-[#087D2C] flex items-center gap-2 cursor-pointer"
                                >
                                  <Camera className="w-3.5 h-3.5 text-blue-600" />
                                  <span>2. Change Photo (R2)</span>
                                </button>
                                {item.image && (
                                  <button
                                    onClick={() => handleRemovePhotoFromEssential(item)}
                                    className="w-full px-3 py-2 text-left text-amber-700 hover:bg-amber-50 flex items-center gap-2 cursor-pointer"
                                  >
                                    <ImageOff className="w-3.5 h-3.5 text-amber-600" />
                                    <span>3. Remove Photo</span>
                                  </button>
                                )}
                                <div className="border-t border-gray-100 my-1" />
                                <button
                                  onClick={() => handleDeleteEssential(item)}
                                  className="w-full px-3 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-red-600" />
                                  <span>4. Delete Essential</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Image Area with R2 stream */}
                      <div className="w-full h-32 flex items-center justify-center p-2 my-1 bg-gray-50/50 rounded-xl border border-gray-100/60">
                        {item.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.image}
                            alt={item.name}
                            className="max-h-[115px] max-w-full object-contain drop-shadow-2xs"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-gray-400">
                            <ImageIcon className="w-8 h-8 stroke-1" />
                            <span className="text-[10px] mt-1 font-bold">No Image</span>
                          </div>
                        )}
                      </div>

                      {/* Content Details */}
                      <div className="pt-2">
                        <h4 className="text-xs font-black text-gray-900 leading-snug line-clamp-2 min-h-[32px]">
                          {item.name}
                        </h4>
                        <div className="text-[11px] text-gray-400 font-medium mt-0.5">
                          {item.weight}
                        </div>

                        <div className="flex items-center justify-between mt-2 pt-1 border-t border-gray-100">
                          <div className="flex items-baseline gap-1">
                            <span className="text-sm font-black text-gray-900">
                              ₹{item.price}
                            </span>
                            {item.originalPrice && (
                              <span className="text-[11px] text-gray-400 line-through">
                                ₹{item.originalPrice}
                              </span>
                            )}
                          </div>
                          {item.discount && (
                            <span className="text-[10px] font-bold text-[#087D2C] bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-100">
                              {item.discount}
                            </span>
                          )}
                        </div>

                        {/* Stock & Quick Action Buttons */}
                        <div className="mt-3 flex items-center justify-between gap-1.5">
                          <button
                            onClick={() => toggleProductStock({ id: item._id, inStock: !(item.inStock !== false) })}
                            className={`flex-1 py-1 px-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer text-center ${
                              item.inStock !== false
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-red-100 text-red-800 hover:bg-red-200'
                            }`}
                          >
                            {item.inStock !== false ? '✓ In Stock' : '✕ Out of Stock'}
                          </button>
                          <button
                            onClick={() => openEditEssentialModal(item)}
                            className="p-1.5 text-gray-400 hover:text-[#087D2C] hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                            title="1. Edit Essential"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteEssential(item)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="4. Delete Essential"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ================= TAB: OFFERS & FESTIVAL BANNER MANAGER (BELOW TOP ESSENTIALS) ================= */}
          {isOffersDropdownOpen && activeTab === 'offers' && (
            <div className="space-y-6">
              {/* Header Card */}
              <div className="p-5 rounded-3xl bg-white border border-gray-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#3C0764] to-[#7B1FA2] text-amber-300 flex items-center justify-center shrink-0 shadow-sm">
                    <Flame className="w-6 h-6 fill-amber-300" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-gray-900 flex items-center gap-2">
                      <span>Festival Offers &amp; Banner Manager</span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-purple-100 text-[#3C0764]">
                        {offerProducts.length} Items
                      </span>
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Edit the Diwali / Festival banner and manage active offer products, pricing, and stock.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href="/offers"
                    target="_blank"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-50 text-[#3C0764] hover:bg-purple-100 text-xs font-bold transition-all border border-purple-200 shadow-2xs"
                  >
                    <span>View Live Offers Page</span>
                    <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                  </Link>
                </div>
              </div>

              {/* 1. Edit Offer Banner Section */}
              <div className="p-6 rounded-3xl bg-white border border-gray-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Pencil className="w-4 h-4 text-[#3C0764]" />
                    <h4 className="text-sm font-black text-gray-900">Edit Festival Hero Banner</h4>
                  </div>
                  <span className="text-[11px] text-gray-400">Updates /offers hero section live</span>
                </div>

                <form onSubmit={handleSaveOfferBanner} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Banner Badge Text
                      </label>
                      <input
                        type="text"
                        value={offerBadgeText}
                        onChange={(e) => setOfferBadgeText(e.target.value)}
                        placeholder="e.g. Diwali Mahotsav Dhamaka Deals"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#3C0764]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Headline Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={offerTitle}
                        onChange={(e) => setOfferTitle(e.target.value)}
                        placeholder="e.g. Shop Diwali Deals & Save Up to 30% OFF"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#3C0764]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Banner Subtitle / Description
                    </label>
                    <textarea
                      rows={2}
                      value={offerSubtitle}
                      onChange={(e) => setOfferSubtitle(e.target.value)}
                      placeholder="e.g. Handpicked festive groceries, pure pooja ghee..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#3C0764] resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Banner Packshot Image
                    </label>
                    <p className="text-[11px] text-gray-500 mb-2">
                      Upload an image file or copy and paste directly from clipboard.
                    </p>

                    {offerBannerImg ? (
                      /* Preview with Delete and Change */
                      <div className="flex items-center gap-4 p-3 bg-gray-50 border border-gray-200 rounded-2xl">
                        <div className="w-24 h-24 rounded-xl bg-white border border-gray-200 p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={offerBannerImg}
                            alt="Banner Preview"
                            className="max-h-full max-w-full object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/images/diwali-offer-products.png';
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0 space-y-1.5">
                          <div className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Banner Image Active</span>
                          </div>
                          <div className="text-[10px] text-gray-400 font-mono truncate max-w-sm">
                            {offerBannerImg}
                          </div>
                          <div className="flex flex-wrap items-center gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => offerBannerInputRef.current?.click()}
                              disabled={isUploadingOfferBanner}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-gray-100 text-gray-700 text-xs font-bold border border-gray-200 shadow-2xs transition-all cursor-pointer"
                            >
                              <Upload className="w-3.5 h-3.5" />
                              <span>Change Image</span>
                            </button>
                            <button
                              type="button"
                              onClick={handleOfferBannerPasteFromClipboard}
                              disabled={isUploadingOfferBanner}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-gray-100 text-[#3C0764] text-xs font-bold border border-gray-200 shadow-2xs transition-all cursor-pointer"
                            >
                              <ClipboardPaste className="w-3.5 h-3.5" />
                              <span>Paste New</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setOfferBannerImg('');
                                setOfferBannerProgress(null);
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 transition-all cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete Image</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* 2 Clean Options: Browse or Copy & Paste */
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => offerBannerInputRef.current?.click()}
                          disabled={isUploadingOfferBanner}
                          className="border-2 border-dashed border-gray-300 hover:border-[#3C0764] hover:bg-purple-50/20 rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all"
                        >
                          <Upload className="w-6 h-6 text-gray-400 mb-1.5" />
                          <span className="text-xs font-bold text-gray-800">1. Click to browse</span>
                          <span className="text-[10px] text-gray-400">Upload banner image file</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleOfferBannerPasteFromClipboard}
                          disabled={isUploadingOfferBanner}
                          className="border-2 border-dashed border-gray-300 hover:border-[#3C0764] hover:bg-purple-50/20 rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all"
                        >
                          <ClipboardPaste className="w-6 h-6 text-[#3C0764] mb-1.5" />
                          <span className="text-xs font-bold text-gray-800">2. Copy and paste</span>
                          <span className="text-[10px] text-gray-400">Click to paste or press Ctrl+V</span>
                        </button>
                      </div>
                    )}

                    <input
                      type="file"
                      ref={offerBannerInputRef}
                      accept="image/*"
                      onChange={handleUploadOfferBanner}
                      className="hidden"
                    />

                    {isUploadingOfferBanner && (
                      <div className="flex items-center justify-center gap-1.5 pt-2 text-xs font-bold text-[#3C0764]">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>{offerBannerProgress || 'Uploading banner to cloud...'}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <span className="text-xs text-emerald-600 font-bold">
                      {offerBannerSaved && '✓ Banner changes saved successfully!'}
                    </span>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#3C0764] hover:bg-[#2A0548] text-white text-xs font-bold transition-all shadow-sm hover:shadow cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>Save Banner Changes</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* 2. Live Offer Products Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <h4 className="text-sm font-black text-gray-900">
                      Offer Products ({offerProducts.length})
                    </h4>
                  </div>
                  <span className="text-xs text-gray-400">
                    Edit pricing, manage stock or remove from offers
                  </span>
                </div>

                {offerProducts.length === 0 ? (
                  <div className="p-12 text-center bg-white rounded-3xl border border-gray-200 text-xs text-gray-400 space-y-2">
                    <Package className="w-8 h-8 mx-auto text-gray-300" />
                    <div className="font-bold text-gray-700">No Offer Products Found</div>
                    <p className="max-w-md mx-auto text-gray-500">
                      Go to the Categories tab and click &quot;+ Add to Offer&quot; on any product to feature it here and on the festival deals page.
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveTab('categories')}
                      className="mt-3 px-4 py-2 rounded-xl bg-[#087D2C] hover:bg-[#066323] text-white font-bold text-xs cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Browse Products in Categories</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {offerProducts.map((prod) => (
                      <div
                        key={prod._id}
                        className="p-4 rounded-3xl bg-white border border-gray-200 shadow-2xs flex flex-col justify-between hover:shadow-md transition-all"
                      >
                        <div>
                          {/* Top Row: Badge & Category */}
                          <div className="flex items-center justify-between mb-2">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-200">
                              🔥 Special Offer
                            </span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                              {prod.category}
                            </span>
                          </div>

                          {/* Image & Info */}
                          <div className="flex gap-3 items-center">
                            <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 p-2 flex items-center justify-center shrink-0">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={prod.image}
                                alt={prod.name}
                                className="max-h-full max-w-full object-contain"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = '/images/prod-rice-5kg.png';
                                }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className="text-xs font-black text-gray-900 truncate">
                                {prod.name}
                              </h5>
                              <p className="text-[11px] text-gray-500 mt-0.5">{prod.weight}</p>
                              <div className="flex items-baseline gap-1.5 mt-1.5 flex-wrap">
                                <span className="text-sm font-black text-gray-900">
                                  ₹{prod.price}
                                </span>
                                {prod.originalPrice && (
                                  <span className="text-[11px] text-gray-400 line-through">
                                    ₹{prod.originalPrice}
                                  </span>
                                )}
                                {prod.discount && (
                                  <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-1 rounded">
                                    {prod.discount}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Actions: Edit Price, Stock, Remove, Delete */}
                        <div className="mt-4 pt-3 border-t border-gray-100 space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <button
                              type="button"
                              onClick={() => toggleProductStock({ id: prod._id, inStock: !(prod.inStock !== false) })}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                                prod.inStock !== false
                                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                  : 'bg-red-100 text-red-800 hover:bg-red-200'
                              }`}
                            >
                              {prod.inStock !== false ? '✓ In Stock' : '✕ Out of Stock'}
                            </button>

                            <button
                              type="button"
                              onClick={() => openPriceModal(prod)}
                              className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#3C0764] text-xs font-bold transition-all border border-purple-200 cursor-pointer"
                            >
                              <Pencil className="w-3 h-3" />
                              <span>Edit Price</span>
                            </button>
                          </div>

                          <div className="flex items-center justify-between gap-2 pt-1 border-t border-gray-50">
                            <button
                              type="button"
                              onClick={() => handleRemoveFromOffers(prod)}
                              className="text-[11px] font-bold text-orange-700 hover:text-orange-900 cursor-pointer"
                              title="Remove from Offers page"
                            >
                              ✕ Remove from Offers
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Permanently delete "${prod.name}"?`)) {
                                  deleteProduct({ id: prod._id });
                                }
                              }}
                              className="p-1 text-gray-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                              title="Delete Product Permanently"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================= TAB: CAR RENTAL ================= */}
          {isRentalsDropdownOpen && activeTab === 'rentals' && (
            <AdminRentalsSection
              inquiries={rentals || []}
              onUpdateInquiryStatus={async (id, status) => {
                try {
                  await updateRentalStatus({ id, status });
                } catch (e) {
                  console.error(e);
                }
              }}
            />
          )}

          {/* ================= TAB: CUSTOMER & LOGINS MANAGEMENT ================= */}
          {isCustomersDropdownOpen && activeTab === 'users' && (
            <AdminCustomersSection orders={orders || []} />
          )}

          {/* ================= TAB: WHATSAPP ORDER NUMBERS ================= */}
          {isWhatsAppDropdownOpen && activeTab === 'whatsapp' && (
            <AdminWhatsAppSection />
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

      {/* Add New Category Modal with Cloudflare R2 Upload & Copy-Paste */}
      {isAddCategoryOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
          onPaste={handleCategoryModalPaste}
        >
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-black text-gray-900">Add New Category</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[11px] text-gray-500 font-medium">
                    Upload image or copy-paste
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
                  id="cat-name-input"
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
                  id="cat-desc-input"
                  rows={2}
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  placeholder="Short description for customer category banners..."
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#087D2C] text-gray-900 resize-none"
                />
              </div>

              {/* Category Banner Image: 2 Options */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700">
                  Category Banner Image
                </label>

                {newCatImage ? (
                  /* Preview of Uploaded Image */
                  <div className="relative rounded-2xl overflow-hidden border border-emerald-300 bg-emerald-50/50 p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-white shrink-0 border border-emerald-200 shadow-sm">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={newCatImage}
                          alt="Category Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                          <Check className="w-4 h-4 text-emerald-600" />
                          <span>Image Uploaded to Cloud</span>
                        </div>
                        <div className="text-[11px] text-gray-500 font-mono truncate mt-0.5">
                          {newCatImage}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setNewCatImage('');
                          setUploadProgress(null);
                        }}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl cursor-pointer transition-colors"
                        title="Remove image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  /* 2 Options */
                  <div className="grid grid-cols-2 gap-3">
                    {/* Option 1: Click to Browse */}
                    <label className="border-2 border-dashed border-gray-300 hover:border-[#087D2C] hover:bg-emerald-50/20 rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={isUploadingImage}
                        className="hidden"
                      />
                      <Upload className="w-6 h-6 text-gray-400 mb-1.5" />
                      <span className="text-xs font-bold text-gray-800">1. Click to browse</span>
                      <span className="text-[10px] text-gray-400 mt-0.5">Choose image file</span>
                    </label>

                    {/* Option 2: Copy and Paste */}
                    <button
                      type="button"
                      onClick={handlePasteFromClipboard}
                      disabled={isUploadingImage}
                      className="border-2 border-dashed border-gray-300 hover:border-[#087D2C] hover:bg-emerald-50/20 rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all"
                    >
                      <ClipboardPaste className="w-6 h-6 text-[#087D2C] mb-1.5" />
                      <span className="text-xs font-bold text-gray-800">2. Copy and paste</span>
                      <span className="text-[10px] text-gray-400 mt-0.5">Paste or press Ctrl+V</span>
                    </button>
                  </div>
                )}

                {isUploadingImage && (
                  <div className="flex items-center justify-center gap-2 py-2 text-xs font-bold text-[#087D2C]">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{uploadProgress || 'Uploading image to cloud...'}</span>
                  </div>
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
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
          onPaste={handleProductModalPaste}
        >
          <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-6 space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-gray-900">Add New Product</h3>
                <p className="text-[11px] text-gray-500 font-medium">Upload or copy-paste image directly</p>
              </div>
              <button
                onClick={() => {
                  setIsAddProductOpen(false);
                  setNewProdImage('');
                  setNewProdIsOffer(false);
                  setProdUploadProgress(null);
                }}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Product Name *</label>
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
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#137A2C] bg-white"
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
                  <label className="block text-xs font-bold text-gray-700 mb-1">Weight / Unit *</label>
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
                  <label className="block text-xs font-bold text-gray-700 mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
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
                    min="1"
                    value={newProdOriginalPrice}
                    onChange={(e) => setNewProdOriginalPrice(e.target.value)}
                    placeholder="120"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#137A2C]"
                  />
                </div>
              </div>

              {/* Product Image: 2 Options & Preview */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700">
                  Product Image
                </label>

                {newProdImage ? (
                  /* Preview of Uploaded Product Image */
                  <div className="relative rounded-2xl overflow-hidden border border-emerald-300 bg-emerald-50/50 p-2.5">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-white shrink-0 border border-emerald-200 shadow-xs flex items-center justify-center p-1">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={newProdImage}
                          alt="Product Preview"
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Image Uploaded to Cloud</span>
                        </div>
                        <div className="text-[10px] text-gray-500 font-mono truncate mt-0.5">
                          {newProdImage}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setNewProdImage('');
                          setProdUploadProgress(null);
                        }}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                        title="Remove image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  /* 2 Options */
                  <div className="grid grid-cols-2 gap-2.5">
                    {/* Option 1: Click to Browse */}
                    <label className="border-2 border-dashed border-gray-300 hover:border-[#137A2C] hover:bg-emerald-50/20 rounded-2xl p-3 flex flex-col items-center justify-center text-center cursor-pointer transition-all">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProductImageUpload}
                        disabled={isUploadingProdImage}
                        className="hidden"
                      />
                      <Upload className="w-5 h-5 text-gray-400 mb-1" />
                      <span className="text-xs font-bold text-gray-800">1. Click to browse</span>
                      <span className="text-[10px] text-gray-400">Choose file</span>
                    </label>

                    {/* Option 2: Copy and Paste */}
                    <button
                      type="button"
                      onClick={handleProductPasteFromClipboard}
                      disabled={isUploadingProdImage}
                      className="border-2 border-dashed border-gray-300 hover:border-[#137A2C] hover:bg-emerald-50/20 rounded-2xl p-3 flex flex-col items-center justify-center text-center cursor-pointer transition-all"
                    >
                      <ClipboardPaste className="w-5 h-5 text-[#137A2C] mb-1" />
                      <span className="text-xs font-bold text-gray-800">2. Copy and paste</span>
                      <span className="text-[10px] text-gray-400">Paste or Ctrl+V</span>
                    </button>
                  </div>
                )}

                {isUploadingProdImage && (
                  <div className="flex items-center justify-center gap-1.5 py-1 text-xs font-bold text-[#137A2C]">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>{prodUploadProgress || 'Uploading product image to cloud...'}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="inStockCheck"
                  checked={newProdInStock}
                  onChange={(e) => setNewProdInStock(e.target.checked)}
                  className="rounded text-[#137A2C] focus:ring-0 cursor-pointer"
                />
                <label htmlFor="inStockCheck" className="text-xs font-bold text-gray-700 cursor-pointer">
                  In Stock &amp; Available for Order
                </label>
              </div>

              {/* Option: Add Product to Offers */}
              <div className="p-3 rounded-2xl bg-orange-50/90 border border-orange-200 flex items-center justify-between">
                <label htmlFor="newProdIsOfferCheck" className="text-xs font-bold text-gray-800 cursor-pointer flex items-center gap-2">
                  <span className="text-base">🔥</span>
                  <div>
                    <div>Add Product to Offers</div>
                    <div className="text-[10px] text-gray-500 font-normal">Featured in Diwali &amp; Special Festival Offers</div>
                  </div>
                </label>
                <input
                  type="checkbox"
                  id="newProdIsOfferCheck"
                  checked={newProdIsOffer}
                  onChange={(e) => setNewProdIsOffer(e.target.checked)}
                  className="w-4 h-4 rounded text-orange-600 focus:ring-0 cursor-pointer"
                />
              </div>

              {/* Add to Top Essentials Checkbox & Options */}
              <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-2.5">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="newProdIsTopEssentialCheck"
                    checked={newProdIsTopEssential}
                    onChange={(e) => setNewProdIsTopEssential(e.target.checked)}
                    className="w-4 h-4 rounded text-[#087D2C] focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="newProdIsTopEssentialCheck" className="text-xs font-bold text-gray-800 cursor-pointer flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>Add to Top Essentials (Home Page)</span>
                  </label>
                </div>

                {newProdIsTopEssential && (
                  <div className="grid grid-cols-2 gap-2 pt-1 animate-in fade-in duration-150">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">Badge (Optional)</label>
                      <select
                        value={newProdBadgeText}
                        onChange={(e) => setNewProdBadgeText(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#087D2C] bg-white cursor-pointer text-gray-800 font-medium"
                      >
                        <option value="">No Badge</option>
                        <option value="Bestseller">👑 Bestseller</option>
                        <option value="Trending">🔥 Trending</option>
                        <option value="Pure & Fresh">🌿 Pure & Fresh</option>
                        <option value="Special Offer">⚡ Special Offer</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">Discount Text</label>
                      <input
                        type="text"
                        value={newProdDiscount}
                        onChange={(e) => setNewProdDiscount(e.target.value)}
                        placeholder="e.g. Save 10%"
                        className="w-full px-2.5 py-1.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#087D2C] bg-white text-gray-800"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddProductOpen(false);
                    setNewProdImage('');
                    setNewProdIsOffer(false);
                    setProdUploadProgress(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploadingProdImage}
                  className="flex-1 py-2.5 rounded-xl bg-[#137A2C] hover:bg-[#0E5C21] text-white text-xs font-bold shadow-md cursor-pointer disabled:opacity-50"
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

      {/* ================= MODAL: ADD TOP ESSENTIAL ================= */}
      {isAddEssentialOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-gray-100 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Add New Top Essential</span>
                </h3>
                <p className="text-[11px] text-gray-400">
                  Adds to Top Essentials section with live Cloudflare R2 photo storage.
                </p>
              </div>
              <button
                onClick={() => setIsAddEssentialOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTopEssential} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={essName}
                  onChange={(e) => setEssName(e.target.value)}
                  placeholder="e.g. Surf Excel Detergent Powder"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#087D2C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Store Category *
                  </label>
                  <select
                    value={essCategory}
                    onChange={(e) => setEssCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#087D2C] bg-white cursor-pointer"
                  >
                    {categoriesList && categoriesList.length > 0 ? (
                      categoriesList.map((cat) => (
                        <option key={cat._id} value={cat.slug}>
                          {cat.name}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="cleaning">Cleaning Essentials</option>
                        <option value="puja-items">Puja Items</option>
                        <option value="groceries">Groceries</option>
                        <option value="paper">Paper &amp; Disposables</option>
                        <option value="home-kitchen">Home &amp; Kitchen</option>
                        <option value="personal-care">Personal Care</option>
                        <option value="snacks">Snacks &amp; Beverages</option>
                        <option value="fruits-veg">Fruits &amp; Vegetables</option>
                        <option value="baby-care">Baby Care</option>
                        <option value="more">More</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Pack / Weight *
                  </label>
                  <input
                    type="text"
                    required
                    value={essWeight}
                    onChange={(e) => setEssWeight(e.target.value)}
                    placeholder="e.g. 1 kg, 750 ml, Pack of 4"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#087D2C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={essPrice}
                    onChange={(e) => setEssPrice(e.target.value)}
                    placeholder="349"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#087D2C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    MRP / Orig Price (₹)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={essOriginalPrice}
                    onChange={(e) => setEssOriginalPrice(e.target.value)}
                    placeholder="399"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#087D2C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Discount Text
                  </label>
                  <input
                    type="text"
                    value={essDiscount}
                    onChange={(e) => setEssDiscount(e.target.value)}
                    placeholder="Save 13%"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#087D2C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Badge Type (Optional)
                  </label>
                  <select
                    value={essBadgeText}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEssBadgeText(val);
                      if (val === 'Bestseller') {
                        setEssBadgeIcon('👑');
                        setEssBadgeColor('bg-[#48BB78] text-white');
                      } else if (val === 'Trending') {
                        setEssBadgeIcon('🔥');
                        setEssBadgeColor('bg-[#FED7AA] text-[#C2410C]');
                      } else if (val === 'Daily Staple') {
                        setEssBadgeIcon('🍚');
                        setEssBadgeColor('bg-emerald-600 text-white');
                      } else {
                        setEssBadgeIcon('');
                        setEssBadgeColor('');
                      }
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#087D2C] bg-white cursor-pointer"
                  >
                    <option value="">No Badge</option>
                    <option value="Bestseller">👑 Bestseller</option>
                    <option value="Trending">🔥 Trending</option>
                    <option value="Daily Staple">🍚 Daily Staple</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Upload Photo (Cloudflare R2)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setIsUploadingNewEssImage(true);
                      try {
                        const formData = new FormData();
                        formData.append('file', file);
                        formData.append('folder', 'products');
                        const res = await fetch('/api/upload', { method: 'POST', body: formData });
                        const data = await res.json();
                        if (data.url) setEssImage(data.url);
                      } catch (err) {
                        alert('Failed to upload image to R2');
                      } finally {
                        setIsUploadingNewEssImage(false);
                      }
                    }}
                    className="w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-[#087D2C] hover:file:bg-emerald-100 cursor-pointer"
                  />
                  {isUploadingNewEssImage && <span className="text-[10px] text-[#087D2C] font-bold">Uploading to R2...</span>}
                  {essImage && <span className="text-[10px] text-emerald-600 font-bold block truncate">✓ {essImage}</span>}
                </div>
              </div>

              <div className="pt-2 flex gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddEssentialOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploadingNewEssImage}
                  className="flex-1 py-2.5 rounded-xl bg-[#087D2C] hover:bg-[#066323] text-white text-xs font-bold shadow-sm hover:shadow transition-all cursor-pointer"
                >
                  Create Essential
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT TOP ESSENTIAL ================= */}
      {editingEssential && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-gray-100 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                  <Pencil className="w-4 h-4 text-[#087D2C]" />
                  <span>Edit Top Essential</span>
                </h3>
                <p className="text-[11px] text-gray-400">
                  Update product information, category, pricing, and badges.
                </p>
              </div>
              <button
                onClick={() => setEditingEssential(null)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateTopEssential} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={essName}
                  onChange={(e) => setEssName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#087D2C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Store Category *
                  </label>
                  <select
                    value={essCategory}
                    onChange={(e) => setEssCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#087D2C] bg-white cursor-pointer"
                  >
                    {categoriesList && categoriesList.length > 0 ? (
                      categoriesList.map((cat) => (
                        <option key={cat._id} value={cat.slug}>
                          {cat.name}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="cleaning">Cleaning Essentials</option>
                        <option value="puja-items">Puja Items</option>
                        <option value="groceries">Groceries</option>
                        <option value="paper">Paper &amp; Disposables</option>
                        <option value="home-kitchen">Home &amp; Kitchen</option>
                        <option value="personal-care">Personal Care</option>
                        <option value="snacks">Snacks &amp; Beverages</option>
                        <option value="fruits-veg">Fruits &amp; Vegetables</option>
                        <option value="baby-care">Baby Care</option>
                        <option value="more">More</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Pack / Weight *
                  </label>
                  <input
                    type="text"
                    required
                    value={essWeight}
                    onChange={(e) => setEssWeight(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#087D2C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={essPrice}
                    onChange={(e) => setEssPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#087D2C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    MRP / Orig Price (₹)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={essOriginalPrice}
                    onChange={(e) => setEssOriginalPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#087D2C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Discount Text
                  </label>
                  <input
                    type="text"
                    value={essDiscount}
                    onChange={(e) => setEssDiscount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#087D2C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Badge Type
                </label>
                <select
                  value={essBadgeText}
                  onChange={(e) => {
                    const val = e.target.value;
                    setEssBadgeText(val);
                    if (val === 'Bestseller') {
                      setEssBadgeIcon('👑');
                      setEssBadgeColor('bg-[#48BB78] text-white');
                    } else if (val === 'Trending') {
                      setEssBadgeIcon('🔥');
                      setEssBadgeColor('bg-[#FED7AA] text-[#C2410C]');
                    } else if (val === 'Daily Staple') {
                      setEssBadgeIcon('🍚');
                      setEssBadgeColor('bg-emerald-600 text-white');
                    } else {
                      setEssBadgeIcon('');
                      setEssBadgeColor('');
                    }
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#087D2C] bg-white cursor-pointer"
                >
                  <option value="">No Badge</option>
                  <option value="Bestseller">👑 Bestseller</option>
                  <option value="Trending">🔥 Trending</option>
                  <option value="Daily Staple">🍚 Daily Staple</option>
                </select>
              </div>

              <div className="pt-2 flex gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingEssential(null)}
                  className="flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#087D2C] hover:bg-[#066323] text-white text-xs font-bold shadow-sm hover:shadow transition-all cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: QUICK EDIT PRICING (OFFERS) ================= */}
      {editingPriceProd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl border border-gray-100 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-black text-gray-900 flex items-center gap-1.5">
                  <Pencil className="w-4 h-4 text-[#3C0764]" />
                  <span>Edit Offer Pricing</span>
                </h3>
                <p className="text-xs text-gray-500 truncate max-w-[220px]">
                  {editingPriceProd.name}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingPriceProd(null)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePrice} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Selling Price (₹) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={editPriceVal}
                  onChange={(e) => setEditPriceVal(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#3C0764]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  MRP / Original Price (₹)
                </label>
                <input
                  type="number"
                  min="1"
                  value={editOrigPriceVal}
                  onChange={(e) => setEditOrigPriceVal(e.target.value)}
                  placeholder="Optional MRP"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#3C0764]"
                />
              </div>

              <div className="pt-2 flex gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingPriceProd(null)}
                  className="flex-1 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingPrice}
                  className="flex-1 py-2 rounded-xl bg-[#3C0764] hover:bg-[#2A0548] text-white text-xs font-bold transition-all shadow-sm hover:shadow cursor-pointer"
                >
                  {isSavingPrice ? 'Saving...' : 'Save Price'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Hidden file input for Top Essentials: Add / Change Photo via Cloudflare R2 */}
      <input
        type="file"
        ref={essentialPhotoInputRef}
        accept="image/*"
        onChange={handleUploadEssentialPhoto}
        className="hidden"
      />

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

