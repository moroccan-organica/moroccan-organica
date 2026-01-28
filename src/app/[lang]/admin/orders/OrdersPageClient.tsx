'use client';

import React, { useState, useMemo } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Search,
    Filter,
    Eye,
    FileText,
    Truck,
    Package,
    AlertCircle,
    CheckCircle2,
    XCircle,
    Clock,
    Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useOrders } from '@/lib/orders/hooks';
import { OrderStatus } from '@/types/order';

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
    PENDING: { label: 'Pending', color: 'bg-amber-100 text-amber-700 hover:bg-amber-100', icon: Clock },
    PROCESSING: { label: 'Processing', color: 'bg-blue-100 text-blue-700 hover:bg-blue-100', icon: Package },
    SHIPPED: { label: 'Shipped', color: 'bg-purple-100 text-purple-700 hover:bg-purple-100', icon: Truck },
    DELIVERED: { label: 'Delivered', color: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100', icon: CheckCircle2 },
    CANCELLED: { label: 'Cancelled', color: 'bg-slate-100 text-slate-700 hover:bg-slate-100', icon: XCircle },
    REFUNDED: { label: 'Refunded', color: 'bg-red-100 text-red-700 hover:bg-red-100', icon: AlertCircle },
};

export function OrdersPageClient() {
    const { data: orders = [], isLoading } = useOrders();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');

    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const matchesSearch =
                order.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [orders, searchTerm, statusFilter]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    if (isLoading) {
        return (
            <div>
                <AdminHeader title="Orders" subtitle="Track and manage customer orders" />
                <div className="flex h-[50vh] items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                </div>
            </div>
        );
    }

    return (
        <div>
            <AdminHeader title="Orders" subtitle="Track and manage customer orders" />

            <div className="p-6">
                {/* Toolbar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3 flex-1">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <Input
                                type="text"
                                placeholder="Search by order ref, customer name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 bg-white"
                            />
                        </div>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'ALL')}
                            className="h-10 px-4 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#606C38]"
                        >
                            <option value="ALL">All Statuses</option>
                            {Object.keys(statusConfig).map((status) => (
                                <option key={status} value={status}>
                                    {statusConfig[status].label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Order Ref</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="text-right px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Items</th>
                                <th className="text-right px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Total</th>
                                <th className="text-right px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredOrders.map((order) => {
                                const StatusIcon = statusConfig[order.status]?.icon || Package;
                                return (
                                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-slate-100 text-slate-500 font-mono text-xs">
                                                    #{order.reference.slice(-4)}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-900">{order.reference}</p>
                                                    <p className="text-xs text-slate-500">{order.shippingAddress?.city}, {order.shippingAddress?.country}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-slate-900">{order.customer.firstName} {order.customer.lastName}</span>
                                                <span className="text-xs text-slate-500">{order.customer.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-slate-600">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </span>
                                            <p className="text-xs text-slate-400">
                                                {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge
                                                className={cn("gap-1.5 pl-1.5 pr-2.5 py-0.5 font-normal", statusConfig[order.status]?.color)}
                                                variant="secondary"
                                            >
                                                <StatusIcon className="h-3.5 w-3.5" />
                                                {statusConfig[order.status]?.label}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm text-slate-600">
                                            {order.itemsCount}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="font-semibold text-[#606C38]">
                                                {formatCurrency(order.totalAmount)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="View Details (Coming Soon)"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    {filteredOrders.length === 0 && (
                        <div className="text-center py-12">
                            <FileText className="h-12 w-12 mx-auto text-slate-300 mb-4" />
                            <p className="text-slate-500">No orders found</p>
                        </div>
                    )}
                </div>

                {/* Summary */}
                <div className="mt-6 flex items-center justify-between text-sm text-slate-500">
                    <p>Showing {filteredOrders.length} of {orders.length} orders</p>
                </div>
            </div>
        </div>
    );
}
