import { NextRequest, NextResponse } from "next/server";
import {
    Client,
    OrdersController,
    Environment,
} from "@paypal/paypal-server-sdk";
import { createOrder } from "@/features/admin/actions/order.actions";

/**
 * PayPal Payment API Route
 * 
 * Handles both client-side capture verification and server-side order creation.
 */

// Initialize PayPal Configuration from Environment Variables
const paypalClientId = process.env.PAYPAL_CLIENT_ID || "ASHlp4YnXU8iZ1q6czZhX8Xc1k2HsHooFqbTUk1VsCFUAanzz-J-mX6Y5pB0M53_oBap69CarTdEXSUM";
const paypalClientSecret = process.env.PAYPAL_CLIENT_SECRET || "";
const paypalMode = (process.env.PAYPAL_MODE || "sandbox") as "live" | "sandbox";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            customer,
            shippingAddress,
            items,
            total,
            paypalOrderId,
        } = body;

        // 1. Basic Validation
        if (!customer || !shippingAddress || !items || !total) {
            return NextResponse.json(
                { success: false, error: "Missing required fields" },
                { status: 400 }
            );
        }

        // 2. Initialize PayPal Client
        const paypalClient = new Client({
            clientCredentialsAuthCredentials: {
                oAuthClientId: paypalClientId,
                oAuthClientSecret: paypalClientSecret,
            },
            environment: paypalMode === "live" ? Environment.Production : Environment.Sandbox,
        });
        const ordersController = new OrdersController(paypalClient);

        // 3. Handle Captured Order (Verification)
        if (paypalOrderId) {
            try {
                // Verify the order status with PayPal
                const orderResponse = await ordersController.getOrder({ id: paypalOrderId });
                const orderResultData = orderResponse.result;

                const status = orderResultData?.status;

                if (status === "COMPLETED" || status === "APPROVED") {
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
                        paymentProvider: "PAYPAL",
                        paymentId: paypalOrderId,
                        orderNotes: customer.orderNotes,
                    });

                    if (!orderResult.success) {
                        return NextResponse.json(
                            { success: false, error: orderResult.error || "Failed to save order to database" },
                            { status: 500 }
                        );
                    }

                    return NextResponse.json({
                        success: true,
                        orderId: orderResult.orderId,
                        orderReference: orderResult.orderReference,
                        paypalOrderId: paypalOrderId,
                    });
                } else {
                    return NextResponse.json(
                        { success: false, error: `PayPal order status: ${status}. Expected COMPLETED.` },
                        { status: 400 }
                    );
                }
            } catch (verifyError: any) {
                console.error("PayPal order verification failed:", verifyError);
                return NextResponse.json(
                    { success: false, error: "Could not verify PayPal order with provider" },
                    { status: 400 }
                );
            }
        }

        // 4. Create New Order (Server-side initialization)
        else {
            const orderRequest: any = {
                intent: "CAPTURE",
                purchaseUnits: [
                    {
                        amount: {
                            currencyCode: "USD",
                            value: total.toFixed(2),
                        },
                        shipping: {
                            name: {
                                fullName: `${customer.firstName} ${customer.lastName}`,
                            },
                            address: {
                                addressLine1: shippingAddress.street,
                                adminArea2: shippingAddress.city,
                                adminArea1: shippingAddress.state,
                                postalCode: shippingAddress.postalCode,
                                countryCode: shippingAddress.country || "MA",
                            },
                        },
                        items: items.map((item: any) => ({
                            name: item.productName || "Product",
                            quantity: item.quantity.toString(),
                            unitAmount: {
                                currencyCode: "USD",
                                value: item.price.toFixed(2),
                            },
                        })),
                    },
                ],
                payer: {
                    name: {
                        givenName: customer.firstName,
                        surname: customer.lastName,
                    },
                    emailAddress: customer.email,
                },
                applicationContext: {
                    brandName: "Moroccan Organica",
                    shippingPreference: "SET_PROVIDED_ADDRESS",
                    userAction: "PAY_NOW",
                    returnUrl: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/checkout/success`,
                    cancelUrl: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/checkout`,
                },
            };

            const orderResponse = await ordersController.createOrder({
                body: orderRequest,
                prefer: "return=representation"
            });

            if (orderResponse.result?.id) {
                return NextResponse.json({
                    success: true,
                    paypalOrderId: orderResponse.result.id,
                    approvalUrl: orderResponse.result.links?.find(
                        (link: any) => link.rel === "approve"
                    )?.href,
                });
            } else {
                return NextResponse.json(
                    { success: false, error: "Failed to create PayPal order ID" },
                    { status: 500 }
                );
            }
        }
    } catch (error: any) {
        console.error("PayPal API Route Error:", error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || "An unexpected error occurred during PayPal processing"
            },
            { status: 500 }
        );
    }
}


