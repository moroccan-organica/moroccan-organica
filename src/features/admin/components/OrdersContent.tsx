'use client';

import React, { useState, useMemo } from 'react';
import { AdminHeader } from '@/features/admin/components/AdminHeader';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import {
    Search,
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
import { useOrders, useUpdateOrder } from '@/features/checkout/hooks/orders';
import { OrderStatus, AdminOrder } from '@/types/order';

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
    PENDING: { label: 'Pending', color: 'bg-amber-100 text-amber-700 hover:bg-amber-100', icon: Clock },
    PROCESSING: { label: 'Processing', color: 'bg-blue-100 text-blue-700 hover:bg-blue-100', icon: Package },
    SHIPPED: { label: 'Shipped', color: 'bg-purple-100 text-purple-700 hover:bg-purple-100', icon: Truck },
    DELIVERED: { label: 'Delivered', color: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100', icon: CheckCircle2 },
    CANCELLED: { label: 'Cancelled', color: 'bg-slate-100 text-slate-700 hover:bg-slate-100', icon: XCircle },
    REFUNDED: { label: 'Refunded', color: 'bg-red-100 text-red-700 hover:bg-red-100', icon: AlertCircle },
};

function OrderStatusBadge({ orderId, status }: { orderId: string, status: string }) {
    const updateOrder = useUpdateOrder();
    const StatusIcon = statusConfig[status]?.icon || Package;

    const handleUpdate = async (newStatus: string) => {
        try {
            await updateOrder.mutateAsync({ id: orderId, status: newStatus });
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    return (
        <div className="relative inline-block" onClick={(e) => e.stopPropagation()}>
            <select
                value={status}
                onChange={(e) => handleUpdate(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                disabled={updateOrder.isPending}
            >
                {Object.keys(statusConfig).map((key) => (
                    <option key={key} value={key}>
                        {statusConfig[key].label}
                    </option>
                ))}
            </select>
            <Badge
                className={cn(
                    "gap-1.5 pl-1.5 pr-2.5 py-0.5 font-normal pointer-events-none",
                    statusConfig[status]?.color
                )}
                variant="secondary"
            >
                <StatusIcon className="h-3.5 w-3.5" />
                {updateOrder.isPending ? 'Updating...' : statusConfig[status]?.label}
            </Badge>
        </div>
    );
}

export function OrdersContent() {
    const { data: orders = [], isLoading } = useOrders();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');
    const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' });
    const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const matchesSearch =
                order.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;

            const matchesDate = (!dateRange.start || new Date(order.createdAt) >= new Date(dateRange.start)) &&
                (!dateRange.end || new Date(order.createdAt) <= new Date(dateRange.end + 'T23:59:59'));

            return matchesSearch && matchesStatus && matchesDate;
        });
    }, [orders, searchTerm, statusFilter, dateRange]);

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
                        <div className="flex items-center gap-2">
                            <Input
                                type="date"
                                value={dateRange.start}
                                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                                className="h-10 bg-white w-auto"
                                placeholder="Start Date"
                            />
                            <span className="text-slate-400">-</span>
                            <Input
                                type="date"
                                value={dateRange.end}
                                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                                className="h-10 bg-white w-auto"
                                placeholder="End Date"
                            />
                        </div>
                    </div>
                </div>

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
                                            <OrderStatusBadge orderId={order.id} status={order.status} />
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
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                                    title="View Details"
                                                    onClick={() => setSelectedOrder(order)}
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

                <div className="mt-6 flex items-center justify-between text-sm text-slate-500">
                    <p>Showing {filteredOrders.length} of {orders.length} orders</p>
                </div>
            </div>

            <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
                <DialogContent className="max-w-4xl p-0 overflow-hidden bg-slate-50">
                    <div className="bg-white p-6 border-b border-slate-100 flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <DialogTitle className="text-xl">Order #{selectedOrder?.reference}</DialogTitle>
                                {selectedOrder && <OrderStatusBadge orderId={selectedOrder.id} status={selectedOrder.status} />}
                            </div>
                            <DialogDescription>
                                Placed on {selectedOrder && new Date(selectedOrder.createdAt).toLocaleDateString()} at {selectedOrder && new Date(selectedOrder.createdAt).toLocaleTimeString()}
                            </DialogDescription>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-slate-500 uppercase tracking-wider font-semibold">Total Amount</p>
                            <p className="text-2xl font-bold text-[#606C38]">{selectedOrder && formatCurrency(selectedOrder.totalAmount)}</p>
                        </div>
                    </div>

                    {selectedOrder && (
                        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left Column: Customer & Shipping */}
                            <div className="lg:col-span-1 space-y-6">
                                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                                    <h3 className="flex items-center gap-2 font-semibold text-slate-800 mb-4">
                                        <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md">
                                            <FileText className="h-4 w-4" />
                                        </div>
                                        Customer Details
                                    </h3>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-xs text-slate-400 uppercase font-semibold">Full Name</p>
                                            <p className="font-medium text-slate-900">{selectedOrder.customer.firstName} {selectedOrder.customer.lastName}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400 uppercase font-semibold">Email Address</p>
                                            <p className="text-sm text-slate-600">{selectedOrder.customer.email}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                                    <h3 className="flex items-center gap-2 font-semibold text-slate-800 mb-4">
                                        <div className="p-1.5 bg-green-50 text-green-600 rounded-md">
                                            <Truck className="h-4 w-4" />
                                        </div>
                                        Shipping Address
                                    </h3>
                                    {selectedOrder.shippingAddress ? (
                                        <div className="space-y-1 text-sm text-slate-600">
                                            <p className="font-medium text-slate-900">{selectedOrder.shippingAddress.city}</p>
                                            <p>{selectedOrder.shippingAddress.country}</p>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-slate-400 italic">No shipping address provided</p>
                                    )}
                                </div>
                            </div>

                            {/* Right Column: Order Items */}
                            <div className="lg:col-span-2">
                                <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                                    <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                                        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                                            <Package className="h-4 w-4 text-slate-400" />
                                            Order Items <span className="text-xs font-normal text-slate-500">({selectedOrder.itemsCount})</span>
                                        </h3>
                                    </div>
                                    <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
                                        {selectedOrder.items?.map((item) => (
                                            <div key={item.id} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                                                <div className="h-16 w-16 rounded-lg border border-slate-100 bg-slate-50 overflow-hidden flex-shrink-0">
                                                    {item.image ? (
                                                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                                                    ) : (
                                                        <div className="h-full w-full flex items-center justify-center text-slate-300">
                                                            <Package className="h-6 w-6" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-slate-900 truncate">{item.name}</p>
                                                    {item.variantName && (
                                                        <p className="text-xs text-slate-500 mt-0.5">Variant: {item.variantName}</p>
                                                    )}
                                                    <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                                                        <span className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 font-medium">Qty: {item.quantity}</span>
                                                        <span>x {formatCurrency(item.price)}</span>
                                                    </div>
                                                </div>
                                                <div className="text-right font-medium text-slate-900">
                                                    {formatCurrency(item.price * item.quantity)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="p-4 bg-slate-50 border-t border-slate-100">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-500">Subtotal</span>
                                            <span className="font-medium">{formatCurrency(selectedOrder.totalAmount)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
