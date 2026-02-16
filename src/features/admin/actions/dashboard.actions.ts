'use server';

import { supabase } from '@/lib/supabase/client';

export interface DashboardStats {
    totalProducts: number;
    totalOrders: number;
    revenue: number;
    revenueChange: number;
    ordersChange: number;
    productsChange: number;
}

export interface RecentOrder {
    id: string;
    reference: string;
    customerName: string;
    totalAmount: number;
    status: string;
    createdAt: string;
}

export interface TopProduct {
    id: string;
    name: string;
    category: string;
    image: string;
    price: number;
    orderCount: number;
}

/**
 * Get dashboard statistics
 */
export async function getDashboardStats(): Promise<DashboardStats> {
    try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999).toISOString();

        // Total products
        const { count: totalProducts, error: pError } = await supabase
            .from('Product')
            .select('*', { count: 'exact', head: true })
            .eq('isAvailable', true);

        if (pError) throw pError;

        // Products created before this month
        const { count: lastMonthProducts, error: lpError } = await supabase
            .from('Product')
            .select('*', { count: 'exact', head: true })
            .eq('isAvailable', true)
            .lt('createdAt', startOfMonth);

        if (lpError) throw lpError;

        const productsChange = (lastMonthProducts || 0) > 0
            ? (((totalProducts || 0) - (lastMonthProducts || 0)) / (lastMonthProducts || 0)) * 100
            : 0;

        // Total orders this month
        const { count: totalOrders, error: oError } = await supabase
            .from('Order')
            .select('*', { count: 'exact', head: true })
            .gte('createdAt', startOfMonth);

        if (oError) throw oError;

        const { count: lastMonthOrders, error: loError } = await supabase
            .from('Order')
            .select('*', { count: 'exact', head: true })
            .gte('createdAt', startOfLastMonth)
            .lte('createdAt', endOfLastMonth);

        if (loError) throw loError;

        const ordersChange = (lastMonthOrders || 0) > 0
            ? (((totalOrders || 0) - (lastMonthOrders || 0)) / (lastMonthOrders || 0)) * 100
            : 0;

        // Revenue this month
        const { data: revenueData, error: rError } = await supabase
            .from('Order')
            .select('totalAmount')
            .gte('createdAt', startOfMonth)
            .in('status', ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED']);

        if (rError) throw rError;
        const revenue = (revenueData || []).reduce((acc, curr) => acc + Number(curr.totalAmount), 0);

        // Revenue last month
        const { data: lastMonthRevenueData, error: lrError } = await supabase
            .from('Order')
            .select('totalAmount')
            .gte('createdAt', startOfLastMonth)
            .lte('createdAt', endOfLastMonth)
            .in('status', ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED']);

        if (lrError) throw lrError;
        const lastMonthRevenue = (lastMonthRevenueData || []).reduce((acc, curr) => acc + Number(curr.totalAmount), 0);

        const revenueChange = lastMonthRevenue > 0
            ? ((revenue - lastMonthRevenue) / lastMonthRevenue) * 100
            : 0;

        return {
            totalProducts: totalProducts || 0,
            totalOrders: totalOrders || 0,
            revenue,
            revenueChange: Math.round(revenueChange * 10) / 10,
            ordersChange: Math.round(ordersChange * 10) / 10,
            productsChange: Math.round(productsChange * 10) / 10,
        };
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        return {
            totalProducts: 0,
            totalOrders: 0,
            revenue: 0,
            revenueChange: 0,
            ordersChange: 0,
            productsChange: 0,
        };
    }
}

/**
 * Get recent orders
 */
export async function getRecentOrders(limit: number = 5): Promise<RecentOrder[]> {
    try {
        const { data: orders, error } = await supabase
            .from('Order')
            .select('*, customer:Customer(*)')
            .order('createdAt', { ascending: false })
            .limit(limit);

        if (error) throw error;

        return (orders || []).map((order: any) => ({
            id: order.id,
            reference: order.reference,
            customerName: order.customer ? `${order.customer.firstName} ${order.customer.lastName}` : 'Unknown',
            totalAmount: Number(order.totalAmount),
            status: order.status,
            createdAt: order.createdAt,
        }));
    } catch (error) {
        console.error('Error fetching recent orders:', error);
        return [];
    }
}

/**
 * Get top selling products
 */
export async function getTopProducts(limit: number = 4): Promise<TopProduct[]> {
    try {
        // Fetch order items and variants to count manually since we don't have groupBy in Supabase client easily
        const { data: orderItems, error: itemsError } = await supabase
            .from('OrderItem')
            .select(`
                variantId,
                variant:ProductVariant(
                    price,
                    product:Product(
                        id,
                        translations:ProductTranslation(*),
                        images:ProductImage(*),
                        category:Category(
                            translations:CategoryTranslation(*)
                        )
                    )
                )
            `);

        if (itemsError) throw itemsError;

        // Group and count in memory
        const counts: Record<string, { count: number; data: any }> = {};
        (orderItems || []).forEach((item: any) => {
            if (!item.variantId || !item.variant?.product) return;
            if (!counts[item.variant.product.id]) {
                counts[item.variant.product.id] = { count: 0, data: item.variant };
            }
            counts[item.variant.product.id].count += 1;
        });

        const sorted = Object.entries(counts)
            .sort((a, b) => b[1].count - a[1].count)
            .slice(0, limit);

        const results = sorted.map(([productId, info]) => {
            const product = info.data.product;
            const translation = product.translations.find((t: any) => t.language === 'en') || product.translations[0];
            const categoryTranslation = product.category?.translations?.find((t: any) => t.language === 'en') || product.category?.translations?.[0];
            const primaryImage = product.images.find((img: any) => img.isPrimary) || product.images[0];

            return {
                id: productId,
                name: translation?.name || 'Unknown Product',
                category: categoryTranslation?.name || 'Uncategorized',
                image: primaryImage?.url || '/images/placeholder.svg',
                price: Number(info.data.price),
                orderCount: info.count,
            };
        });

        return results;
    } catch (error) {
        console.error('Error fetching top products:', error);
        return [];
    }
}
