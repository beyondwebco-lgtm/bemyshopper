'use client';

import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Plus,
  Filter,
  ShieldCheck,
  ShieldAlert,
  KeyRound,
  Eye,
  EyeOff,
  Copy,
  Check,
  Trash2,
  Edit3,
  Lock,
  Unlock,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  LogIn,
  ArrowUpDown,
  Download,
  RefreshCw,
  X,
  AlertCircle,
  ShoppingBag,
  Laptop,
  CheckCircle2,
  UserPlus,
  Sparkles,
} from 'lucide-react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';

interface CustomerItem {
  id: Id<'users'>;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'user';
  address?: string;
  password?: string;
  isBlocked?: boolean;
  lastLoginAt?: number;
  loginCount?: number;
  notes?: string;
  createdAt: number;
  updatedAt?: number;
}

interface AdminCustomersSectionProps {
  orders?: any[];
}

export default function AdminCustomersSection({ orders = [] }: AdminCustomersSectionProps) {
  // Sub-tabs: 'customers' (Profiles & Credentials) | 'logins' (Login Audit History)
  const [activeSubTab, setActiveSubTab] = useState<'customers' | 'logins'>('customers');

  // Convex Queries & Mutations
  const rawUsers = useQuery(api.users.listUsers) as CustomerItem[] | undefined;
  const loginLogs = useQuery(api.users.listLoginHistory, { limit: 100 });

  const adminUpdateUser = useMutation(api.users.adminUpdateUser);
  const adminSetPassword = useMutation(api.users.adminSetCustomerPassword);
  const adminToggleBlock = useMutation(api.users.adminToggleBlock);
  const adminDeleteUser = useMutation(api.users.adminDeleteUser);
  const adminCreateUser = useMutation(api.users.adminCreateUser);

  // Filters & Sorting State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'blocked'>('all');
  const [roleFilter, setRoleFilter] = useState<'all' | 'user' | 'admin'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'logins' | 'last_active' | 'name'>('newest');

  // Password visibility & copy feedback
  const [revealedPasswords, setRevealedPasswords] = useState<Record<string, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addForm, setAddForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    role: 'user' as 'user' | 'admin',
    notes: '',
  });
  const [isSubmittingAdd, setIsSubmittingAdd] = useState(false);

  // Quick Add State (Fast & Immediate inline adding)
  const [quickName, setQuickName] = useState('');
  const [quickEmail, setQuickEmail] = useState('');
  const [quickPassword, setQuickPassword] = useState('');
  const [quickPhone, setQuickPhone] = useState('');
  const [isSubmittingQuickAdd, setIsSubmittingQuickAdd] = useState(false);

  const [editingCustomer, setEditingCustomer] = useState<CustomerItem | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    role: 'user' as 'user' | 'admin',
    isBlocked: false,
    notes: '',
  });
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

  // Change Password Modal
  const [passwordModalCustomer, setPasswordModalCustomer] = useState<CustomerItem | null>(null);
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);

  // Customer Detail Drawer Modal
  const [detailCustomer, setDetailCustomer] = useState<CustomerItem | null>(null);

  // Order stats map by customer email
  const customerOrdersMap = useMemo(() => {
    const map: Record<string, { count: number; totalSpend: number; latestDate?: number }> = {};
    if (!orders || !Array.isArray(orders)) return map;

    for (const order of orders) {
      const email = (order.customerEmail || '').trim().toLowerCase();
      if (!email) continue;
      if (!map[email]) {
        map[email] = { count: 0, totalSpend: 0 };
      }
      map[email].count += 1;
      map[email].totalSpend += order.totalAmount || 0;
      if (!map[email].latestDate || order.createdAt > map[email].latestDate!) {
        map[email].latestDate = order.createdAt;
      }
    }
    return map;
  }, [orders]);

  // Flash feedback toast
  const triggerFeedback = (msg: string) => {
    setActionFeedback(msg);
    setTimeout(() => setActionFeedback(null), 4000);
  };

  const copyToClipboard = (text: string, key: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const togglePasswordReveal = (id: string) => {
    setRevealedPasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Helper date formatters
  const formatDate = (timestamp?: number) => {
    if (!timestamp) return 'Never';
    return new Date(timestamp).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatDateTime = (timestamp?: number) => {
    if (!timestamp) return 'Never';
    return new Date(timestamp).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatTimeAgo = (timestamp?: number) => {
    if (!timestamp) return 'Never';
    const diffMs = Date.now() - timestamp;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHour < 24) return `${diffHour}h ago`;
    if (diffDay === 1) return 'Yesterday';
    if (diffDay < 7) return `${diffDay}d ago`;
    return formatDate(timestamp);
  };

  // KPI Calculations
  const totalCustomersCount = rawUsers?.length ?? 0;
  const activeCustomersCount = rawUsers?.filter((u) => !u.isBlocked).length ?? 0;
  const blockedCustomersCount = rawUsers?.filter((u) => u.isBlocked).length ?? 0;
  const recentLoginsCount = rawUsers?.filter((u) => u.lastLoginAt && Date.now() - u.lastLoginAt < 24 * 60 * 60 * 1000).length ?? 0;

  // Filtered and Sorted Customers
  const filteredCustomers = useMemo(() => {
    if (!rawUsers) return [];

    let result = rawUsers.filter((user) => {
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = user.name?.toLowerCase().includes(q);
        const matchesEmail = user.email?.toLowerCase().includes(q);
        const matchesPhone = user.phone?.toLowerCase().includes(q);
        const matchesAddress = user.address?.toLowerCase().includes(q);
        if (!matchesName && !matchesEmail && !matchesPhone && !matchesAddress) return false;
      }

      // Status filter
      if (statusFilter === 'active' && user.isBlocked) return false;
      if (statusFilter === 'blocked' && !user.isBlocked) return false;

      // Role filter
      if (roleFilter !== 'all' && user.role !== roleFilter) return false;

      return true;
    });

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'newest') return (b.createdAt || 0) - (a.createdAt || 0);
      if (sortBy === 'oldest') return (a.createdAt || 0) - (b.createdAt || 0);
      if (sortBy === 'logins') return (b.loginCount || 0) - (a.loginCount || 0);
      if (sortBy === 'last_active') return (b.lastLoginAt || 0) - (a.lastLoginAt || 0);
      if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
      return 0;
    });

    return result;
  }, [rawUsers, searchQuery, statusFilter, roleFilter, sortBy]);

  // Handle Export CSV
  const handleExportCSV = () => {
    if (!rawUsers || rawUsers.length === 0) {
      alert('No customer data to export');
      return;
    }

    const headers = ['Name', 'Email', 'Phone', 'Address', 'Role', 'Status', 'Logins Count', 'Last Login', 'Registered At', 'Admin Notes'];
    const rows = rawUsers.map((u) => [
      `"${(u.name || '').replace(/"/g, '""')}"`,
      `"${u.email}"`,
      `"${u.phone || ''}"`,
      `"${(u.address || '').replace(/"/g, '""')}"`,
      u.role,
      u.isBlocked ? 'Blocked' : 'Active',
      u.loginCount || 0,
      u.lastLoginAt ? new Date(u.lastLoginAt).toISOString() : '',
      new Date(u.createdAt).toISOString(),
      `"${(u.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `bemyshopper_customers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerFeedback('✓ Customer data exported to CSV');
  };

  // Toggle Block Status
  const handleToggleBlock = async (user: CustomerItem) => {
    const nextAction = user.isBlocked ? 'unblock' : 'block';
    if (!confirm(`Are you sure you want to ${nextAction} account for "${user.name}" (${user.email})?`)) return;

    try {
      await adminToggleBlock({ userId: user.id });
      triggerFeedback(`✓ Account ${user.isBlocked ? 'reactivated' : 'blocked'} successfully`);
    } catch (err: any) {
      alert(err.message || 'Failed to update account status');
    }
  };

  // Delete User Immediately
  const handleDeleteUser = async (user: CustomerItem) => {
    if (!confirm(`Delete user "${user.name}" (${user.email})?`)) return;

    try {
      await adminDeleteUser({ userId: user.id });
      triggerFeedback(`✓ User "${user.name}" deleted immediately.`);
      if (detailCustomer?.id === user.id) setDetailCustomer(null);
    } catch (err: any) {
      alert(err.message || 'Failed to delete user');
    }
  };

  // Fast Quick Add User
  const handleQuickAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickName.trim() || !quickEmail.trim() || !quickPassword.trim()) {
      alert('Please fill Name, Email, and Password');
      return;
    }

    setIsSubmittingQuickAdd(true);
    try {
      await adminCreateUser({
        name: quickName.trim(),
        email: quickEmail.trim().toLowerCase(),
        password: quickPassword.trim(),
        phone: quickPhone.trim() || undefined,
        role: 'user',
      });

      triggerFeedback(`✓ User "${quickName.trim()}" added immediately!`);
      setQuickName('');
      setQuickEmail('');
      setQuickPassword('');
      setQuickPhone('');
    } catch (err: any) {
      alert(err.message || 'Failed to add user');
    } finally {
      setIsSubmittingQuickAdd(false);
    }
  };

  // Submit Add Customer
  const handleCreateCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.name.trim() || !addForm.email.trim() || !addForm.password.trim()) {
      alert('Please fill in Name, Email and Password');
      return;
    }

    setIsSubmittingAdd(true);
    try {
      await adminCreateUser({
        name: addForm.name.trim(),
        email: addForm.email.trim().toLowerCase(),
        password: addForm.password.trim(),
        phone: addForm.phone.trim() || undefined,
        address: addForm.address.trim() || undefined,
        role: addForm.role,
        notes: addForm.notes.trim() || undefined,
      });

      triggerFeedback(`✓ Created new customer "${addForm.name}" successfully!`);
      setIsAddModalOpen(false);
      setAddForm({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        role: 'user',
        notes: '',
      });
    } catch (err: any) {
      alert(err.message || 'Failed to create customer');
    } finally {
      setIsSubmittingAdd(false);
    }
  };

  // Submit Edit Customer
  const handleEditCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer) return;

    setIsSubmittingEdit(true);
    try {
      await adminUpdateUser({
        userId: editingCustomer.id,
        name: editForm.name.trim(),
        email: editForm.email.trim().toLowerCase(),
        phone: editForm.phone.trim(),
        address: editForm.address.trim(),
        role: editForm.role,
        isBlocked: editForm.isBlocked,
        notes: editForm.notes.trim(),
      });

      triggerFeedback(`✓ Updated details for "${editForm.name}"`);
      setEditingCustomer(null);
    } catch (err: any) {
      alert(err.message || 'Failed to update customer');
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  // Submit Reset Password
  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordModalCustomer || !newPasswordInput.trim()) return;

    setIsSubmittingPassword(true);
    try {
      await adminSetPassword({
        userId: passwordModalCustomer.id,
        newPassword: newPasswordInput.trim(),
      });

      triggerFeedback(`✓ Password updated for "${passwordModalCustomer.name}"!`);
      setPasswordModalCustomer(null);
      setNewPasswordInput('');
    } catch (err: any) {
      alert(err.message || 'Failed to reset password');
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ================= 1. SECTION HEADER ================= */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-gray-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#087D2C] to-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                Customer &amp; Logins Management
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800">
                {totalCustomersCount} Accounts
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
              Manage registered shopper profiles, login credentials, authentication audit logs, and account statuses.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-all shadow-2xs cursor-pointer"
            title="Download CSV spreadsheet of all registered customers"
          >
            <Download className="w-4 h-4 text-gray-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#087D2C] hover:bg-[#066323] text-white text-xs font-bold transition-all shadow-sm hover:shadow cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Customer</span>
          </button>
        </div>
      </div>

      {/* Global Feedback Banner */}
      {actionFeedback && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-between shadow-2xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionFeedback}</span>
          </div>
          <button onClick={() => setActionFeedback(null)} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ================= 2. KPI METRIC CARDS ================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Customers */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-gray-200/80 shadow-2xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 text-[#087D2C] flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-gray-900 tracking-tight">{totalCustomersCount}</div>
            <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Total Customers</div>
          </div>
        </div>

        {/* Active Accounts */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-gray-200/80 shadow-2xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-teal-50 border border-teal-100 text-teal-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-teal-700 tracking-tight">{activeCustomersCount}</div>
            <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Active Status</div>
          </div>
        </div>

        {/* Recent Logins Today */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-gray-200/80 shadow-2xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <LogIn className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-blue-700 tracking-tight">{recentLoginsCount}</div>
            <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Active in Last 24h</div>
          </div>
        </div>

        {/* Suspended / Blocked */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-gray-200/80 shadow-2xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-rose-700 tracking-tight">{blockedCustomersCount}</div>
            <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Suspended Accounts</div>
          </div>
        </div>
      </div>

      {/* ================= 3. SUB-NAV TABS ================= */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveSubTab('customers')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'customers'
              ? 'bg-[#087D2C] text-white shadow-xs'
              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Customer Accounts &amp; Logins</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
            activeSubTab === 'customers' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
          }`}>
            {filteredCustomers.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('logins')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'logins'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Login History &amp; Session Logs</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
            activeSubTab === 'logins' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
          }`}>
            {loginLogs?.length ?? 0}
          </span>
        </button>
      </div>

      {/* ================= 4. TAB 1: CUSTOMERS DIRECTORY ================= */}
      {activeSubTab === 'customers' && (
        <div className="space-y-4">
          {/* Quick Fast Add User Bar */}
          <div className="p-4 rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50/60 to-white border border-emerald-200/90 shadow-2xs">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2 text-xs font-black text-emerald-950">
                <UserPlus className="w-4 h-4 text-emerald-600" />
                <span>Fast Add New User (Instant)</span>
              </div>
              <span className="text-[11px] text-gray-500 font-medium">Quickly create a login immediately</span>
            </div>
            <form onSubmit={handleQuickAddSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
              <input
                type="text"
                placeholder="Full Name *"
                required
                value={quickName}
                onChange={(e) => setQuickName(e.target.value)}
                className="px-3.5 py-2 text-xs rounded-xl border border-emerald-200 bg-white focus:outline-none focus:border-[#087D2C]"
              />
              <input
                type="email"
                placeholder="Email Address *"
                required
                value={quickEmail}
                onChange={(e) => setQuickEmail(e.target.value)}
                className="px-3.5 py-2 text-xs rounded-xl border border-emerald-200 bg-white focus:outline-none focus:border-[#087D2C]"
              />
              <input
                type="text"
                placeholder="Password *"
                required
                value={quickPassword}
                onChange={(e) => setQuickPassword(e.target.value)}
                className="px-3.5 py-2 text-xs rounded-xl border border-emerald-200 bg-white focus:outline-none focus:border-[#087D2C]"
              />
              <input
                type="tel"
                placeholder="Phone (Optional)"
                value={quickPhone}
                onChange={(e) => setQuickPhone(e.target.value)}
                className="px-3.5 py-2 text-xs rounded-xl border border-emerald-200 bg-white focus:outline-none focus:border-[#087D2C]"
              />
              <button
                type="submit"
                disabled={isSubmittingQuickAdd}
                className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#087D2C] hover:bg-[#066323] text-white text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                <span>{isSubmittingQuickAdd ? 'Adding...' : 'Add User Now'}</span>
              </button>
            </form>
          </div>

          {/* Search & Filter Bar */}
          <div className="p-4 rounded-3xl bg-white border border-gray-200/80 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search customers by name, email, phone number, or city address..."
                className="w-full pl-9 pr-8 py-2.5 text-xs font-medium rounded-2xl border border-gray-200 bg-gray-50/60 focus:bg-white focus:border-[#087D2C] focus:outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Status Filter */}
              <div className="flex items-center gap-1 bg-gray-100/80 p-1 rounded-2xl text-[11px] font-bold">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
                    statusFilter === 'all' ? 'bg-white text-gray-900 shadow-2xs font-black' : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  All Status
                </button>
                <button
                  onClick={() => setStatusFilter('active')}
                  className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
                    statusFilter === 'active' ? 'bg-white text-emerald-700 shadow-2xs font-black' : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => setStatusFilter('blocked')}
                  className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
                    statusFilter === 'blocked' ? 'bg-white text-rose-700 shadow-2xs font-black' : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  Blocked
                </button>
              </div>

              {/* Role Filter */}
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as any)}
                className="px-3 py-2 text-xs font-bold rounded-2xl border border-gray-200 bg-white text-gray-700 focus:outline-none focus:border-[#087D2C] cursor-pointer"
              >
                <option value="all">All Roles</option>
                <option value="user">Customers Only</option>
                <option value="admin">Administrators</option>
              </select>

              {/* Sort Order */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 text-xs font-bold rounded-2xl border border-gray-200 bg-white text-gray-700 focus:outline-none focus:border-[#087D2C] cursor-pointer"
              >
                <option value="newest">Newest Registered</option>
                <option value="oldest">Oldest Registered</option>
                <option value="last_active">Recently Active</option>
                <option value="logins">Most Logins</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Customer Cards & Table */}
          {filteredCustomers.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white border border-gray-200/80 shadow-2xs space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-base font-black text-gray-800">No Customers Found</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                {searchQuery
                  ? `No customers match your search query "${searchQuery}". Try adjusting your keywords or clearing filters.`
                  : 'No customer accounts registered yet. Click "Add New Customer" above to manually onboard a shopper.'}
              </p>
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                    setRoleFilter('all');
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700 transition-all cursor-pointer"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-gray-200/80 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50/80 border-b border-gray-200 text-gray-500 uppercase text-[10px] font-black tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">Customer Details</th>
                      <th className="py-3.5 px-4">Login Credentials</th>
                      <th className="py-3.5 px-4">Login Activity</th>
                      <th className="py-3.5 px-4">Orders &amp; Address</th>
                      <th className="py-3.5 px-4">Account Status</th>
                      <th className="py-3.5 px-4 text-right sticky right-0 bg-gray-50/95 backdrop-blur-xs z-10 border-l border-gray-200">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium">
                    {filteredCustomers.map((user) => {
                      const isRevealed = revealedPasswords[user.id] || false;
                      const orderStats = customerOrdersMap[user.email.toLowerCase()] || { count: 0, totalSpend: 0 };

                      return (
                        <tr key={user.id} className="hover:bg-gray-50/60 transition-colors group">
                          {/* 1. Customer Details */}
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div
                                onClick={() => setDetailCustomer(user)}
                                className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm text-white shrink-0 cursor-pointer shadow-2xs transition-transform group-hover:scale-105 ${
                                  user.role === 'admin'
                                    ? 'bg-gradient-to-tr from-purple-600 to-indigo-600'
                                    : 'bg-gradient-to-tr from-[#087D2C] to-emerald-500'
                                }`}
                              >
                                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span
                                    onClick={() => setDetailCustomer(user)}
                                    className="font-black text-gray-900 truncate hover:text-[#087D2C] cursor-pointer text-sm"
                                  >
                                    {user.name}
                                  </span>
                                  {user.role === 'admin' && (
                                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-purple-100 text-purple-800">
                                      Admin
                                    </span>
                                  )}
                                  {/* Immediate Quick Delete Button right next to user name */}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteUser(user);
                                    }}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white transition-all text-xs font-bold border border-rose-200 cursor-pointer shadow-2xs ml-auto shrink-0"
                                    title={`Delete user "${user.name}" immediately`}
                                  >
                                    <Trash2 className="w-3 h-3" />
                                    <span>Delete</span>
                                  </button>
                                </div>
                                <div className="flex items-center gap-1.5 text-gray-500 mt-0.5">
                                  <Mail className="w-3 h-3 text-gray-400 shrink-0" />
                                  <span className="truncate">{user.email}</span>
                                  <button
                                    onClick={() => copyToClipboard(user.email, `email_${user.id}`)}
                                    className="text-gray-400 hover:text-gray-700 ml-0.5 cursor-pointer"
                                    title="Copy email"
                                  >
                                    {copiedKey === `email_${user.id}` ? (
                                      <Check className="w-3 h-3 text-emerald-600" />
                                    ) : (
                                      <Copy className="w-3 h-3" />
                                    )}
                                  </button>
                                </div>
                                {user.phone && (
                                  <div className="flex items-center gap-1.5 text-gray-500 text-[11px] mt-0.5">
                                    <Phone className="w-3 h-3 text-gray-400 shrink-0" />
                                    <span>{user.phone}</span>
                                    <a
                                      href={`https://wa.me/91${user.phone.replace(/[^0-9]/g, '')}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-emerald-600 hover:text-emerald-700 text-[10px] font-bold"
                                      title="Chat on WhatsApp"
                                    >
                                      WhatsApp
                                    </a>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* 2. Login Credentials */}
                          <td className="py-4 px-4">
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-1.5">
                                <KeyRound className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded-md text-gray-800 select-all">
                                  {isRevealed ? user.password || '••••••••' : '••••••••'}
                                </span>
                                <button
                                  onClick={() => togglePasswordReveal(user.id)}
                                  className="text-gray-400 hover:text-gray-700 p-1 cursor-pointer"
                                  title={isRevealed ? 'Hide Password' : 'Show Password'}
                                >
                                  {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                </button>
                                {isRevealed && user.password && (
                                  <button
                                    onClick={() => copyToClipboard(user.password!, `pw_${user.id}`)}
                                    className="text-gray-400 hover:text-gray-700 p-1 cursor-pointer"
                                    title="Copy password"
                                  >
                                    {copiedKey === `pw_${user.id}` ? (
                                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                                    ) : (
                                      <Copy className="w-3.5 h-3.5" />
                                    )}
                                  </button>
                                )}
                              </div>
                              <button
                                onClick={() => {
                                  setPasswordModalCustomer(user);
                                  setNewPasswordInput('');
                                }}
                                className="text-[11px] font-bold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 cursor-pointer"
                              >
                                <Lock className="w-3 h-3" />
                                <span>Reset Password</span>
                              </button>
                            </div>
                          </td>

                          {/* 3. Login Activity */}
                          <td className="py-4 px-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5">
                                <span className="font-black text-gray-900 text-xs">{user.loginCount || 0}</span>
                                <span className="text-[11px] text-gray-500">sign-ins recorded</span>
                              </div>
                              <div className="flex items-center gap-1 text-[11px] text-gray-500">
                                <Clock className="w-3 h-3 text-gray-400 shrink-0" />
                                <span>Last: </span>
                                <span className="font-bold text-gray-700">{formatTimeAgo(user.lastLoginAt)}</span>
                              </div>
                              {user.lastLoginAt && (
                                <div className="text-[10px] text-gray-400">
                                  {formatDateTime(user.lastLoginAt)}
                                </div>
                              )}
                            </div>
                          </td>

                          {/* 4. Orders & Address */}
                          <td className="py-4 px-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5">
                                <ShoppingBag className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span className="font-black text-gray-900">{orderStats.count}</span>
                                <span className="text-[11px] text-gray-500">orders</span>
                                {orderStats.totalSpend > 0 && (
                                  <span className="text-[11px] font-bold text-emerald-700">
                                    (₹{orderStats.totalSpend.toLocaleString('en-IN')})
                                  </span>
                                )}
                              </div>
                              {user.address ? (
                                <div className="flex items-start gap-1 text-[11px] text-gray-500 line-clamp-2 max-w-[200px]" title={user.address}>
                                  <MapPin className="w-3 h-3 text-gray-400 shrink-0 mt-0.5" />
                                  <span>{user.address}</span>
                                </div>
                              ) : (
                                <div className="text-[10px] text-gray-400 italic">No delivery address saved</div>
                              )}
                            </div>
                          </td>

                          {/* 5. Account Status */}
                          <td className="py-4 px-4">
                            <div className="space-y-1.5">
                              {user.isBlocked ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-rose-100 text-rose-800">
                                  <ShieldAlert className="w-3 h-3" />
                                  Suspended
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                  Active
                                </span>
                              )}
                              <div className="text-[10px] text-gray-400 flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-gray-300" />
                                <span>Joined {formatDate(user.createdAt)}</span>
                              </div>
                            </div>
                          </td>

                          {/* 6. Action Buttons */}
                          <td className="py-4 px-4 text-right sticky right-0 bg-white group-hover:bg-gray-50/95 transition-colors z-10 border-l border-gray-100 shadow-[-4px_0_10px_rgba(0,0,0,0.03)]">
                            <div className="inline-flex items-center gap-1.5">
                              {/* View / Details Drawer */}
                              <button
                                onClick={() => setDetailCustomer(user)}
                                className="p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all cursor-pointer"
                                title="View Customer Profile"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              {/* Edit Profile */}
                              <button
                                onClick={() => {
                                  setEditingCustomer(user);
                                  setEditForm({
                                    name: user.name,
                                    email: user.email,
                                    phone: user.phone || '',
                                    address: user.address || '',
                                    role: user.role,
                                    isBlocked: !!user.isBlocked,
                                    notes: user.notes || '',
                                  });
                                }}
                                className="p-2 rounded-xl text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all cursor-pointer"
                                title="Edit Customer Details"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>

                              {/* Block / Unblock Toggle */}
                              <button
                                onClick={() => handleToggleBlock(user)}
                                className={`p-2 rounded-xl transition-all cursor-pointer ${
                                  user.isBlocked
                                    ? 'text-emerald-600 hover:bg-emerald-50'
                                    : 'text-amber-600 hover:bg-amber-50'
                                }`}
                                title={user.isBlocked ? 'Reactivate Account' : 'Suspend / Block Account'}
                              >
                                {user.isBlocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                              </button>

                              {/* Fast Delete Button */}
                              <button
                                onClick={() => handleDeleteUser(user)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white transition-all text-xs font-bold cursor-pointer border border-rose-200/80 shadow-2xs ml-1"
                                title="Delete User Immediately"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= 5. TAB 2: LOGIN HISTORY & AUDIT LOGS ================= */}
      {activeSubTab === 'logins' && (
        <div className="bg-white rounded-3xl border border-gray-200/80 shadow-2xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-sm sm:text-base font-black text-gray-900 tracking-tight flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Customer Login Session Audit Log</span>
              </h2>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                Real-time records of customer authentication events, sign-in attempts, and status.
              </p>
            </div>
            <span className="text-xs font-bold text-gray-400">
              Showing last {loginLogs?.length ?? 0} events
            </span>
          </div>

          {!loginLogs || loginLogs.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <Clock className="w-10 h-10 text-gray-300 mx-auto" />
              <p className="text-xs font-bold text-gray-500">No login session records captured yet.</p>
              <p className="text-[11px] text-gray-400">Customer logins will automatically appear here as users sign in.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50/80 border-b border-gray-200 text-gray-500 uppercase text-[10px] font-black tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Time &amp; Date</th>
                    <th className="py-3 px-4">Customer Email</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Device / Client</th>
                    <th className="py-3 px-4">Remarks / Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {loginLogs.map((log: any) => (
                    <tr key={log._id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-gray-900">{formatTimeAgo(log.timestamp)}</div>
                        <div className="text-[10px] text-gray-400">{formatDateTime(log.timestamp)}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-gray-800 flex items-center gap-1.5">
                          <Mail className="w-3 h-3 text-gray-400" />
                          <span>{log.email}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        {log.status === 'success' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Success
                          </span>
                        )}
                        {log.status === 'failed' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800">
                            <AlertCircle className="w-3 h-3 text-amber-600" />
                            Failed Attempt
                          </span>
                        )}
                        {log.status === 'blocked' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-800">
                            <ShieldAlert className="w-3 h-3 text-rose-600" />
                            Blocked Login
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-gray-500">
                        <div className="flex items-center gap-1.5 text-xs">
                          <Laptop className="w-3.5 h-3.5 text-gray-400" />
                          <span>{log.device || 'Web Browser'}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-gray-500">
                        {log.failureReason ? (
                          <span className="text-rose-600 font-bold">{log.failureReason}</span>
                        ) : (
                          <span className="text-emerald-700">Authenticated successfully</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ================= 6. MODAL: ADD NEW CUSTOMER ================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-gray-100 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#087D2C] flex items-center justify-center font-black">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-gray-900">Add New Customer</h3>
                  <p className="text-xs text-gray-500">Register a new shopper account in BeMyShopper.</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:text-gray-800 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomerSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={addForm.name}
                    onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#087D2C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={addForm.email}
                    onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                    placeholder="customer@gmail.com"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#087D2C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Password *</label>
                  <input
                    type="text"
                    required
                    value={addForm.password}
                    onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
                    placeholder="At least 6 characters"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#087D2C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={addForm.phone}
                    onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })}
                    placeholder="e.g. 9876543210"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#087D2C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Delivery Address</label>
                <input
                  type="text"
                  value={addForm.address}
                  onChange={(e) => setAddForm({ ...addForm, address: e.target.value })}
                  placeholder="Door No, Street, Bapatla, AP"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#087D2C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Internal Admin Notes</label>
                <textarea
                  rows={2}
                  value={addForm.notes}
                  onChange={(e) => setAddForm({ ...addForm, notes: e.target.value })}
                  placeholder="Optional internal notes about customer preference..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#087D2C]"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingAdd}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#087D2C] hover:bg-[#066323] text-white transition-all shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingAdd ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= 7. MODAL: EDIT CUSTOMER ================= */}
      {editingCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-gray-100 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-gray-900">Edit Customer Profile</h3>
                  <p className="text-xs text-gray-500">Update account info for {editingCustomer.name}.</p>
                </div>
              </div>
              <button
                onClick={() => setEditingCustomer(null)}
                className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:text-gray-800 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditCustomerSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#087D2C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#087D2C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#087D2C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Account Role</label>
                  <select
                    value={editForm.role}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value as any })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#087D2C]"
                  >
                    <option value="user">Customer (User)</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Delivery Address</label>
                <input
                  type="text"
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#087D2C]"
                />
              </div>

              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-gray-800">Account Status</div>
                  <div className="text-[11px] text-gray-500">
                    {editForm.isBlocked ? 'Customer cannot log in or place orders' : 'Customer has full active access'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setEditForm({ ...editForm, isBlocked: !editForm.isBlocked })}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    editForm.isBlocked
                      ? 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                      : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                  }`}
                >
                  {editForm.isBlocked ? 'Blocked' : 'Active'}
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Internal Admin Notes</label>
                <textarea
                  rows={2}
                  value={editForm.notes}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#087D2C]"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingCustomer(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingEdit}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#087D2C] hover:bg-[#066323] text-white transition-all shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingEdit ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= 8. MODAL: RESET PASSWORD ================= */}
      {passwordModalCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-gray-100 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-gray-900">Reset Customer Password</h3>
                  <p className="text-xs text-gray-500">For {passwordModalCustomer.name}</p>
                </div>
              </div>
              <button
                onClick={() => setPasswordModalCustomer(null)}
                className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:text-gray-800 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 text-xs space-y-1">
              <div className="text-gray-500">Current Saved Password:</div>
              <div className="font-mono font-bold text-gray-900 text-sm">
                {passwordModalCustomer.password || 'Not visible'}
              </div>
            </div>

            <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Enter New Password *</label>
                <input
                  type="text"
                  required
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  placeholder="New password (min 4 chars)"
                  className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl border border-gray-200 focus:outline-none focus:border-[#087D2C]"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setPasswordModalCustomer(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPassword || !newPasswordInput.trim()}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#087D2C] hover:bg-[#066323] text-white transition-all shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingPassword ? 'Saving...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= 9. DRAWER: CUSTOMER DETAIL VIEW ================= */}
      {detailCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md h-full bg-white shadow-2xl p-6 overflow-y-auto space-y-6 animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="text-base font-black text-gray-900">Customer Profile Overview</h3>
              <button
                onClick={() => setDetailCustomer(null)}
                className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:text-gray-800 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Avatar & Summary */}
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#087D2C] to-emerald-500 text-white font-black text-2xl flex items-center justify-center mx-auto shadow-sm">
                {detailCustomer.name ? detailCustomer.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <h4 className="text-lg font-black text-gray-900">{detailCustomer.name}</h4>
                <p className="text-xs text-gray-500">{detailCustomer.email}</p>
              </div>
              <div className="flex items-center justify-center gap-2 pt-1">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                  detailCustomer.isBlocked ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {detailCustomer.isBlocked ? 'Suspended Account' : 'Active Account'}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-gray-100 text-gray-700">
                  {detailCustomer.role === 'admin' ? 'Administrator' : 'Customer'}
                </span>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="text-xl font-black text-gray-900">{detailCustomer.loginCount || 0}</div>
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Total Logins</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="text-xl font-black text-emerald-700">
                  {customerOrdersMap[detailCustomer.email.toLowerCase()]?.count || 0}
                </div>
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Orders Placed</div>
              </div>
            </div>

            {/* Contact & Credentials Details */}
            <div className="space-y-3 bg-gray-50/70 p-4 rounded-2xl border border-gray-200/80 text-xs">
              <div className="font-black text-gray-800 text-[11px] uppercase tracking-wider">Contact &amp; Login Data</div>

              <div className="flex items-center justify-between py-1 border-b border-gray-200/60">
                <span className="text-gray-500">Email:</span>
                <span className="font-bold text-gray-900 select-all">{detailCustomer.email}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-gray-200/60">
                <span className="text-gray-500">Phone:</span>
                <span className="font-bold text-gray-900">{detailCustomer.phone || 'Not provided'}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-gray-200/60">
                <span className="text-gray-500">Password:</span>
                <span className="font-mono font-bold text-gray-900 select-all">
                  {detailCustomer.password || '••••••••'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-gray-200/60">
                <span className="text-gray-500">Last Sign-In:</span>
                <span className="font-bold text-gray-900">{formatDateTime(detailCustomer.lastLoginAt)}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-gray-200/60">
                <span className="text-gray-500">Registered:</span>
                <span className="font-bold text-gray-900">{formatDateTime(detailCustomer.createdAt)}</span>
              </div>

              <div className="py-1">
                <div className="text-gray-500 mb-0.5">Delivery Address:</div>
                <div className="font-medium text-gray-800">
                  {detailCustomer.address || 'No address saved'}
                </div>
              </div>

              {detailCustomer.notes && (
                <div className="py-1 border-t border-gray-200/60">
                  <div className="text-gray-500 mb-0.5">Admin Notes:</div>
                  <div className="font-medium text-amber-900 bg-amber-50 p-2 rounded-xl text-[11px]">
                    {detailCustomer.notes}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions in Drawer */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  setPasswordModalCustomer(detailCustomer);
                  setNewPasswordInput('');
                }}
                className="w-full py-2.5 px-4 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-800 flex items-center justify-center gap-2 cursor-pointer"
              >
                <KeyRound className="w-4 h-4 text-blue-600" />
                <span>Reset Customer Password</span>
              </button>

              <button
                onClick={() => handleToggleBlock(detailCustomer)}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer ${
                  detailCustomer.isBlocked
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                }`}
              >
                {detailCustomer.isBlocked ? (
                  <>
                    <Unlock className="w-4 h-4" />
                    <span>Reactivate Account</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Suspend / Block Account</span>
                  </>
                )}
              </button>

              <button
                onClick={() => handleDeleteUser(detailCustomer)}
                className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete This Customer Account</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
