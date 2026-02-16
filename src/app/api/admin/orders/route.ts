import { supabase } from '@/lib/supabase/client';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const { data: orders, error } = await supabase
            .from('Order')
            .select(`
                *,
                customer:Customer(id, firstName, lastName, email),
                address:Address(country, city),
                items:OrderItem(
                    id, 
                    quantity, 
                    priceSnapshot, 
                    productNameSnapshot, 
                    variantNameSnapshot,
                    variant:ProductVariant(
                        product:Product(
                            images:ProductImage(*)
                        )
                    )
                )
            `)
            .order('createdAt', { ascending: false });

        if (error) throw error;

        // Transform data for JSON response
        const formattedOrders = (orders || []).map((order: any) => ({
            id: order.id,
            reference: order.reference,
            createdAt: order.createdAt,
            status: order.status,
            totalAmount: Number(order.totalAmount),
            customer: order.customer,
            shippingAddress: order.address,
            itemsCount: order.items?.length || 0,
            items: (order.items || []).map((item: any) => ({
                id: item.id,
                name: item.productNameSnapshot,
                variantName: item.variantNameSnapshot,
                price: Number(item.priceSnapshot),
                quantity: item.quantity,
                image: item.variant?.product?.images?.[0]?.url || null
            }))
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
