'use client'

import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { BadgeCheck, Clock3, PackageOpen } from 'lucide-react'

const orders = [
  {
    id: 'ORD-1042',
    customer: 'Amina El Fassi',
    date: '2026-01-15',
    total: '$245.00',
    status: 'Shipped',
    items: 3,
    country: 'MA',
  },
  {
    id: 'ORD-1038',
    customer: 'Youssef Haddad',
    date: '2026-01-12',
    total: '$118.50',
    status: 'Processing',
    items: 2,
    country: 'FR',
  },
  {
    id: 'ORD-1029',
    customer: 'Sara Bennis',
    date: '2026-01-08',
    total: '$412.90',
    status: 'Pending',
    items: 6,
    country: 'US',
  },
  {
    id: 'ORD-1022',
    customer: 'Mohamed Idrissi',
    date: '2026-01-05',
    total: '$89.00',
    status: 'Delivered',
    items: 1,
    country: 'MA',
  },
]

const statusColor: Record<string, string> = {
  Pending: 'bg-amber-100 text-amber-800',
  Processing: 'bg-blue-100 text-blue-800',
  Shipped: 'bg-sky-100 text-sky-800',
  Delivered: 'bg-emerald-100 text-emerald-800',
}

export default function OrdersPage() {
  return (
    <div>
      <AdminHeader title="Orders" subtitle="Track and manage customer orders" />

      <div className="p-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Recent Orders</h3>
              <p className="text-sm text-slate-500">Overview of the latest sales in Organica.</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="flex items-center gap-1"><BadgeCheck className="h-4 w-4 text-emerald-600" /> Delivered</span>
              <span className="flex items-center gap-1"><PackageOpen className="h-4 w-4 text-sky-600" /> Shipped</span>
              <span className="flex items-center gap-1"><Clock3 className="h-4 w-4 text-amber-600" /> Pending</span>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Items</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Country</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium text-slate-900">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell className="text-slate-500">{order.date}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${statusColor[order.status] || 'bg-slate-100 text-slate-700'}`}>
                      {order.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">{order.items}</TableCell>
                  <TableCell className="text-right font-semibold text-[#606C38]">{order.total}</TableCell>
                  <TableCell className="text-right">{order.country}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
