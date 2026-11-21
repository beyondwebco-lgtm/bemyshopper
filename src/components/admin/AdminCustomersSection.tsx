'use client';

import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Plus,
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
  Download,
  X,
  AlertCircle,
  ShoppingBag,
  Laptop,
  CheckCircle2,
  UserPlus,
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
    setTimeout(() => setActionFeedback(null), 3500);
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
    link.setAttribute('download', `customers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerFeedback('✓ Customer data exported to CSV');
  };

  // Toggle Block Status
  const handleToggleBlock = async (user: CustomerItem) => {
    const nextAction = user.isBlocked ? 'unblock' : 'block';
    if (!confirm(`Are you sure you want to ${nextAction} account for "${user.name}"?`)) return;

    try {
      await adminToggleBlock({ userId: user.id });
      triggerFeedback(`✓ Account ${user.isBlocked ? 'reactivated' : 'blocked'}`);
    } catch (err: any) {
      alert(err.message || 'Failed to update account status');
    }
  };

  // Delete User Immediately (Single action)
  const handleDeleteUser = async (user: CustomerItem) => {
    if (!confirm(`Permanently delete customer "${user.name}" (${user.email})?`)) return;

    try {
      await adminDeleteUser({ userId: user.id });
      triggerFeedback(`✓ Customer "${user.name}" deleted.`);
      if (detailCustomer?.id === user.id) setDetailCustomer(null);
    } catch (err: any) {
      alert(err.message || 'Failed to delete user');
    }
  };

  // Submit Add Customer
  const handleCreateCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.name.trim() || !addForm.email.trim() || !addForm.password.trim()) {
      alert('Please fill Name, Email and Password');
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

      triggerFeedback(`✓ Customer "${addForm.name}" created`);
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

      triggerFeedback(`✓ Updated "${editForm.name}"`);
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

      triggerFeedback(`✓ Password updated for "${passwordModalCustomer.name}"`);
      setPasswordModalCustomer(null);
      setNewPasswordInput('');
    } catch (err: any) {
      alert(err.message || 'Failed to reset password');
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* ================= 1. MINIMAL HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Customer Logins</h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-[#137A2C] border border-emerald-100">
              {totalCustomersCount} Accounts
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            View registered customers, login credentials, passwords, and access status.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold transition-colors cursor-pointer"
            title="Export CSV"
          >
            <Download className="w-3.5 h-3.5 text-gray-500" />
            <span>Export</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#137A2C] hover:bg-[#0E5C21] text-white text-xs font-semibold transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      {/* Global Feedback Banner */}
      {actionFeedback && (
        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[#137A2C] text-xs font-semibold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{actionFeedback}</span>
          </div>
          <button onClick={() => setActionFeedback(null)} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ================= 2. MINIMAL STATS STRIP ================= */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-gray-600 font-medium">
          Total: <strong className="text-gray-900 font-bold">{totalCustomersCount}</strong>
        </span>
        <span className="px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-emerald-700 font-medium">
          Active: <strong className="font-bold">{activeCustomersCount}</strong>
        </span>
        <span className="px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-blue-700 font-medium">
          Active 24h: <strong className="font-bold">{recentLoginsCount}</strong>
        </span>
        {blockedCustomersCount > 0 && (
          <span className="px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-rose-700 font-medium">
            Blocked: <strong className="font-bold">{blockedCustomersCount}</strong>
          </span>
        )}
      </div>

      {/* ================= 3. SUB-NAV TABS ================= */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-1.5 text-xs font-semibold">
        <button
          onClick={() => setActiveSubTab('customers')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
            activeSubTab === 'customers'
              ? 'bg-gray-900 text-white font-bold'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Customer Accounts ({filteredCustomers.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('logins')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
            activeSubTab === 'logins'
              ? 'bg-gray-900 text-white font-bold'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Login History ({loginLogs?.length ?? 0})</span>
        </button>
      </div>

      {/* ================= 4. TAB 1: CUSTOMERS DIRECTORY ================= */}
      {activeSubTab === 'customers' && (
        <div className="space-y-3">
          {/* Minimal Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email, or phone..."
                className="w-full pl-8 pr-7 py-2 text-xs rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-[#137A2C] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-2.5 py-2 text-xs font-medium rounded-xl border border-gray-200 bg-white text-gray-700 focus:outline-none focus:border-[#137A2C] cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="blocked">Blocked</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-2.5 py-2 text-xs font-medium rounded-xl border border-gray-200 bg-white text-gray-700 focus:outline-none focus:border-[#137A2C] cursor-pointer"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="last_active">Recently Active</option>
                <option value="logins">Most Logins</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Minimal Clean Table */}
          {filteredCustomers.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-white border border-gray-200 text-xs text-gray-500">
              No customers found matching your criteria.
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50/75 border-b border-gray-200 text-gray-500 uppercase text-[10px] font-bold tracking-wider">
                    <tr>
                      <th className="py-2.5 px-3.5">Customer</th>
                      <th className="py-2.5 px-3.5">Phone</th>
                      <th className="py-2.5 px-3.5">Password</th>
                      <th className="py-2.5 px-3.5">Activity</th>
                      <th className="py-2.5 px-3.5">Status</th>
                      <th className="py-2.5 px-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredCustomers.map((user) => {
                      const isRevealed = revealedPasswords[user.id] || false;
                      const orderStats = customerOrdersMap[user.email.toLowerCase()] || { count: 0, totalSpend: 0 };

                      return (
                        <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                          {/* 1. Customer Name & Email (CLEAN, NO DUPLICATE DELETE BUTTON) */}
                          <td className="py-3 px-3.5">
                            <div className="flex items-center gap-2.5">
                              <div
                                onClick={() => setDetailCustomer(user)}
                                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white shrink-0 cursor-pointer ${
                                  user.role === 'admin'
                                    ? 'bg-purple-600'
                                    : 'bg-[#137A2C]'
                                }`}
                              >
                                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span
                                    onClick={() => setDetailCustomer(user)}
                                    className="font-bold text-gray-900 truncate hover:text-[#137A2C] cursor-pointer"
                                  >
                                    {user.name}
                                  </span>
                                  {user.role === 'admin' && (
                                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-purple-100 text-purple-700">
                                      Admin
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-1 text-gray-400 text-[11px]">
                                  <span className="truncate">{user.email}</span>
                                  <button
                                    onClick={() => copyToClipboard(user.email, `email_${user.id}`)}
                                    className="text-gray-400 hover:text-gray-700 cursor-pointer"
                                    title="Copy email"
                                  >
                                    {copiedKey === `email_${user.id}` ? (
                                      <Check className="w-3 h-3 text-emerald-600" />
                                    ) : (
                                      <Copy className="w-3 h-3" />
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* 2. Phone */}
                          <td className="py-3 px-3.5 text-gray-600 whitespace-nowrap">
                            {user.phone ? (
                              <div className="flex items-center gap-1.5">
                                <span>{user.phone}</span>
                                <a
                                  href={`https://wa.me/91${user.phone.replace(/[^0-9]/g, '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-emerald-600 hover:underline text-[10px] font-semibold"
                                >
                                  WA
                                </a>
                              </div>
                            ) : (
                              <span className="text-gray-300">—</span>
                            )}
                          </td>

                          {/* 3. Password */}
                          <td className="py-3 px-3.5">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-xs bg-gray-50 border border-gray-100 px-2 py-0.5 rounded text-gray-800">
                                {isRevealed ? user.password || '••••••••' : '••••••••'}
                              </span>
                              <button
                                onClick={() => togglePasswordReveal(user.id)}
                                className="text-gray-400 hover:text-gray-700 p-0.5 cursor-pointer"
                                title={isRevealed ? 'Hide' : 'Show'}
                              >
                                {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              </button>
                              <button
                                onClick={() => {
                                  setPasswordModalCustomer(user);
                                  setNewPasswordInput('');
                                }}
                                className="text-[11px] font-medium text-blue-600 hover:underline ml-1 cursor-pointer"
                              >
                                Reset
                              </button>
                            </div>
                          </td>

                          {/* 4. Activity */}
                          <td className="py-3 px-3.5 whitespace-nowrap text-gray-500">
                            <div className="text-[11px]">
                              <span className="font-semibold text-gray-800">{user.loginCount || 0} logins</span>
                              {user.lastLoginAt && (
                                <span className="text-gray-400 ml-1">({formatTimeAgo(user.lastLoginAt)})</span>
                              )}
                            </div>
                            {orderStats.count > 0 && (
                              <div className="text-[10px] text-emerald-700 font-medium">
                                {orderStats.count} order{orderStats.count > 1 ? 's' : ''} (₹{orderStats.totalSpend})
                              </div>
                            )}
                          </td>

                          {/* 5. Status */}
                          <td className="py-3 px-3.5 whitespace-nowrap">
                            {user.isBlocked ? (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                Blocked
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Active
                              </span>
                            )}
                          </td>

                          {/* 6. Clean Single Action Group */}
                          <td className="py-3 px-3.5 text-right whitespace-nowrap">
                            <div className="inline-flex items-center gap-1">
                              {/* Edit */}
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
                                className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                                title="Edit"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>

                              {/* Block/Unblock */}
                              <button
                                onClick={() => handleToggleBlock(user)}
                                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                  user.isBlocked
                                    ? 'text-emerald-600 hover:bg-emerald-50'
                                    : 'text-gray-400 hover:text-amber-600 hover:bg-amber-50'
                                }`}
                                title={user.isBlocked ? 'Unblock' : 'Block'}
                              >
                                {user.isBlocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                              </button>

                              {/* Single Delete Button */}
                              <button
                                onClick={() => handleDeleteUser(user)}
                                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white transition-all text-xs font-semibold cursor-pointer border border-rose-200 ml-1"
                                title="Delete User"
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

      {/* ================= 5. TAB 2: LOGIN HISTORY ================= */}
      {activeSubTab === 'logins' && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
          <div className="p-3 border-b border-gray-200 flex items-center justify-between text-xs text-gray-500">
            <span className="font-semibold text-gray-900">Recent Login Session Logs</span>
            <span>Showing last {loginLogs?.length ?? 0} events</span>
          </div>

          {!loginLogs || loginLogs.length === 0 ? (
            <div className="p-8 text-center text-xs text-gray-400">
              No login logs recorded yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50/75 border-b border-gray-200 text-gray-500 uppercase text-[10px] font-bold tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3.5">Time</th>
                    <th className="py-2.5 px-3.5">Email</th>
                    <th className="py-2.5 px-3.5">Status</th>
                    <th className="py-2.5 px-3.5">Device</th>
                    <th className="py-2.5 px-3.5">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loginLogs.map((log: any) => (
                    <tr key={log._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-2.5 px-3.5 whitespace-nowrap">
                        <span className="font-semibold text-gray-800">{formatTimeAgo(log.timestamp)}</span>
                        <span className="text-[10px] text-gray-400 ml-1.5">{formatDateTime(log.timestamp)}</span>
                      </td>
                      <td className="py-2.5 px-3.5 font-medium text-gray-800">
                        {log.email}
                      </td>
                      <td className="py-2.5 px-3.5 whitespace-nowrap">
                        {log.status === 'success' ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700">
                            Success
                          </span>
                        ) : log.status === 'blocked' ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700">
                            Blocked
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700">
                            Failed
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3.5 text-gray-500">
                        {log.device || 'Web Browser'}
                      </td>
                      <td className="py-2.5 px-3.5 text-gray-500">
                        {log.failureReason ? (
                          <span className="text-rose-600 font-medium">{log.failureReason}</span>
                        ) : (
                          <span className="text-emerald-700">Authenticated</span>
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

      {/* ================= 6. MODAL: ADD CUSTOMER ================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-xl border border-gray-100 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900">Add Customer</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-7 h-7 rounded-full bg-gray-100 text-gray-500 hover:text-gray-800 flex items-center justify-center cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomerSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={addForm.name}
                  onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#137A2C]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={addForm.email}
                  onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                  placeholder="customer@gmail.com"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#137A2C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Password *</label>
                  <input
                    type="text"
                    required
                    value={addForm.password}
                    onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
                    placeholder="Min 6 chars"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#137A2C]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={addForm.phone}
                    onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })}
                    placeholder="e.g. 9876543210"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#137A2C]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl font-semibold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingAdd}
                  className="px-4 py-2 rounded-xl font-bold bg-[#137A2C] hover:bg-[#0E5C21] text-white transition-colors cursor-pointer disabled:opacity-50"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-xl border border-gray-100 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900">Edit Customer</h3>
              <button
                onClick={() => setEditingCustomer(null)}
                className="w-7 h-7 rounded-full bg-gray-100 text-gray-500 hover:text-gray-800 flex items-center justify-center cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <form onSubmit={handleEditCustomerSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#137A2C]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#137A2C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#137A2C]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Role</label>
                  <select
                    value={editForm.role}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#137A2C]"
                  >
                    <option value="user">Customer</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-200">
                <span className="font-semibold text-gray-700">Account Status</span>
                <button
                  type="button"
                  onClick={() => setEditForm({ ...editForm, isBlocked: !editForm.isBlocked })}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                    editForm.isBlocked
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {editForm.isBlocked ? 'Blocked' : 'Active'}
                </button>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingCustomer(null)}
                  className="px-3.5 py-2 rounded-xl font-semibold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingEdit}
                  className="px-4 py-2 rounded-xl font-bold bg-[#137A2C] hover:bg-[#0E5C21] text-white transition-colors cursor-pointer disabled:opacity-50"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-xl border border-gray-100 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-gray-900">Reset Password</h3>
                <p className="text-xs text-gray-500">For {passwordModalCustomer.name}</p>
              </div>
              <button
                onClick={() => setPasswordModalCustomer(null)}
                className="w-7 h-7 rounded-full bg-gray-100 text-gray-500 hover:text-gray-800 flex items-center justify-center cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <form onSubmit={handleResetPasswordSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">New Password *</label>
                <input
                  type="text"
                  required
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full px-3 py-2 font-mono rounded-xl border border-gray-200 focus:outline-none focus:border-[#137A2C]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPasswordModalCustomer(null)}
                  className="px-3.5 py-2 rounded-xl font-semibold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPassword || !newPasswordInput.trim()}
                  className="px-4 py-2 rounded-xl font-bold bg-[#137A2C] hover:bg-[#0E5C21] text-white transition-colors cursor-pointer disabled:opacity-50"
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
          <div className="w-full max-w-sm h-full bg-white shadow-2xl p-6 overflow-y-auto space-y-5 animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900">Customer Details</h3>
              <button
                onClick={() => setDetailCustomer(null)}
                className="w-7 h-7 rounded-full bg-gray-100 text-gray-500 hover:text-gray-800 flex items-center justify-center cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Profile Info */}
            <div className="text-center space-y-1.5">
              <div className="w-14 h-14 rounded-full bg-[#137A2C] text-white font-bold text-xl flex items-center justify-center mx-auto shadow-sm">
                {detailCustomer.name ? detailCustomer.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <h4 className="text-base font-bold text-gray-900">{detailCustomer.name}</h4>
              <p className="text-xs text-gray-500">{detailCustomer.email}</p>
            </div>

            {/* Details list */}
            <div className="space-y-2.5 bg-gray-50 p-4 rounded-2xl text-xs">
              <div className="flex justify-between py-1 border-b border-gray-200/50">
                <span className="text-gray-500">Phone:</span>
                <span className="font-semibold text-gray-900">{detailCustomer.phone || '—'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-200/50">
                <span className="text-gray-500">Password:</span>
                <span className="font-mono font-semibold text-gray-900">{detailCustomer.password || '••••••••'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-200/50">
                <span className="text-gray-500">Status:</span>
                <span className={`font-semibold ${detailCustomer.isBlocked ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {detailCustomer.isBlocked ? 'Blocked' : 'Active'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-200/50">
                <span className="text-gray-500">Logins:</span>
                <span className="font-semibold text-gray-900">{detailCustomer.loginCount || 0}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-200/50">
                <span className="text-gray-500">Last Login:</span>
                <span className="font-semibold text-gray-900">{formatTimeAgo(detailCustomer.lastLoginAt)}</span>
              </div>
              <div className="py-1">
                <span className="text-gray-500 block mb-0.5">Address:</span>
                <span className="text-gray-800">{detailCustomer.address || 'No address saved'}</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  setPasswordModalCustomer(detailCustomer);
                  setNewPasswordInput('');
                }}
                className="w-full py-2 px-3 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-800 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5 text-blue-600" />
                <span>Reset Password</span>
              </button>

              <button
                onClick={() => handleDeleteUser(detailCustomer)}
                className="w-full py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-200 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Customer Account</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
