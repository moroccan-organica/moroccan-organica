"use client";

import { useImperativeHandle, forwardRef, useState } from "react";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
    "pk_live_51R6wPIIyF1N47bdozKFkx0sumpCfUqrWwRJsoefO3SD1MNxgjOYlYN7MOwVHfrGv6Pe9xXmdYfgxn7GKFcIZyehI003HAqMx6I"
);

export interface StripeElementsHandle {
    createPaymentMethod: (billingDetails?: {
        name: string;
        email: string;
        phone?: string;
        address?: {
            line1: string;
            city: string;
            state: string;
            postal_code: string;
            country: string;
        }
    }) => Promise<string | null>;
}

interface StripeElementsProps {
    amount: number;
    onPaymentMethodCreated: (paymentMethodId: string) => void;
    onError: (error: string) => void;
}

const StripePaymentForm = forwardRef<StripeElementsHandle, Omit<StripeElementsProps, "amount">>(
    ({ onPaymentMethodCreated, onError }, ref) => {
        const stripe = useStripe();
        const elements = useElements();
        const [error, setError] = useState<string | null>(null);
        const [isReady, setIsReady] = useState(false);

        const createPaymentMethod = async (billingDetails?: {
            name: string;
            email: string;
            phone?: string;
            address?: {
                line1: string;
                city: string;
                state: string;
                postal_code: string;
                country: string;
            }
        }): Promise<string | null> => {
            if (!stripe || !elements) {
                const errorMsg = "Stripe not initialized. Please wait a moment and try again.";
                setError(errorMsg);
                onError(errorMsg);
                return null;
            }

            // Get the PaymentElement
            const paymentElement = elements.getElement('payment');
            if (!paymentElement) {
                const errorMsg = "Payment form not ready. Please wait a moment and try again.";
                setError(errorMsg);
                onError(errorMsg);
                return null;
            }

            setError(null);

            try {
                // Submit the form to validate (logic validation)
                const { error: submitError } = await elements.submit();
                if (submitError) {
                    const errorMsg = submitError.message || "An error occurred";
                    setError(errorMsg);
                    onError(errorMsg);
                    return null;
                }

                // Create payment method with billing details
                // Since we hidden fields in the UI (billingDetails: "never"), we MUST pass them here.
                const { error: createError, paymentMethod } = await stripe.createPaymentMethod({
                    elements,
                    params: {
                        billing_details: billingDetails,
                    },
                });

                if (createError) {
                    const errorMsg = createError.message || "Failed to create payment method";
                    setError(errorMsg);
                    onError(errorMsg);
                    return null;
                }

                if (paymentMethod) {
                    onPaymentMethodCreated(paymentMethod.id);
                    return paymentMethod.id;
                }

                return null;
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
                setError(errorMessage);
                onError(errorMessage);
                return null;
            }
        };

        useImperativeHandle(ref, () => ({
            createPaymentMethod,
        }));

        // Wait for Stripe and Elements to be ready
        if (!stripe || !elements) {
            return (
                <div className="space-y-4">
                    <div className="p-6 border-2 border-dashed rounded-lg bg-slate-50 flex items-center justify-center min-h-[200px]">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#606C38] mx-auto mb-2"></div>
                            <p className="text-sm text-muted-foreground">Loading payment form...</p>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="space-y-4 w-full">
                {!isReady && (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
                        Please enter your card details below
                    </div>
                )}
                <div className="min-h-[200px] w-full">
                    <PaymentElement
                        onReady={() => {
                            setIsReady(true);
                        }}
                        options={{
                            layout: "tabs",
                            fields: {
                                billingDetails: {
                                    name: "never",
                                    email: "never",
                                    phone: "never",
                                    address: "never",
                                },
                            },
                        }}
                    />
                </div>
                {error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
            </div>
        );
    }
);

StripePaymentForm.displayName = "StripePaymentForm";

export const StripeElements = forwardRef<StripeElementsHandle, StripeElementsProps>(
    ({ amount, onPaymentMethodCreated, onError }, ref) => {
        const options: StripeElementsOptions = {
            mode: "payment",
            amount: Math.round(amount * 100), // Convert to cents
            currency: "usd",
            paymentMethodCreation: "manual", // Required for createPaymentMethod
            appearance: {
                theme: "stripe",
            },
        };

        return (
            <Elements stripe={stripePromise} options={options}>
                <StripePaymentForm
                    ref={ref}
                    onPaymentMethodCreated={onPaymentMethodCreated}
                    onError={onError}
                />
            </Elements>
        );
    }
);

StripeElements.displayName = "StripeElements";
