'use server';

import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

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
    createdAt: Date;
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
        // Get current month date range
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

        // Total products
        const totalProducts = await prisma.product.count({
            where: { isAvailable: true },
        });

        // Products from last month
        const lastMonthProducts = await prisma.product.count({
            where: {
                isAvailable: true,
                createdAt: {
                    lt: startOfMonth,
                },
            },
        });

        // Calculate products change
        const productsChange = lastMonthProducts > 0
            ? ((totalProducts - lastMonthProducts) / lastMonthProducts) * 100
            : 0;

        // Total orders this month
        const totalOrders = await prisma.order.count({
            where: {
                createdAt: {
                    gte: startOfMonth,
                },
            },
        });

        // Orders from last month
        const lastMonthOrders = await prisma.order.count({
            where: {
                createdAt: {
                    gte: startOfLastMonth,
                    lte: endOfLastMonth,
                },
            },
        });

        // Calculate orders change
        const ordersChange = lastMonthOrders > 0
            ? ((totalOrders - lastMonthOrders) / lastMonthOrders) * 100
            : 0;

        // Revenue this month
        const revenueResult = await prisma.order.aggregate({
            where: {
                createdAt: {
                    gte: startOfMonth,
                },
                status: {
                    in: ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'],
                },
            },
            _sum: {
                totalAmount: true,
            },
        });

        const revenue = revenueResult._sum.totalAmount
            ? parseFloat(revenueResult._sum.totalAmount.toString())
            : 0;

        // Revenue from last month
        const lastMonthRevenueResult = await prisma.order.aggregate({
            where: {
                createdAt: {
                    gte: startOfLastMonth,
                    lte: endOfLastMonth,
                },
                status: {
                    in: ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'],
                },
            },
            _sum: {
                totalAmount: true,
            },
        });

        const lastMonthRevenue = lastMonthRevenueResult._sum.totalAmount
            ? parseFloat(lastMonthRevenueResult._sum.totalAmount.toString())
            : 0;

        // Calculate revenue change
        const revenueChange = lastMonthRevenue > 0
            ? ((revenue - lastMonthRevenue) / lastMonthRevenue) * 100
            : 0;

        return {
            totalProducts,
            totalOrders,
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
        const orders = await prisma.order.findMany({
            take: limit,
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                customer: true,
            },
        });

        return orders.map((order) => ({
            id: order.id,
            reference: order.reference,
            customerName: `${order.customer.firstName} ${order.customer.lastName}`,
            totalAmount: parseFloat(order.totalAmount.toString()),
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
        // Get order items grouped by variant with count
        const topVariants = await prisma.orderItem.groupBy({
            by: ['variantId'],
            _count: {
                variantId: true,
            },
            orderBy: {
                _count: {
                    variantId: 'desc',
                },
            },
            take: limit,
        });

        // Fetch full product details for these variants
        const products = await Promise.all(
            topVariants.map(async (item) => {
                const variant = await prisma.productVariant.findUnique({
                    where: { id: item.variantId },
                    include: {
                        product: {
                            include: {
                                translations: true,
                                images: true,
                                category: {
                                    include: {
                                        translations: true,
                                    },
                                },
                            },
                        },
                    },
                });

                if (!variant || !variant.product) return null;

                const product = variant.product;
                const translation = product.translations.find((t) => t.language === 'en') || product.translations[0];
                const categoryTranslation = product.category.translations.find((t) => t.language === 'en') || product.category.translations[0];
                const primaryImage = product.images.find((img) => img.isPrimary) || product.images[0];

                return {
                    id: product.id,
                    name: translation?.name || 'Unknown Product',
                    category: categoryTranslation?.name || 'Uncategorized',
                    image: primaryImage?.url || '/placeholder.jpg',
                    price: parseFloat(variant.price.toString()),
                    orderCount: item._count.variantId,
                };
            })
        );

        return products.filter((p): p is TopProduct => p !== null);
    } catch (error) {
        console.error('Error fetching top products:', error);
        return [];
    }
}
