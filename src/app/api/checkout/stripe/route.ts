import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createOrder } from "@/actions/order.actions";

/**
 * Stripe Payment API Route
 * 
 * Handles Stripe payment processing with PaymentIntents.
 */

// Initialize Stripe with secret key from environment
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "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";
const stripe = new Stripe(stripeSecretKey, {
    apiVersion: "2025-12-15.clover",
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            customer,
            shippingAddress,
            items,
            total,
            paymentMethodId,
        } = body;

        // 1. Basic Validation
        if (!customer || !shippingAddress || !items || !total) {
            return NextResponse.json(
                { success: false, error: "Missing required fields" },
                { status: 400 }
            );
        }

        if (!paymentMethodId) {
            return NextResponse.json(
                { success: false, error: "Payment method ID is required" },
                { status: 400 }
            );
        }

        // 2. Create or retrieve Stripe Customer
        let stripeCustomer;
        try {
            const existingCustomers = await stripe.customers.list({
                email: customer.email,
                limit: 1,
            });

            if (existingCustomers.data.length > 0) {
                stripeCustomer = existingCustomers.data[0];
                // Update customer info if needed
                await stripe.customers.update(stripeCustomer.id, {
                    name: `${customer.firstName} ${customer.lastName}`,
                    phone: customer.phone,
                });
            } else {
                stripeCustomer = await stripe.customers.create({
                    email: customer.email,
                    name: `${customer.firstName} ${customer.lastName}`,
                    phone: customer.phone,
                    address: {
                        line1: shippingAddress.street,
                        city: shippingAddress.city,
                        state: shippingAddress.state,
                        postal_code: shippingAddress.postalCode,
                        country: shippingAddress.country || "MA",
                    },
                });
            }
        } catch (custError) {
            console.error("Stripe customer error:", custError);
            // Fallback to anonymous if customer creation fails, or handle error
        }

        // 3. Create Payment Intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(total * 100), // Convert to cents
            currency: "usd", // Consider making this dynamic or using MAD
            customer: stripeCustomer?.id,
            payment_method: paymentMethodId,
            off_session: false,
            confirm: true,
            // Stripe recommends using automatic_payment_methods instead of manual confirmation
            // but since we are confirming server-side with a paymentMethodId, this is correct for this flow.
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: 'always',
            },
            return_url: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/checkout/success`,
            metadata: {
                customer_email: customer.email,
                customer_name: `${customer.firstName} ${customer.lastName}`,
                items_count: items.length.toString(),
            },
            shipping: {
                name: `${customer.firstName} ${customer.lastName}`,
                address: {
                    line1: shippingAddress.street,
                    city: shippingAddress.city,
                    state: shippingAddress.state,
                    postal_code: shippingAddress.postalCode,
                    country: shippingAddress.country || "MA",
                },
            },
        });

        // 4. Handle payment status
        if (paymentIntent.status === "succeeded") {
            // Save order to database
            const orderResult = await createOrder({
                customer: {
                    email: customer.email,
                    firstName: customer.firstName,
                    lastName: customer.lastName,
                    phone: customer.phone,
                    companyName: customer.companyName,
                },
                shippingAddress: {
                    street: shippingAddress.street,
                    city: shippingAddress.city,
                    state: shippingAddress.state,
                    postalCode: shippingAddress.postalCode,
                    country: shippingAddress.country,
                },
                items: items.map((item: any) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price,
                    productName: item.productName || "Product",
                    productNameAr: item.productNameAr,
                })),
                totalAmount: total,
                paymentProvider: "STRIPE",
                paymentId: paymentIntent.id,
                orderNotes: customer.orderNotes,
            });

            if (!orderResult.success) {
                // IMPORTANT: Payment succeeded but DB failed. Log this for manual intervention!
                console.error("FATAL: Stripe payment succeeded but order creation failed:", orderResult.error);
                return NextResponse.json(
                    {
                        success: true,
                        orderSucceeded: false,
                        paymentIntentId: paymentIntent.id,
                        error: "Payment successful but failed to save order. Our team will contact you."
                    },
                    { status: 200 } // Still return 200 because payment was taken
                );
            }

            return NextResponse.json({
                success: true,
                orderId: orderResult.orderId,
                orderReference: orderResult.orderReference,
                paymentIntentId: paymentIntent.id,
            });
        } else if (paymentIntent.status === "requires_action" || paymentIntent.status === "requires_confirmation") {
            // 3D Secure or other action required
            return NextResponse.json({
                success: false,
                requiresAction: true,
                clientSecret: paymentIntent.client_secret,
            });
        } else {
            return NextResponse.json(
                {
                    success: false,
                    error: `Payment failed with status: ${paymentIntent.status}`,
                },
                { status: 400 }
            );
        }
    } catch (error: any) {
        console.error("Stripe API Route Error:", error);

        if (error instanceof Stripe.errors.StripeError) {
            return NextResponse.json(
                { success: false, error: error.message },
                { status: error.statusCode || 400 }
            );
        }

        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : "An unexpected error occurred with Stripe"
            },
            { status: 500 }
        );
    }
}

