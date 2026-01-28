"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

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
        // Find or create customer
        const customer = await prisma.customer.upsert({
            where: { email: input.customer.email },
            update: {
                firstName: input.customer.firstName,
                lastName: input.customer.lastName,
                phone: input.customer.phone,
                companyName: input.customer.companyName,
                lastOrderDate: new Date(),
            },
            create: {
                email: input.customer.email,
                firstName: input.customer.firstName,
                lastName: input.customer.lastName,
                phone: input.customer.phone,
                companyName: input.customer.companyName,
                lastOrderDate: new Date(),
            },
        });

        // Create shipping address
        const address = await prisma.address.create({
            data: {
                customerId: customer.id,
                addressLine1: input.shippingAddress.street,
                city: input.shippingAddress.city,
                postalCode: input.shippingAddress.postalCode,
                country: input.shippingAddress.country,
                phone: input.customer.phone,
            },
        });

        // Generate order reference
        let orderReference = generateOrderReference();
        let attempts = 0;
        while (attempts < 10) {
            const existing = await prisma.order.findUnique({
                where: { reference: orderReference },
            });
            if (!existing) break;
            orderReference = generateOrderReference();
            attempts++;
        }

        // Resolve items and variants before creating the order
        const orderItemsData = await Promise.all(input.items.map(async (item) => {
            // Find a valid variant for this product
            // Check if item.productId is a variant ID or a base product ID
            let variant = await prisma.productVariant.findFirst({
                where: {
                    OR: [
                        { id: item.productId },
                        { productId: item.productId }
                    ]
                }
            });

            if (!variant) {
                // If still not found, try to find by SKU if productId happens to be SKU
                variant = await prisma.productVariant.findUnique({
                    where: { sku: item.productId }
                });
            }

            if (!variant) {
                throw new Error(`No valid variant found for: ${item.productId}`);
            }

            return {
                variantId: variant.id,
                productNameSnapshot: item.productName,
                variantNameSnapshot: variant.sizeName || item.productName,
                priceSnapshot: new Prisma.Decimal(item.price),
                quantity: item.quantity,
            };
        }));

        // Create order with resolved items
        const order = await prisma.order.create({
            data: {
                reference: orderReference,
                customerId: customer.id,
                shippingAddressId: address.id,
                totalAmount: new Prisma.Decimal(input.totalAmount),
                paymentProvider: input.paymentProvider,
                paymentId: input.paymentId,
                status: "PENDING",
                items: {
                    create: orderItemsData
                },
            },
            include: {
                customer: true,
                shippingAddress: true,
                items: true,
            },
        });

        // Update customer total spent
        await prisma.customer.update({
            where: { id: customer.id },
            data: {
                totalSpent: {
                    increment: new Prisma.Decimal(input.totalAmount),
                },
            },
        });

        return {
            success: true,
            orderId: order.id,
            orderReference: order.reference,
        };
    } catch (error) {
        console.error("Error creating order:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to create order",
        };
    }
}
