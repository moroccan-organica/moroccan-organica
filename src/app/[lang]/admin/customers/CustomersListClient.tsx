'use client';

import React, { useState, useEffect } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import {
    Search,
    Users,
    Mail,
    Phone,
    ShoppingBag,
    Loader2,
    Eye,
    FileText,
    MapPin
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Address {
    id: string;
    addressLine1: string;
    city: string;
    country: string;
    postalCode: string | null;
    phone: string | null;
}

interface Customer {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
    companyName: string | null;
    totalSpent: number;
    createdAt: string;
    lastOrderDate: string | null;
    addresses: Address[];
    _count: {
        orders: number;
    };
}

interface PaginationData {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export function CustomersListClient() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [pagination, setPagination] = useState<PaginationData>({
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 0,
    });
    const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' });

    const fetchCustomers = async () => {
        // ... (fetch logic) ...
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '20',
                search: search,
            });
            if (dateRange.start) params.append('startDate', dateRange.start);
            if (dateRange.end) params.append('endDate', dateRange.end);

            const response = await fetch(`/api/admin/customers?${params}`);
            const data = await response.json();

            if (response.ok) {
                setCustomers(data.customers);
                setPagination(data.pagination);
            }
        } catch (error) {
            console.error('Error fetching customers:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, [page, dateRange]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        fetchCustomers();
    };

    // ... (formatCurrency) ...
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    if (loading && page === 1 && customers.length === 0) {
        // ... (loading view) ...
        return (
            <div>
                <AdminHeader title="CRM Customers" subtitle="Manage and view all customer information" />
                <div className="flex h-[50vh] items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                </div>
            </div>
        );
    }

    return (
        <div>
            <AdminHeader title="CRM Customers" subtitle="Manage and view all customer information" />

            <div className="p-6">
                {/* ... (Toolbar) ... */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3 flex-1">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <form onSubmit={handleSearch}>
                                <Input
                                    type="text"
                                    placeholder="Search by name, email, or phone..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10 bg-white"
                                />
                            </form>
                        </div>
                        <div className="flex items-center gap-2">
                            <Input
                                type="date"
                                value={dateRange.start}
                                onChange={(e) => {
                                    setDateRange(prev => ({ ...prev, start: e.target.value }));
                                    setPage(1);
                                }}
                                className="h-10 bg-white w-auto"
                                placeholder="Start Date"
                            />
                            <span className="text-slate-400">-</span>
                            <Input
                                type="date"
                                value={dateRange.end}
                                onChange={(e) => {
                                    setDateRange(prev => ({ ...prev, end: e.target.value }));
                                    setPage(1);
                                }}
                                className="h-10 bg-white w-auto"
                                placeholder="End Date"
                            />
                        </div>
                    </div>
                    <div className="text-sm text-slate-500">
                        Total Customers: <span className="font-semibold text-slate-900">{pagination.total}</span>
                    </div>
                </div>

                {/* Customers Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <table className="w-full">
                        {/* ... (thead) ... */}
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact</th>
                                <th className="text-right px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Orders</th>
                                <th className="text-right px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Spent</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Last Order</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Joined</th>
                                <th className="text-right px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {customers.map((customer) => (
                                <tr key={customer.id} className="hover:bg-slate-50 transition-colors">
                                    {/* ... (other columns) ... */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-slate-100 text-slate-500">
                                                <Users className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-900">
                                                    {customer.firstName || customer.lastName
                                                        ? `${customer.firstName || ''} ${customer.lastName || ''}`.trim()
                                                        : 'No Name'}
                                                </p>
                                                {customer.companyName && (
                                                    <p className="text-xs text-slate-500">{customer.companyName}</p>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col space-y-1">
                                            <div className="flex items-center gap-1.5 text-slate-600 text-sm">
                                                <Mail className="h-3 w-3" />
                                                <span className="truncate max-w-[180px]">{customer.email}</span>
                                            </div>
                                            {customer.phone && (
                                                <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                                                    <Phone className="h-3 w-3" />
                                                    <span>{customer.phone}</span>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
                                            <ShoppingBag className="h-3 w-3" />
                                            {customer._count.orders}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="font-semibold text-[#606C38]">
                                            {formatCurrency(Number(customer.totalSpent))}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {customer.lastOrderDate ? (
                                            <div className="flex flex-col">
                                                <span className="text-sm text-slate-600">
                                                    {new Date(customer.lastOrderDate).toLocaleDateString()}
                                                </span>
                                                <span className="text-xs text-slate-400">
                                                    {formatDistanceToNow(new Date(customer.lastOrderDate), { addSuffix: true })}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-slate-400 italic">Never</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm text-slate-600">
                                                {new Date(customer.createdAt).toLocaleDateString()}
                                            </span>
                                            <span className="text-xs text-slate-400">
                                                {formatDistanceToNow(new Date(customer.createdAt), { addSuffix: true })}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 text-right">
                                        <button
                                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                            title="View Details"
                                            onClick={() => setSelectedCustomer(customer)}
                                        >
                                            <Eye className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* ... (empty state) ... */}
                    {customers.length === 0 && !loading && (
                        <div className="text-center py-12">
                            <FileText className="h-12 w-12 mx-auto text-slate-300 mb-4" />
                            <p className="text-slate-500">No customers found</p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="mt-6 flex items-center justify-between text-sm text-slate-500">
                        <p>
                            Showing {(page - 1) * pagination.limit + 1} to{' '}
                            {Math.min(page * pagination.limit, pagination.total)} of{' '}
                            {pagination.total} customers
                        </p>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(page - 1)}
                                disabled={page === 1}
                                className="h-8 cursor-pointer"
                            >
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(page + 1)}
                                disabled={page === pagination.totalPages}
                                className="h-8 cursor-pointer"
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            <Dialog open={!!selectedCustomer} onOpenChange={(open) => !open && setSelectedCustomer(null)}>
                <DialogContent className="max-w-2xl p-0 overflow-hidden bg-slate-50">
                    {/* Header / Hero */}
                    <div className="bg-white p-6 border-b border-slate-100">
                        <div className="flex items-start gap-4">
                            <div className="h-16 w-16 rounded-full bg-[#606C38]/10 text-[#606C38] flex items-center justify-center text-2xl font-bold border border-[#606C38]/20">
                                {selectedCustomer?.firstName?.[0]}{selectedCustomer?.lastName?.[0]}
                            </div>
                            <div className="flex-1">
                                <DialogTitle className="text-xl text-slate-900">
                                    {selectedCustomer?.firstName} {selectedCustomer?.lastName}
                                </DialogTitle>
                                <div className="mt-1 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-slate-500">
                                    <div className="flex items-center gap-1.5">
                                        <Mail className="h-3.5 w-3.5" />
                                        {selectedCustomer?.email}
                                    </div>
                                    {selectedCustomer?.phone && (
                                        <div className="flex items-center gap-1.5">
                                            <Phone className="h-3.5 w-3.5" />
                                            {selectedCustomer?.phone}
                                        </div>
                                    )}
                                </div>
                                <div className="mt-2 text-xs text-slate-400">
                                    Customer ID: <span className="font-mono">{selectedCustomer?.id}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {selectedCustomer && (
                        <div className="p-6 space-y-6">
                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                    <div className="flex items-center gap-2 text-slate-500 text-xs uppercase font-semibold mb-2">
                                        <ShoppingBag className="h-4 w-4" />
                                        Orders
                                    </div>
                                    <p className="text-2xl font-bold text-slate-900">{selectedCustomer._count.orders}</p>
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                    <div className="flex items-center gap-2 text-slate-500 text-xs uppercase font-semibold mb-2">
                                        <div className="text-[#606C38] font-bold">$</div>
                                        Total Spent
                                    </div>
                                    <p className="text-2xl font-bold text-[#606C38]">{formatCurrency(Number(selectedCustomer.totalSpent))}</p>
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                    <div className="flex items-center gap-2 text-slate-500 text-xs uppercase font-semibold mb-2">
                                        <Users className="h-4 w-4" />
                                        Joined
                                    </div>
                                    <p className="text-sm font-medium text-slate-900 mt-1">
                                        {new Date(selectedCustomer.createdAt).toLocaleDateString()}
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        {formatDistanceToNow(new Date(selectedCustomer.createdAt), { addSuffix: true })}
                                    </p>
                                </div>
                            </div>

                            {/* Addresses */}
                            <div>
                                <h3 className="font-semibold text-sm text-slate-800 flex items-center gap-2 mb-3">
                                    <MapPin className="h-4 w-4 text-slate-500" />
                                    Addresses
                                </h3>
                                {selectedCustomer.addresses && selectedCustomer.addresses.length > 0 ? (
                                    <div className="grid gap-3">
                                        {selectedCustomer.addresses.map((address) => (
                                            <div key={address.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-start gap-4">
                                                <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                                                    <MapPin className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <p className="text-slate-900 font-medium">{address.addressLine1}</p>
                                                    <p className="text-sm text-slate-500">{address.city}, {address.postalCode}</p>
                                                    <p className="text-sm text-slate-500 font-semibold mt-0.5">{address.country}</p>
                                                    {address.phone && (
                                                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                                            <Phone className="h-3 w-3" /> {address.phone}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-white p-8 rounded-xl border border-slate-100 border-dashed text-center">
                                        <div className="mx-auto w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center mb-2">
                                            <MapPin className="h-5 w-5 text-slate-300" />
                                        </div>
                                        <p className="text-slate-500 text-sm">No addresses found for this customer.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div >
    );
}
