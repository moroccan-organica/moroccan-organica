"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const STORAGE_KEY = "paypal_checkout_data";
const POPUP_WIDTH = 500;
const POPUP_HEIGHT = 700;

interface PayPalRedirectButtonProps {
    orderData: {
        customer: any;
        shippingAddress: any;
        items: any[];
        total: number;
        lang?: string;
    };
    disabled: boolean;
    onClick: () => Promise<boolean>;
    onError: (err: string) => void;
    onSuccess?: (orderId: string) => void;
    label?: string;
}

export function PayPalRedirectButton({
    orderData,
    disabled,
    onClick,
    onError,
    onSuccess,
    label = "Pay with PayPal",
}: PayPalRedirectButtonProps) {
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const handleMessage = (e: MessageEvent) => {
            if (e.data?.type === "PAYPAL_COMPLETE" && e.origin === window.location.origin) {
                const { orderId } = e.data;
                setIsLoading(false);
                if (orderId) onSuccess?.(orderId);
            }
        };
        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, [onSuccess]);

    const handleClick = async () => {
        if (disabled || isLoading) return;
        const isValid = await onClick();
        if (!isValid) return;

        setIsLoading(true);
        onError("");

        try {
            const response = await fetch("/api/checkout/paypal", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(orderData),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.error || "Failed to create PayPal order");
            }

            const approvalUrl = result.approvalUrl;
            if (!approvalUrl) {
                throw new Error("No approval URL received from PayPal");
            }

            if (typeof sessionStorage !== "undefined") {
                sessionStorage.setItem(STORAGE_KEY, JSON.stringify(orderData));
            }

            const left = Math.round((window.screen.width - POPUP_WIDTH) / 2);
            const top = Math.round((window.screen.height - POPUP_HEIGHT) / 2);
            const popup = window.open(
                approvalUrl,
                "paypal_checkout",
                `width=${POPUP_WIDTH},height=${POPUP_HEIGHT},left=${left},top=${top},scrollbars=yes,resizable=yes`
            );
            const checkClosed = setInterval(() => {
                if (popup?.closed) {
                    clearInterval(checkClosed);
                    setIsLoading(false);
                }
            }, 500);
        } catch (err) {
            setIsLoading(false);
            onError(err instanceof Error ? err.message : "PayPal error");
        }
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={disabled || isLoading}
            className="w-full flex items-center justify-center gap-3 py-3 px-6 rounded-lg bg-[#ffc439] hover:bg-[#f0bb2e] disabled:opacity-60 disabled:cursor-not-allowed transition-colors font-medium text-[#1b1f23]"
        >
            {isLoading ? (
                <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#1b1f23] border-t-transparent" />
                    <span>Opening PayPal...</span>
                </>
            ) : (
                <>
                    <Image
                        src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg"
                        alt="PayPal"
                        width={44}
                        height={28}
                        className="object-contain"
                    />
                    <span>{label}</span>
                </>
            )}
        </button>
    );
}
