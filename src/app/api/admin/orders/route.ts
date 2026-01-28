import { prisma } from '@/lib/queries';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const orders = await prisma.order.findMany({
            include: {
                customer: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    }
                },
                shippingAddress: {
                    select: {
                        country: true,
                        city: true,
                    }
                },
                items: {
                    select: {
                        id: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Transform decimal to number for JSON response
        const formattedOrders = orders.map(order => ({
            id: order.id,
            reference: order.reference,
            createdAt: order.createdAt,
            status: order.status,
            totalAmount: Number(order.totalAmount),
            customer: order.customer,
            shippingAddress: order.shippingAddress,
            itemsCount: order.items.length
        }));

        return NextResponse.json(formattedOrders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json(
            { error: 'Failed to fetch orders' },
            { status: 500 }
        );
    }
}
