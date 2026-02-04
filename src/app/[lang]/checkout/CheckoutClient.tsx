"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCart } from "@/components/shop/CartContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard, Lock, ShoppingBag, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { StripeElements, type StripeElementsHandle } from "@/components/checkout/StripeElements";
import { DirectPayPalButtons } from "@/components/checkout/DirectPayPalButtons";
import { useRef } from "react";

const checkoutSchema = z.object({
    // Customer Info
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),

    // Shipping Address
    street: z.string().min(5, "Street address must be at least 5 characters"),
    city: z.string().min(2, "City must be at least 2 characters"),
    state: z.string().min(2, "State/Province must be at least 2 characters"),
    postalCode: z.string().min(4, "Postal code must be at least 4 characters"),
    country: z.string().min(2, "Country must be at least 2 characters"),

    // Order Notes
    orderNotes: z.string().optional(),

    // Payment Method
    paymentMethod: z.enum(["stripe", "paypal"]),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

interface CheckoutDictionary {
    emptyCart: string;
    backToShop: string;
    title: string;
    customerInfo: {
        title: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
    };
    shippingAddress: {
        title: string;
        street: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
    };
    orderNotes: {
        title: string;
        placeholder: string;
    };
    paymentMethod: {
        title: string;
        stripe: {
            label: string;
            description: string;
        };
        paypal: {
            label: string;
            description: string;
        };
        cardNumber: string;
        cardExpiry: string;
        cardCvc: string;
        cardName: string;
    };
    processing: string;
    completeOrder: string;
    terms: string;
    termsLink: string;
    and: string;
    privacyLink: string;
    orderSummary: {
        title: string;
        subtotal: string;
        shipping: string;
        tax: string;
        total: string;
    };
}

interface CheckoutClientProps {
    dict: CheckoutDictionary;
    lang: string;
}

export function CheckoutClient({ dict, lang }: CheckoutClientProps) {
    const router = useRouter();
    const { items, totalPrice, clearCart } = useCart();
    const [isProcessing, setIsProcessing] = useState(false);
    const isRTL = lang === "ar";

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        trigger,
        formState: { errors },
    } = useForm<CheckoutFormData>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            paymentMethod: "stripe",
        },
    });

    const paymentMethod = watch("paymentMethod");
    const subtotal = totalPrice;
    const shipping = 0.00; // Free shipping
    const tax = subtotal * 0.10; // 10% tax
    const total = subtotal + shipping + tax;
    const [, setStripePaymentMethodId] = useState<string | null>(null);
    const [stripeError, setStripeError] = useState<string | null>(null);
    const [paypalError, setPaypalError] = useState<string | null>(null);
    const stripeElementsRef = useRef<StripeElementsHandle>(null);

    // Helper to convert country names to ISO codes
    const getCountryCode = (country: string) => {
        const c = country?.toLowerCase() || "";
        if (c === "maroc" || c === "morocco" || c === "المغرب" || c === "ma") return "MA";
        if (c === "france" || c === "fr") return "FR";
        return "MA";
    };

    const onSubmit = async (data: CheckoutFormData) => {
        if (items.length === 0) {
            return;
        }

        // For PayPal, the payment is handled by the PayPal button
        if (data.paymentMethod === "paypal") {
            return;
        }

        // For Stripe, create payment method first
        if (data.paymentMethod === "stripe") {
            setIsProcessing(true);
            setStripeError(null);

            const countryCode = getCountryCode(data.country);

            try {
                // Create payment method using Stripe Elements
                const paymentMethodId = await stripeElementsRef.current?.createPaymentMethod({
                    name: `${data.firstName} ${data.lastName}`,
                    email: data.email,
                    phone: data.phone,
                    address: {
                        line1: data.street,
                        city: data.city,
                        state: data.state,
                        postal_code: data.postalCode,
                        country: countryCode,
                    }
                });

                if (!paymentMethodId) {
                    setIsProcessing(false);
                    return;
                }

                // Prepare order data
                const orderData = {
                    customer: {
                        firstName: data.firstName,
                        lastName: data.lastName,
                        email: data.email,
                        phone: data.phone,
                        orderNotes: data.orderNotes,
                    },
                    shippingAddress: {
                        street: data.street,
                        city: data.city,
                        state: data.state,
                        postalCode: data.postalCode,
                        country: data.country, // Keep original for DB
                    },
                    items: items.map((item) => ({
                        productId: item.product.id,
                        quantity: item.quantity,
                        price: item.product.price,
                        productName: isRTL ? item.product.nameAr : item.product.name,
                        productNameAr: item.product.nameAr,
                    })),
                    total: total,
                    paymentMethodId: paymentMethodId,
                };

                // Call the Stripe payment API
                const response = await fetch(`/api/checkout/stripe`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(orderData),
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    // Clear cart and redirect to success page
                    clearCart();
                    router.push(`/${lang}/checkout/success?orderId=${result.orderId || result.orderReference}`);
                } else if (result.requiresAction) {
                    // Handle 3D Secure or other actions
                    setStripeError(isRTL ? "يرجى إكمال المصادقة" : "Please complete authentication");
                } else {
                    throw new Error(result.error || "Payment failed");
                }
            } catch (error) {
                console.error("Checkout error:", error);
                setStripeError(error instanceof Error ? error.message : (isRTL ? "حدث خطأ أثناء معالجة الطلب" : "An error occurred"));
            } finally {
                setIsProcessing(false);
            }
        }
    };

    // Handle PayPal payment success
    const handlePayPalApprove = async (paypalOrderId: string) => {
        setIsProcessing(true);
        setPaypalError(null);
        try {
            // Prepare order data
            const formData = watch();
            const countryCode = getCountryCode(formData.country);

            const orderData = {
                customer: {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    phone: formData.phone,
                    orderNotes: formData.orderNotes,
                },
                shippingAddress: {
                    street: formData.street,
                    city: formData.city,
                    state: formData.state,
                    postalCode: formData.postalCode,
                    country: countryCode,
                },
                items: items.map((item) => ({
                    productId: item.product.id,
                    quantity: item.quantity,
                    price: item.product.price,
                    productName: isRTL ? item.product.nameAr : item.product.name,
                    productNameAr: item.product.nameAr,
                })),
                total: total,
                paypalOrderId: paypalOrderId,
            };

            const response = await fetch("/api/checkout/paypal", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(orderData),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                clearCart();
                router.push(`/${lang}/checkout/success?orderId=${result.orderId || result.orderReference}`);
            } else {
                throw new Error(result.error || "Payment failed");
            }
        } catch (error) {
            console.error("PayPal processing error:", error);
            setPaypalError(isRTL ? "حدث خطأ أثناء معالجة الدفع" : "An error occurred processing payment");
        } finally {
            setIsProcessing(false);
        }
    };



    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16 min-h-screen flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6 text-center">
                        <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                        <h2 className="text-2xl font-bold mb-2">
                            {dict.emptyCart || "Your cart is empty"}
                        </h2>
                        <p className="text-muted-foreground mb-6">
                            {isRTL ? "أضف منتجات إلى سلة التسوق قبل إتمام الطلب" : "Add products to your cart before checkout"}
                        </p>
                        <Link href={`/${lang}/shop`}>
                            <Button className="w-full">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                {dict.backToShop || "Back to Shop"}
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">
                    {dict.title || "Checkout"}
                </h1>

                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Forms */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Customer Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {dict.customerInfo?.title || "Customer Information"}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="firstName">
                                            {dict.customerInfo?.firstName || "First Name"}
                                        </Label>
                                        <Input
                                            id="firstName"
                                            {...register("firstName")}
                                            className={errors.firstName ? "border-destructive" : ""}
                                        />
                                        {errors.firstName && (
                                            <p className="text-sm text-destructive mt-1">
                                                {errors.firstName.message}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <Label htmlFor="lastName">
                                            {dict.customerInfo?.lastName || "Last Name"}
                                        </Label>
                                        <Input
                                            id="lastName"
                                            {...register("lastName")}
                                            className={errors.lastName ? "border-destructive" : ""}
                                        />
                                        {errors.lastName && (
                                            <p className="text-sm text-destructive mt-1">
                                                {errors.lastName.message}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="email">
                                        {dict.customerInfo?.email || "Email Address"}
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        {...register("email")}
                                        className={errors.email ? "border-destructive" : ""}
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-destructive mt-1">
                                            {errors.email.message}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="phone">
                                        {dict.customerInfo?.phone || "Phone Number"}
                                    </Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        {...register("phone")}
                                        className={errors.phone ? "border-destructive" : ""}
                                    />
                                    {errors.phone && (
                                        <p className="text-sm text-destructive mt-1">
                                            {errors.phone.message}
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Shipping Address */}
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {dict.shippingAddress?.title || "Shipping Address"}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="street">
                                        {dict.shippingAddress?.street || "Street Address"}
                                    </Label>
                                    <Input
                                        id="street"
                                        {...register("street")}
                                        className={errors.street ? "border-destructive" : ""}
                                    />
                                    {errors.street && (
                                        <p className="text-sm text-destructive mt-1">
                                            {errors.street.message}
                                        </p>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="city">
                                            {dict.shippingAddress?.city || "City"}
                                        </Label>
                                        <Input
                                            id="city"
                                            {...register("city")}
                                            className={errors.city ? "border-destructive" : ""}
                                        />
                                        {errors.city && (
                                            <p className="text-sm text-destructive mt-1">
                                                {errors.city.message}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <Label htmlFor="state">
                                            {dict.shippingAddress?.state || "State/Province"}
                                        </Label>
                                        <Input
                                            id="state"
                                            {...register("state")}
                                            className={errors.state ? "border-destructive" : ""}
                                        />
                                        {errors.state && (
                                            <p className="text-sm text-destructive mt-1">
                                                {errors.state.message}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="postalCode">
                                            {dict.shippingAddress?.postalCode || "Postal Code"}
                                        </Label>
                                        <Input
                                            id="postalCode"
                                            {...register("postalCode")}
                                            className={errors.postalCode ? "border-destructive" : ""}
                                        />
                                        {errors.postalCode && (
                                            <p className="text-sm text-destructive mt-1">
                                                {errors.postalCode.message}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <Label htmlFor="country">
                                            {dict.shippingAddress?.country || "Country"}
                                        </Label>
                                        <Select
                                            value={watch("country") || ""}
                                            onValueChange={(value) => setValue("country", value)}
                                        >
                                            <SelectTrigger
                                                id="country"
                                                className={errors.country ? "border-destructive" : ""}
                                            >
                                                <SelectValue placeholder="Select a country" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Morocco">Morocco</SelectItem>
                                                <SelectItem value="Netherlands">Netherlands</SelectItem>
                                                <SelectItem value="India">India</SelectItem>
                                                <SelectItem value="Ireland">Ireland</SelectItem>
                                                <SelectItem value="KSA">KSA (Saudi Arabia)</SelectItem>
                                                <SelectItem value="UAE">UAE (United Arab Emirates)</SelectItem>
                                                <SelectItem value="Poland">Poland</SelectItem>
                                                <SelectItem value="China">China</SelectItem>
                                                <SelectItem value="France">France</SelectItem>
                                                <SelectItem value="Spain">Spain</SelectItem>
                                                <SelectItem value="Other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.country && (
                                            <p className="text-sm text-destructive mt-1">
                                                {errors.country.message}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Order Notes */}
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {dict.orderNotes?.title || "Order Notes (Optional)"}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Textarea
                                    {...register("orderNotes")}
                                    placeholder={dict.orderNotes?.placeholder || "Special instructions, delivery notes, etc."}
                                    className="min-h-[100px] resize-y"
                                />
                            </CardContent>
                        </Card>

                        {/* Payment Method */}
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {dict.paymentMethod?.title || "Payment Method"}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <RadioGroup
                                    value={paymentMethod}
                                    onValueChange={(value) => setValue("paymentMethod", value as "stripe" | "paypal")}
                                >
                                    {/* Stripe Option */}
                                    <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                        <RadioGroupItem value="stripe" id="stripe" className="mt-1" />
                                        <Label
                                            htmlFor="stripe"
                                            className="flex-1 cursor-pointer"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="font-semibold">
                                                        {dict.paymentMethod?.stripe?.label || "Credit/Debit Card"}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {dict.paymentMethod?.stripe?.description || "Pay securely with Stripe"}
                                                    </div>
                                                </div>
                                                <div className="text-sm font-semibold text-muted-foreground">
                                                    Stripe
                                                </div>
                                            </div>
                                        </Label>
                                    </div>

                                    {/* PayPal Option */}
                                    <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                        <RadioGroupItem value="paypal" id="paypal" className="mt-1" />
                                        <Label
                                            htmlFor="paypal"
                                            className="flex-1 cursor-pointer"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="font-semibold">
                                                        {dict.paymentMethod?.paypal?.label || "PayPal"}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {dict.paymentMethod?.paypal?.description || "Pay with your PayPal account"}
                                                    </div>
                                                </div>
                                                <div className="w-16 h-8 relative">
                                                    <Image
                                                        src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg"
                                                        alt="PayPal"
                                                        fill
                                                        sizes="64px"
                                                        className="object-contain"
                                                    />
                                                </div>
                                            </div>
                                        </Label>
                                    </div>
                                </RadioGroup>

                                {/* Stripe Card Details */}
                                {paymentMethod === "stripe" && (
                                    <div className="mt-6 p-4 border rounded-lg bg-white space-y-4">
                                        <div className="flex items-center gap-2 text-sm font-medium mb-4">
                                            <CreditCard className="w-4 h-4" />
                                            {dict.paymentMethod?.cardNumber || "Card Details"}
                                        </div>
                                        <div className="w-full">
                                            <StripeElements
                                                ref={stripeElementsRef}
                                                amount={total}
                                                onPaymentMethodCreated={(paymentMethodId) => {
                                                    setStripePaymentMethodId(paymentMethodId);
                                                    setStripeError(null);
                                                }}
                                                onError={(error) => {
                                                    setStripeError(error);
                                                }}
                                            />
                                        </div>
                                        {stripeError && (
                                            <div className="text-sm text-destructive mt-2 p-2 bg-destructive/10 rounded">
                                                {stripeError}
                                            </div>
                                        )}
                                    </div>
                                )}


                                <div className="mt-8 pt-6 border-t">
                                    <Button
                                        type="submit"
                                        className="w-full btn-accent py-6 text-lg"
                                        disabled={isProcessing || paymentMethod === "paypal"}
                                    >
                                        {isProcessing ? (
                                            <>
                                                <Lock className="w-4 h-4 mr-2 animate-spin" />
                                                {dict.processing || "Processing..."}
                                            </>
                                        ) : (
                                            dict.completeOrder || "Complete Order"
                                        )}
                                    </Button>

                                    {/* PayPal Buttons Area */}
                                    {paymentMethod === "paypal" && (
                                        <div className="mt-6">
                                            <DirectPayPalButtons
                                                total={total}
                                                disabled={isProcessing}
                                                onClick={async () => await trigger()}
                                                onApprove={handlePayPalApprove}
                                                onError={(err: any) => {
                                                    console.error("PayPal error:", err);
                                                    setPaypalError(isRTL ? "حدث خطأ مع PayPal" : "An error occurred with PayPal");
                                                }}
                                                onCancel={() => {

                                                }}
                                            />
                                            {paypalError && (
                                                <div className="text-sm text-destructive mt-2 p-2 bg-destructive/10 rounded">
                                                    {paypalError}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <p className="text-xs text-center text-muted-foreground mt-4">
                                        {dict.terms || "By placing your order, you agree to our"}{" "}
                                        <Link href={`/${lang}/terms-conditions`} className="underline hover:text-primary">
                                            {dict.termsLink || "Terms of Service"}
                                        </Link>{" "}
                                        {dict.and || "and"}{" "}
                                        <Link href={`/${lang}/privacy-policy`} className="underline hover:text-primary">
                                            {dict.privacyLink || "Privacy Policy"}
                                        </Link>
                                        .
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-4">
                            <CardHeader>
                                <CardTitle>
                                    {dict.orderSummary?.title || "Order Summary"}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Order Items */}
                                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                                    {items.map((item) => (
                                        <div key={item.product.id} className="flex gap-3">
                                            <div className="w-16 h-16 rounded-md overflow-hidden bg-muted shrink-0 relative">
                                                <Image
                                                    src={item.product.image}
                                                    alt={isRTL ? item.product.nameAr : item.product.name}
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-medium text-sm truncate">
                                                    {isRTL ? item.product.nameAr : item.product.name}
                                                </h4>
                                                <p className="text-sm text-muted-foreground">
                                                    Qty: {item.quantity}
                                                </p>
                                                <p className="text-sm font-semibold text-primary">
                                                    ${(item.product.price * item.quantity).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t pt-4 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            {dict.orderSummary?.subtotal || "Subtotal"}
                                        </span>
                                        <span>${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            {dict.orderSummary?.shipping || "Shipping"}
                                        </span>
                                        <span>${shipping.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            {dict.orderSummary?.tax || "Tax"}
                                        </span>
                                        <span>${tax.toFixed(2)}</span>
                                    </div>
                                    <div className="border-t pt-2 flex justify-between font-bold text-lg">
                                        <span>
                                            {dict.orderSummary?.total || "Total"}
                                        </span>
                                        <span className="text-primary">${total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </form>
            </div>
        </div>
    );
}
