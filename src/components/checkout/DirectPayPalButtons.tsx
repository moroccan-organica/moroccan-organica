"use client";

import { useEffect, useState } from "react";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";

interface DirectPayPalButtonsProps {
    total: number;
    disabled: boolean;
    isReady?: boolean; // Made optional as internal hook handles state now
    onApprove: (orderId: string) => Promise<void>;
    onError: (err: any) => void;
    onCancel?: () => void;
    onClick?: () => Promise<boolean>;
}

export function DirectPayPalButtons({
    total,
    disabled,
    onApprove,
    onError,
    onCancel,
    onClick,
}: DirectPayPalButtonsProps) {
    const [{ isPending, isResolved, isRejected }] = usePayPalScriptReducer();
    const [isSdkReady, setIsSdkReady] = useState(false);

    useEffect(() => {
        if (isResolved && window?.paypal?.Buttons) {
            setIsSdkReady(true);
        }
    }, [isResolved, isPending]);

    if (isRejected) {
        return (
            <div className="p-4 border border-destructive/20 bg-destructive/10 rounded-lg text-destructive text-sm">
                Failed to load PayPal SDK. Please refresh the page or use another payment method.
            </div>
        );
    }

    if (!isSdkReady || isPending) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-2 text-sm text-muted-foreground">Loading PayPal...</span>
            </div>
        );
    }

    return (
        <div className="min-h-[150px] w-full relative z-0">
            <PayPalButtons
                style={{
                    layout: "vertical",
                    color: "gold",
                    shape: "rect",
                    label: "paypal",
                    height: 45,
                }}
                disabled={disabled}
                forceReRender={[total]} // Re-render buttons if total changes
                onClick={async (data, actions) => {
                    if (onClick) {
                        const isValid = await onClick();
                        if (!isValid) {
                            return actions.reject();
                        }
                    }
                    return actions.resolve();
                }}
                createOrder={(_data, actions) => {

                    return actions.order.create({
                        intent: "CAPTURE",
                        purchase_units: [
                            {
                                amount: {
                                    currency_code: "USD",
                                    value: total.toFixed(2),
                                },
                            },
                        ],
                    });
                }}
                onApprove={async (_data, actions) => {

                    if (!actions.order) return;
                    try {
                        const order = await actions.order.capture();
                        await onApprove(order.id || "");
                    } catch (error) {
                        console.error("Error capturing PayPal order:", error);
                        onError(error);
                    }
                }}
                onError={(err) => {
                    console.error("PayPal button error:", err);
                    onError(err);
                }}
                onCancel={() => {

                    if (onCancel) onCancel();
                }}
            />
        </div>
    );
}
