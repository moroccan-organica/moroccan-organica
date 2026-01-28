"use client";

import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import type { CreateOrderActions, OnApproveActions, OnApproveData, CreateOrderData } from "@paypal/paypal-js";

interface PayPalButtonsWrapperProps {
    total: number;
    disabled: boolean;
    onApprove: (data: OnApproveData, actions: OnApproveActions) => Promise<void>;
    onError: (err: Record<string, unknown>) => void;
    onCancel: () => void;
}

export function PayPalButtonsWrapper({
    total,
    disabled,
    onApprove,
    onError,
    onCancel,
}: PayPalButtonsWrapperProps) {
    const [{ isPending, isResolved, isRejected }] = usePayPalScriptReducer();

    if (isPending) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-2 text-sm text-muted-foreground">Loading PayPal...</span>
            </div>
        );
    }

    if (isRejected) {
        return (
            <div className="text-sm text-destructive p-4 bg-destructive/10 rounded">
                Failed to load PayPal. Please refresh the page or try a different payment method.
            </div>
        );
    }

    if (!isResolved) {
        return null;
    }

    return (
        <PayPalButtons
            style={{
                layout: "vertical",
                color: "gold",
                shape: "rect",
                label: "paypal",
            }}
            disabled={disabled}
            createOrder={(_data: CreateOrderData, actions: CreateOrderActions) => {
                return actions.order.create({
                    intent: "CAPTURE",
                    purchase_units: [{
                        amount: {
                            currency_code: "USD",
                            value: total.toFixed(2),
                        },
                    }],
                });
            }}
            onApprove={onApprove}
            onError={onError}
            onCancel={onCancel}
        />
    );
}
