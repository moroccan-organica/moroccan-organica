import { AdminHeader } from '@/components/admin/AdminHeader';
import { Package, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';
import { shopProducts } from '@/data/shop-products';

const stats = [
    {
        label: 'Total Products',
        value: shopProducts.length.toString(),
        icon: Package,
        color: 'bg-blue-500',
        change: '+12%',
    },
    {
        label: 'Total Orders',
        value: '156',
        icon: ShoppingCart,
        color: 'bg-green-500',
        change: '+8%',
    },
    {
        label: 'Revenue',
        value: '$12,450',
        icon: DollarSign,
        color: 'bg-purple-500',
        change: '+23%',
    },
    {
        label: 'Growth',
        value: '18.2%',
        icon: TrendingUp,
        color: 'bg-orange-500',
        change: '+5%',
    },
];

export default function AdminDashboard() {
    return (
        <div>
            <AdminHeader title="Dashboard" subtitle="Welcome back to Moroccan Organica" />
            
            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={stat.label}
                                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`${stat.color} p-3 rounded-xl`}>
                                        <Icon className="h-6 w-6 text-white" />
                                    </div>
                                    <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                        {stat.change}
                                    </span>
                                </div>
                                <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                                <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
                            </div>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Orders</h3>
                        <div className="text-center py-12 text-slate-400">
                            <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-50" />
                            <p>No recent orders</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Top Products</h3>
                        <div className="space-y-4">
                            {shopProducts.slice(0, 4).map((product) => (
                                <div key={product.id} className="flex items-center gap-4">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="h-12 w-12 rounded-lg object-cover"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-slate-900 truncate">
                                            {product.name}
                                        </p>
                                        <p className="text-xs text-slate-500">{product.category}</p>
                                    </div>
                                    <p className="text-sm font-bold text-[#606C38]">
                                        ${product.price}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
