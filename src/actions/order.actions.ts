"use server";

import { supabase } from "@/lib/supabase";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

async function checkAdmin() {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
        throw new Error('Unauthorized');
    }
    return session;
}

interface CreateOrderInput {
    customer: {
        email: string;
        firstName: string;
        lastName: string;
        phone: string;
        companyName?: string;
    };
    shippingAddress: {
        street: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
    };
    items: Array<{
        productId: string;
        quantity: number;
        price: number;
        productName: string;
        productNameAr?: string;
    }>;
    totalAmount: number;
    paymentProvider: "STRIPE" | "PAYPAL";
    paymentId: string;
    orderNotes?: string;
}

/**
 * Generate order reference (MO-YYYY-XXX format)
 */
function generateOrderReference(): string {
    const year = new Date().getFullYear();
    const random = Math.random().toString(36).substring(2, 9).toUpperCase();
    return `MO-${year}-${random}`;
}

/**
 * Create a new order in the database
 */
export async function createOrder(input: CreateOrderInput): Promise<{
    success: boolean;
    orderId?: string;
    orderReference?: string;
    error?: string;
}> {
    try {
        const { data: customer, error: customerError } = await supabase
            .from('Customer')
            .upsert({
                email: input.customer.email,
                firstName: input.customer.firstName,
                lastName: input.customer.lastName,
                phone: input.customer.phone,
                companyName: input.customer.companyName,
                lastOrderDate: new Date().toISOString(),
            }, { onConflict: 'email' })
            .select()
            .single();

        if (customerError) throw customerError;

        const { data: address, error: addressError } = await supabase
            .from('Address')
            .insert({
                customerId: customer.id,
                addressLine1: input.shippingAddress.street,
                city: input.shippingAddress.city,
                postalCode: input.shippingAddress.postalCode,
                country: input.shippingAddress.country,
                phone: input.customer.phone,
            })
            .select()
            .single();

        if (addressError) throw addressError;

        let orderReference = generateOrderReference();
        let attempts = 0;
        while (attempts < 10) {
            const { data: existing } = await supabase
                .from('Order')
                .select('id')
                .eq('reference', orderReference)
                .maybeSingle();
            if (!existing) break;
            orderReference = generateOrderReference();
            attempts++;
        }

        const orderItemsData = await Promise.all(input.items.map(async (item) => {
            let { data: variant, error: varError } = await supabase
                .from('ProductVariant')
                .select('id, sizeName')
                .or(`id.eq.${item.productId},productId.eq.${item.productId}`)
                .limit(1)
                .maybeSingle();

            if (!variant) {
                const { data: vBySku } = await supabase
                    .from('ProductVariant')
                    .select('id, sizeName')
                    .eq('sku', item.productId)
                    .maybeSingle();
                variant = vBySku;
            }

            if (!variant) {
                throw new Error(`No valid variant found for: ${item.productId}`);
            }

            return {
                variantId: variant.id,
                productNameSnapshot: item.productName,
                variantNameSnapshot: variant.sizeName || item.productName,
                priceSnapshot: item.price,
                quantity: item.quantity,
            };
        }));

        const { data: order, error: orderError } = await supabase
            .from('Order')
            .insert({
                reference: orderReference,
                customerId: customer.id,
                shippingAddressId: address.id,
                totalAmount: input.totalAmount,
                paymentProvider: input.paymentProvider,
                paymentId: input.paymentId,
                status: "PENDING",
            })
            .select()
            .single();

        if (orderError) throw orderError;

        const { error: itemsError } = await supabase
            .from('OrderItem')
            .insert(orderItemsData.map(item => ({
                ...item,
                orderId: order.id
            })));

        if (itemsError) throw itemsError;

        await supabase
            .from('Customer')
            .update({
                totalSpent: (customer.totalSpent || 0) + input.totalAmount
            })
            .eq('id', customer.id);

        return {
            success: true,
            orderId: order.id,
            orderReference: order.reference,
        };
    } catch (error: any) {
        console.error("Error creating order:", error);
        return {
            success: false,
            error: error.message || "Failed to create order",
        };
    }
}

/**
 * Get all orders (ADMIN ONLY)
 */
export async function getOrders() {
    await checkAdmin();

    try {
        const { data: orders, error } = await supabase
            .from('Order')
            .select(`
                *,
                customer:Customer(*),
                address:Address(*),
                items:OrderItem(*)
            `)
            .order('createdAt', { ascending: false });

        if (error) throw error;

        // Map to expected AdminOrder structure if needed
        return (orders || []).map((o: any) => ({
            ...o,
            itemsCount: o.items?.length || 0,
            shippingAddress: o.address,
            // Nested items might need image mapping if stored elsewhere
            items: o.items?.map((item: any) => ({
                ...item,
                name: item.productNameSnapshot,
                variantName: item.variantNameSnapshot,
                price: Number(item.priceSnapshot),
                // image: ... (might need to fetch from ProductImage if needed)
            }))
        }));
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw new Error('Failed to fetch orders');
    }
}

/**
 * Update order status (ADMIN ONLY)
 */
export async function updateOrderStatus(id: string, status: string) {
    await checkAdmin();

    try {
        const { data, error } = await supabase
            .from('Order')
            .update({ status })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        revalidatePath('/[lang]/admin/orders');
        return { success: true, data };
    } catch (error: any) {
        console.error('Error updating order:', error);
        return { success: false, error: error.message };
    }
}
